import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsProcessor } from './submissions.processor';
import { JudgeModule } from '../judge/judge.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'submissions',
    }),
    JudgeModule,
  ],
  controllers: [SubmissionsController],
  providers: [SubmissionsService, SubmissionsProcessor],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}