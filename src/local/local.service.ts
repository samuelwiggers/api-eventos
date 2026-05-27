import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLocalDto } from './dto/create-local.dto';
import { UpdateLocalDto } from './dto/update-local.dto';
import { Local } from './local.entity';

@Injectable()
export class LocalService {
  constructor(
    @InjectRepository(Local)
    private readonly localRepository: Repository<Local>,
  ) {}

  findAll(): Promise<Local[]> {
    return this.localRepository.find();
  }

  async findOne(id: number): Promise<Local> {
    const local = await this.localRepository.findOne({ where: { id } });
    if (!local) {
      throw new NotFoundException(`Local ${id} não encontrado`);
    }
    return local;
  }

  create(dto: CreateLocalDto): Promise<Local> {
    const local = this.localRepository.create(dto);
    return this.localRepository.save(local);
  }

  async update(id: number, dto: UpdateLocalDto): Promise<Local> {
    const local = await this.findOne(id);
    Object.assign(local, dto);
    return this.localRepository.save(local);
  }

  async remove(id: number): Promise<void> {
    const local = await this.findOne(id);
    await this.localRepository.remove(local);
  }
}
