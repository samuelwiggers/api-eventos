import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventoService } from '../evento/evento.service';
import { CreateInscricaoDto } from './dto/create-inscricao.dto';
import { UpdateInscricaoDto } from './dto/update-inscricao.dto';
import { Inscricao } from './inscricao.entity';

@Injectable()
export class InscricaoService {
  constructor(
    @InjectRepository(Inscricao)
    private readonly inscricaoRepository: Repository<Inscricao>,
    private readonly eventoService: EventoService,
  ) {}

  findAll(): Promise<Inscricao[]> {
    return this.inscricaoRepository.find({ relations: { evento: true } });
  }

  async findOne(id: number): Promise<Inscricao> {
    const inscricao = await this.inscricaoRepository.findOne({
      where: { id },
      relations: { evento: true },
    });
    if (!inscricao) {
      throw new NotFoundException(`Inscrição ${id} não encontrada`);
    }
    return inscricao;
  }

  async create(dto: CreateInscricaoDto): Promise<Inscricao> {
    await this.eventoService.findOne(dto.eventoId);
    const inscricao = this.inscricaoRepository.create({
      ...dto,
      dataInscricao: new Date(),
    });
    return this.inscricaoRepository.save(inscricao);
  }

  async update(id: number, dto: UpdateInscricaoDto): Promise<Inscricao> {
    const inscricao = await this.findOne(id);
    if (dto.eventoId !== undefined) {
      await this.eventoService.findOne(dto.eventoId);
    }
    Object.assign(inscricao, dto);
    return this.inscricaoRepository.save(inscricao);
  }

  async remove(id: number): Promise<void> {
    const inscricao = await this.findOne(id);
    await this.inscricaoRepository.remove(inscricao);
  }
}
