import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateServicoDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do serviço é obrigatório.' })
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'O preço padrão é obrigatório.' })
  @IsPositive({ message: 'O preço padrão deve ser maior que zero.' })
  precoPadrao: number;

  @IsInt()
  @IsNotEmpty({ message: 'A duração em minutos é obrigatória.' })
  @IsPositive({ message: 'A duração deve ser maior que zero.' })
  duracaoMinutos: number;
}