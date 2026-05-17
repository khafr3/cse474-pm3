require('./tracing'); // Must be first line - initializes OpenTelemetry
const app = require('./app');

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Comments service running on port ${PORT}`);
});
