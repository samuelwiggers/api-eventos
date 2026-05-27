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
import { CreateLocalDto } from './dto/create-local.dto';
import { UpdateLocalDto } from './dto/update-local.dto';
import { Local } from './local.entity';
import { LocalService } from './local.service';

@ApiTags('Locais')
@Controller('locais')
export class LocalController {
  constructor(private readonly localService: LocalService) {}

  @Get()
  @ApiOperation({ summary: 'Listar locais' })
  findAll(): Promise<Local[]> {
    return this.localService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar local por ID' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Local> {
    return this.localService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar local' })
  create(@Body() dto: CreateLocalDto): Promise<Local> {
    return this.localService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar local' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLocalDto,
  ): Promise<Local> {
    return this.localService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover local' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.localService.remove(id);
  }
}
