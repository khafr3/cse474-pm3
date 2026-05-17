const swaggerJsdoc = require('swagger-jsdoc');
const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Search Index Service API', version: '1.0.0' },
    servers: [{ url: 'http://localhost:4001' }],
  },
  apis: ['./src/routes/*.js'],
};
module.exports = swaggerJsdoc(options);
