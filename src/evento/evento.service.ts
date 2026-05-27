import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocalService } from '../local/local.service';
import { OrganizadorService } from '../organizador/organizador.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { Evento } from './evento.entity';

@Injectable()
export class EventoService {
  constructor(
    @InjectRepository(Evento)
    private readonly eventoRepository: Repository<Evento>,
    private readonly localService: LocalService,
    private readonly organizadorService: OrganizadorService,
  ) {}

  findAll(): Promise<Evento[]> {
    return this.eventoRepository.find({
      relations: { local: true, organizador: true },
    });
  }

  async findOne(id: number): Promise<Evento> {
    const evento = await this.eventoRepository.findOne({
      where: { id },
      relations: { local: true, organizador: true },
    });
    if (!evento) {
      throw new NotFoundException(`Evento ${id} não encontrado`);
    }
    return evento;
  }

  async create(dto: CreateEventoDto): Promise<Evento> {
    await this.localService.findOne(dto.localId);
    await this.organizadorService.findOne(dto.organizadorId);
    const evento = this.eventoRepository.create({
      ...dto,
      dataInicio: new Date(dto.dataInicio),
    });
    return this.eventoRepository.save(evento);
  }

  async update(id: number, dto: UpdateEventoDto): Promise<Evento> {
    const evento = await this.findOne(id);
    if (dto.localId !== undefined) {
      await this.localService.findOne(dto.localId);
    }
    if (dto.organizadorId !== undefined) {
      await this.organizadorService.findOne(dto.organizadorId);
    }
    const { dataInicio, ...rest } = dto;
    Object.assign(evento, rest);
    if (dataInicio !== undefined) {
      evento.dataInicio = new Date(dataInicio);
    }
    return this.eventoRepository.save(evento);
  }

  async remove(id: number): Promise<void> {
    const evento = await this.findOne(id);
    await this.eventoRepository.remove(evento);
  }
}
