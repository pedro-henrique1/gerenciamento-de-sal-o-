import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { AgendamentoService } from './agendamento.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';

@Controller('agendamento')
export class AgendamentoController {
  constructor(private readonly agendamentoService: AgendamentoService) {}

  @Post()
  create(@Body() createAgendamentoDto: CreateAgendamentoDto) {
    return this.agendamentoService.create(createAgendamentoDto);
  }

  @Get()
  findAll(@Query() query: Record<string, string>) {
    return this.agendamentoService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
   return this.agendamentoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAgendamentoDto: UpdateAgendamentoDto) {
    return this.agendamentoService.update(id, updateAgendamentoDto);
  }

  @Patch(':id/cancelar')
  cancel(@Param('id') id: string) {
    return this.agendamentoService.cancel(id);
  }
}