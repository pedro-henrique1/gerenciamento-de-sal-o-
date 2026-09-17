import { Servico as PrismaServico, Prisma } from '@prisma/client';

export class Servico implements PrismaServico {
  id: string;
  nome: string;
  descricao: string | null;
  precoPadrao: Prisma.Decimal;
  duracaoMinutos: number;
}