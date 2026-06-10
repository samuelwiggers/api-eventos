import type {
  CreateEventoDto,
  CreateInscricaoDto,
  CreateLocalDto,
  CreateOrganizadorDto,
  Evento,
  Inscricao,
  Local,
  Organizador,
  UpdateEventoDto,
  UpdateInscricaoDto,
  UpdateLocalDto,
  UpdateOrganizadorDto,
} from '@/types'

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const message = Array.isArray(body.message)
      ? body.message.join(', ')
      : (body.message ?? res.statusText)
    throw new Error(message)
  }

  const text = await res.text()
  if (!text) return undefined as T
  return JSON.parse(text) as T
}

function crud<T, Create, Update>(path: string) {
  return {
    list: () => request<T[]>(path),
    get: (id: number) => request<T>(`${path}/${id}`),
    create: (dto: Create) =>
      request<T>(path, { method: 'POST', body: JSON.stringify(dto) }),
    update: (id: number, dto: Update) =>
      request<T>(`${path}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(dto),
      }),
    remove: (id: number) =>
      request<void>(`${path}/${id}`, { method: 'DELETE' }),
  }
}

export const locaisApi = crud<Local, CreateLocalDto, UpdateLocalDto>('/locais')
export const organizadoresApi = crud<
  Organizador,
  CreateOrganizadorDto,
  UpdateOrganizadorDto
>('/organizadores')
export const eventosApi = crud<Evento, CreateEventoDto, UpdateEventoDto>(
  '/eventos',
)
export const inscricoesApi = crud<
  Inscricao,
  CreateInscricaoDto,
  UpdateInscricaoDto
>('/inscricoes')
