import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PrismaService } from '../prisma/prisma.service'; 
import { getPagination } from '../common/pagination';

@Injectable()
export class ClienteService {
  constructor(private prisma: PrismaService) {}
  
  async create(createClienteDto: CreateClienteDto) {
    const clienteExistente = await this.prisma.cliente.findUnique({
      where: { telefone: createClienteDto.telefone },
    });

    if (clienteExistente) {
      throw new ConflictException('Erro ao cadastrar cliente, tente novamente.');
    }

    const novoCliente = await this.prisma.cliente.create({
      data: {
        nome: createClienteDto.nome,
        telefone: createClienteDto.telefone,
        email: createClienteDto.email,
      },
    });

    return novoCliente;
  }

  async findAll(query: Record<string, string> = {}) {
    const { page, limit, skip } = getPagination(Number(query.page), Number(query.limit));
    const where = query.nome ? { nome: { contains: query.nome, mode: 'insensitive' as const } } : {};
    const [items, total] = await this.prisma.$transaction([
      this.prisma.cliente.findMany({ where, skip, take: limit, orderBy: { nome: 'asc' } }),
      this.prisma.cliente.count({ where }),
    ]);
    return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) { 
    const cliente = await this.prisma.cliente.findUnique({
      where: { id },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado.');
    }

    return cliente;
  }

  async update(id: string, updateClienteDto: UpdateClienteDto) { 
    await this.findOne(id); 

    return this.prisma.cliente.update({
      where: { id },
      data: updateClienteDto,
    });
  }

  async remove(id: string) { 
    await this.findOne(id);

    return this.prisma.cliente.delete({
      where: { id },
    });
  }
}