import { Agendamento as PrismaAgendamento, StatusAgendamento } from '@prisma/client';

export class Agendamento implements PrismaAgendamento {
  id: string;
  dataHoraReserva: Date;
  status: StatusAgendamento;
  
  clienteId: string;
  profissionalId: string;
  servicoId: string;
}