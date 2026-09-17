import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';
import { FormaPagamento } from '@prisma/client';

export class CreatePagamentoDto {
  @IsUUID('4', { message: 'O ID do atendimento deve ser um UUID válido.' })
  @IsNotEmpty({ message: 'O atendimento é obrigatório.' })
  atendimentoId: string;

  @IsNumber({}, { message: 'O valor final deve ser um número válido.' })
  @IsNotEmpty({ message: 'O valor final é obrigatório.' })
  @IsPositive({ message: 'O valor final deve ser maior que zero.' })
  valorFinal: number;

  @IsEnum(FormaPagamento, { message: 'A forma de pagamento deve ser PIX, CARTAO ou DINHEIRO.' })
  @IsNotEmpty({ message: 'A forma de pagamento é obrigatória.' })
  formaPagamento: FormaPagamento;
}