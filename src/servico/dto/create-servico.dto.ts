import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateServicoDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do serviço é obrigatório.' })
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'O preço padrão é obrigatório.' })
  precoPadrao: number;

  @IsInt()
  @IsNotEmpty({ message: 'A duração em minutos é obrigatória.' })
  duracaoMinutos: number;
}