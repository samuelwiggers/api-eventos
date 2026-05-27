import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsString } from 'class-validator';

export class CreateInscricaoDto {
  @ApiProperty({ example: 'João Souza' })
  @IsString()
  nomeParticipante: string;

  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  eventoId: number;
}
