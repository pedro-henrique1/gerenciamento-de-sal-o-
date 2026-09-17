import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ServicoService } from './servico.service';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { Roles } from '../auth/auth.decorator';

@Controller('servico')
export class ServicoController {
  constructor(private readonly servicoService: ServicoService) {}

  @Post()
  @Roles('GERENTE')
  create(@Body() createServicoDto: CreateServicoDto) {
    return this.servicoService.create(createServicoDto);
  }

  @Get()
  findAll(@Query() query: Record<string, string>) {
    return this.servicoService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {  
    return this.servicoService.findOne(id);
  }

  @Patch(':id')
  @Roles('GERENTE')
  update(@Param('id') id: string, @Body() updateServicoDto: UpdateServicoDto) { 
    return this.servicoService.update(id, updateServicoDto);
  }

  @Delete(':id')
  @Roles('GERENTE')
  remove(@Param('id') id: string) { 
    return this.servicoService.remove(id);
  }
}