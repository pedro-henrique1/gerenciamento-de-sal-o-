import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfissionalDto } from './dto/create-profissional.dto';
import { UpdateProfissionalDto } from './dto/update-profissional.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfissionalService {
  constructor(private prisma: PrismaService) {}

  async create(createProfissionalDto: CreateProfissionalDto) {
    return this.prisma.profissional.create({
      data: createProfissionalDto,
    });
  }

  async findAll() {
    return this.prisma.profissional.findMany();
  }

  async findOne(id: string) {
    const profissional = await this.prisma.profissional.findUnique({
      where: { id },
    });

    if (!profissional) {
      throw new NotFoundException('Profissional não encontrado.');
    }

    return profissional;
  }

  async update(id: string, updateProfissionalDto: UpdateProfissionalDto) {
    await this.findOne(id);

    return this.prisma.profissional.update({
      where: { id },
      data: updateProfissionalDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.profissional.delete({
      where: { id },
    });
  }
}