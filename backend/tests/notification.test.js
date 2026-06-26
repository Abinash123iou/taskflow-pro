const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/config/db');
const User = require('../src/models/User');
const Notification = require('../src/models/Notification');
const Task = require('../src/models/Task');

let tokenA;
let tokenB;
let userAId;
let userBId;
let notificationAId;
let taskAId;

beforeAll(async () => {
  // Sync database with force to reset everything
  await sequelize.sync({ force: true });

  // Register and login User A
  const regResponseA = await request(app)
    .post('/api/auth/register')
    .send({ username: 'user_a', email: 'usera@example.com', password: 'password123' });
  userAId = regResponseA.body.data.id;

  const loginResponseA = await request(app)
    .post('/api/auth/login')
    .send({ email: 'usera@example.com', password: 'password123' });
  tokenA = loginResponseA.body.data.token;

  // Register and login User B
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

describe('Notification API Endpoints', () => {
  describe('Authorization check', () => {
    it('should deny access to GET /api/notifications when no token is provided', async () => {
      const response = await request(app).get('/api/notifications');
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('No token provided');
    });
  });

  describe('Triggering Notifications via Task Lifecycle', () => {
    it('should generate a notification when a task is created', async () => {
      const taskResponse = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          title: 'Design Notification Spec',
          description: 'Define payload structure and HTTP methods.',
          status: 'Pending',
          priority: 'High',
          dueDate: '2026-07-01'
        });

      expect(taskResponse.status).toBe(201);
      taskAId = taskResponse.body.data.id;

      // Verify notification is created
      const notifResponse = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(notifResponse.status).toBe(200);
      expect(notifResponse.body.data.length).toBe(1);
      expect(notifResponse.body.data[0]).toMatchObject({
        title: 'Task Created',
        message: 'You created a new task: "Design Notification Spec".',
        type: 'Success',
        isRead: false
      });

      notificationAId = notifResponse.body.data[0].id;
    });

    it('should generate a notification when a task status is updated', async () => {
      // Update the task status to In Progress
      const updateResponse = await request(app)
        .put(`/api/tasks/${taskAId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ status: 'In Progress' });

      expect(updateResponse.status).toBe(200);

      // Verify notification was added
      const notifResponse = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${tokenA}`);

      // We should now have 2 notifications, sorted newest first (Task Updated should be index 0)
      expect(notifResponse.body.data.length).toBe(2);
      expect(notifResponse.body.data[0]).toMatchObject({
        title: 'Task Updated',
        message: 'Task "Design Notification Spec" has been updated: status changed to "In Progress".',
        type: 'Info',
        isRead: false
      });
    });
  });

  describe('PUT /api/notifications/:id/read (Mark Read)', () => {
    it('should allow marking a specific notification as read', async () => {
      const response = await request(app)
        .put(`/api/notifications/${notificationAId}/read`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body.data.isRead).toBe(true);

      // Verify state
      const notifResponse = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${tokenA}`);
      
      const notifA = notifResponse.body.data.find(n => n.id === notificationAId);
      expect(notifA.isRead).toBe(true);
    });

    it('should return 404 if marking a non-existent notification', async () => {
      const response = await request(app)
        .put('/api/notifications/9999/read')
        .set('Authorization', `Bearer ${tokenA}`)
        .send();

      expect(response.status).toBe(404);
    });

    it('should deny User B from marking User A\'s notification as read', async () => {
      const response = await request(app)
        .put(`/api/notifications/${notificationAId}/read`)
        .set('Authorization', `Bearer ${tokenB}`)
        .send();

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/notifications/read-all (Mark All Read)', () => {
    it('should mark all unread notifications as read for the user', async () => {
      // Prior to this, notificationAId is read, but the "Task Updated" notification is unread.
      const response = await request(app)
        .put('/api/notifications/read-all')
        .set('Authorization', `Bearer ${tokenA}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body.data.affectedCount).toBe(1); // One notification was updated

      // Verify all are read
      const notifResponse = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${tokenA}`);
      
      expect(notifResponse.body.data.every(n => n.isRead)).toBe(true);
    });
  });

  describe('DELETE /api/notifications/:id (Delete Notification)', () => {
    it('should successfully delete a notification', async () => {
      const response = await request(app)
        .delete(`/api/notifications/${notificationAId}`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(200);

      // Verify deleted from list
      const notifResponse = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${tokenA}`);
      
      expect(notifResponse.body.data.length).toBe(1); // Only 1 remaining
      expect(notifResponse.body.data.some(n => n.id === notificationAId)).toBe(false);
    });

    it('should refuse to delete other users\' notifications', async () => {
      // Find remaining notification belonging to User A
      const notifResponse = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${tokenA}`);
      
      const remainingId = notifResponse.body.data[0].id;

      const response = await request(app)
        .delete(`/api/notifications/${remainingId}`)
        .set('Authorization', `Bearer ${tokenB}`);

      expect(response.status).toBe(404);
    });
  });
});
