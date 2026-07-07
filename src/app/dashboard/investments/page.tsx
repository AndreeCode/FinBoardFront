import { InvestmentsManager } from '@/src/components/dashboard/investments-manager'

export default function InvestmentsPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Inversiones</h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">Gestiona tus inversiones y ganancias esperadas</p>
      </div>

      <InvestmentsManager />
    </>
  )
}