export interface Local {
  id: number
  nome: string
  endereco: string
  capacidade: number
}

export interface Organizador {
  id: number
  nome: string
  email: string
  telefone: string
}

export interface Evento {
  id: number
  titulo: string
  descricao: string | null
  dataInicio: string
  localId: number
  organizadorId: number
  local?: Local
  organizador?: Organizador
}

export interface Inscricao {
  id: number
  nomeParticipante: string
  email: string
  dataInscricao: string
  eventoId: number
  evento?: Evento
}

export type CreateLocalDto = Omit<Local, 'id'>
export type UpdateLocalDto = Partial<CreateLocalDto>

export type CreateOrganizadorDto = Omit<Organizador, 'id'>
export type UpdateOrganizadorDto = Partial<CreateOrganizadorDto>

export type CreateEventoDto = {
  titulo: string
  descricao?: string
  dataInicio: string
  localId: number
  organizadorId: number
}
export type UpdateEventoDto = Partial<CreateEventoDto>

export type CreateInscricaoDto = {
  nomeParticipante: string
  email: string
  eventoId: number
}
export type UpdateInscricaoDto = Partial<CreateInscricaoDto>
