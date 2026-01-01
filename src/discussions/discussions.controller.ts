import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { DiscussionsService, CreateDiscussionDto, CreateDiscussionVoteDto } from './discussions.service';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    username: string;
    role: 'user' | 'admin';
  };
}

@Controller('discussions')
@UseGuards(JwtAuthGuard)
export class DiscussionsController {
  constructor(private readonly discussionsService: DiscussionsService) {}

  @Post()
  async create(@Body() createDiscussionDto: CreateDiscussionDto, @Req() req: AuthenticatedRequest) {
    return this.discussionsService.create(createDiscussionDto, req.user.id);
  }

  @Get('problems/:problemId')
  async findByProblemId(@Param('problemId', ParseIntPipe) problemId: number) {
    return this.discussionsService.findByProblemId(problemId);
  }

  @Post(':id/vote')
  async vote(
    @Param('id', ParseIntPipe) discussionId: number,
    @Body() createVoteDto: CreateDiscussionVoteDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.discussionsService.vote({ ...createVoteDto, discussionId }, req.user.id);
  }

  @Put(':id/mark-answer')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async markAsAnswer(
    @Param('id', ParseIntPipe) discussionId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.discussionsService.markAsAnswer(discussionId, req.user.id);
  }
}
