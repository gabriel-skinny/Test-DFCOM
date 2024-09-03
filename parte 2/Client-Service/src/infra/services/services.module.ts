import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './Auth';
import { AbstractAuthService } from '../../application/services/jwt';

@Module({
  imports: [],
  providers: [
    {
      provide: AbstractAuthService,
      useClass: AuthService,
    },
  ],
  exports: [
    {
      provide: AbstractAuthService,
      useClass: AuthService,
    },
  ],
})
export class ServiceModule {}
