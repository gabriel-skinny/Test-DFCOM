import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AbstractAuthService } from 'src/application/services/jwt';

export interface ILoginTokenData {
  userId: string;
  email: string;
  name: string;
}

@Injectable()
export class AuthService implements AbstractAuthService {
  constructor(private jwtService: JwtService) {}

  async generateLoginToken(data: ILoginTokenData): Promise<{ token: string }> {
    const payload = {
      sub: data.userId,
      username: data.name,
      useremail: data.email,
    };

    const token = await this.jwtService.signAsync(payload);

    return { token };
  }

  async verifyToken(token: string): Promise<ILoginTokenData> {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });

    return {
      email: payload.useremail,
      name: payload.username,
      userId: payload.sub,
    };
  }
}
