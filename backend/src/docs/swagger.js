const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskFlow Pro API',
      version: '1.0.0',
      description: 'API Documentation for TaskFlow Pro Project Management Portal (with JWT Auth & Pagination)',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            username: { type: 'string', example: 'john_doe' },
            email: { type: 'string', example: 'john@example.com' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        AuthSuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Login successful' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
              },
            },
          },
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            userId: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Design Database Schema' },
            description: { type: 'string', example: 'Create MySQL tables and configure indexes.' },
            status: { type: 'string', example: 'Pending' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        TaskInput: {
          type: 'object',
          required: ['title', 'description'],
          properties: {
            title: { type: 'string', minLength: 3, example: 'Design Database Schema' },
            description: { type: 'string', minLength: 20, example: 'Create MySQL tables and configure indexes for the task management portal.' },
            status: { type: 'string', enum: ['Pending', 'In Progress', 'Completed'], example: 'Pending' },
          },
        },
        TaskStatusInput: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string', enum: ['Pending', 'In Progress', 'Completed'], example: 'In Progress' },
          },
        },
        ValidationErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation Error' },
            errors: {
              type: 'array',
              items: { type: 'string' },
              example: ['Title must be at least 3 characters', 'Description must be at least 20 characters'],
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Resource not found' },
          },
        },
      },
    },
    paths: {
      '/auth/register': {
        post: {
          summary: 'Register a new user',
          description: 'Create a new user account with username, email, and password.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'email', 'password'],
                  properties: {
                    username: { type: 'string', minLength: 3, example: 'john_doe' },
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                    password: { type: 'string', minLength: 6, example: 'secret123' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'User registered successfully' },
                      data: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Validation error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
                },
              },
            },
          },
        },
      },
      '/auth/login': {
        post: {
          summary: 'Log in user',
          description: 'Authenticate user with email and password, returning user info and a JWT token.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                    password: { type: 'string', example: 'secret123' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AuthSuccessResponse' },
                },
              },
            },
            400: {
              description: 'Validation error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
                },
              },
            },
            401: {
              description: 'Unauthorized credentials',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
      '/tasks': {
        get: {
          summary: 'Retrieve paginated tasks',
          description: 'Fetch tasks belonging to the authenticated user, supporting optional search, status filtering, and pagination.',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'status',
              in: 'query',
              required: false,
              schema: { type: 'string', enum: ['Pending', 'In Progress', 'Completed'] },
              description: 'Filter tasks by status',
            },
            {
              name: 'search',
              in: 'query',
              required: false,
              schema: { type: 'string' },
              description: 'Search tasks by title (substring)',
            },
            {
              name: 'page',
              in: 'query',
              required: false,
              schema: { type: 'integer', default: 1 },
              description: 'Page number',
            },
            {
              name: 'limit',
              in: 'query',
              required: false,
              schema: { type: 'integer', default: 10 },
              description: 'Page size limit',
            },
          ],
          responses: {
            200: {
              description: 'Tasks retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Tasks retrieved successfully' },
                      data: {
                        type: 'object',
                        properties: {
                          tasks: { type: 'array', items: { $ref: '#/components/schemas/Task' } },
                          totalTasks: { type: 'integer', example: 15 },
                          totalPages: { type: 'integer', example: 2 },
                          currentPage: { type: 'integer', example: 1 },
                          limit: { type: 'integer', example: 10 },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: 'Access denied. No token or invalid token.',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
        post: {
          summary: 'Create a new task',
          description: 'Create a new task for the authenticated user.',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TaskInput' },
              },
            },
          },
          responses: {
            201: {
              description: 'Task created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Task created successfully' },
                      data: { $ref: '#/components/schemas/Task' },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Validation error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
                },
              },
            },
            401: {
              description: 'Unauthorized access',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
      '/tasks/{id}': {
        put: {
          summary: 'Update task status',
          description: 'Update the status of a specific task belonging to the authenticated user.',
          security: [{ BearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TaskStatusInput' },
              },
            },
          },
          responses: {
            200: {
              description: 'Task updated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Task updated successfully' },
                      data: { $ref: '#/components/schemas/Task' },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Validation error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
                },
              },
            },
            404: {
              description: 'Task not found or access denied',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
        delete: {
          summary: 'Delete a task',
          description: 'Delete a task by ID belonging to the authenticated user.',
          security: [{ BearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
          ],
          responses: {
            200: {
              description: 'Task deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Task deleted successfully' },
                      data: { type: 'object', nullable: true, example: null },
                    },
                  },
                },
              },
            },
            404: {
              description: 'Task not found or access denied',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
      '/tasks/stats': {
        get: {
          summary: 'Get dashboard statistics',
          description: 'Retrieve task status counts belonging to the authenticated user.',
          security: [{ BearerAuth: [] }],
          responses: {
            200: {
              description: 'Dashboard statistics retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Dashboard statistics retrieved successfully' },
                      data: {
                        type: 'object',
                        properties: {
                          totalTasks: { type: 'integer', example: 10 },
                          pendingTasks: { type: 'integer', example: 4 },
                          inProgressTasks: { type: 'integer', example: 3 },
                          completedTasks: { type: 'integer', example: 3 },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = {
  setupSwagger,
  swaggerSpec,
};
