import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { EventosPage } from '@/pages/EventosPage'
import { InscricoesPage } from '@/pages/InscricoesPage'
import { LocaisPage } from '@/pages/LocaisPage'
import { OrganizadoresPage } from '@/pages/OrganizadoresPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<EventosPage />} />
          <Route path="locais" element={<LocaisPage />} />
          <Route path="organizadores" element={<OrganizadoresPage />} />
          <Route path="inscricoes" element={<InscricoesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
