import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class CreateLocalDto {
  @ApiProperty({ example: 'Auditório Central' })
  @IsString()
  nome: string;

  @ApiProperty({ example: 'Rua das Flores, 100' })
  @IsString()
  endereco: string;

  @ApiProperty({ example: 200 })
  @IsInt()
  @Min(1)
  capacidade: number;
}
