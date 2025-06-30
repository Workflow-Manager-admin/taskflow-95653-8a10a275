const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Taskflow Task Management API',
      version: '1.0.0',
      description: `
A simple, well-documented REST API for task management (users, authentication, CRUD on tasks, filtering/sorting).  
See: [README.md](../README.md) and [api_spec.md](./api_spec.md) for more details.

**Base URL:** \`/\` (example: \`https://your-domain/\`)

**Authentication:**  
Bearer JWT (\`Authorization: Bearer <token>\`) is required for all /api/tasks and /api/users/profile endpoints.

**Try the API below—click an operation for details, schemas, and example requests/responses.**
      `,
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local dev server' }
    ],
    tags: [
      { name: 'Authentication', description: 'User registration, login, logout' },
      { name: 'Users', description: 'Profile and user-only endpoints' },
      { name: 'Tasks', description: 'CRUD for tasks, filtering, sorting, pagination' },
      { name: 'Health', description: 'Health/status endpoints' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Description of the error' }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: 'f94d-ab12-45d2-1234' },
            username: { type: 'string', example: 'johnsmith' },
            email: { type: 'string', example: 'john@example.com' },
            created_at: { type: 'string', format: 'date-time', example: '2024-05-12T10:00:00Z' }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: { type: 'string', example: 'alice' },
            email: { type: 'string', example: 'alice@email.com' },
            password: { type: 'string', format: 'password', example: 'secret123' }
          }
        },
        RegisterResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            token: { type: 'string', example: 'jwt.token.here' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'alice@email.com' },
            password: { type: 'string', format: 'password', example: 'secret123' }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            token: { type: 'string', example: 'jwt.token.here' }
          }
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: 'b45f-12ee-5b8c-5678' },
            title: { type: 'string', example: 'Buy groceries' },
            description: { type: 'string', example: 'Milk, eggs, bread' },
            due_date: { type: 'string', format: 'date-time', example: '2024-05-31T23:59:59Z' },
            created_at: { type: 'string', format: 'date-time', example: '2024-05-12T10:00:00Z' },
            status: { type: 'string', enum: ['pending', 'in_progress', 'completed'], example: 'in_progress' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'], example: 'medium' },
            user_id: { type: 'string', format: 'uuid', example: 'f94d-ab12-45d2-1234' }
          }
        },
        CreateTaskRequest: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string', example: 'Read Docs' },
            description: { type: 'string', example: 'Swagger and OpenAPI guides' },
            due_date: { type: 'string', format: 'date-time', example: '2024-06-01T12:00:00Z' },
            status: { type: 'string', enum: ['pending', 'in_progress', 'completed'], example: 'pending' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'], example: 'high' }
          }
        },
        UpdateTaskRequest: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Read Docs' },
            description: { type: 'string', example: 'Swagger and OpenAPI guides updated' },
            due_date: { type: 'string', format: 'date-time', example: '2024-06-09T00:00:00Z' },
            status: { type: 'string', enum: ['pending', 'in_progress', 'completed'], example: 'completed' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'], example: 'medium' }
          }
        },
        TasksListResponse: {
          type: 'object',
          properties: {
            tasks: {
              type: 'array',
              items: { $ref: '#/components/schemas/Task' }
            },
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            total: { type: 'integer', example: 42 }
          }
        },
        HealthCheckResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'ok' },
            message: { type: 'string', example: 'Service is healthy' },
            timestamp: { type: 'string', format: 'date-time', example: '2024-05-12T13:00:00.000Z' },
            environment: { type: 'string', example: 'development' }
          }
        }
      }
    },
    security: [],
    paths: {
      // Populated by swagger-jsdoc scanning. See apis below.
    }
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js'
  ],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
