import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventoModule } from './evento/evento.module';
import { InscricaoModule } from './inscricao/inscricao.module';
import { LocalModule } from './local/local.module';
import { OrganizadorModule } from './organizador/organizador.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    LocalModule,
    OrganizadorModule,
    EventoModule,
    InscricaoModule,
  ],
})
export class AppModule {}
