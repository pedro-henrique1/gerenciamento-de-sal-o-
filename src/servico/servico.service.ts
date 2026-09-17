import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { PrismaService } from '../prisma/prisma.service';
import { getPagination } from '../common/pagination';

@Injectable()
export class ServicoService {
  constructor(private prisma: PrismaService) {}

  async create(createServicoDto: CreateServicoDto) {
    return this.prisma.servico.create({
      data: createServicoDto,
    });
  }

  async findAll(query: Record<string, string> = {}) {
    const { page, limit, skip } = getPagination(Number(query.page), Number(query.limit));
    const where = query.nome ? { nome: { contains: query.nome, mode: 'insensitive' as const } } : {};
    const [items, total] = await this.prisma.$transaction([
      this.prisma.servico.findMany({ where, skip, take: limit, orderBy: { nome: 'asc' } }),
      this.prisma.servico.count({ where }),
    ]);
    return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
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