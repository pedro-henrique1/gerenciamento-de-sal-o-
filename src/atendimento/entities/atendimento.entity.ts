import { Atendimento as PrismaAtendimento } from '@prisma/client';

export class Atendimento implements PrismaAtendimento {
  id: string;
  dataConclusao: Date;
  observacoes: string | null;
  agendamentoId: string;
}