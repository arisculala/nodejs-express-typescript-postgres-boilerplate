/**
 * Logger configuration using winston.
 */
import winston from 'winston';

/**
 * Define log levels.
 */
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

/**
 * Determine the logging level based on the environment.
 * @returns {string} - 'debug' for development, 'warn' for other environments.
 */
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

/**
 * Define colors for log levels.
 */
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

/**
 * Add colors to winston.
 */
winston.addColors(colors);

/**
 * Define log format.
 */
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

/**
 * Define log transports.
 */
const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
];

/**
 * Add 'logs/all.log' transport only if not in development.
 */
if (process.env.NODE_ENV !== 'development') {
  transports.push(new winston.transports.File({ filename: 'logs/all.log' }));
}

/**
 * Create the logger with the defined configurations.
 */
const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export default Logger;
