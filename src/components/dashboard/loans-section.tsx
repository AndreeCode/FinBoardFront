'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Banknote, Loader2 } from 'lucide-react';
import { formatSoles } from '@/src/lib/currency';
import { getLoans, Loan } from '@/src/lib/actions/loans';
import { getTransactions, Transaction } from '@/src/lib/actions/transactions';

interface LoanDisplay {
  id: string;
  name: string;
  amount: number;
  paid: number;
  remaining: number;
  percentage: number;
  rate: number;
  nextPayment: string;
  status: string;
}

export function LoansSection() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [loanData, txData] = await Promise.all([
          getLoans(),
          getTransactions(),
        ])
        setLoans(loanData)
        setTransactions(txData)
      } catch (error) {
        console.error('Error loading loans:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  function getTransactionDescription(transactionId: string): string {
    const tx = transactions.find(t => t.id === transactionId)
    return tx?.description || 'Sin descripción'
  }

  function getTransactionAmount(transactionId: string): number {
    const tx = transactions.find(t => t.id === transactionId)
    return tx?.amount || 0
  }

  const loanDisplays: LoanDisplay[] = loans.map(loan => {
    const amount = getTransactionAmount(loan.transaction_id)
    const percentage = loan.status === 'paid' ? 100 : loan.status === 'active' ? 0 : 0
    return {
      id: loan.id,
      name: getTransactionDescription(loan.transaction_id),
      amount,
      paid: 0,
      remaining: amount,
      percentage,
      rate: loan.interest_rate,
      nextPayment: loan.due_date ? new Date(loan.due_date).toLocaleDateString('es-ES') : 'Sin fecha',
      status: loan.status,
    }
  }).slice(0, 3)

  if (isLoading) {
    return (
      <Card className="border-border">
        <CardContent className="p-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (loanDisplays.length === 0) {
    return (
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">Préstamos Activos</CardTitle>
            <Banknote className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">No hay préstamos activos</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">Préstamos Activos</CardTitle>
          <Banknote className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loanDisplays.map((loan) => (
            <div key={loan.id} className="p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground">{loan.name}</h4>
                  <p className="text-xs text-muted-foreground">Tasa: {loan.rate}%</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {loan.status === 'active' ? 'Activo' : loan.status === 'paid' ? 'Pagado' : loan.status}
                </Badge>
              </div>
              
              <div className="bg-secondary/30 rounded-full h-2 w-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                  style={{ width: `${loan.percentage}%` }}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                <div>
                  <p className="text-muted-foreground">Pagado</p>
                  <p className="font-semibold text-foreground">{formatSoles(loan.paid)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Restante</p>
                  <p className="font-semibold text-foreground">{formatSoles(loan.remaining)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-semibold text-foreground">{formatSoles(loan.amount)}</p>
                </div>
              </div>
              
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-xs text-green-700 dark:text-green-400">
                  <span className="font-semibold">Vence:</span> {loan.nextPayment}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
