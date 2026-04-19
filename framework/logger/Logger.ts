import winston from 'winston';
import { AsyncLocalStorage } from 'async_hooks';

/**
 * Winston format parts
 */
const { combine, timestamp, printf, colorize } = winston.format;

/**
 * Storage for logging context, allowing class name and method name to be tracked 
 * across asynchronous calls.
 */
export const loggerContext = new AsyncLocalStorage<{ context: string; method: string }>();

/**
 * Custom log format that includes timestamp, context (class/method), and log level.
 * 
 * Example output line:
 * 2024-04-19 21:01:46 [SearchResultsPage.clickContinue] info: Clicking continue button
 */
const logFormat = printf(({ level, message, timestamp, context, method }) => {
  const store = loggerContext.getStore();
  const currentContext = context || store?.context;
  const currentMethod = method || store?.method;

  const contextStr = currentContext ? ` [${currentContext}${currentMethod ? `.${currentMethod}` : ''}]` : '';
  const messageStr = typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
  return `${timestamp}${contextStr}:\n${level}: ${messageStr}`;
});

/**
 * Configured Winston logger instance for the framework.
 * Supports console output with colors and file logging to 'test-results/test-run.log'.
 */
export const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      )
    }),
    new winston.transports.File({
      filename: 'test-results/test-run.log',
      level: 'debug'
    })
  ]
});
