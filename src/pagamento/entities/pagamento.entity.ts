import { Pagamento as PrismaPagamento, FormaPagamento, Prisma } from '@prisma/client';

export class Pagamento implements PrismaPagamento {
  id: string;
  valorFinal: Prisma.Decimal;
  formaPagamento: FormaPagamento;
  dataPagamento: Date;
  atendimentoId: string;
}