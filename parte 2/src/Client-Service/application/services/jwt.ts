import { ILoginTokenData } from 'src/infra/services/Auth';

export abstract class AbstractAuthService {
  abstract generateLoginToken(data: {
    userId: string;
    email: string;
    name: string;
  }): Promise<{ token: string }>;
  abstract verifyToken(token: string): Promise<ILoginTokenData>;
}
