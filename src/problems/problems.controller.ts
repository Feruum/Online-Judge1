import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProblemsService, CreateProblemDto, UpdateProblemDto } from './problems.service';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    username: string;
    role: 'user' | 'admin';
  };
}

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Get()
  async findAll() {
    return this.problemsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.problemsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(@Body() createProblemDto: CreateProblemDto, @Req() req: AuthenticatedRequest) {
    return this.problemsService.create(createProblemDto, req.user.role);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProblemDto: UpdateProblemDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.problemsService.update(id, updateProblemDto, req.user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
    return this.problemsService.delete(id, req.user.role);
  }
}