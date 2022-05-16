import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import { logger } from './logger.config';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, path: url } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('close', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      // logger.log('info', request.body, response);
      console.log(response.statusMessage);
      if (statusCode === 200 || statusCode === 201) {
        logger.log(
          'info',
          `${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip} - ${response.statusMessage}`,
        );
      } else {
        logger.log(
          'error',
          `${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip} - ${response.statusMessage}`,
        );
      }
    });

    next();
  }
}
