const express = require('express');
const swaggerUi = require('swagger-ui-express');
const commentRoutes = require('./routes/commentRoutes');
const { initDB } = require('./db');
const { register, httpRequestCount, httpRequestDuration } = require('./metrics');
const logger = require('./logger');
const swaggerSpec = require('./swagger');

const app = express();
app.use(express.json());

// request_id middleware
app.use((req, res, next) => {
  req.id = Math.random().toString(36).substring(2, 15);
  next();
});

// Metrics middleware
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer({ method: req.method, route: req.path });
  res.on('finish', () => {
    httpRequestCount.inc({ method: req.method, route: req.path, status: res.statusCode });
    end();
    logger.info({ message: `${req.method} ${req.path}`, status: res.statusCode, request_id: req.id });
  });
  next();
});

app.use('/api', commentRoutes);
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

initDB().catch(console.error);
module.exports = app;
