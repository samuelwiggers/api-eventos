import { Plus } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface PageHeaderProps {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  children?: ReactNode
}

export function PageHeader({
  title,
  description,
  actionLabel = 'Novo',
  onAction,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b px-8 py-6">
      <div>
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children ??
        (onAction && (
          <Button onClick={onAction}>
            <Plus className="size-4" />
            {actionLabel}
          </Button>
        ))}
    </div>
  )
}
