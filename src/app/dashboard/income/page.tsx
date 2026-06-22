'use client'

import { IncomeManager } from '@/src/components/dashboard/income-manager'

export default function IncomePage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Gestión de Ingresos</h1>
        <p className="text-muted-foreground mt-2">Organiza y controla tus fuentes de ingreso</p>
      </div>

      <IncomeManager />
    </>
  )
}
