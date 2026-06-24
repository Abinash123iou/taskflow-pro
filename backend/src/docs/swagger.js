const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskFlow Pro API',
      version: '1.0.0',
      description: 'API Documentation for TaskFlow Pro Project Management Portal',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development Server',
      },
    ],
    components: {
      schemas: {
        Task: {
          type: 'object',
          required: ['title', 'description', 'status'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated ID of the task',
              example: 1,
            },
            title: {
              type: 'string',
              description: 'The title of the task',
              example: 'Design Database Schema',
            },
            description: {
              type: 'string',
              description: 'The description of the task',
              example: 'Create MySQL tables and configure indexes.',
            },
            status: {
              type: 'string',
              enum: ['Pending', 'In Progress', 'Completed'],
              description: 'The status of the task',
              example: 'Pending',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date-time the task was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date-time the task was last updated',
            },
          },
        },
        TaskInput: {
          type: 'object',
          required: ['title', 'description', 'status'],
          properties: {
            title: {
              type: 'string',
              minLength: 3,
              description: 'The title of the task',
              example: 'Design Database Schema',
            },
            description: {
              type: 'string',
              minLength: 20,
              description: 'The description of the task',
              example: 'Create MySQL tables and configure indexes for the task management portal.',
            },
            status: {
              type: 'string',
              enum: ['Pending', 'In Progress', 'Completed'],
              description: 'The status of the task',
              example: 'Pending',
            },
          },
        },
        TaskStatusInput: {
          type: 'object',
          required: ['status'],
          properties: {
            status: {
              type: 'string',
              enum: ['Pending', 'In Progress', 'Completed'],
              description: 'The updated status of the task',
              example: 'In Progress',
            },
          },
        },
        ValidationErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Validation Error',
            },
            errors: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['Title must be at least 3 characters', 'Description must be at least 20 characters'],
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Task not found',
            },
          },
        },
      },
    },
    paths: {
      '/tasks': {
        get: {
          summary: 'Retrieve all tasks',
          description: 'Fetch a list of tasks with optional filtering by status and searching by title.',
          parameters: [
            {
              name: 'status',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
                enum: ['Pending', 'In Progress', 'Completed'],
              },
              description: 'Filter tasks by their status',
            },
            {
              name: 'search',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
              },
              description: 'Search tasks by title (substring match)',
            },
          ],
          responses: {
            200: {
              description: 'A list of tasks retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Tasks retrieved successfully' },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Task' },
                      },
                    },
                  },
                },
              },
            },
            500: {
              description: 'Internal server error',
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
          description: 'Create a task with title, description, and status.',
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
            500: {
              description: 'Internal server error',
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
          description: 'Update the status of a specific task by its ID.',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'integer',
              },
              description: 'The task ID',
            },
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
              description: 'Task not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            500: {
              description: 'Internal server error',
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
          description: 'Delete a task by its ID.',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'integer',
              },
              description: 'The task ID',
            },
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
              description: 'Task not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            500: {
              description: 'Internal server error',
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
          summary: 'Get dashboard task statistics',
          description: 'Retrieve task counts grouped by status.',
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
            500: {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
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
