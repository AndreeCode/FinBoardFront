'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { Loader2, Search } from 'lucide-react'
import { 
  ShoppingCart, 
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { formatSoles } from '@/src/lib/currency'
import { getTransactions, Transaction } from '@/src/lib/actions/transactions'
import { getCategories, Category } from '@/src/lib/actions/categories'

interface TransactionWithCategory extends Transaction {
  category_name: string
}

const ICONS: Record<string, React.ReactNode> = {
  income: <DollarSign className="h-4 w-4" />,
  expense: <ShoppingCart className="h-4 w-4" />,
  investment: <TrendingUp className="h-4 w-4" />,
}

const COLORS: Record<string, string> = {
  income: 'text-green-500',
  expense: 'text-red-500',
  investment: 'text-purple-500',
}

const BADGE_COLORS: Record<string, string> = {
  income: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  expense: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  investment: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
}

export function TransactionsList() {
  const [transactions, setTransactions] = useState<TransactionWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setIsLoading(true)
    try {
      const [txData, catData] = await Promise.all([
        getTransactions(),
        getCategories(),
      ])
      setCategories(catData)
      
      const txWithCategory = txData.map((tx) => {
        const cat = catData.find((c) => c.id === tx.category_id)
        return {
          ...tx,
          category_name: cat?.name || 'Sin categoría',
        }
      })
      setTransactions(txWithCategory)
    } catch (error) {
      console.error('Error loading transactions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTransactions = transactions.filter((tx) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      tx.description.toLowerCase().includes(term) ||
      tx.category_name.toLowerCase().includes(term) ||
      tx.type.toLowerCase().includes(term)
    )
  })

  const getTypeColor = (type: string) => {
    return BADGE_COLORS[type] || ''
  }

  if (isLoading) {
    return (
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm md:text-base font-bold">Transacciones Recientes</CardTitle>
        </CardHeader>
        <CardContent className="pb-2 flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm md:text-base font-bold">Transacciones Recientes</CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-7 pr-2 py-1 rounded border border-input bg-background"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No hay transacciones
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTransactions.slice(0, 6).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-2 rounded border border-border hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className={`p-1.5 rounded text-sm flex-shrink-0 ${COLORS[transaction.type]}`}>
                    {ICONS[transaction.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground text-xs truncate">
                      {transaction.description}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {transaction.category_name} • {new Date(transaction.transaction_date).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge className={`${getTypeColor(transaction.type)} border-0 text-xs py-0`}>
                    {transaction.category_name}
                  </Badge>
                  <span className={`font-bold text-sm flex items-center gap-1 ${
                    transaction.type === 'income' ? 'text-green-500' :
                    transaction.type === 'investment' ? 'text-purple-500' :
                    'text-foreground'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {formatSoles(transaction.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}