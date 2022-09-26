import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import User from './entities/user.entity';

const GetUser = createParamDecorator((_, ctx: ExecutionContext): User => {
  const req = ctx.switchToHttp().getRequest();

  return req.user;
});

export default GetUser;
