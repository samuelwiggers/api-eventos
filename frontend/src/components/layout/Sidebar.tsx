import { CalendarDays, MapPin, Ticket, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const links = [
  { to: '/', label: 'Eventos', icon: CalendarDays },
  { to: '/locais', label: 'Locais', icon: MapPin },
  { to: '/organizadores', label: 'Organizadores', icon: Users },
  { to: '/inscricoes', label: 'Inscrições', icon: Ticket },
]

export function Sidebar() {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r bg-sidebar">
      <div className="border-b px-5 py-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Gestão
        </p>
        <h1 className="font-heading text-lg font-semibold">Eventos</h1>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/60',
              )
            }
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
