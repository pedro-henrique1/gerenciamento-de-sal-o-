import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProfissionalDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'O telefone é obrigatório.' })
  telefone: string;

  @IsString()
  @IsNotEmpty({ message: 'A especialidade é obrigatória.' })
  especialidade: string;
}