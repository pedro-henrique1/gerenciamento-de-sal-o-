import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateAtendimentoDto } from './dto/create-atendimento.dto';
import { PrismaService } from '../prisma/prisma.service';
import { getPagination } from '../common/pagination';

@Injectable()
export class AtendimentoService {
  constructor(private prisma: PrismaService) {}

  async create(createAtendimentoDto: CreateAtendimentoDto) {
    const agendamento = await this.prisma.agendamento.findUnique({
      where: { id: createAtendimentoDto.agendamentoId },
      include: { atendimento: true },
    });

    if (!agendamento) {
      throw new NotFoundException('Agendamento não encontrado.');
    }

    if (agendamento.atendimento) {
      throw new ConflictException('Este agendamento já foi concluído e possui um atendimento registrado.');
    }

    const resultadoAtendimento = await this.prisma.$transaction(async (prismaTx) => {
      await prismaTx.agendamento.update({
        where: { id: createAtendimentoDto.agendamentoId },
        data: { status: 'CONCLUIDO' },
      });

      const novoAtendimento = await prismaTx.atendimento.create({
        data: {
          agendamentoId: createAtendimentoDto.agendamentoId,
          observacoes: createAtendimentoDto.observacoes,
        },
      });

      return novoAtendimento;
    });

    return resultadoAtendimento;
  }

  async findAll(query: Record<string, string> = {}) {
    const { page, limit, skip } = getPagination(Number(query.page), Number(query.limit));
    const [items, total] = await this.prisma.$transaction([
      this.prisma.atendimento.findMany({
        skip,
        take: limit,
        orderBy: { dataConclusao: 'desc' },
      include: {
        agendamento: {
          include: {
            cliente: true,
            profissional: true,
            servico: true,
          },
        },
        pagamento: true, 
      },
      }),
      this.prisma.atendimento.count(),
    ]);
    return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
  }
}