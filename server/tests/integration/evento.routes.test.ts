import request from 'supertest';
import { app, closeServer } from '../../src/index'; // Importa a aplicação Express e a função para fechar o servidor
import pool from '../../src/config/db'; // Importa o pool de conexão do banco de dados
import { PoolClient } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express'; // Importar tipos do Express
import { Admin } from '../../src/models/admin.model'; // Importar a interface Admin

// Mock the auth middleware
jest.mock('../../src/middleware/auth.middleware', () => ({
  protect: jest.fn((req: Request, res: Response, next: NextFunction) => {
    // Mock an authenticated admin user
    req.admin = { 
      id: 'test-admin-id', 
      cargo: 'SuperAdmin', 
      nome: 'Test Admin', 
      email: 'test@admin.com', 
      permissoes: [],
      password_hash: 'mocked_hash', // Adicionar campos faltantes
      created_at: new Date(),
      updated_at: new Date()
    } as Admin; // Assegurar que o tipo é Admin
    next(); // Permite que a requisição prossiga
  }),
  authorize: jest.fn(() => (req: Request, res: Response, next: NextFunction) => next()), // Sempre autoriza
}));

describe('Eventos API', () => {
  let createdEventId: string; // Para armazenar o ID de um evento criado para testes

  // Limpa a tabela de eventos antes de cada teste para garantir isolamento
  beforeEach(async () => {
    await pool.query('DELETE FROM eventos;');
  });

  // Fecha o servidor e o pool de conexões após todos os testes
  afterAll(async () => {
    await pool.query('DELETE FROM eventos;'); // Limpa a tabela no final também
    // TODO: Garantir que o servidor só feche DEPOIS que todos os testes assíncronos terminarem.
    // Em alguns setups Jest, `afterAll` pode precisar de `done()` ou retornar uma Promise se houver operações assíncronas longas.
    await closeServer();
  });

  it('GET /api/eventos should return an empty array initially', async () => {
    const res = await request(app).get('/api/eventos');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it('POST /api/eventos should create a new event', async () => {
    const novoEvento = {
      nome: 'Concerto de Teste POST',
      data: '2025-01-15',
      descricao: 'Evento criado via teste POST.',
      local: 'Local de Teste',
      equipesParticipantes: ['equipe-a'],
      titulo: 'Titulo POST',
      horaInicio: '10:00',
      horaFim: '12:00',
      tipo: 'Oficina',
      status: 'Programado',
      participantes: ['user-x']
    };

    const res = await request(app)
      .post('/api/eventos')
      .send(novoEvento);

    expect(res.statusCode).toEqual(201); // Espera 201 Created com autenticação mockada
    expect(res.body).toHaveProperty('id');
    expect(res.body.nome).toBe(novoEvento.nome);
    // Armazena o ID para testes subsequentes
    createdEventId = res.body.id;

    // Opcional: Verificar se foi realmente inserido no banco de dados
    const client = await pool.connect();
    try {
      const dbResult = await client.query('SELECT * FROM eventos WHERE id = $1;', [createdEventId]);
      expect(dbResult.rowCount).toBe(1);
      expect(dbResult.rows[0].nome).toBe(novoEvento.nome);
    } finally {
      client.release();
    }
  });

  // Teste para GET /api/eventos/:id
  it('GET /api/eventos/:id should return the event if found', async () => {
    // Cria um evento diretamente no banco de dados para este teste
    const client = await pool.connect();
    const eventToFind = {
        id: uuidv4(),
        nome: 'Evento para GET by ID',
        data: '2025-02-20',
        descricao: 'Descrição',
        local: 'Online',
        equipesParticipantes: [],
        titulo: 'Título',
        horaInicio: '14:00', 
        horaFim: '16:00', 
        tipo: 'Palestra',
        status: 'Programado',
        participantes: [], 
        mediaPontuacao: 0 // Coluna com letra minúscula no DB
    };
    try {
        await client.query(`
            INSERT INTO eventos (id, nome, data, descricao, local, equipesParticipantes, titulo, horaInicio, horaFim, tipo, status, participantes, mediaPontuacao)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `, [eventToFind.id, eventToFind.nome, eventToFind.data, eventToFind.descricao, eventToFind.local, eventToFind.equipesParticipantes, eventToFind.titulo, eventToFind.horaInicio, eventToFind.horaFim, eventToFind.tipo, eventToFind.status, eventToFind.participantes, eventToFind.mediaPontuacao]);
    } finally {
        client.release();
    }

    const res = await request(app).get(`/api/eventos/${eventToFind.id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', eventToFind.id);
    expect(res.body.nome).toBe(eventToFind.nome);
  });

  it('GET /api/eventos/:id should return 404 if event is not found', async () => {
    const nonExistentId = uuidv4(); // Um ID que não existe no DB
    const res = await request(app).get(`/api/eventos/${nonExistentId}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Evento não encontrado.');
    });

  // Teste para PUT /api/eventos/:id
  it('PUT /api/eventos/:id should update an event', async () => {
     // Cria um evento para atualizar
     const client = await pool.connect();
     const eventToUpdate = {
         id: uuidv4(),
         nome: 'Evento Original',
         data: '2025-03-01',
         descricao: 'Descrição Original',
         local: 'Local Original',
         equipesParticipantes: [],
         titulo: 'Título Original',
         horaInicio: '09:00',
        horaFim: '11:00',
         tipo: 'Workshop',
        status: 'Programado',
         participantes: [],
         mediaPontuacao: 0
     };
     try {
         await client.query(`
             INSERT INTO eventos (id, nome, data, descricao, local, equipesParticipantes, titulo, horaInicio, horaFim, tipo, status, participantes, mediaPontuacao)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         `, [eventToUpdate.id, eventToUpdate.nome, eventToUpdate.data, eventToUpdate.descricao, eventToUpdate.local, eventToUpdate.equipesParticipantes, eventToUpdate.titulo, eventToUpdate.horaInicio, eventToUpdate.horaFim, eventToUpdate.tipo, eventToUpdate.status, eventToUpdate.participantes, eventToUpdate.mediaPontuacao]);
     } finally {
         client.release();
     }

    const updatedData = {
      nome: 'Evento Atualizado PUT',
      local: 'Novo Local',
      status: 'Concluído'
    };

    const res = await request(app)
      .put(`/api/eventos/${eventToUpdate.id}`)
      .send(updatedData);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', eventToUpdate.id);
    expect(res.body.nome).toBe(updatedData.nome);
    expect(res.body.local).toBe(updatedData.local);
    expect(res.body.status).toBe(updatedData.status);
    // Verifica se outros campos não foram alterados
    expect(res.body.descricao).toBe(eventToUpdate.descricao);

    // Opcional: Verificar se foi realmente atualizado no banco de dados
    const clientAfterUpdate = await pool.connect();
    try {
      const dbResult = await clientAfterUpdate.query('SELECT * FROM eventos WHERE id = $1;', [eventToUpdate.id]);
      expect(dbResult.rowCount).toBe(1);
      expect(dbResult.rows[0].nome).toBe(updatedData.nome);
      expect(dbResult.rows[0].local).toBe(updatedData.local);
      expect(dbResult.rows[0].status).toBe(updatedData.status);
    } finally {
      clientAfterUpdate.release();
    }
    });

  it('PUT /api/eventos/:id should return 404 if event is not found for update', async () => {
    const nonExistentId = uuidv4();
    const updatedData = { nome: 'Nome Inexistente' };

    const res = await request(app)
      .put(`/api/eventos/${nonExistentId}`)
      .send(updatedData);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Evento não encontrado para atualização.');
  });

  // Teste para DELETE /api/eventos/:id
  it('DELETE /api/eventos/:id should delete an event', async () => {
    // Cria um evento para excluir
    const client = await pool.connect();
    const eventToDelete = {
        id: uuidv4(),
        nome: 'Evento para DELETE',
        data: '2025-04-05',
        descricao: 'Descrição',
        local: 'Local',
        equipesParticipantes: [],
        titulo: 'Título',
        horaInicio: '17:00',
        horaFim: '18:00',
        tipo: 'Outro',
        status: 'Programado',
        participantes: [],
        mediaPontuacao: 0
    };
    try {
        await client.query(`
            INSERT INTO eventos (id, nome, data, descricao, local, equipesParticipantes, titulo, horaInicio, horaFim, tipo, status, participantes, mediaPontuacao)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `, [eventToDelete.id, eventToDelete.nome, eventToDelete.data, eventToDelete.descricao, eventToDelete.local, eventToDelete.equipesParticipantes, eventToDelete.titulo, eventToDelete.horaInicio, eventToDelete.horaFim, eventToDelete.tipo, eventToDelete.status, eventToDelete.participantes, eventToDelete.mediaPontuacao]);
    } finally {
        client.release();
    }

    const res = await request(app)
      .delete(`/api/eventos/${eventToDelete.id}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Evento excluído com sucesso.');

    // Opcional: Verificar se foi realmente excluído do banco de dados
    const clientAfterDelete = await pool.connect();
    try {
      const dbResult = await clientAfterDelete.query('SELECT * FROM eventos WHERE id = $1;', [eventToDelete.id]);
      expect(dbResult.rowCount).toBe(0);
    } finally {
      clientAfterDelete.release();
    }
  });

  it('DELETE /api/eventos/:id should return 404 if event is not found for deletion', async () => {
    const nonExistentId = uuidv4();
    const res = await request(app)
      .delete(`/api/eventos/${nonExistentId}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Evento não encontrado para exclusão.');
  });
});
