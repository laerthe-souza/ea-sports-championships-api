import { Request } from 'express';

import { AuthProvider } from '@core/infra/providers/auth.provider';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

type IPayload = {
  id: string;
  name: string;
  username: string;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authProvider: AuthProvider) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const { authorization } = request.headers;

    if (!authorization) {
      throw new UnauthorizedException('Token not provided');
    }

    const [schema, token] = authorization.split(' ');

    if (!/^Bearer$/i.test(schema)) {
      throw new UnauthorizedException('Invalid token');
    }

    try {
      const payload = this.authProvider.decodeToken<IPayload>(token);

      Object.assign(request, {
        player: payload,
      });

      return true;
    } catch (error) {
      if (error.message === 'jwt expired') {
        throw new UnauthorizedException('Session expired');
      }

      throw new UnauthorizedException('Invalid token');
    }
  }
}
