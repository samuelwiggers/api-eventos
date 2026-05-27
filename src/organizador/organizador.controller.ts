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
import { CreateOrganizadorDto } from './dto/create-organizador.dto';
import { UpdateOrganizadorDto } from './dto/update-organizador.dto';
import { Organizador } from './organizador.entity';
import { OrganizadorService } from './organizador.service';

@ApiTags('Organizadores')
@Controller('organizadores')
export class OrganizadorController {
  constructor(private readonly organizadorService: OrganizadorService) {}

  @Get()
  @ApiOperation({ summary: 'Listar organizadores' })
  findAll(): Promise<Organizador[]> {
    return this.organizadorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar organizador por ID' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Organizador> {
    return this.organizadorService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar organizador' })
  create(@Body() dto: CreateOrganizadorDto): Promise<Organizador> {
    return this.organizadorService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar organizador' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrganizadorDto,
  ): Promise<Organizador> {
    return this.organizadorService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover organizador' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.organizadorService.remove(id);
  }
}
