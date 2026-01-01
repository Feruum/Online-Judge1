import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VotesService, CreateVoteDto } from './votes.service';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    username: string;
    role: 'user' | 'admin';
  };
}

@Controller('votes')
@UseGuards(JwtAuthGuard)
export class VotesController {
  constructor(private readonly votesService: VotesService) { }

  @Post()
  async create(@Body() createVoteDto: CreateVoteDto, @Req() req: AuthenticatedRequest) {
    return this.votesService.create(createVoteDto, req.user.id);
  }

  @Get('problems/:problemId/top-solutions')
  async getTopSolutions(
    @Param('problemId', ParseIntPipe) problemId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const isAdmin = req.user.role === 'admin';
    return this.votesService.getTopSolutions(problemId, req.user.id, isAdmin);
  }

  @Post('mark-top-solution')
  async markAsTopSolution(
    @Body() body: { submissionId: number; voteType: 'best_practice' | 'clever' },
    @Req() req: AuthenticatedRequest,
  ) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Only admins can mark top solutions');
    }
    return this.votesService.markAsTopSolution(body.submissionId, body.voteType);
  }
}