import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CustomIp = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const proxyRealIp = request.headers['x-real-ip'];

    return process.env.NODE_ENV === 'development' ? request.ip : proxyRealIp;
  },
);
