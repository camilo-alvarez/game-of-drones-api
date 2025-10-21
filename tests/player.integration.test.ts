import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createApp } from '../src/app';
import { Player } from '../src/models';

let mongoServer: MongoMemoryServer;
const app = createApp();

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Player.deleteMany({});
});

describe('Player API Integration Tests', () => {
  describe('POST /api/v1/players', () => {
    it('should create a new player', async () => {
      const response = await request(app).post('/api/v1/players').send({
        name: 'Test Player',
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.name).toBe('test player'); // lowercase
      expect(response.body.data.wins).toBe(0);
      expect(response.body.data.losses).toBe(0);
    });

    it('should return 400 for invalid player name', async () => {
      const response = await request(app).post('/api/v1/players').send({
        name: 'A',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 409 for duplicate player name', async () => {
      await request(app).post('/api/v1/players').send({
        name: 'Duplicate Player',
      });

      const response = await request(app).post('/api/v1/players').send({
        name: 'Duplicate Player',
      });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/players', () => {
    it('should return empty array when no players exist', async () => {
      const response = await request(app).get('/api/v1/players');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('should return all players', async () => {
      await request(app).post('/api/v1/players').send({ name: 'Player 1' });
      await request(app).post('/api/v1/players').send({ name: 'Player 2' });

      const response = await request(app).get('/api/v1/players');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });
  });

  describe('GET /api/v1/players/:id/stats', () => {
    it('should return player statistics', async () => {
      const createResponse = await request(app)
        .post('/api/v1/players')
        .send({ name: 'Stats Player' });

      const playerId = createResponse.body.data._id;

      const response = await request(app).get(`/api/v1/players/${playerId}/stats`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('player');
      expect(response.body.data).toHaveProperty('totalMatches');
      expect(response.body.data).toHaveProperty('winRate');
      expect(response.body.data.totalMatches).toBe(0);
      expect(response.body.data.winRate).toBe(0);
    });

    it('should return 404 for non-existent player', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/v1/players/${fakeId}/stats`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should return 404 for invalid player id', async () => {
      const response = await request(app).get('/api/v1/players/invalid-id/stats');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
