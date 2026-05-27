import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateEventoDto {
  @ApiProperty({ example: 'Workshop NestJS' })
  @IsString()
  titulo: string;

  @ApiProperty({ example: 'Introdução REST', required: false })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ example: '2026-06-15T14:00:00.000Z' })
  @IsDateString()
  dataInicio: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  localId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  organizadorId: number;
}
