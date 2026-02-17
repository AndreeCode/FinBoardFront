'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Badge } from '@/src/components/ui/badge';
import { Progress } from '@/src/components/ui/progress';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatSoles } from '@/src/lib/currency';

interface Payment {
  id: string;
  date: string;
  amount: number;
  notes: string;
}

interface Loan {
  id: string;
  to: string;
  icon: string;
  reason: string;
  totalAmount: number;
  paidAmount: number;
  payments: Payment[];
  startDate: string;
  dueDate: string;
  isExpanded: boolean;
  status: 'active' | 'completed' | 'overdue';
}

export function DetailedLoans() {
  const [loans, setLoans] = useState<Loan[]>([
    {
      id: '1',
      to: 'Juan García',
      icon: '👤',
      reason: 'Préstamo personal',
      totalAmount: 500000,
      paidAmount: 200000,
      payments: [
        {
          id: 'p1',
          date: '2024-01-15',
          amount: 100000,
          notes: 'Primer pago',
        },
        {
          id: 'p2',
          date: '2024-02-15',
          amount: 100000,
          notes: 'Segundo pago',
        },
      ],
      startDate: '2024-01-01',
      dueDate: '2024-12-31',
      isExpanded: true,
      status: 'active',
    },
    {
      id: '2',
      to: 'Carlos Mendez',
      icon: '👤',
      reason: 'Inversión en negocio',
      totalAmount: 1000000,
      paidAmount: 1000000,
      payments: [
        {
          id: 'p3',
          date: '2024-01-20',
          amount: 500000,
          notes: 'Primer cuota',
        },
        {
          id: 'p4',
          date: '2024-02-20',
          amount: 500000,
          notes: 'Pago final',
        },
      ],
      startDate: '2024-01-01',
      dueDate: '2024-02-28',
      isExpanded: false,
      status: 'completed',
    },
    {
      id: '3',
      to: 'María López',
      icon: '👤',
      reason: 'Préstamo de corto plazo',
      totalAmount: 300000,
      paidAmount: 0,
      payments: [],
      startDate: '2024-03-01',
      dueDate: '2024-06-01',
      isExpanded: true,
      status: 'active',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newPayment, setNewPayment] = useState({
    loanId: '',
    amount: '',
    notes: '',
  });

  const toggleLoan = (id: string) => {
    setLoans(
      loans.map((loan) =>
        loan.id === id ? { ...loan, isExpanded: !loan.isExpanded } : loan
      )
    );
  };

  const addPayment = () => {
    if (newPayment.loanId && newPayment.amount) {
      setLoans(
        loans.map((loan) => {
          if (loan.id === newPayment.loanId) {
            const amount = parseFloat(newPayment.amount);
            const newPaidAmount = loan.paidAmount + amount;
            return {
              ...loan,
              paidAmount: newPaidAmount,
              payments: [
                ...loan.payments,
                {
                  id: Date.now().toString(),
                  date: new Date().toISOString().split('T')[0],
                  amount,
                  notes: newPayment.notes,
                },
              ],
              status:
                newPaidAmount >= loan.totalAmount
                  ? 'completed'
                  : loan.status,
            };
          }
          return loan;
        })
      );
      setNewPayment({ loanId: '', amount: '', notes: '' });
      setShowForm(false);
    }
  };

  const deleteLoan = (id: string) => {
    setLoans(loans.filter((loan) => loan.id !== id));
  };

  const deletePayment = (loanId: string, paymentId: string) => {
    setLoans(
      loans.map((loan) => {
        if (loan.id === loanId) {
          const payment = loan.payments.find((p) => p.id === paymentId);
          return {
            ...loan,
            payments: loan.payments.filter((p) => p.id !== paymentId),
            paidAmount: loan.paidAmount - (payment?.amount || 0),
          };
        }
        return loan;
      })
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Pagado';
      case 'active':
        return 'Activo';
      case 'overdue':
        return 'Vencido';
      default:
        return status;
    }
  };

  const totalLent = loans.reduce((sum, loan) => sum + loan.totalAmount, 0);
  const totalPaid = loans.reduce((sum, loan) => sum + loan.paidAmount, 0);
  const pendingAmount = totalLent - totalPaid;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Total Prestado</p>
            <h3 className="text-2xl font-bold text-foreground">
              {formatSoles(totalLent)}
            </h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Total Pagado</p>
            <h3 className="text-2xl font-bold text-green-600">
              {formatSoles(totalPaid)}
            </h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Pendiente</p>
            <h3 className="text-2xl font-bold text-primary">
              {formatSoles(pendingAmount)}
            </h3>
          </CardContent>
        </Card>
      </div>

      {/* Loans List */}
      <div className="space-y-4">
        {loans.map((loan) => {
          const percentage = (loan.paidAmount / loan.totalAmount) * 100;
          return (
            <Card key={loan.id}>
              <CardHeader
                className="cursor-pointer hover:bg-muted transition-colors"
                onClick={() => toggleLoan(loan.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-3xl">{loan.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{loan.to}</h3>
                        <Badge
                          className={`text-xs ${getStatusColor(loan.status)}`}
                          variant="secondary"
                        >
                          {getStatusLabel(loan.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{loan.reason}</p>
                    </div>
                  </div>
                  <div className="text-right mr-4">
                    <p className="text-lg font-bold text-foreground">
                      {formatSoles(loan.paidAmount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      de {formatSoles(loan.totalAmount)}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    {loan.isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </Button>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <Progress value={percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {percentage.toFixed(0)}% completado
                  </p>
                </div>
              </CardHeader>

              {loan.isExpanded && (
                <CardContent className="border-t pt-6">
                  <div className="space-y-6">
                    {/* Loan Details */}
                    <div className="grid grid-cols-2 gap-4 pb-6 border-b">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Fecha Inicio</p>
                        <p className="font-semibold">
                          {format(new Date(loan.startDate), 'dd MMM yyyy', {
                            locale: es,
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Fecha Vencimiento
                        </p>
                        <p className="font-semibold">
                          {format(new Date(loan.dueDate), 'dd MMM yyyy', {
                            locale: es,
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Payments */}
                    {loan.payments.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Pagos Realizados</h4>
                        <div className="space-y-2">
                          {loan.payments
                            .sort((a, b) => b.date.localeCompare(a.date))
                            .map((payment) => (
                              <div
                                key={payment.id}
                                className="flex items-center justify-between p-3 bg-muted rounded-lg"
                              >
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-foreground">
                                    {format(new Date(payment.date), 'dd MMM yyyy', {
                                      locale: es,
                                    })}
                                  </p>
                                  {payment.notes && (
                                    <p className="text-xs text-muted-foreground">
                                      {payment.notes}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="font-semibold text-green-600">
                                    {formatSoles(payment.amount)}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      deletePayment(loan.id, payment.id)
                                    }
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Add Payment */}
                    {showForm && newPayment.loanId === loan.id ? (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3">Agregar Pago</h4>
                        <div className="space-y-3">
                          <Input
                            type="number"
                            placeholder="Monto del pago"
                            value={newPayment.amount}
                            onChange={(e) =>
                              setNewPayment({
                                ...newPayment,
                                amount: e.target.value,
                              })
                            }
                          />
                          <Input
                            placeholder="Notas (opcional)"
                            value={newPayment.notes}
                            onChange={(e) =>
                              setNewPayment({
                                ...newPayment,
                                notes: e.target.value,
                              })
                            }
                          />
                          <div className="flex gap-2">
                            <Button
                              className="flex-1"
                              onClick={addPayment}
                            >
                              Guardar
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 bg-transparent"
                              onClick={() => setShowForm(false)}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() =>
                          setNewPayment({
                            loanId: loan.id,
                            amount: '',
                            notes: '',
                          }) && setShowForm(true)
                        }
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Pago
                      </Button>
                    )}

                    {/* Delete Loan */}
                    <Button
                      variant="outline"
                      className="w-full text-destructive hover:text-destructive border-destructive bg-transparent"
                      onClick={() => deleteLoan(loan.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar Préstamo
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Add New Loan Button */}
      <Button className="w-full" size="lg">
        <Plus className="w-4 h-4 mr-2" />
        Agregar Nuevo Préstamo
      </Button>
    </div>
  );
}
