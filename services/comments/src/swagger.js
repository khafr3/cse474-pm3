const swaggerJsdoc = require('swagger-jsdoc');
const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Comments Service API', version: '1.0.0' },
    servers: [{ url: 'http://localhost:4000' }],
  },
  apis: ['./src/routes/*.js'],
};
module.exports = swaggerJsdoc(options);
