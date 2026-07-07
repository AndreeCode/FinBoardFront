'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Loader2, Pencil, Trash2, Banknote, Calendar, ArrowUpDown } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent } from '@/src/components/ui/card'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Badge } from '@/src/components/ui/badge'
import { FormModal, ConfirmModal } from '@/src/components/ui/modal'
import { 
  getCredits, 
  createCredit, 
  updateCredit, 
  deleteCredit,
  Credit,
  CreateCreditRequest,
  UpdateCreditRequest 
} from '@/src/lib/actions/credits'
import { formatSoles } from '@/src/lib/currency'
import { toast } from 'sonner'

const STATUS_OPTIONS = [
  { value: 'active', label: 'Activo', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'paid', label: 'Pagado', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  { value: 'overdue', label: 'Vencido', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  { value: 'cancelled', label: 'Cancelado', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
]

export function CreditsManager() {
  const [credits, setCredits] = useState<Credit[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [newCredit, setNewCredit] = useState<CreateCreditRequest>({
    person_name: '',
    amount: 0,
    interest_rate: 0,
    is_creditor: false,
    is_secure: false,
    status: 'active',
  })

  const [newCreditDueDate, setNewCreditDueDate] = useState<string>('')

  const [editForm, setEditForm] = useState<UpdateCreditRequest>({})

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setIsLoading(true)
    try {
      const creditData = await getCredits()
      setCredits(creditData)
    } catch {
      toast.error('Error al cargar datos')
    } finally {
      setIsLoading(false)
    }
  }

  function getStatusInfo(status: string) {
    return STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0]
  }

  function isOverdue(dueDate: string | null): boolean {
    if (!dueDate) return false
    return new Date(dueDate) < new Date() && new Date(dueDate).toISOString().split('T')[0] !== new Date().toISOString().split('T')[0]
  }

  async function handleCreate() {
    if (!newCredit.person_name.trim()) {
      toast.error('El nombre es requerido')
      return
    }
    if (!newCredit.amount || newCredit.amount <= 0) {
      toast.error('El monto debe ser mayor a 0')
      return
    }

    setIsLoading(true)
    try {
      const payload = {
        person_name: newCredit.person_name,
        amount: newCredit.amount,
        interest_rate: newCredit.interest_rate,
        is_creditor: newCredit.is_creditor,
        is_secure: newCredit.is_secure,
        status: newCredit.status,
        due_date: newCreditDueDate ? `${newCreditDueDate}T23:59:59Z` : undefined,
      }
      const result = await createCredit(payload)
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
    setNewCredit({
      person_name: '',
      amount: 0,
      interest_rate: 0,
      is_creditor: false,
      is_secure: false,
      status: 'active',
    })
    setNewCreditDueDate('')
  }

  async function handleUpdate() {
    if (!editingId) return
    setIsLoading(true)
    try {
      const payload: Record<string, unknown> = { ...editForm }
      if (payload.due_date === '') {
        delete payload.due_date
      } else if (payload.due_date && typeof payload.due_date === 'string') {
        payload.due_date = `${payload.due_date}T23:59:59Z`
      }
      const result = await updateCredit(editingId, payload as UpdateCreditRequest)
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
      const result = await deleteCredit(deleteId)
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

  function startEdit(credit: Credit) {
    setEditingId(credit.id)
    setEditForm({
      person_name: credit.person_name,
      amount: credit.amount,
      interest_rate: credit.interest_rate,
      is_creditor: credit.is_creditor,
      is_secure: credit.is_secure,
      due_date: credit.due_date ? credit.due_date.split('T')[0] : '',
      status: credit.status,
    })
  }

  const deleteCreditObj = deleteId ? credits.find(c => c.id === deleteId) : null

  const youOwe = credits.filter(c => !c.is_creditor && c.status === 'active').reduce((sum, c) => sum + c.amount, 0)
  const youAreOwed = credits.filter(c => c.is_creditor && c.status === 'active').reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div 
          className="border-2 border-dashed border-blue-500/30 rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer"
          onClick={() => setShowCreateModal(true)}
        >
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Plus className="w-6 h-6 text-blue-600" />
          </div>
          <span className="font-semibold text-foreground">Nuevo Crédito</span>
          <span className="text-xs text-muted-foreground">💰 Registrar crédito</span>
        </div>

        <Card className="border-border">
          <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <ArrowUpDown className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-xs text-muted-foreground">Debes</span>
            <span className="text-lg font-bold text-red-500">{formatSoles(youOwe)}</span>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Banknote className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs text-muted-foreground">Te Deben</span>
            <span className="text-lg font-bold text-green-500">{formatSoles(youAreOwed)}</span>
          </CardContent>
        </Card>
      </div>

      {isLoading && credits.length === 0 ? (
        <Card>
          <CardContent className="p-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      ) : credits.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No hay créditos registrados</p>
            <p className="text-sm text-muted-foreground mt-1">
              Crea un crédito usando el botón de arriba
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {credits.map((credit) => {
            const statusInfo = getStatusInfo(credit.status)
            const overdue = isOverdue(credit.due_date)

            return (
              <Card key={credit.id} className={`border-border hover:border-blue-500/30 transition-colors ${overdue && credit.status === 'active' ? 'border-red-500/50' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{credit.is_creditor ? '📥' : '📤'}</span>
                      <Badge className={`${statusInfo.color} border-0 text-xs`}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                    {overdue && credit.status === 'active' && (
                      <Badge variant="outline" className="text-red-500 border-red-500 text-xs">
                        Vencido
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-semibold text-foreground mb-1 truncate">{credit.person_name}</h4>
                  <p className="text-2xl font-bold mb-2" style={{ color: credit.is_creditor ? '#22c55e' : '#ef4444' }}>
                    {credit.is_creditor ? '+' : '-'}{formatSoles(credit.amount)}
                  </p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>Tipo: <span className="text-foreground font-medium">{credit.is_creditor ? 'Me deben' : 'Debo'}</span></p>
                    <p>Seguro: <span className="text-foreground font-medium">{credit.is_secure ? 'Sí' : 'No'}</span></p>
                    {credit.due_date && (
                      <p>Vence: <span className={`font-medium ${overdue ? 'text-red-500' : ''}`}>
                        {new Date(credit.due_date).toLocaleDateString('es-ES')}
                      </span></p>
                    )}
                    <p>Interés: <span className="text-blue-500 font-medium">{credit.interest_rate}%</span></p>
                  </div>
                  <div className="flex gap-1 mt-3 pt-3 border-t border-border">
                    <Button size="sm" variant="ghost" onClick={() => startEdit(credit)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setDeleteId(credit.id)} className="text-destructive hover:text-destructive">
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
        title="💰 Nuevo Crédito"
        size="lg"
      >
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre de la persona</Label>
              <Input
                placeholder="Ej: Juan Pérez"
                value={newCredit.person_name}
                onChange={(e) => setNewCredit({ ...newCredit, person_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newCredit.is_creditor ? 'true' : 'false'}
                onChange={(e) => setNewCredit({ ...newCredit, is_creditor: e.target.value === 'true' })}
              >
                <option value="false">Debo (le debo a alguien)</option>
                <option value="true">Me deben (me deben dinero)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Monto</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={newCredit.amount || ''}
                onChange={(e) => setNewCredit({ ...newCredit, amount: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label>¿Es seguro?</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newCredit.is_secure ? 'true' : 'false'}
                onChange={(e) => setNewCredit({ ...newCredit, is_secure: e.target.value === 'true' })}
              >
                <option value="false">No</option>
                <option value="true">Sí</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Fecha de vencimiento</Label>
              <Input
                type="date"
                value={newCreditDueDate}
                onChange={(e) => setNewCreditDueDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Tasa de interés (%)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                placeholder="0.0"
                value={newCredit.interest_rate || ''}
                onChange={(e) => setNewCredit({ ...newCredit, interest_rate: parseFloat(e.target.value) || 0 })}
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
        title="✏️ Editar Crédito"
        size="md"
      >
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Nombre</Label>
              <Input
                value={editForm.person_name || ''}
                onChange={(e) => setEditForm({ ...editForm, person_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Monto</Label>
              <Input
                type="number"
                step="0.01"
                value={editForm.amount || ''}
                onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) || undefined })}
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
              <Label className="text-xs">Tipo</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={editForm.is_creditor ? 'true' : 'false'}
                onChange={(e) => setEditForm({ ...editForm, is_creditor: e.target.value === 'true' || undefined })}
              >
                <option value="false">Debo</option>
                <option value="true">Me deben</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">¿Es seguro?</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={editForm.is_secure ? 'true' : 'false'}
                onChange={(e) => setEditForm({ ...editForm, is_secure: e.target.value === 'true' || undefined })}
              >
                <option value="false">No</option>
                <option value="true">Sí</option>
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
        title="¿Eliminar crédito?"
        description={`¿Estás seguro de eliminar el crédito de "${deleteCreditObj?.person_name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  )
}
