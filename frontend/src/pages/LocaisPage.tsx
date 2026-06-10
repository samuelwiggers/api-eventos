import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { locaisApi } from '@/api/client'
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
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { CreateLocalDto, Local } from '@/types'

const emptyForm: CreateLocalDto = { nome: '', endereco: '', capacidade: 0 }

export function LocaisPage() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Local | null>(null)
  const [deleting, setDeleting] = useState<Local | null>(null)
  const [form, setForm] = useState<CreateLocalDto>(emptyForm)

  const { data: locais = [], isLoading } = useQuery({
    queryKey: ['locais'],
    queryFn: locaisApi.list,
  })

  const saveMutation = useMutation({
    mutationFn: (payload: { id?: number; data: CreateLocalDto }) =>
      payload.id
        ? locaisApi.update(payload.id, payload.data)
        : locaisApi.create(payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locais'] })
      toast.success(editing ? 'Local atualizado' : 'Local criado')
      closeDialog()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => locaisApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locais'] })
      toast.success('Local removido')
      setDeleting(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  function openEdit(local: Local) {
    setEditing(local)
    setForm({
      nome: local.nome,
      endereco: local.endereco,
      capacidade: local.capacidade,
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
    saveMutation.mutate({ id: editing?.id, data: form })
  }

  function handleDelete() {
    if (!deleting) return
    const id = deleting.id
    setDeleting(null)
    deleteMutation.mutate(id)
  }

  return (
    <>
      <PageHeader
        title="Locais"
        description="Espaços onde os eventos acontecem"
        onAction={openCreate}
      />

      <div className="px-8 py-6">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : locais.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
            <p className="text-muted-foreground">Nenhum local cadastrado</p>
            <Button className="mt-4" onClick={openCreate}>
              Criar primeiro local
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Capacidade</TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {locais.map((local) => (
                  <TableRow key={local.id}>
                    <TableCell className="font-medium">{local.nome}</TableCell>
                    <TableCell>{local.endereco}</TableCell>
                    <TableCell>{local.capacidade}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEdit(local)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleting(local)}
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
            <DialogTitle>{editing ? 'Editar local' : 'Novo local'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={form.endereco}
                onChange={(e) =>
                  setForm({ ...form, endereco: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacidade">Capacidade</Label>
              <Input
                id="capacidade"
                type="number"
                min={1}
                value={form.capacidade || ''}
                onChange={(e) =>
                  setForm({ ...form, capacidade: Number(e.target.value) })
                }
                required
              />
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
            <AlertDialogTitle>Remover local?</AlertDialogTitle>
            <AlertDialogDescription>
              O local &quot;{deleting?.nome}&quot; será excluído permanentemente.
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
