import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './Auth';
import { AbstractAuthService } from 'src/application/services/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
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
