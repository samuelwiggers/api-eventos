import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateOrganizadorDto {
  @ApiProperty({ example: 'Maria Silva' })
  @IsString()
  nome: string;

  @ApiProperty({ example: 'maria@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '11999999999' })
  @IsString()
  telefone: string;
}
