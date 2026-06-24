const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/config/db');
const User = require('../src/models/User');

beforeAll(async () => {
  // Sync in-memory SQLite database before running test suite
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close database connection after completing tests
  await sequelize.close();
});

describe('User Authentication API Endpoints', () => {
  const testUser = {
    username: 'test_user',
    email: 'test@example.com',
    password: 'password123'
  };

  describe('POST /api/auth/register', () => {
    it('should successfully register a new user with valid inputs', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('username', testUser.username);
      expect(response.body.data).toHaveProperty('email', testUser.email);
      expect(response.body.data.password).toBeUndefined(); // Password must not be returned
    });

    it('should fail registration when email is already registered', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should fail registration when input fields violate validations', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'ab', // Must be min 3 chars
          email: 'invalid-email', // Must be valid email
          password: '123' // Must be min 6 chars
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toBe('Validation Error');
      expect(response.body.errors).toContain('Username must be at least 3 characters');
      expect(response.body.errors).toContain('Must be a valid email address');
      expect(response.body.errors).toContain('Password must be at least 6 characters');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should successfully log in and return a JWT token with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('email', testUser.email);
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should fail login when providing incorrect credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toBe('Invalid email or password');
    });
  });
});
