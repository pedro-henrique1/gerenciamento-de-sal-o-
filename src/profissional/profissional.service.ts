import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfissionalDto } from './dto/create-profissional.dto';
import { UpdateProfissionalDto } from './dto/update-profissional.dto';
import { PrismaService } from '../prisma/prisma.service';
import { getPagination } from '../common/pagination';

@Injectable()
export class ProfissionalService {
  constructor(private prisma: PrismaService) {}

  async create(createProfissionalDto: CreateProfissionalDto) {
    return this.prisma.profissional.create({
      data: createProfissionalDto,
    });
  }

  async findAll(query: Record<string, string> = {}) {
    const { page, limit, skip } = getPagination(Number(query.page), Number(query.limit));
    const where = query.ativo === undefined ? {} : { ativo: query.ativo === 'true' };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.profissional.findMany({ where, skip, take: limit, orderBy: { nome: 'asc' } }),
      this.prisma.profissional.count({ where }),
    ]);
    return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
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