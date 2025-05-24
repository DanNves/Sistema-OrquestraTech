import request from 'supertest';
import { app, closeServer } from '../../src/index'; // Adjust path as needed
import { Pool, PoolClient } from 'pg'; // Import PoolClient for more detailed mocking

// Mock the auth middleware
jest.mock('../../src/middleware/auth.middleware', () => ({
  protect: jest.fn((req, res, next) => {
    // Mock an authenticated admin user
    req.admin = { 
      id: 'test-admin-id', 
      cargo: 'SuperAdmin', 
      nome: 'Test Admin', 
      email: 'test@admin.com', 
      permissoes: [] 
    };
    next();
  }),
  authorize: jest.fn(() => (req, res, next) => next()),
}));

// Mock the DB (pg Pool)
jest.mock('pg', () => {
  const mClient = {
    query: jest.fn(),
    release: jest.fn(),
    // Mock other PoolClient methods if your service uses them (e.g., begin, commit, rollback)
  };
  const mPool = {
    connect: jest.fn(() => Promise.resolve(mClient)), // connect() returns a Promise resolving to a client
    query: jest.fn(), // Also mock query directly on pool if used
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('Eventos API', () => {
  let mockPool: jest.Mocked<Pool>;
  let mockClient: jest.Mocked<PoolClient>;

  beforeEach(() => {
    // Re-initialize mocks before each test for a clean state
    mockPool = new Pool() as jest.Mocked<Pool>;
    // Since connect is mocked to return a Promise, we need to access the resolved value for client methods
    // This setup assumes connect() is called for each DB interaction in the service.
    // If the service uses pool.query() directly, then mockPool.query needs to be set up.
    mockClient = {
        query: jest.fn(),
        release: jest.fn(),
    } as unknown as jest.Mocked<PoolClient>;

    (mockPool.connect as jest.Mock).mockResolvedValue(mockClient); // Ensure connect resolves to mockClient
    (mockPool.query as jest.Mock).mockClear(); // Clear direct pool query mock if any
    (mockClient.query as jest.Mock).mockClear();
    (mockClient.release as jest.Mock).mockClear();
  });

  afterAll((done) => {
    if (closeServer) {
      closeServer(done);
    } else {
      done();
    }
  });

  describe('POST /api/eventos', () => {
    it('should create an event when authenticated and data is valid', async () => {
      const eventData = { 
        nome: 'Integration Test Event Nome', // Added nome
        titulo: 'Integration Test Event', 
        descricao: 'Testing event creation', 
        data: '2024-12-01', 
        horaInicio: '14:00', 
        horaFim: '16:00', 
        local: 'Online', 
        tipo: 'Oficina', 
        status: 'Programado',
        // equipesParticipantes and participantes can be omitted if they default to empty arrays
      };
      
      // Mock the response from the DB INSERT query in EventoService.createEvento
      const dbResponse = { 
        ...eventData, 
        id: 'mock-generated-event-id', // Simulate ID generation
        data: new Date(eventData.data), // Ensure data is a Date object if service returns it as such
        equipesParticipantes: [], 
        participantes: [], 
        mediaPontuacao: 0,
        // created_at and updated_at are usually set by DB or service
      };
      (mockClient.query as jest.Mock).mockResolvedValueOnce({ rows: [dbResponse], rowCount: 1 });

      const response = await request(app)
        .post('/api/eventos')
        .send(eventData);

      expect(response.status).toBe(201);
      // The response.body will be the direct result from EventoService.createEvento
      expect(response.body).toMatchObject({
        ...eventData, // Original data sent
        id: dbResponse.id, // Check if ID is present
        data: dbResponse.data.toISOString(), // Compare ISO strings for dates
        mediaPontuacao: 0, // Check default value
      });
      expect(mockPool.connect).toHaveBeenCalledTimes(1);
      expect(mockClient.query).toHaveBeenCalledTimes(1); // Check if DB was called via client
      expect(mockClient.release).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if required fields are missing (e.g., titulo)', async () => {
      const eventData = { 
        descricao: 'Missing title test',
        data: '2024-12-02',
        horaInicio: '10:00',
        horaFim: '11:00',
        tipo: 'Palestra',
        status: 'Programado',
        nome: 'Test'
        // titulo is missing
      };
      const response = await request(app)
        .post('/api/eventos')
        .send(eventData);
      
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Missing required fields'); 
      // Ensure DB was not called
      expect(mockClient.query).not.toHaveBeenCalled();
    });

     it('should return 400 if required field "nome" is missing', async () => {
      const eventData = { 
        titulo: 'Missing Nome Test',
        descricao: 'Testing missing nome',
        data: '2024-12-03', 
        horaInicio: '14:00', 
        horaFim: '16:00', 
        local: 'Online', 
        tipo: 'Oficina', 
        status: 'Programado',
        // nome is missing
      };
      const response = await request(app)
        .post('/api/eventos')
        .send(eventData);
      
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Missing required fields');
      expect(mockClient.query).not.toHaveBeenCalled();
    });
  });
});
