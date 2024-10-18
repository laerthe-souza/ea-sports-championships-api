import { IAuthProvider } from '@core/application/providers/auth.provider';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthProvider implements IAuthProvider {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(data: object): string {
    return this.jwtService.sign(data, { secret: process.env.JWT_SECRET });
  }

  decodeToken<T>(token: string): T {
    return this.jwtService.verify(token) as T;
  }
}
