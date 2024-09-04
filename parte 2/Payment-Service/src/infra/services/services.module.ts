import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AbstractAuthService, AuthService } from './Auth';

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
  exports: [AbstractAuthService],
})
export class ServiceModule {}
