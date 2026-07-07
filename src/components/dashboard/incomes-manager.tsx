'use client'

import React, { useState, useEffect } from 'react'
import { Trash2, Plus, Loader2, Pencil, Search, Wallet, CreditCard } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Badge } from '@/src/components/ui/badge'
import { FormModal, ConfirmModal } from '@/src/components/ui/modal'
import { 
  getTransactions, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction,
  Transaction,
  UpdateTransactionRequest 
} from '@/src/lib/actions/transactions'
import { getCategories, Category } from '@/src/lib/actions/categories'
import { formatSoles } from '@/src/lib/currency'
import { toast } from 'sonner'

interface CategoryWithChildren extends Category {
  children: CategoryWithChildren[]
}

interface CategoryBoxProps {
  category: CategoryWithChildren
  onClick: (categoryId: string) => void
  onSubClick: (categoryId: string) => void
}

function CategoryBox({ category, onClick, onSubClick }: CategoryBoxProps) {
  return (
    <div 
      className="border border-border rounded-lg p-4 hover:border-primary/50 hover:bg-accent/5 transition-all cursor-pointer group"
      onClick={() => onClick(category.id)}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">📁</span>
        <span className="font-semibold text-foreground group-hover:text-primary">{category.name}</span>
      </div>
      {category.description && (
        <p className="text-xs text-muted-foreground line-clamp-2">{category.description}</p>
      )}
      {category.children.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {category.children.map((child) => (
              <Button
                key={child.id}
                variant="outline"
                size="sm"
                className="h-auto py-1 px-2 text-xs"
                onClick={(e) => {
                  e.stopPropagation()
                  onSubClick(child.id)
                }}
              >
                📄 {child.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function IncomesManager() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const [newTransaction, setNewTransaction] = useState({
    category_id: null as string | null,
    amount: 0,
    type: 'income' as 'income' | 'expense',
    transaction_date: new Date().toISOString().split('T')[0],
    received_date: null as string | null,
    due_date: null as string | null,
    canceled: false,
    description: '',
  })

  const [editForm, setEditForm] = useState<UpdateTransactionRequest>({})

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
      setTransactions(txData)
      setCategories(catData)
    } catch {
      toast.error('Error al cargar datos')
    } finally {
      setIsLoading(false)
    }
  }

  function handleCategoryClick(categoryId: string) {
    setSelectedCategoryId(categoryId)
    setNewTransaction((prev) => ({ ...prev, category_id: categoryId, type: transactionType }))
    setShowCreateModal(true)
  }

  function handleSubCategoryClick(categoryId: string) {
    setSelectedCategoryId(categoryId)
    setNewTransaction((prev) => ({ ...prev, category_id: categoryId, type: transactionType }))
    setShowCreateModal(true)
  }

  function buildCategoryTree(cats: Category[]): CategoryWithChildren[] {
    const map = new Map<string, CategoryWithChildren>()
    const roots: CategoryWithChildren[] = []

    cats.forEach((cat) => {
      map.set(cat.id, { ...cat, children: [] })
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

  function getCategoryPath(categoryId: string | null): string {
    if (!categoryId) return 'Sin categoría'
    const cat = categories.find((c) => c.id === categoryId)
    if (!cat) return 'Categoría no encontrada'

    const parts: string[] = [cat.name]
    let current = cat
    while (current.parent_id) {
      const parent = categories.find((c) => c.id === current.parent_id)
      if (parent) {
        parts.unshift(parent.name)
        current = parent
      } else {
        break
      }
    }
    return parts.join(' > ')
  }

  const categoryTree = buildCategoryTree(categories)

  async function handleCreate() {
    if (!newTransaction.description.trim()) {
      toast.error('La descripción es requerida')
      return
    }
    if (newTransaction.amount <= 0) {
      toast.error('El monto debe ser mayor a 0')
      return
    }

    setIsLoading(true)
    try {
      const transactionToSend = {
        ...newTransaction,
        transaction_date: new Date(newTransaction.transaction_date).toISOString(),
        received_date: newTransaction.received_date
          ? new Date(newTransaction.received_date).toISOString()
          : null,
        due_date: newTransaction.due_date ? new Date(newTransaction.due_date).toISOString() : null,
      }
      const result = await createTransaction(transactionToSend)
      if (result.status === 201) {
        toast.success(result.msg)
        resetForm()
        setShowCreateModal(false)
        loadData()
      } else {
        toast.error(result.msg)
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  function resetForm() {
    setNewTransaction({
      category_id: null,
      amount: 0,
      type: transactionType,
      transaction_date: new Date().toISOString().split('T')[0],
      received_date: null,
      due_date: null,
      canceled: false,
      description: '',
    })
    setSelectedCategoryId(null)
  }

  function openNewIncome() {
    setSelectedCategoryId(null)
    setTransactionType('income')
    setNewTransaction((prev) => ({ ...prev, type: 'income' }))
    setShowCreateModal(true)
  }

  function openNewExpense() {
    setSelectedCategoryId(null)
    setTransactionType('expense')
    setNewTransaction((prev) => ({ ...prev, type: 'expense' }))
    setShowCreateModal(true)
  }

  async function handleUpdate() {
    if (!editingId) return
    setIsLoading(true)
    try {
      const editData = {
        ...editForm,
        transaction_date: editForm.transaction_date
          ? new Date(editForm.transaction_date as string).toISOString()
          : undefined,
        received_date: editForm.received_date
          ? new Date(editForm.received_date as string).toISOString()
          : undefined,
        due_date: editForm.due_date
          ? new Date(editForm.due_date as string).toISOString()
          : undefined,
      }
      const result = await updateTransaction(editingId, editData)
      if (result.status === 200) {
        toast.success(result.msg)
        setEditingId(null)
        setEditForm({})
        loadData()
      } else {
        toast.error(result.msg)
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    setIsLoading(true)
    try {
      const result = await deleteTransaction(deleteId)
      if (result.status === 200) {
        toast.success(result.msg)
        setDeleteId(null)
        loadData()
      } else {
        toast.error(result.msg)
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  function startEdit(tx: Transaction) {
    setEditingId(tx.id)
    setEditForm({
      category_id: tx.category_id,
      amount: tx.amount,
      type: tx.type as 'income' | 'expense' | 'investment',
      transaction_date: tx.transaction_date ? tx.transaction_date.split('T')[0] : '',
      received_date: tx.received_date ? tx.received_date.split('T')[0] : null,
      due_date: tx.due_date ? tx.due_date.split('T')[0] : null,
      canceled: tx.canceled,
      description: tx.description,
    })
  }

  const filteredTransactions = transactions.filter((tx) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      tx.description.toLowerCase().includes(term) ||
      getCategoryPath(tx.category_id).toLowerCase().includes(term) ||
      tx.type.toLowerCase().includes(term)
    )
  })

  const deleteTransactionObj = deleteId ? transactions.find(tx => tx.id === deleteId) : null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div 
          className="border-2 border-dashed border-green-500/30 rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-green-500/50 hover:bg-green-500/5 transition-all cursor-pointer"
          onClick={openNewIncome}
        >
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-green-600" />
          </div>
          <span className="font-semibold text-foreground">Nuevo Ingreso</span>
          <span className="text-xs text-muted-foreground">💰 Registrar entrada de dinero</span>
        </div>

        <div 
          className="border-2 border-dashed border-red-500/30 rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-red-500/50 hover:bg-red-500/5 transition-all cursor-pointer"
          onClick={openNewExpense}
        >
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-red-600" />
          </div>
          <span className="font-semibold text-foreground">Nuevo Gasto</span>
          <span className="text-xs text-muted-foreground">💸 Registrar salida de dinero</span>
        </div>

        <Card className="border-border">
          <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center">
            <div className="text-2xl">📊</div>
            <span className="font-semibold text-foreground text-sm">
              {filteredTransactions.length} transacciones
            </span>
            <span className="text-xs text-muted-foreground">
              Filtradas de {transactions.length} total
            </span>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar transacciones..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading && transactions.length === 0 ? (
        <Card>
          <CardContent className="p-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      ) : filteredTransactions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No hay transacciones</p>
            <p className="text-sm text-muted-foreground mt-1">
              Selecciona una categoría o crea una nueva
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredTransactions.map((tx) => (
            <Card key={tx.id} className={`${tx.canceled ? 'opacity-60' : ''} hover:border-primary/30 transition-colors`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="text-2xl">{tx.type === 'income' ? '💰' : '💸'}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-foreground truncate">{tx.description}</h4>
                        <Badge className={`${tx.type === 'income' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'} border-0 text-xs`}>
                          {tx.type === 'income' ? 'Ingreso' : 'Gasto'}
                        </Badge>
                        {tx.canceled && (
                          <Badge variant="outline" className="text-xs">Cancelada</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span>{getCategoryPath(tx.category_id)}</span>
                        <span>•</span>
                        <span>{new Date(tx.transaction_date).toLocaleDateString('es-ES')}</span>
                        {tx.received_date && (
                          <>
                            <span>•</span>
                            <span>Recibido: {new Date(tx.received_date).toLocaleDateString('es-ES')}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-bold text-sm ${tx.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatSoles(tx.amount)}
                    </span>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => startEdit(tx)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setDeleteId(tx.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="border-t pt-6">
        <h3 className="font-semibold text-foreground mb-4">Categorías</h3>
        {categoryTree.length === 0 ? (
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
            {categoryTree.map((cat) => (
              <CategoryBox
                key={cat.id}
                category={cat}
                onClick={handleCategoryClick}
                onSubClick={handleSubCategoryClick}
              />
            ))}
          </div>
        )}
      </div>

      <FormModal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); resetForm() }}
        title={`💰 Nueva Transacción de ${transactionType === 'income' ? 'Ingreso' : 'Gasto'}`}
        size="lg"
      >
        <div className="space-y-4 py-4">
          <div className="flex gap-2 mb-4">
            <Button
              variant={transactionType === 'income' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setTransactionType('income')
                setNewTransaction((prev) => ({ ...prev, type: 'income' }))
              }}
              className="flex-1"
            >
              💰 Ingreso
            </Button>
            <Button
              variant={transactionType === 'expense' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setTransactionType('expense')
                setNewTransaction((prev) => ({ ...prev, type: 'expense' }))
              }}
              className="flex-1"
            >
              💸 Gasto
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Input
                placeholder={
                  transactionType === 'income'
                    ? 'Ej: Salario, Bono, Propina...'
                    : 'Ej: Compra, Pago, Servicio...'
                }
                value={newTransaction.description}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Monto (S/)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={newTransaction.amount || ''}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Categoría</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedCategoryId || ''}
                onChange={(e) => {
                  const val = e.target.value
                  setSelectedCategoryId(val || null)
                  setNewTransaction({ ...newTransaction, category_id: val || null })
                }}
              >
                <option value="">Sin categoría</option>
                {categoryTree.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Fecha</Label>
              <Input
                type="date"
                value={newTransaction.transaction_date}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, transaction_date: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha recepción (opcional)</Label>
              <Input
                type="date"
                value={newTransaction.received_date || ''}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    received_date: e.target.value || null,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha vencimiento (opcional)</Label>
              <Input
                type="date"
                value={newTransaction.due_date || ''}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    due_date: e.target.value || null,
                  })
                }
              />
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={handleCreate} disabled={isLoading} className="flex-1">
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Crear
            </Button>
            <Button
              variant="outline"
              onClick={() => { setShowCreateModal(false); resetForm() }}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </FormModal>

      <FormModal
        isOpen={!!editingId}
        onClose={() => { setEditingId(null); setEditForm({}) }}
        title="✏️ Editar Transacción"
        size="lg"
      >
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Descripción</Label>
              <Input
                value={editForm.description || ''}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Monto (S/)</Label>
              <Input
                type="number"
                step="0.01"
                value={editForm.amount || ''}
                onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) || null })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Categoría</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={editForm.category_id || ''}
                onChange={(e) => setEditForm({ ...editForm, category_id: e.target.value || null })}
              >
                <option value="">Sin categoría</option>
                {categoryTree.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Fecha</Label>
              <Input
                type="date"
                value={editForm.transaction_date || ''}
                onChange={(e) => setEditForm({ ...editForm, transaction_date: e.target.value || null })}
              />
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={handleUpdate} disabled={isLoading} className="flex-1">
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Guardar
            </Button>
            <Button
              variant="outline"
              onClick={() => { setEditingId(null); setEditForm({}) }}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </FormModal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="¿Eliminar transacción?"
        description={`¿Estás seguro de eliminar "${deleteTransactionObj?.description}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  )
}