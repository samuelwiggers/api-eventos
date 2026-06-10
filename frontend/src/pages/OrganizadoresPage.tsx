import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { organizadoresApi } from '@/api/client'
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
import type { CreateOrganizadorDto, Organizador } from '@/types'

const emptyForm: CreateOrganizadorDto = { nome: '', email: '', telefone: '' }

export function OrganizadoresPage() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Organizador | null>(null)
  const [deleting, setDeleting] = useState<Organizador | null>(null)
  const [form, setForm] = useState<CreateOrganizadorDto>(emptyForm)

  const { data: organizadores = [], isLoading } = useQuery({
    queryKey: ['organizadores'],
    queryFn: organizadoresApi.list,
  })

  const saveMutation = useMutation({
    mutationFn: (payload: { id?: number; data: CreateOrganizadorDto }) =>
      payload.id
        ? organizadoresApi.update(payload.id, payload.data)
        : organizadoresApi.create(payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizadores'] })
      toast.success(editing ? 'Organizador atualizado' : 'Organizador criado')
      closeDialog()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => organizadoresApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizadores'] })
      toast.success('Organizador removido')
      setDeleting(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  function openEdit(org: Organizador) {
    setEditing(org)
    setForm({ nome: org.nome, email: org.email, telefone: org.telefone })
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
        title="Organizadores"
        description="Responsáveis pela organização dos eventos"
        onAction={openCreate}
      />

      <div className="px-8 py-6">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : organizadores.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
            <p className="text-muted-foreground">
              Nenhum organizador cadastrado
            </p>
            <Button className="mt-4" onClick={openCreate}>
              Criar primeiro organizador
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizadores.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">{org.nome}</TableCell>
                    <TableCell>{org.email}</TableCell>
                    <TableCell>{org.telefone}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEdit(org)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleting(org)}
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
              {editing ? 'Editar organizador' : 'Novo organizador'}
            </DialogTitle>
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
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={form.telefone}
                onChange={(e) =>
                  setForm({ ...form, telefone: e.target.value })
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
            <AlertDialogTitle>Remover organizador?</AlertDialogTitle>
            <AlertDialogDescription>
              O organizador &quot;{deleting?.nome}&quot; será excluído
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
