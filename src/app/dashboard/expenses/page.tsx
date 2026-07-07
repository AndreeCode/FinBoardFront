import { IncomesManager } from '@/src/components/dashboard/incomes-manager'

export default function ExpensesPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Gastos</h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">Gestiona tus gastos y salidas de dinero</p>
      </div>

      <IncomesManager />
    </>
  )
}