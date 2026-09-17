import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PrismaService } from '../prisma/prisma.service'; 

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

  async findAll() {
    return this.prisma.cliente.findMany();
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