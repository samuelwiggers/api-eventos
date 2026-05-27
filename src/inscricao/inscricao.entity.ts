import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Evento } from '../evento/evento.entity';

@Entity('inscricoes')
export class Inscricao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nomeParticipante: string;

  @Column()
  email: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  dataInscricao: Date;

  @Column()
  eventoId: number;

  @ManyToOne(() => Evento)
  @JoinColumn({ name: 'eventoId' })
  evento: Evento;
}
