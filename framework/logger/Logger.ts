import winston from 'winston';
import { AsyncLocalStorage } from 'async_hooks';

const { combine, timestamp, printf, colorize } = winston.format;

export const loggerContext = new AsyncLocalStorage<{ context: string; method: string }>();

const logFormat = printf(({ level, message, timestamp, context, method }) => {
  const store = loggerContext.getStore();
  const currentContext = context || store?.context;
  const currentMethod = method || store?.method;
  
  const contextStr = currentContext ? ` [${currentContext}${currentMethod ? `.${currentMethod}` : ''}]` : '';
  const messageStr = typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
  return `${timestamp}${contextStr} ${level}: ${messageStr}`;
});

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
