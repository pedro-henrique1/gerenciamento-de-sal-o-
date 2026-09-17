import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateAgendamentoDto {
  @IsUUID('4', { message: 'O ID do cliente deve ser um UUID válido.' })
  @IsNotEmpty({ message: 'O cliente é obrigatório.' })
  clienteId: string;

  @IsUUID('4', { message: 'O ID do profissional deve ser um UUID válido.' })
  @IsNotEmpty({ message: 'O profissional é obrigatório.' })
  profissionalId: string;

  @IsUUID('4', { message: 'O ID do serviço deve ser um UUID válido.' })
  @IsNotEmpty({ message: 'O serviço é obrigatório.' })
  servicoId: string;

  @IsDateString({}, { message: 'A data e hora devem estar no formato ISO (ex: 2026-10-25T14:30:00Z).' })
  @IsNotEmpty({ message: 'A data e hora da reserva são obrigatórias.' })
  dataHoraReserva: string;
}