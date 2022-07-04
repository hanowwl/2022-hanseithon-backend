import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/entities';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    req.user.password = undefined;
    return req.user;
  },
);
