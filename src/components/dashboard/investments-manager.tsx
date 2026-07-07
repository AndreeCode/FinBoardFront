'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Loader2, Pencil, Trash2, TrendingUp, AlertTriangle } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent } from '@/src/components/ui/card'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Badge } from '@/src/components/ui/badge'
import { FormModal, ConfirmModal } from '@/src/components/ui/modal'
import { 
  getInvestments, 
  createInvestment, 
  updateInvestment, 
  deleteInvestment,
  Investment,
  CreateInvestmentRequest,
  UpdateInvestmentRequest 
} from '@/src/lib/actions/investments'
import { getTransactions, Transaction } from '@/src/lib/actions/transactions'
import { formatSoles } from '@/src/lib/currency'
import { toast } from 'sonner'

const RISK_LEVELS = [
  { value: 'low', label: 'Bajo', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  { value: 'medium', label: 'Medio', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { value: 'high', label: 'Alto', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
]

const STATUS_OPTIONS = [
  { value: 'active', label: 'Activo', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'closed', label: 'Cerrado', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
  { value: 'cancelled', label: 'Cancelado', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
]

export function InvestmentsManager() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [newInvestment, setNewInvestment] = useState<CreateInvestmentRequest>({
    transaction_id: '',
    expected_gain: 0,
    risk_level: 'medium',
    status: 'active',
  })

  const [editForm, setEditForm] = useState<UpdateInvestmentRequest>({})

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setIsLoading(true)
    try {
      const [invData, txData] = await Promise.all([
        getInvestments(),
        getTransactions(),
      ])
      setInvestments(invData)
      setTransactions(txData.filter(tx => tx.type === 'investment'))
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

  function getRiskInfo(risk: string) {
    return RISK_LEVELS.find(r => r.value === risk) || RISK_LEVELS[1]
  }

  function getStatusInfo(status: string) {
    return STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0]
  }

  async function handleCreate() {
    if (!newInvestment.transaction_id) {
      toast.error('Selecciona una transacción')
      return
    }

    setIsLoading(true)
    try {
      const result = await createInvestment(newInvestment)
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
    setNewInvestment({
      transaction_id: '',
      expected_gain: 0,
      risk_level: 'medium',
      status: 'active',
    })
  }

  async function handleUpdate() {
    if (!editingId) return
    setIsLoading(true)
    try {
      const result = await updateInvestment(editingId, editForm)
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
      const result = await deleteInvestment(deleteId)
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

  function startEdit(inv: Investment) {
    setEditingId(inv.id)
    setEditForm({
      expected_gain: inv.expected_gain,
      risk_level: inv.risk_level,
      status: inv.status,
    })
  }

  const deleteInvestmentObj = deleteId ? investments.find(inv => inv.id === deleteId) : null
  const deleteTransactionDesc = deleteInvestmentObj ? getTransactionDescription(deleteInvestmentObj.transaction_id) : ''

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div 
          className="border-2 border-dashed border-purple-500/30 rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all cursor-pointer"
          onClick={() => setShowCreateModal(true)}
        >
          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <span className="font-semibold text-foreground">Nueva Inversión</span>
          <span className="text-xs text-muted-foreground">📈 Registrar nueva inversión</span>
        </div>

        <Card className="border-border">
          <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center">
            <div className="text-2xl">📊</div>
            <span className="text-2xl font-bold text-foreground">{investments.length}</span>
            <span className="text-xs text-muted-foreground">Inversiones activas</span>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center">
            <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-xs text-muted-foreground">Riesgo promedio</span>
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-0">
              Medio
            </Badge>
          </CardContent>
        </Card>
      </div>

      {isLoading && investments.length === 0 ? (
        <Card>
          <CardContent className="p-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      ) : investments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No hay inversiones registradas</p>
            <p className="text-sm text-muted-foreground mt-1">
              Crea una inversión usando el botón de arriba
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {investments.map((inv) => {
            const riskInfo = getRiskInfo(inv.risk_level)
            const statusInfo = getStatusInfo(inv.status)
            const txAmount = getTransactionAmount(inv.transaction_id)
            const txDesc = getTransactionDescription(inv.transaction_id)

            return (
              <Card key={inv.id} className="border-border hover:border-purple-500/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📈</span>
                      <Badge className={`${riskInfo.color} border-0 text-xs`}>
                        {riskInfo.label}
                      </Badge>
                    </div>
                    <Badge className={`${statusInfo.color} border-0 text-xs`}>
                      {statusInfo.label}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-foreground mb-1 truncate">{txDesc}</h4>
                  <p className="text-2xl font-bold text-purple-500 mb-2">
                    {formatSoles(txAmount)}
                  </p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>Ganancia esperada: <span className="text-purple-500 font-medium">{inv.expected_gain}%</span></p>
                  </div>
                  <div className="flex gap-1 mt-3 pt-3 border-t border-border">
                    <Button size="sm" variant="ghost" onClick={() => startEdit(inv)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setDeleteId(inv.id)} className="text-destructive hover:text-destructive">
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
        title="📈 Nueva Inversión"
        size="lg"
      >
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Transacción</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newInvestment.transaction_id}
                onChange={(e) => setNewInvestment({ ...newInvestment, transaction_id: e.target.value })}
              >
                <option value="">Seleccionar...</option>
                {transactions.map((tx) => (
                  <option key={tx.id} value={tx.id}>
                    {tx.description} - {formatSoles(tx.amount)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Ganancia esperada (%)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                placeholder="0.0"
                value={newInvestment.expected_gain || ''}
                onChange={(e) => setNewInvestment({ ...newInvestment, expected_gain: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Nivel de riesgo</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newInvestment.risk_level}
                onChange={(e) => setNewInvestment({ ...newInvestment, risk_level: e.target.value })}
              >
                {RISK_LEVELS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newInvestment.status}
                onChange={(e) => setNewInvestment({ ...newInvestment, status: e.target.value })}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
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
        title="✏️ Editar Inversión"
        size="md"
      >
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Ganancia esperada (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={editForm.expected_gain || ''}
                onChange={(e) => setEditForm({ ...editForm, expected_gain: parseFloat(e.target.value) || undefined })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Nivel de riesgo</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={editForm.risk_level || ''}
                onChange={(e) => setEditForm({ ...editForm, risk_level: e.target.value || undefined })}
              >
                {RISK_LEVELS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
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
        title="¿Eliminar inversión?"
        description={`¿Estás seguro de eliminar la inversión "${deleteTransactionDesc}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  )
}