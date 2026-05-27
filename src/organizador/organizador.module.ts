import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizadorController } from './organizador.controller';
import { Organizador } from './organizador.entity';
import { OrganizadorService } from './organizador.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organizador])],
  controllers: [OrganizadorController],
  providers: [OrganizadorService],
  exports: [OrganizadorService],
})
export class OrganizadorModule {}
