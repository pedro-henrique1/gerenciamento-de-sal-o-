import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'O telefone é obrigatório.' })
  telefone: string;

  @IsOptional()
  @IsEmail({}, { message: 'Formato de e-mail inválido.' })
  email?: string;
}