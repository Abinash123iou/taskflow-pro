const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/config/db');
const User = require('../src/models/User');
const Task = require('../src/models/Task');

let tokenA;
let tokenB;
let userAId;
let userBId;
let taskAId;

beforeAll(async () => {
  // Sync SQLite in-memory database
  await sequelize.sync({ force: true });

  // Create and log in User A
  const regResponseA = await request(app)
    .post('/api/auth/register')
    .send({ username: 'user_a', email: 'usera@example.com', password: 'password123' });
  userAId = regResponseA.body.data.id;

  const loginResponseA = await request(app)
    .post('/api/auth/login')
    .send({ email: 'usera@example.com', password: 'password123' });
  tokenA = loginResponseA.body.data.token;

  // Create and log in User B
  const regResponseB = await request(app)
    .post('/api/auth/register')
    .send({ username: 'user_b', email: 'userb@example.com', password: 'password123' });
  userBId = regResponseB.body.data.id;

  const loginResponseB = await request(app)
    .post('/api/auth/login')
    .send({ email: 'userb@example.com', password: 'password123' });
  tokenB = loginResponseB.body.data.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Task Management API Endpoints', () => {
  describe('Authentication check', () => {
    it('should deny access to GET /api/tasks when no authorization token is provided', async () => {
      const response = await request(app).get('/api/tasks');
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('No token provided');
    });
  });

  describe('POST /api/tasks (Create Task)', () => {
    it('should allow User A to create a task successfully with valid input', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          title: 'Design API Spec',
          description: 'Document backend REST routes and response payloads in detail.',
          status: 'Pending'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('title', 'Design API Spec');
      expect(response.body.data).toHaveProperty('userId', userAId);
      taskAId = response.body.data.id;
    });

    it('should fail task creation when validation constraints are violated', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          title: '', // Cannot be empty
          description: 'Short', // Must be min 20 chars
          status: 'InvalidStatus' // Status must be valid enum
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/tasks (Retrieve Tasks with Search, Filters, and Pagination)', () => {
    beforeAll(async () => {
      // Seed additional tasks for User A to test search/pagination
      await Task.bulkCreate([
        { title: 'Write tests', description: 'Implement unit and integration tests using Jest.', status: 'In Progress', userId: userAId },
        { title: 'Refactor Auth middleware', description: 'Review token decryption and validation flow.', status: 'Completed', userId: userAId },
        { title: 'Setup MySQL DB', description: 'Install database engines and configure pooling.', status: 'Completed', userId: userAId }
      ]);
    });

    it('should retrieve only tasks belonging to the logged-in User A', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('tasks');
      expect(response.body.data.tasks.length).toBe(4);
      expect(response.body.data.tasks.every(t => t.userId === userAId)).toBe(true);
    });

    it('should return empty list for User B since User B has no tasks', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${tokenB}`);

      expect(response.status).toBe(200);
      expect(response.body.data.tasks.length).toBe(0);
      expect(response.body.data.totalTasks).toBe(0);
    });

    it('should correctly filter tasks by status (e.g. Completed)', async () => {
      const response = await request(app)
        .get('/api/tasks?status=Completed')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(response.body.data.tasks.length).toBe(2);
      expect(response.body.data.tasks.every(t => t.status === 'Completed')).toBe(true);
    });

    it('should search tasks matching a substring search filter', async () => {
      const response = await request(app)
        .get('/api/tasks?search=tests')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(response.body.data.tasks.length).toBe(1);
      expect(response.body.data.tasks[0].title).toBe('Write tests');
    });

    it('should correctly paginate results', async () => {
      const response = await request(app)
        .get('/api/tasks?page=1&limit=2')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(response.body.data.tasks.length).toBe(2);
      expect(response.body.data.totalTasks).toBe(4);
      expect(response.body.data.totalPages).toBe(2);
      expect(response.body.data.currentPage).toBe(1);
    });
  });

  describe('GET /api/tasks/stats (Dashboard Statistics)', () => {
    it('should fetch user-specific statistics accurately', async () => {
      const response = await request(app)
        .get('/api/tasks/stats')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toEqual({
        totalTasks: 4,
        pendingTasks: 1,
        inProgressTasks: 1,
        completedTasks: 2
      });
    });
  });

  describe('PUT /api/tasks/:id (Update Status)', () => {
    it('should successfully update a task status owned by the user', async () => {
      const response = await request(app)
        .put(`/api/tasks/${taskAId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ status: 'In Progress' });

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('In Progress');
    });

    it('should deny task status update if the task is owned by a different user', async () => {
      const response = await request(app)
        .put(`/api/tasks/${taskAId}`)
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ status: 'Completed' });

      expect(response.status).toBe(404); // Scoped fetch fails to find the task, returning 404
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('DELETE /api/tasks/:id (Delete Task)', () => {
    it('should deny task deletion if task is owned by a different user', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${taskAId}`)
        .set('Authorization', `Bearer ${tokenB}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should successfully delete a task owned by the user', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${taskAId}`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task deleted successfully');

      // Verify deletion
      const checkResponse = await Task.findByPk(taskAId);
      expect(checkResponse).toBeNull();
    });
  });
});
