import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import { PrismaService } from '../prisma/prisma.service';
import { getPagination } from '../common/pagination';

@Injectable()
export class AgendamentoService {
  constructor(private prisma: PrismaService) {}

  async create(createAgendamentoDto: CreateAgendamentoDto) {
    const dados = { ...createAgendamentoDto, dataHoraReserva: new Date(createAgendamentoDto.dataHoraReserva) };
    await this.validarDadosAgendamento(dados);
    await this.validarDisponibilidade(dados.profissionalId, dados.servicoId, dados.dataHoraReserva);
    return this.prisma.agendamento.create({
      data: {
        clienteId: dados.clienteId,
        profissionalId: dados.profissionalId,
        servicoId: dados.servicoId,
        dataHoraReserva: dados.dataHoraReserva,
      },
    });
  }

  async findAll(query: Record<string, string> = {}) {
    const { page, limit, skip } = getPagination(Number(query.page), Number(query.limit));
    const where = {
      ...(query.status ? { status: query.status as 'PENDENTE' | 'CONCLUIDO' | 'CANCELADO' } : {}),
      ...(query.profissionalId ? { profissionalId: query.profissionalId } : {}),
      ...(query.clienteId ? { clienteId: query.clienteId } : {}),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.agendamento.findMany({
        where,
        skip,
        take: limit,
        orderBy: { dataHoraReserva: 'asc' },
        include: { cliente: true, profissional: true, servico: true },
      }),
      this.prisma.agendamento.count({ where }),
    ]);
    return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
  }

  async update(id: string, updateAgendamentoDto: UpdateAgendamentoDto) {
    const atual = await this.prisma.agendamento.findUnique({ where: { id } });
    if (!atual) throw new NotFoundException('Agendamento não encontrado.');
    if (atual.status !== 'PENDENTE') {
      throw new ConflictException('Somente agendamentos pendentes podem ser alterados.');
    }
    const dados = {
      clienteId: updateAgendamentoDto.clienteId ?? atual.clienteId,
      profissionalId: updateAgendamentoDto.profissionalId ?? atual.profissionalId,
      servicoId: updateAgendamentoDto.servicoId ?? atual.servicoId,
      dataHoraReserva: updateAgendamentoDto.dataHoraReserva
        ? new Date(updateAgendamentoDto.dataHoraReserva)
        : atual.dataHoraReserva,
    };
    await this.validarDadosAgendamento(dados);
    await this.validarDisponibilidade(dados.profissionalId, dados.servicoId, dados.dataHoraReserva, id);
    return this.prisma.agendamento.update({ where: { id }, data: dados });
  }

  async cancel(id: string) {
    const agendamento = await this.findOne(id);
    if (agendamento.status !== 'PENDENTE') {
      throw new ConflictException('Somente agendamentos pendentes podem ser cancelados.');
    }
    return this.prisma.agendamento.update({ where: { id }, data: { status: 'CANCELADO' } });
  }

  private async validarDadosAgendamento(dados: {
    clienteId: string;
    profissionalId: string;
    servicoId: string;
    dataHoraReserva: Date;
  }) {
    const [cliente, profissional, servico] = await Promise.all([
      this.prisma.cliente.findUnique({ where: { id: dados.clienteId } }),
      this.prisma.profissional.findUnique({ where: { id: dados.profissionalId } }),
      this.prisma.servico.findUnique({ where: { id: dados.servicoId } }),
    ]);
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');
    if (!profissional) throw new NotFoundException('Profissional não encontrado.');
    if (!profissional.ativo) throw new ConflictException('O profissional está inativo.');
    if (!servico) throw new NotFoundException('Serviço não encontrado.');
    if (dados.dataHoraReserva.getTime() <= Date.now()) {
      throw new ConflictException('O agendamento deve ser feito para uma data futura.');
    }
  }

  private async validarDisponibilidade(profissionalId: string, servicoId: string, inicio: Date, ignorarId?: string) {
    const servico = await this.prisma.servico.findUnique({ where: { id: servicoId } });
    if (!servico) throw new NotFoundException('Serviço não encontrado.');
    const fim = new Date(inicio.getTime() + servico.duracaoMinutos * 60_000);
    const agendamentos = await this.prisma.agendamento.findMany({
      where: {
        profissionalId,
        status: { not: 'CANCELADO' },
        ...(ignorarId ? { id: { not: ignorarId } } : {}),
        dataHoraReserva: { lt: fim },
      },
      include: { servico: true },
    });
    const conflito = agendamentos.some((agendamento) => {
      const agendamentoFim = new Date(agendamento.dataHoraReserva.getTime() + agendamento.servico.duracaoMinutos * 60_000);
      return agendamentoFim > inicio;
    });
    if (conflito) throw new ConflictException('O profissional já possui um agendamento neste intervalo.');
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