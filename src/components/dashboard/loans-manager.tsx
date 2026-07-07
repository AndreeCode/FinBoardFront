'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Loader2, Pencil, Trash2, DollarSign, Calendar } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent } from '@/src/components/ui/card'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Badge } from '@/src/components/ui/badge'
import { FormModal, ConfirmModal } from '@/src/components/ui/modal'
import { 
  getLoans, 
  createLoan, 
  updateLoan, 
  deleteLoan,
  Loan,
  CreateLoanRequest,
  UpdateLoanRequest 
} from '@/src/lib/actions/loans'
import { getTransactions, createTransaction, Transaction } from '@/src/lib/actions/transactions'
import { formatSoles } from '@/src/lib/currency'
import { toast } from 'sonner'

const STATUS_OPTIONS = [
  { value: 'active', label: 'Activo', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'paid', label: 'Pagado', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  { value: 'overdue', label: 'Vencido', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  { value: 'cancelled', label: 'Cancelado', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
]

export function LoansManager() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [newLoan, setNewLoan] = useState<CreateLoanRequest & { description: string; amount: number; type: 'income' | 'expense' }>({
    transaction_id: '',
    description: '',
    amount: 0,
    type: 'expense',
    lender: '',
    due_date: '',
    interest_rate: 0,
    status: 'active',
  })

  const [editForm, setEditForm] = useState<UpdateLoanRequest>({})

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setIsLoading(true)
    try {
      const [loanData, txData] = await Promise.all([
        getLoans(),
        getTransactions(),
      ])
      setLoans(loanData)
      setTransactions(txData.filter(tx => tx.type === 'expense' || tx.type === 'income'))
    } catch {
      toast.error('Error al cargar datos')
    } finally {
      setIsLoading(false)
    }
  }

  function getTransactionDescription(transactionId: string): string {
    const tx = transactions.find(t => t.id === transactionId)
    return tx?.description || 'Transacción no encontrada'
  }

  function getTransactionAmount(transactionId: string): number {
    const tx = transactions.find(t => t.id === transactionId)
    return tx?.amount || 0
  }

  function getStatusInfo(status: string) {
    return STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0]
  }

  function isOverdue(dueDate: string): boolean {
    return new Date(dueDate) < new Date() && new Date(dueDate).toISOString().split('T')[0] !== new Date().toISOString().split('T')[0]
  }

  async function handleCreate() {
    if (!newLoan.description.trim()) {
      toast.error('La descripción es requerida')
      return
    }
    if (!newLoan.amount || newLoan.amount <= 0) {
      toast.error('El monto debe ser mayor a 0')
      return
    }
    if (!newLoan.lender.trim()) {
      toast.error('El prestador es requerido')
      return
    }

    setIsLoading(true)
    try {
      const txResult = await createTransaction({
        category_id: null,
        amount: newLoan.amount,
        type: newLoan.type,
        transaction_date: new Date().toISOString().split('T')[0],
        received_date: null,
        due_date: newLoan.due_date || null,
        canceled: false,
        description: newLoan.description,
      })

      if (txResult.status !== 201) {
        toast.error(txResult.msg || 'Error al crear transacción')
        setIsLoading(false)
        return
      }

      const transactionId = txResult.data?.id
      if (!transactionId) {
        toast.error('No se pudo obtener el ID de la transacción')
        setIsLoading(false)
        return
      }

      const loanData: CreateLoanRequest = {
        transaction_id: transactionId,
        lender: newLoan.lender,
        due_date: newLoan.due_date,
        interest_rate: newLoan.interest_rate,
        status: newLoan.status,
      }

      const result = await createLoan(loanData)
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
    setNewLoan({
      transaction_id: '',
      description: '',
      amount: 0,
      type: 'expense',
      lender: '',
      due_date: '',
      interest_rate: 0,
      status: 'active',
    })
  }

  async function handleUpdate() {
    if (!editingId) return
    setIsLoading(true)
    try {
      const result = await updateLoan(editingId, editForm)
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
      const result = await deleteLoan(deleteId)
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

  function startEdit(loan: Loan) {
    setEditingId(loan.id)
    setEditForm({
      lender: loan.lender,
      due_date: loan.due_date ? loan.due_date.split('T')[0] : '',
      interest_rate: loan.interest_rate,
      status: loan.status,
    })
  }

  const deleteLoanObj = deleteId ? loans.find(l => l.id === deleteId) : null
  const deleteLoanDesc = deleteLoanObj ? getTransactionDescription(deleteLoanObj.transaction_id) : ''

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div 
          className="border-2 border-dashed border-blue-500/30 rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer"
          onClick={() => setShowCreateModal(true)}
        >
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
          <span className="font-semibold text-foreground">Nuevo Préstamo</span>
          <span className="text-xs text-muted-foreground">💰 Registrar nuevo préstamo</span>
        </div>

        <Card className="border-border">
          <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center">
            <div className="text-2xl">📊</div>
            <span className="text-2xl font-bold text-foreground">{loans.length}</span>
            <span className="text-xs text-muted-foreground">Préstamos activos</span>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs text-muted-foreground">Total prestado</span>
            <span className="text-lg font-bold text-foreground">
              {formatSoles(loans.reduce((sum, l) => sum + getTransactionAmount(l.transaction_id), 0))}
            </span>
          </CardContent>
        </Card>
      </div>

      {isLoading && loans.length === 0 ? (
        <Card>
          <CardContent className="p-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      ) : loans.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No hay préstamos registrados</p>
            <p className="text-sm text-muted-foreground mt-1">
              Crea un préstamo usando el botón de arriba
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loans.map((loan) => {
            const statusInfo = getStatusInfo(loan.status)
            const txAmount = getTransactionAmount(loan.transaction_id)
            const txDesc = getTransactionDescription(loan.transaction_id)
            const overdue = isOverdue(loan.due_date)

            return (
              <Card key={loan.id} className={`border-border hover:border-blue-500/30 transition-colors ${overdue && loan.status === 'active' ? 'border-red-500/50' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">💰</span>
                      <Badge className={`${statusInfo.color} border-0 text-xs`}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                    {overdue && loan.status === 'active' && (
                      <Badge variant="outline" className="text-red-500 border-red-500 text-xs">
                        Vencido
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-semibold text-foreground mb-1 truncate">{txDesc}</h4>
                  <p className="text-2xl font-bold text-blue-500 mb-2">
                    {formatSoles(txAmount)}
                  </p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>Prestador: <span className="text-foreground font-medium">{loan.lender}</span></p>
                    <p>Vence: <span className={`font-medium ${overdue ? 'text-red-500' : ''}`}>
                      {new Date(loan.due_date).toLocaleDateString('es-ES')}
                    </span></p>
                    <p>Interés: <span className="text-blue-500 font-medium">{loan.interest_rate}%</span></p>
                  </div>
                  <div className="flex gap-1 mt-3 pt-3 border-t border-border">
                    <Button size="sm" variant="ghost" onClick={() => startEdit(loan)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setDeleteId(loan.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <FormModal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); resetForm() }}
        title="💰 Nuevo Préstamo"
        size="lg"
      >
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Input
                placeholder="Ej: Préstamo para auto"
                value={newLoan.description}
                onChange={(e) => setNewLoan({ ...newLoan, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newLoan.type}
                onChange={(e) => setNewLoan({ ...newLoan, type: e.target.value as 'income' | 'expense' })}
              >
                <option value="expense">Gasto (lo que debo)</option>
                <option value="income">Ingreso (me deben)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Monto</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={newLoan.amount || ''}
                onChange={(e) => setNewLoan({ ...newLoan, amount: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Prestador (banco, persona, etc)</Label>
              <Input
                placeholder="Ej: Banco ABC, Juan Pérez"
                value={newLoan.lender}
                onChange={(e) => setNewLoan({ ...newLoan, lender: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha de vencimiento</Label>
              <Input
                type="date"
                value={newLoan.due_date}
                onChange={(e) => setNewLoan({ ...newLoan, due_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Tasa de interés (%)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                placeholder="0.0"
                value={newLoan.interest_rate || ''}
                onChange={(e) => setNewLoan({ ...newLoan, interest_rate: parseFloat(e.target.value) || 0 })}
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
            <Button variant="outline" onClick={() => { setShowCreateModal(false); resetForm() }} className="flex-1">
              Cancelar
            </Button>
          </div>
        </div>
      </FormModal>

      <FormModal
        isOpen={!!editingId}
        onClose={() => { setEditingId(null); setEditForm({}) }}
        title="✏️ Editar Préstamo"
        size="md"
      >
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Prestador</Label>
              <Input
                value={editForm.lender || ''}
                onChange={(e) => setEditForm({ ...editForm, lender: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Fecha vencimiento</Label>
              <Input
                type="date"
                value={editForm.due_date || ''}
                onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value || undefined })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Tasa de interés (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={editForm.interest_rate || ''}
                onChange={(e) => setEditForm({ ...editForm, interest_rate: parseFloat(e.target.value) || undefined })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Estado</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={editForm.status || ''}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value || undefined })}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
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
            <Button variant="outline" onClick={() => { setEditingId(null); setEditForm({}) }} className="flex-1">
              Cancelar
            </Button>
          </div>
        </div>
      </FormModal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="¿Eliminar préstamo?"
        description={`¿Estás seguro de eliminar el préstamo "${deleteLoanDesc}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  )
}