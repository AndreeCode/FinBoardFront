import { SummaryCards } from '@/src/components/dashboard/summary-cards'
import { ExpenseChart } from '@/src/components/dashboard/expense-chart'
import { CategoriesChart } from '@/src/components/dashboard/categories-chart'
import { TransactionsList } from '@/src/components/dashboard/transactions-list'
import { FrequentExpenses } from '@/src/components/dashboard/frequent-expenses'

export default function DashboardPage() {
  return (
    <>
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Mi Dashboard</h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">Control de finanzas personales</p>
      </div>

      <div className="mb-4">
        <SummaryCards />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <ExpenseChart />
        <CategoriesChart />
        <FrequentExpenses />
      </div>
      
      <div>
        <TransactionsList />
      </div>
    </>
  )
}
