import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function formatDateTime(value: string) {
  return format(parseISO(value), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
}

export function toDatetimeLocal(value: string) {
  const d = new Date(value)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function fromDatetimeLocal(value: string) {
  return new Date(value).toISOString()
}
