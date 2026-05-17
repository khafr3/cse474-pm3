require('./tracing'); // Must be first line - initializes OpenTelemetry
const app = require('./app');

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Search-index service running on port ${PORT}`);
});
