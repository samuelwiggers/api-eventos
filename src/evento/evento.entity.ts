import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Local } from '../local/local.entity';
import { Organizador } from '../organizador/organizador.entity';

@Entity('eventos')
export class Evento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'datetime' })
  dataInicio: Date;

  @Column()
  localId: number;

  @ManyToOne(() => Local)
  @JoinColumn({ name: 'localId' })
  local: Local;

  @Column()
  organizadorId: number;

  @ManyToOne(() => Organizador)
  @JoinColumn({ name: 'organizadorId' })
  organizador: Organizador;
}
