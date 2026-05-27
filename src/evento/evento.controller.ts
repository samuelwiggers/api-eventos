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
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { Evento } from './evento.entity';
import { EventoService } from './evento.service';

@ApiTags('Eventos')
@Controller('eventos')
export class EventoController {
  constructor(private readonly eventoService: EventoService) {}

  @Get()
  @ApiOperation({ summary: 'Listar eventos' })
  findAll(): Promise<Evento[]> {
    return this.eventoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar evento por ID' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Evento> {
    return this.eventoService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar evento' })
  create(@Body() dto: CreateEventoDto): Promise<Evento> {
    return this.eventoService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar evento' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEventoDto,
  ): Promise<Evento> {
    return this.eventoService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover evento' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.eventoService.remove(id);
  }
}
