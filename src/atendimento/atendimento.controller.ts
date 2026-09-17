import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AtendimentoService } from './atendimento.service';
import { CreateAtendimentoDto } from './dto/create-atendimento.dto';

@Controller('atendimento')
export class AtendimentoController {
  constructor(private readonly atendimentoService: AtendimentoService) {}

  @Post()
  create(@Body() createAtendimentoDto: CreateAtendimentoDto) {
    return this.atendimentoService.create(createAtendimentoDto);
  }

  @Get()
  findAll() {
    return this.atendimentoService.findAll();
  }
}