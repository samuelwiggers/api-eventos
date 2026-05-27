import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('locais')
export class Local {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  endereco: string;

  @Column()
  capacidade: number;
}
