import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServicoService {
  constructor(private prisma: PrismaService) {}

  async create(createServicoDto: CreateServicoDto) {
    return this.prisma.servico.create({
      data: createServicoDto,
    });
  }

  async findAll() {
    return this.prisma.servico.findMany();
  }

  async findOne(id: string) {
    const servico = await this.prisma.servico.findUnique({
      where: { id },
    });

    if (!servico) {
      throw new NotFoundException('Serviço não encontrado.');
    }

    return servico;
  }

  async update(id: string, updateServicoDto: UpdateServicoDto) {
    await this.findOne(id); 

    return this.prisma.servico.update({
      where: { id },
      data: updateServicoDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); 

    return this.prisma.servico.delete({
      where: { id },
    });
  }
}