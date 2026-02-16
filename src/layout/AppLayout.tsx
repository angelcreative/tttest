import { useState, type ReactNode } from 'react'
import { Navbar } from '../components/Navbar'
import { Sidebar } from '../components/Sidebar'
import { Breadcrumb, type BreadcrumbItem } from '../components/Breadcrumb'

export interface AppLayoutProps {
  /** Ítems del breadcrumb (ej. [{ label: 'Home' }, { label: 'Select your network', current: true }]) */
  breadcrumbItems: BreadcrumbItem[]
  /** Contenido principal: cada pantalla inyecta aquí su zona título + cuerpo */
  children: ReactNode
}

/**
 * Template fijo de la app: Sidebar + Navbar + Breadcrumb + zona de contenido.
 * Reutilizar en todas las pantallas; no reconstruir.
 *
 * Contrato para cada pantalla: recibir como children un nodo que incluya
 * (1) su barra de título/acciones y (2) su cuerpo. El layout no define
 * la zona título; cada pantalla la dibuja como parte de children.
 */
export function AppLayout({ breadcrumbItems, children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)

  return (
    <div className="h-full w-full flex bg-[var(--surface-page)] text-[var(--copy-primary)]">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((c) => !c)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <Breadcrumb items={breadcrumbItems} />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
