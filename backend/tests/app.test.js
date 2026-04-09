import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { jest } from '@jest/globals';

process.env.NODE_ENV = 'test';
process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/test-placeholder';
process.env.JWT_SECRET = 'test-secret-value-12345';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-12345';
process.env.CLIENT_URL = 'http://localhost:5173';

const { default: app } = await import('../src/app.js');
const { User } = await import('../src/models/User.js');
const { Chat } = await import('../src/models/Chat.js');
const { Message } = await import('../src/models/Message.js');

let mongoServer;

jest.setTimeout(30000);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  if (mongoose.connection.readyState) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }

  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  await Promise.all([
    User.deleteMany({}),
    Chat.deleteMany({}),
    Message.deleteMany({})
  ]);
});

describe('chat backend', () => {
  test('register -> me flow works without otp', async () => {
    const registerRes = await request(app).post('/api/auth/register').send({
      name: 'Alice Example',
      email: 'alice@example.com',
      password: 'strongPass123'
    });

    expect(registerRes.statusCode).toBe(201);
    expect(registerRes.body.accessToken).toBeTruthy();

    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${registerRes.body.accessToken}`);

    expect(meRes.statusCode).toBe(200);
    expect(meRes.body.user.email).toBe('alice@example.com');
  });

  test('direct chat messaging and search work', async () => {
    const [alice, bob] = await Promise.all([
      User.create({
        name: 'Alice',
        email: 'alice2@example.com',
        passwordHash: await bcrypt.hash('Password123', 10),
        isVerified: true
      }),
      User.create({
        name: 'Bob',
        email: 'bob@example.com',
        passwordHash: await bcrypt.hash('Password123', 10),
        isVerified: true
      })
    ]);

    const loginAlice = await request(app).post('/api/auth/login').send({
      email: alice.email,
      password: 'Password123'
    });

    const token = loginAlice.body.accessToken;

    const chatRes = await request(app)
      .post('/api/chats')
      .set('Authorization', `Bearer ${token}`)
      .send({ receiverId: bob._id.toString() });

    expect(chatRes.statusCode).toBe(201);

    const messageRes = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${token}`)
      .field('chatId', chatRes.body._id)
      .field('text', 'hello premium world')
      .field('clientMessageId', 'client-1');

    expect(messageRes.statusCode).toBe(201);
    expect(messageRes.body.text).toBe('hello premium world');

    const searchRes = await request(app)
      .get('/api/messages/search?q=premium')
      .set('Authorization', `Bearer ${token}`);

    expect(searchRes.statusCode).toBe(200);
    expect(searchRes.body.data).toHaveLength(1);
  });

  test('invalid token is rejected', async () => {
    const res = await request(app).get('/api/users').set('Authorization', 'Bearer invalid-token');
    expect(res.statusCode).toBe(401);
  });
});
