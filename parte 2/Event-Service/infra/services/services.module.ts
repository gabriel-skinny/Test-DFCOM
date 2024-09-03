import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AbstractAuthService, AuthService } from './Auth';
import { BullModule, InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

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
