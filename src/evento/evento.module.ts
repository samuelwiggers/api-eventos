import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalModule } from '../local/local.module';
import { OrganizadorModule } from '../organizador/organizador.module';
import { EventoController } from './evento.controller';
import { Evento } from './evento.entity';
import { EventoService } from './evento.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evento]),
    LocalModule,
    OrganizadorModule,
  ],
  controllers: [EventoController],
  providers: [EventoService],
  exports: [EventoService],
})
export class EventoModule {}
