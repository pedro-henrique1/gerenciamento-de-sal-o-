import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PagamentoService {
  constructor(private prisma: PrismaService) {}

  async create(createPagamentoDto: CreatePagamentoDto) {
    // 1. Verificar se o atendimento existe
    const atendimento = await this.prisma.atendimento.findUnique({
      where: { id: createPagamentoDto.atendimentoId },
      include: { pagamento: true },
    });

    if (!atendimento) {
      throw new NotFoundException('Atendimento não encontrado.');
    }

    // 2. REGRA DE NEGÓCIO: Verificar se o atendimento já foi pago
    if (atendimento.pagamento) {
      throw new ConflictException('Este atendimento já possui um pagamento registrado.');
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

  async findAll() {
    return this.prisma.pagamento.findMany({
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
    });
  }
}