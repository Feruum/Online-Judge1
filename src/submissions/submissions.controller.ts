import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubmissionsService, CreateSubmissionDto } from './submissions.service';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    username: string;
    role: 'user' | 'admin';
  };
}

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createSubmissionDto: CreateSubmissionDto, @Req() req: AuthenticatedRequest) {
    return this.submissionsService.create(createSubmissionDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findUserSubmissions(@Req() req: AuthenticatedRequest) {
    return this.submissionsService.findUserSubmissions(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
    return this.submissionsService.findById(id, req.user.id);
  }

  @Patch(':id/public')
  @UseGuards(JwtAuthGuard)
  async makePublic(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
    return this.submissionsService.makePublic(id, req.user.id);
  }
}