'use client';

import { SummaryCards } from '@/components/dashboard/summary-cards';
import { ExpenseChart } from '@/components/dashboard/expense-chart';
import { CategoriesChart } from '@/components/dashboard/categories-chart';
import { TransactionsList } from '@/components/dashboard/transactions-list';
import { FrequentExpenses } from '@/components/dashboard/frequent-expenses';
import { Sidebar } from '@/components/dashboard/sidebar';

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="min-h-screen bg-background overflow-auto">
          <div className="px-4 py-4 md:px-6 md:py-5">
            <div className="max-w-7xl mx-auto">
              {/* Title */}
              <div className="mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Mi Dashboard</h1>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">Control de finanzas personales</p>
              </div>

              {/* Summary Cards */}
              <div className="mb-4">
                <SummaryCards />
              </div>
              
              {/* Main Charts Section - 3 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <ExpenseChart />
                <CategoriesChart />
                <FrequentExpenses />
              </div>
              
              {/* Transactions */}
              <div>
                <TransactionsList />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
