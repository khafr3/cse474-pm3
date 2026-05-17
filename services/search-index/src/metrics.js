const client = require('prom-client');
const register = new client.Registry();
client.collectDefaultMetrics({ register });
const httpRequestCount = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register]
});
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'route'],
  buckets: [0.05, 0.1, 0.3, 0.5, 1.0],
  registers: [register]
});
module.exports = { register, httpRequestCount, httpRequestDuration };
