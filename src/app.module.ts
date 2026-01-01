import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProblemsModule } from './problems/problems.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { VotesModule } from './votes/votes.module';
import { JudgeModule } from './judge/judge.module';
import { DiscussionsModule } from './discussions/discussions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    AuthModule,
    UsersModule,
    ProblemsModule,
    SubmissionsModule,
    VotesModule,
    JudgeModule,
    DiscussionsModule,
  ],
})
export class AppModule {}