'use client'

import { useState, useEffect } from 'react'
import { Trash2, Plus, Loader2, Pencil, X, Check, Filter, Search } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Badge } from '@/src/components/ui/badge'
import { 
  getTransactions, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction,
  getTransactionsByCategory,
  Transaction,
  CreateTransactionRequest,
  UpdateTransactionRequest 
} from '@/src/lib/actions/transactions'
import { getCategories, Category } from '@/src/lib/actions/categories'
import { formatSoles } from '@/src/lib/currency'
import { toast } from 'sonner'

const TRANSACTION_TYPES = [
  { value: 'expense', label: 'Gasto', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  { value: 'income', label: 'Ingreso', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  { value: 'investment', label: 'Inversión', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
]

const TYPE_ICONS: Record<string, string> = {
  expense: '💸',
  income: '💰',
  investment: '📈',
}

export function TransactionsManager() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const [newTransaction, setNewTransaction] = useState<CreateTransactionRequest>({
    user_id: '',
    category_id: null,
    amount: 0,
    type: 'expense',
    transaction_date: new Date().toISOString().split('T')[0],
    received_date: null,
    due_date: null,
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

  async function loadTransactionsByCategory(categoryId: string) {
    setIsLoading(true)
    try {
      const data = await getTransactionsByCategory(categoryId)
      setTransactions(data)
    } catch {
      toast.error('Error al filtrar transacciones')
    } finally {
      setIsLoading(false)
    }
  }

  function handleFilterChange(categoryId: string) {
    setFilterCategory(categoryId)
    if (categoryId === 'all') {
      loadData()
    } else {
      loadTransactionsByCategory(categoryId)
    }
  }

  function getCategoryName(categoryId: string | null): string {
    if (!categoryId) return 'Sin categoría'
    const cat = categories.find(c => c.id === categoryId)
    return cat?.name || 'Categoría no encontrada'
  }

  function getTypeInfo(type: string) {
    return TRANSACTION_TYPES.find(t => t.value === type) || TRANSACTION_TYPES[0]
  }

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
      const result = await createTransaction(newTransaction)
      if (result.status === 201) {
        toast.success(result.msg)
        setNewTransaction({
          user_id: '',
          category_id: null,
          amount: 0,
          type: 'expense',
          transaction_date: new Date().toISOString().split('T')[0],
          received_date: null,
          due_date: null,
          canceled: false,
          description: '',
        })
        setShowCreateForm(false)
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

  async function handleUpdate(id: string) {
    setIsLoading(true)
    try {
      const result = await updateTransaction(id, editForm)
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

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta transacción?')) return

    setIsLoading(true)
    try {
      const result = await deleteTransaction(id)
      if (result.status === 200) {
        toast.success(result.msg)
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
      type: tx.type,
      transaction_date: tx.transaction_date,
      received_date: tx.received_date,
      due_date: tx.due_date,
      canceled: tx.canceled,
      description: tx.description,
    })
  }

  const filteredTransactions = transactions.filter(tx => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      tx.description.toLowerCase().includes(term) ||
      getCategoryName(tx.category_id).toLowerCase().includes(term) ||
      tx.type.toLowerCase().includes(term)
    )
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Crear Nueva Transacción</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        {showCreateForm && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Input
                  placeholder="Descripción de la transacción"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
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
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as 'income' | 'expense' | 'investment' })}
                >
                  {TRANSACTION_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Categoría</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newTransaction.category_id || ''}
                  onChange={(e) => setNewTransaction({ ...newTransaction, category_id: e.target.value || null })}
                >
                  <option value="">Sin categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Fecha de transacción</Label>
                <Input
                  type="date"
                  value={newTransaction.transaction_date}
                  onChange={(e) => setNewTransaction({ ...newTransaction, transaction_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Fecha de recepción (opcional)</Label>
                <Input
                  type="date"
                  value={newTransaction.received_date || ''}
                  onChange={(e) => setNewTransaction({ ...newTransaction, received_date: e.target.value || null })}
                />
              </div>
              <div className="space-y-2">
                <Label>Fecha de vencimiento (opcional)</Label>
                <Input
                  type="date"
                  value={newTransaction.due_date || ''}
                  onChange={(e) => setNewTransaction({ ...newTransaction, due_date: e.target.value || null })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                Crear
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar transacciones..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={filterCategory}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="all">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
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
              Crea tu primera transacción usando el formulario de arriba
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredTransactions.map((tx) => {
            const typeInfo = getTypeInfo(tx.type)
            return (
              <Card key={tx.id} className={tx.canceled ? 'opacity-60' : ''}>
                <CardContent className="p-4">
                  {editingId === tx.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Descripción</Label>
                          <Input
                            value={editForm.description || ''}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Monto (S/)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={editForm.amount || ''}
                            onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) || null })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Tipo</Label>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={editForm.type || ''}
                            onChange={(e) => setEditForm({ ...editForm, type: e.target.value || null })}
                          >
                            {TRANSACTION_TYPES.map((type) => (
                              <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Categoría</Label>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={editForm.category_id || ''}
                            onChange={(e) => setEditForm({ ...editForm, category_id: e.target.value || null })}
                          >
                            <option value="">Sin categoría</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Fecha de transacción</Label>
                          <Input
                            type="date"
                            value={editForm.transaction_date || ''}
                            onChange={(e) => setEditForm({ ...editForm, transaction_date: e.target.value || null })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Cancelada</Label>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={editForm.canceled ? 'true' : 'false'}
                            onChange={(e) => setEditForm({ ...editForm, canceled: e.target.value === 'true' })}
                          >
                            <option value="false">No</option>
                            <option value="true">Sí</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleUpdate(tx.id)}>
                          <Check className="w-4 h-4 mr-1" /> Guardar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="text-2xl">{TYPE_ICONS[tx.type]}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-foreground truncate">{tx.description}</h4>
                            <Badge className={`${typeInfo.color} border-0 text-xs`}>
                              {typeInfo.label}
                            </Badge>
                            {tx.canceled && (
                              <Badge variant="outline" className="text-xs">Cancelada</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span>{getCategoryName(tx.category_id)}</span>
                            <span>•</span>
                            <span>{new Date(tx.transaction_date).toLocaleDateString('es-ES')}</span>
                            {tx.received_date && (
                              <>
                                <span>•</span>
                                <span>Recibido: {new Date(tx.received_date).toLocaleDateString('es-ES')}</span>
                              </>
                            )}
                            {tx.due_date && (
                              <>
                                <span>•</span>
                                <span>Vence: {new Date(tx.due_date).toLocaleDateString('es-ES')}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-bold text-sm ${
                          tx.type === 'income' ? 'text-green-500' :
                          tx.type === 'investment' ? 'text-purple-500' :
                          'text-foreground'
                        }`}>
                          {tx.type === 'income' ? '+' : tx.type === 'expense' ? '-' : ''}{formatSoles(tx.amount)}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEdit(tx)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(tx.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}