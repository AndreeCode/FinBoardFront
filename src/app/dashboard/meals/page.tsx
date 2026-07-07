import { Suspense } from 'react'
import { ExpensesByCategoryManager } from '@/src/components/dashboard/expenses-by-category'
import { Loader2 } from 'lucide-react'

export default function MealsPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Gastos por Categoría</h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">Visualiza tus gastos agrupados por categoría</p>
      </div>

      <Suspense fallback={<div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>}>
        <ExpensesByCategoryManager />
      </Suspense>
    </>
  )
}