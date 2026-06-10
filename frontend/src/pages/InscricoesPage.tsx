import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { eventosApi, inscricoesApi } from '@/api/client'
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
import { Button } from '@/components/ui/button'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDateTime } from '@/lib/dates'
import type { CreateInscricaoDto, Evento, Inscricao } from '@/types'

function formatEventoLabel(
  evento: Pick<Evento, 'id' | 'titulo' | 'descricao'>,
) {
  const descricao = evento.descricao?.trim() || 'Sem descrição'
  return `${evento.id} - ${evento.titulo} / ${descricao}`
}

type InscricaoForm = {
  nomeParticipante: string
  email: string
  eventoId: string
}

const emptyForm: InscricaoForm = {
  nomeParticipante: '',
  email: '',
  eventoId: '',
}

export function InscricoesPage() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Inscricao | null>(null)
  const [deleting, setDeleting] = useState<Inscricao | null>(null)
  const [form, setForm] = useState<InscricaoForm>(emptyForm)

  const { data: inscricoes = [], isLoading } = useQuery({
    queryKey: ['inscricoes'],
    queryFn: inscricoesApi.list,
  })

  const { data: eventos = [] } = useQuery({
    queryKey: ['eventos'],
    queryFn: eventosApi.list,
  })

  const saveMutation = useMutation({
    mutationFn: (payload: { id?: number; data: CreateInscricaoDto }) =>
      payload.id
        ? inscricoesApi.update(payload.id, payload.data)
        : inscricoesApi.create(payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inscricoes'] })
      toast.success(editing ? 'Inscrição atualizada' : 'Inscrição criada')
      closeDialog()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => inscricoesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inscricoes'] })
      toast.success('Inscrição removida')
      setDeleting(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  function openCreate() {
    if (eventos.length === 0) {
      toast.error('Cadastre ao menos um evento antes')
      return
    }
    setEditing(null)
    setForm({ ...emptyForm, eventoId: String(eventos[0].id) })
    setOpen(true)
  }

  function openEdit(inscricao: Inscricao) {
    setEditing(inscricao)
    setForm({
      nomeParticipante: inscricao.nomeParticipante,
      email: inscricao.email,
      eventoId: String(inscricao.eventoId),
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
    const data: CreateInscricaoDto = {
      nomeParticipante: form.nomeParticipante,
      email: form.email,
      eventoId: Number(form.eventoId),
    }
    saveMutation.mutate({ id: editing?.id, data })
  }

  function handleDelete() {
    if (!deleting) return
    const id = deleting.id
    setDeleting(null)
    deleteMutation.mutate(id)
  }

  const selectedEvento = eventos.find((e) => String(e.id) === form.eventoId)

  return (
    <>
      <PageHeader
        title="Inscrições"
        description="Participantes inscritos nos eventos"
        onAction={openCreate}
      />

      <div className="px-8 py-6">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : inscricoes.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
            <p className="text-muted-foreground">Nenhuma inscrição cadastrada</p>
            <Button className="mt-4" onClick={openCreate}>
              Criar primeira inscrição
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participante</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead>Data inscrição</TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {inscricoes.map((inscricao) => (
                  <TableRow key={inscricao.id}>
                    <TableCell className="font-medium">
                      {inscricao.nomeParticipante}
                    </TableCell>
                    <TableCell>{inscricao.email}</TableCell>
                    <TableCell>
                      {inscricao.evento
                        ? formatEventoLabel(inscricao.evento)
                        : `${inscricao.eventoId} - Evento não encontrado`}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(inscricao.dataInscricao)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEdit(inscricao)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleting(inscricao)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={(v) => !v && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Editar inscrição' : 'Nova inscrição'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nomeParticipante">Participante</Label>
              <Input
                id="nomeParticipante"
                value={form.nomeParticipante}
                onChange={(e) =>
                  setForm({ ...form, nomeParticipante: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Evento</Label>
              <Select
                value={form.eventoId}
                onValueChange={(v) =>
                  v && setForm({ ...form, eventoId: v })
                }
              >
                <SelectTrigger className="w-full">
                  <span
                    className={
                      selectedEvento
                        ? 'line-clamp-1'
                        : 'line-clamp-1 text-muted-foreground'
                    }
                  >
                    {selectedEvento
                      ? formatEventoLabel(selectedEvento)
                      : 'Selecione o evento'}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {eventos.map((evento) => (
                    <SelectItem key={evento.id} value={String(evento.id)}>
                      {formatEventoLabel(evento)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {editing && (
              <div className="space-y-2">
                <Label>Data inscrição</Label>
                <Input
                  value={formatDateTime(editing.dataInscricao)}
                  disabled
                />
              </div>
            )}
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
            <AlertDialogTitle>Remover inscrição?</AlertDialogTitle>
            <AlertDialogDescription>
              A inscrição de &quot;{deleting?.nomeParticipante}&quot; será
              excluída permanentemente.
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
