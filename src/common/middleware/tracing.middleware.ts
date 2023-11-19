import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TracingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.body) {
      const uuid = req.body.requestId ?? randomUUID();
      req.body.requestId = uuid;
      res.setHeader('x-request-id', uuid);
    }
    const oldJson = res.json;
    res.json = (body) => {
      if (res.getHeader('x-request-id')) {
        const requestId = res.getHeader('x-request-id');
        body = { ...body, requestId };
      }
      res.locals.body = body;
      return oldJson.call(res, body);
    };
    next();
  }
}
