import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAtendimentoDto {
  @IsUUID('4', { message: 'O ID do agendamento deve ser um UUID válido.' })
  @IsNotEmpty({ message: 'O agendamento é obrigatório.' })
  agendamentoId: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}