const express = require('express');
const swaggerUi = require('swagger-ui-express');
const searchRoutes = require('./routes/searchRoutes');
const { initSearchDB } = require('./db');
const { startConsumer } = require('./kafkaConsumer');
const { register, httpRequestCount, httpRequestDuration } = require('./metrics');
const logger = require('./logger');
const swaggerSpec = require('./swagger');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer({ method: req.method, route: req.path });
  res.on('finish', () => {
    httpRequestCount.inc({ method: req.method, route: req.path, status: res.statusCode });
    end();
    logger.info({ message: `${req.method} ${req.path}`, status: res.statusCode });
  });
  next();
});

app.use('/api', searchRoutes);
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

initSearchDB().then(() => {
  startConsumer().catch(console.error);
}).catch(console.error);
module.exports = app;
