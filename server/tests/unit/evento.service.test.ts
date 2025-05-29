import { Pool, PoolClient } from 'pg';
import * as EventoService from '../../src/services/evento.service';
import { v4 as uuidv4 } from 'uuid';
import { Evento } from '../../src/models/evento.model';

// Mock pg Pool
jest.mock('pg', () => {
  const mClient = {
    query: jest.fn(),
    release: jest.fn(),
  };
  const mPool = {
    connect: jest.fn(() => Promise.resolve(mClient)),
    query: jest.fn(), // Also mock query directly on pool for services that might use it without explicit connect
  };
  return { Pool: jest.fn(() => mPool) };
});

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('EventoService', () => {
  let mockPool: jest.Mocked<Pool>;
  let mockClient: jest.Mocked<PoolClient>;
  const mockUuid = 'mock-uuid-123';

  beforeEach(() => {
    // Re-initialize mocks before each test for a clean state
    mockPool = new Pool() as jest.Mocked<Pool>;
    mockClient = {
      query: jest.fn(),
      release: jest.fn(),
    } as unknown as jest.Mocked<PoolClient>;
    (mockPool.connect as jest.Mock).mockResolvedValue(mockClient);
    (mockPool.query as jest.Mock).mockClear(); // Clear direct pool query mock
    (mockClient.query as jest.Mock).mockClear();
    (mockClient.release as jest.Mock).mockClear();
    (uuidv4 as jest.Mock).mockReturnValue(mockUuid);
  });

  describe('createEvento', () => {
    it('should create an event and return it', async () => {
      const eventData: Omit<Evento, 'id' | 'mediaPontuacao' | 'inscricoes' | 'created_at' | 'updated_at'> = {
        nome: 'Test Event Nome',
        data: new Date('2024-01-01'),
        titulo: 'Test Event Titulo',
        horaInicio: '10:00',
        horaFim: '12:00',
        tipo: 'Palestra',
        descricao: 'A test event',
        local: 'Online',
        status: 'Programado',
        equipesParticipantes: [],
        participantes: [],
      };

      const expectedDbEventRow = {
        id: mockUuid,
        ...eventData,
        mediaPontuacao: 0, // Default do DB, mas incluído no retorno
      };
      
      (mockClient.query as jest.Mock).mockResolvedValueOnce({ rows: [expectedDbEventRow], rowCount: 1 });

      const result = await EventoService.createEvento(eventData);
      
      expect(result).toEqual(expectedDbEventRow);
      expect(uuidv4).toHaveBeenCalledTimes(1);
      expect(mockPool.connect).toHaveBeenCalledTimes(1);
      expect(mockClient.query).toHaveBeenCalledTimes(1);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO eventos'),
        [
          mockUuid,
          eventData.nome,
          eventData.data,
          eventData.descricao,
          eventData.local,
          eventData.equipesParticipantes,
          eventData.titulo,
          eventData.horaInicio,
          eventData.horaFim,
          eventData.tipo,
          eventData.status,
          eventData.participantes,
          // Removido 0 para mediaPontuacao, pois não é passado na query de INSERT real
        ]
      );
      expect(mockClient.release).toHaveBeenCalledTimes(1);
    });
  });

  describe('getEventoById', () => {
    it('should return an event if found', async () => {
      const mockEvent: Evento = {
        id: mockUuid,
        nome: 'Found Event',
        data: new Date('2024-02-01'),
        titulo: 'Found Event Titulo',
        horaInicio: '14:00',
        horaFim: '16:00',
        tipo: 'Oficina',
        descricao: 'An existing event',
        local: 'Conference Hall',
        status: 'Programado',
        equipesParticipantes: ['team-1'],
        participantes: ['user-1'],
        mediaPontuacao: 4.5,
        created_at: new Date(), // Adicionado para corresponder à interface
        updated_at: new Date()  // Adicionado para corresponder à interface
      };
      (mockClient.query as jest.Mock).mockResolvedValueOnce({ rows: [mockEvent], rowCount: 1 });

      const result = await EventoService.getEventoById(mockUuid);

      expect(result).toEqual(mockEvent);
      expect(mockPool.connect).toHaveBeenCalledTimes(1);
      expect(mockClient.query).toHaveBeenCalledTimes(1);
      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT * FROM eventos WHERE id = $1;',
        [mockUuid]
      );
      expect(mockClient.release).toHaveBeenCalledTimes(1);
    });

    it('should return null if event not found', async () => {
      (mockClient.query as jest.Mock).mockResolvedValueOnce({ rows: [], rowCount: 0 });

      const result = await EventoService.getEventoById('non-existing-uuid');

      expect(result).toBeNull();
      expect(mockPool.connect).toHaveBeenCalledTimes(1);
      expect(mockClient.query).toHaveBeenCalledTimes(1);
      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT * FROM eventos WHERE id = $1;',
        ['non-existing-uuid']
      );
      expect(mockClient.release).toHaveBeenCalledTimes(1);
    });
  });

  // TODO: Adicionar testes para getAllEventos, updateEvento e deleteEvento
});
