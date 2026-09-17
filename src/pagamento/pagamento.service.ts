import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { PrismaService } from '../prisma/prisma.service';
import { getPagination } from '../common/pagination';

@Injectable()
export class PagamentoService {
  constructor(private prisma: PrismaService) {}

  async create(createPagamentoDto: CreatePagamentoDto) {
    // 1. Verificar se o atendimento existe
    const atendimento = await this.prisma.atendimento.findUnique({
      where: { id: createPagamentoDto.atendimentoId },
      include: { pagamento: true, agendamento: true },
    });

    if (!atendimento) {
      throw new NotFoundException('Atendimento não encontrado.');
    }

    // 2. REGRA DE NEGÓCIO: Verificar se o atendimento já foi pago
    if (atendimento.pagamento) {
      throw new ConflictException('Este atendimento já possui um pagamento registrado.');
    }

    if (atendimento.agendamento.status !== 'CONCLUIDO') {
      throw new ConflictException('O pagamento só pode ser registrado após a conclusão do atendimento.');
    }

    // 3. CAMINHO FELIZ: Registrar o pagamento no PostgreSQL
    const novoPagamento = await this.prisma.pagamento.create({
      data: {
        atendimentoId: createPagamentoDto.atendimentoId,
        valorFinal: createPagamentoDto.valorFinal,
        formaPagamento: createPagamentoDto.formaPagamento,
      },
    });

    return novoPagamento;
  }

  async findAll(query: Record<string, string> = {}) {
    const { page, limit, skip } = getPagination(Number(query.page), Number(query.limit));
    const where = query.formaPagamento
      ? { formaPagamento: query.formaPagamento as 'PIX' | 'CARTAO' | 'DINHEIRO' }
      : {};
    const [items, total] = await this.prisma.$transaction([
      this.prisma.pagamento.findMany({
        where,
        skip,
        take: limit,
        orderBy: { dataPagamento: 'desc' },
        include: {
          atendimento: {
            include: {
              agendamento: {
                include: {
                  cliente: true,
                  servico: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.pagamento.count({ where }),
    ]);
    return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
  }
}