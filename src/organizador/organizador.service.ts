import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrganizadorDto } from './dto/create-organizador.dto';
import { UpdateOrganizadorDto } from './dto/update-organizador.dto';
import { Organizador } from './organizador.entity';

@Injectable()
export class OrganizadorService {
  constructor(
    @InjectRepository(Organizador)
    private readonly organizadorRepository: Repository<Organizador>,
  ) {}

  findAll(): Promise<Organizador[]> {
    return this.organizadorRepository.find();
  }

  async findOne(id: number): Promise<Organizador> {
    const organizador = await this.organizadorRepository.findOne({
      where: { id },
    });
    if (!organizador) {
      throw new NotFoundException(`Organizador ${id} não encontrado`);
    }
    return organizador;
  }

  create(dto: CreateOrganizadorDto): Promise<Organizador> {
    const organizador = this.organizadorRepository.create(dto);
    return this.organizadorRepository.save(organizador);
  }

  async update(id: number, dto: UpdateOrganizadorDto): Promise<Organizador> {
    const organizador = await this.findOne(id);
    Object.assign(organizador, dto);
    return this.organizadorRepository.save(organizador);
  }

  async remove(id: number): Promise<void> {
    const organizador = await this.findOne(id);
    await this.organizadorRepository.remove(organizador);
  }
}
