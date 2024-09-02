import { ILoginTokenData } from 'src/infra/services/Auth';
import { AbstractAuthService } from './jwt';

export class JwtMock implements AbstractAuthService {
  verifyToken(token: string): Promise<ILoginTokenData> {
    throw new Error('Method not implemented.');
  }
  async generateLoginToken(data: {
    userId: string;
    email: string;
    name: string;
  }): Promise<{ token: string }> {
    return { token: 'mockedToken' };
  }
}
