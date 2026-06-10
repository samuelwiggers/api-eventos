import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Calendar, MapPin, Pencil, Trash2, User } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { eventosApi, locaisApi, organizadoresApi } from '@/api/client'
import { PageHeader } from '@/components/layout/PageHeader'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import {
  formatDateTime,
  fromDatetimeLocal,
  toDatetimeLocal,
} from '@/lib/dates'
import type { CreateEventoDto, Evento, Local, Organizador } from '@/types'

function formatLocalLabel(local: Pick<Local, 'id' | 'nome' | 'endereco'>) {
  return `${local.id} - ${local.nome} / ${local.endereco}`
}

function formatOrganizadorLabel(org: Pick<Organizador, 'id' | 'nome' | 'email'>) {
  return `${org.id} - ${org.nome} / ${org.email}`
}

type EventoForm = {
  titulo: string
  descricao: string
  dataInicio: string
  localId: string
  organizadorId: string
}

const emptyForm: EventoForm = {
  titulo: '',
  descricao: '',
  dataInicio: '',
  localId: '',
  organizadorId: '',
}

export function EventosPage() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Evento | null>(null)
  const [deleting, setDeleting] = useState<Evento | null>(null)
  const [form, setForm] = useState<EventoForm>(emptyForm)

  const { data: eventos = [], isLoading } = useQuery({
    queryKey: ['eventos'],
    queryFn: eventosApi.list,
  })

  const { data: locais = [] } = useQuery({
    queryKey: ['locais'],
    queryFn: locaisApi.list,
  })

  const { data: organizadores = [] } = useQuery({
    queryKey: ['organizadores'],
    queryFn: organizadoresApi.list,
  })

  const saveMutation = useMutation({
    mutationFn: (payload: { id?: number; data: CreateEventoDto }) =>
      payload.id
        ? eventosApi.update(payload.id, payload.data)
        : eventosApi.create(payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos'] })
      toast.success(editing ? 'Evento atualizado' : 'Evento criado')
      closeDialog()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => eventosApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos'] })
      toast.success('Evento removido')
      setDeleting(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  function openCreate() {
    if (locais.length === 0 || organizadores.length === 0) {
      toast.error('Cadastre ao menos um local e um organizador antes')
      return
    }
    setEditing(null)
    setForm({
      ...emptyForm,
      localId: String(locais[0].id),
      organizadorId: String(organizadores[0].id),
    })
    setOpen(true)
  }

  function openEdit(evento: Evento) {
    setEditing(evento)
    setForm({
      titulo: evento.titulo,
      descricao: evento.descricao ?? '',
      dataInicio: toDatetimeLocal(evento.dataInicio),
      localId: String(evento.localId),
      organizadorId: String(evento.organizadorId),
    })
    setOpen(true)
  }

  function closeDialog() {
    setOpen(false)
    setEditing(null)
    setForm(emptyForm)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data: CreateEventoDto = {
      titulo: form.titulo,
      descricao: form.descricao || undefined,
      dataInicio: fromDatetimeLocal(form.dataInicio),
      localId: Number(form.localId),
      organizadorId: Number(form.organizadorId),
    }
    saveMutation.mutate({ id: editing?.id, data })
  }

  function handleDelete() {
    if (!deleting) return
    const id = deleting.id
    setDeleting(null)
    deleteMutation.mutate(id)
  }

  const selectedLocal = locais.find((l) => String(l.id) === form.localId)
  const selectedOrganizador = organizadores.find(
    (o) => String(o.id) === form.organizadorId,
  )

  return (
    <>
      <PageHeader
        title="Eventos"
        description="Gerencie os eventos cadastrados"
        onAction={openCreate}
      />

      <div className="px-8 py-6">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : eventos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
            <p className="text-muted-foreground">Nenhum evento cadastrado</p>
            <Button className="mt-4" onClick={openCreate}>
              Criar primeiro evento
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {eventos.map((evento) => (
              <Card key={evento.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2 text-base">
                      {evento.titulo}
                    </CardTitle>
                    <Badge variant="secondary" className="shrink-0">
                      <Calendar className="size-3" />
                      {formatDateTime(evento.dataInicio)}
                    </Badge>
                  </div>
                  {evento.descricao && (
                    <CardDescription className="line-clamp-2">
                      {evento.descricao}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-3.5 shrink-0" />
                    <span>
                      {evento.local
                        ? formatLocalLabel(evento.local)
                        : `${evento.localId} - Local não encontrado`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="size-3.5 shrink-0" />
                    <span>
                      {evento.organizador
                        ? formatOrganizadorLabel(evento.organizador)
                        : `${evento.organizadorId} - Organizador não encontrado`}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="mt-auto gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEdit(evento)}
                  >
                    <Pencil className="size-3.5" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleting(evento)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={(v) => !v && closeDialog()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Editar evento' : 'Novo evento'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={form.descricao}
                onChange={(e) =>
                  setForm({ ...form, descricao: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data e hora</Label>
              <Input
                id="dataInicio"
                type="datetime-local"
                value={form.dataInicio}
                onChange={(e) =>
                  setForm({ ...form, dataInicio: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Local</Label>
              <Select
                value={form.localId}
                onValueChange={(v) =>
                  v && setForm({ ...form, localId: v })
                }
              >
                <SelectTrigger className="w-full">
                  <span
                    className={
                      selectedLocal
                        ? 'line-clamp-1'
                        : 'line-clamp-1 text-muted-foreground'
                    }
                  >
                    {selectedLocal
                      ? formatLocalLabel(selectedLocal)
                      : 'Selecione o local'}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {locais.map((local) => (
                    <SelectItem key={local.id} value={String(local.id)}>
                      {formatLocalLabel(local)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Organizador</Label>
              <Select
                value={form.organizadorId}
                onValueChange={(v) =>
                  v && setForm({ ...form, organizadorId: v })
                }
              >
                <SelectTrigger className="w-full">
                  <span
                    className={
                      selectedOrganizador
                        ? 'line-clamp-1'
                        : 'line-clamp-1 text-muted-foreground'
                    }
                  >
                    {selectedOrganizador
                      ? formatOrganizadorLabel(selectedOrganizador)
                      : 'Selecione o organizador'}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {organizadores.map((org) => (
                    <SelectItem key={org.id} value={String(org.id)}>
                      {formatOrganizadorLabel(org)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover evento?</AlertDialogTitle>
            <AlertDialogDescription>
              O evento &quot;{deleting?.titulo}&quot; será excluído
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
