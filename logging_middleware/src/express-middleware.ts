import { Request, Response, NextFunction } from 'express';
import Logger from './logger';

const logger = new Logger('backend', 'express-middleware');

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const { method, path, query, body } = req;

  const originalSend = res.send;

  res.send = function(data) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    logger.info(`${method} ${path}`, {
      statusCode,
      duration,
      query,
      bodyKeys: body ? Object.keys(body) : [],
    });

    return originalSend.call(this, data);
  };

  next();
};

export default loggingMiddleware;
