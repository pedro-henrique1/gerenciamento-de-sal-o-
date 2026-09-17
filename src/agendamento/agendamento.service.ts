import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AgendamentoService {
  constructor(private prisma: PrismaService) {}

  async create(createAgendamentoDto: CreateAgendamentoDto) {
    // 1. REGRA DE NEGÓCIO: Verificar se o profissional já tem cliente neste exato horário
    const agendamentoConflitante = await this.prisma.agendamento.findFirst({
      where: {
        profissionalId: createAgendamentoDto.profissionalId,
        dataHoraReserva: new Date(createAgendamentoDto.dataHoraReserva),
        status: {
          not: 'CANCELADO', // Se foi cancelado, o horário está livre novamente
        },
      },
    });

    // 2. TRATAMENTO DE ERRO: Bloquear a requisição se o horário estiver ocupado
    if (agendamentoConflitante) {
      throw new ConflictException('Este profissional já possui um agendamento neste horário.');
    }

    // 3. CAMINHO FELIZ: Salvar o agendamento real no PostgreSQL
    const novoAgendamento = await this.prisma.agendamento.create({
      data: {
        clienteId: createAgendamentoDto.clienteId,
        profissionalId: createAgendamentoDto.profissionalId,
        servicoId: createAgendamentoDto.servicoId,
        dataHoraReserva: new Date(createAgendamentoDto.dataHoraReserva),
      },
    });

    return novoAgendamento;
  }

  async findAll() {
    return this.prisma.agendamento.findMany({
      include: {
        cliente: true,
        profissional: true,
        servico: true,
      },
    });
  }


  async findOne(id: string) {
    const agendamento = await this.prisma.agendamento.findUnique({
      where: { id },
      include: {
        cliente: true,
        profissional: true,
        servico: true,
      },
    });

    if (!agendamento) {
      throw new NotFoundException('Agendamento não encontrado.');
    }

    return agendamento;
  }
}