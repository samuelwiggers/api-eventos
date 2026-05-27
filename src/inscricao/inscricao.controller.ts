import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateInscricaoDto } from './dto/create-inscricao.dto';
import { UpdateInscricaoDto } from './dto/update-inscricao.dto';
import { Inscricao } from './inscricao.entity';
import { InscricaoService } from './inscricao.service';

@ApiTags('Inscrições')
@Controller('inscricoes')
export class InscricaoController {
  constructor(private readonly inscricaoService: InscricaoService) {}

  @Get()
  @ApiOperation({ summary: 'Listar inscrições' })
  findAll(): Promise<Inscricao[]> {
    return this.inscricaoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar inscrição por ID' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Inscricao> {
    return this.inscricaoService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar inscrição' })
  create(@Body() dto: CreateInscricaoDto): Promise<Inscricao> {
    return this.inscricaoService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar inscrição' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInscricaoDto,
  ): Promise<Inscricao> {
    return this.inscricaoService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover inscrição' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.inscricaoService.remove(id);
  }
}
