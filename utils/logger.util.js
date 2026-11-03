const { createLogger, transports, format } = require('winston');
const LokiTransport = require('winston-loki');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json() // Loki handles structured JSON logs efficiently
  ),
  transports: [
    // 1. Output to standard console
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),
    // 2. Ship logs to Grafana Loki
    new LokiTransport({
      host: 'http://loki:3100',
      labels: { app: 'nodejs-app-service', env: 'development' },
      json: true,
      batching: true,
      interval: 5, // Send batched logs every 5 seconds
      // basicAuth: 'username:password', // Uncomment if your Loki requires authentication
    })
  ]
});

module.exports = logger;
