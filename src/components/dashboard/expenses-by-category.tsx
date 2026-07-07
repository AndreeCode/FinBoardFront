'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2, PieChart, CreditCard } from 'lucide-react'
import { Card, CardContent } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { 
  getTransactions,
  getTransactionsByCategory,
  Transaction 
} from '@/src/lib/actions/transactions'
import { getCategories, Category } from '@/src/lib/actions/categories'
import { formatSoles } from '@/src/lib/currency'
import { toast } from 'sonner'

interface CategoryWithChildren extends Category {
  children: CategoryWithChildren[]
  total: number
  transactionCount: number
}

export function ExpensesByCategoryManager() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category_id')

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(categoryParam)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategoryId(categoryParam)
      loadTransactionsByCategory(categoryParam)
    }
  }, [categoryParam])

  async function loadData() {
    setIsLoading(true)
    try {
      const [txData, catData] = await Promise.all([
        getTransactions(),
        getCategories(),
      ])
      setTransactions(txData)
      setCategories(catData)
    } catch {
      toast.error('Error al cargar datos')
    } finally {
      setIsLoading(false)
    }
  }

  async function loadTransactionsByCategory(categoryId: string) {
    setIsLoading(true)
    try {
      const data = await getTransactionsByCategory(categoryId)
      setTransactions(data)
    } catch {
      toast.error('Error al cargar transacciones')
    } finally {
      setIsLoading(false)
    }
  }

  function buildCategoryTree(cats: Category[]): CategoryWithChildren[] {
    const map = new Map<string, CategoryWithChildren>()
    const roots: CategoryWithChildren[] = []

    cats.forEach((cat) => {
      map.set(cat.id, { ...cat, children: [], total: 0, transactionCount: 0 })
    })

    map.forEach((node) => {
      if (node.parent_id && map.has(node.parent_id)) {
        map.get(node.parent_id)!.children.push(node)
      } else {
        roots.push(node)
      }
    })

    return roots
  }

  const categoryTree = useMemo(() => buildCategoryTree(categories), [categories])

  const categoriesWithTotals = useMemo(() => {
    return categoryTree.map((cat) => {
      const expenses = transactions.filter(tx => tx.type === 'expense' && tx.category_id === cat.id)
      const childExpenses = cat.children.flatMap((child) =>
        transactions.filter(tx => tx.type === 'expense' && tx.category_id === child.id)
      )

      return {
        ...cat,
        total: expenses.reduce((sum, tx) => sum + tx.amount, 0) +
               childExpenses.reduce((sum, tx) => sum + tx.amount, 0),
        transactionCount: expenses.length + childExpenses.length,
        children: cat.children.map((child) => {
          const childExpenses = transactions.filter(tx => tx.type === 'expense' && tx.category_id === child.id)
          return {
            ...child,
            total: childExpenses.reduce((sum, tx) => sum + tx.amount, 0),
            transactionCount: childExpenses.length,
          }
        }),
      }
    })
  }, [categoryTree, transactions])

  const selectedCategory = selectedCategoryId
    ? categories.find((c) => c.id === selectedCategoryId)
    : null

  const selectedCategoryTransactions = useMemo(() => {
    if (!selectedCategoryId) return []
    return transactions.filter(
      (tx) => tx.type === 'expense' && tx.category_id === selectedCategoryId
    )
  }, [selectedCategoryId, transactions])

  const totalExpenses = useMemo(() => {
    return transactions
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0)
  }, [transactions])

  function handleCategoryClick(categoryId: string) {
    setSelectedCategoryId(categoryId)
    window.history.pushState(null, '', `?category_id=${categoryId}`)
  }

  function handleClearFilter() {
    setSelectedCategoryId(null)
    window.history.pushState(null, '', '/dashboard/meals')
    loadData()
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-2xl font-bold text-foreground">{formatSoles(totalExpenses)}</span>
            <span className="text-xs text-muted-foreground">Total Gastos</span>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <PieChart className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-bold text-foreground">{categoriesWithTotals.length}</span>
            <span className="text-xs text-muted-foreground">Categorías con gastos</span>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <span className="text-2xl font-bold text-foreground">
              {transactions.filter((tx) => tx.type === 'expense').length}
            </span>
            <span className="text-xs text-muted-foreground">Transacciones de gasto</span>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-4">Gastos por Categoría</h3>
        {isLoading && categories.length === 0 ? (
          <Card>
            <CardContent className="p-8 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : categoriesWithTotals.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No hay categorías creadas</p>
              <p className="text-sm text-muted-foreground mt-1">
                Crea categorías en la sección de Categorías
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categoriesWithTotals.map((cat) => (
              <div
                key={cat.id}
                className={`border rounded-lg p-4 hover:border-primary/50 hover:bg-accent/5 transition-all cursor-pointer ${
                  selectedCategoryId === cat.id ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onClick={() => handleCategoryClick(cat.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📁</span>
                    <span className="font-semibold text-foreground">{cat.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {cat.transactionCount} gastos
                  </Badge>
                </div>
                <div className="text-xl font-bold text-red-500">{formatSoles(cat.total)}</div>
                {cat.children.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex flex-wrap gap-1">
                      {cat.children.map((child) => (
                        <span
                          key={child.id}
                          className="text-xs bg-accent px-2 py-1 rounded"
                        >
                          {child.name}: {formatSoles(child.total)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCategory && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">
              Gastos en: {selectedCategory.name}
            </h3>
            <button
              onClick={handleClearFilter}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Ver todos
            </button>
          </div>

          {isLoading ? (
            <Card>
              <CardContent className="p-8 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ) : selectedCategoryTransactions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No hay gastos en esta categoría</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {selectedCategoryTransactions.map((tx) => (
                <Card key={tx.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-2xl">💸</div>
                        <div>
                          <h4 className="font-semibold text-foreground">{tx.description}</h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(tx.transaction_date).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-red-500">-{formatSoles(tx.amount)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}