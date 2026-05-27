import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventoModule } from '../evento/evento.module';
import { InscricaoController } from './inscricao.controller';
import { Inscricao } from './inscricao.entity';
import { InscricaoService } from './inscricao.service';

@Module({
  imports: [TypeOrmModule.forFeature([Inscricao]), EventoModule],
  controllers: [InscricaoController],
  providers: [InscricaoService],
})
export class InscricaoModule {}
