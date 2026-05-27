import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('organizadores')
export class Organizador {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  email: string;

  @Column()
  telefone: string;
}
