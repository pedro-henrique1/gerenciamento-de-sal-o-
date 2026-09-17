import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProfissionalService } from './profissional.service';
import { CreateProfissionalDto } from './dto/create-profissional.dto';
import { UpdateProfissionalDto } from './dto/update-profissional.dto';
import { Roles } from '../auth/auth.decorator';

@Controller('profissional')
export class ProfissionalController {
  constructor(private readonly profissionalService: ProfissionalService) {}

  @Post()
  @Roles('GERENTE')
  create(@Body() createProfissionalDto: CreateProfissionalDto) {
    return this.profissionalService.create(createProfissionalDto);
  }

  @Get()
  findAll(@Query() query: Record<string, string>) {
    return this.profissionalService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profissionalService.findOne(id);
  }

  @Patch(':id')
  @Roles('GERENTE')
  update(@Param('id') id: string, @Body() updateProfissionalDto: UpdateProfissionalDto) {
    return this.profissionalService.update(id, updateProfissionalDto);
  }

  @Delete(':id')
  @Roles('GERENTE')
  remove(@Param('id') id: string) {
    return this.profissionalService.remove(id);
  }
}