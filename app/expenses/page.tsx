'use client';

import { useState } from 'react';
import { Plus, Trash2, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatSoles } from '@/lib/currency';

interface Expense {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  icon: string;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      name: 'Café matinal',
      category: 'Alimentación',
      amount: 5000,
      date: new Date().toISOString().split('T')[0],
      description: 'Café en la oficina',
      icon: '☕',
    },
    {
      id: '2',
      name: 'Almuerzo',
      category: 'Alimentación',
      amount: 18000,
      date: new Date().toISOString().split('T')[0],
      description: 'Comida en restaurante',
      icon: '🍽️',
    },
    {
      id: '3',
      name: 'Gasolina',
      category: 'Transporte',
      amount: 60000,
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      description: 'Llenada de combustible',
      icon: '⛽',
    },
    {
      id: '4',
      name: 'Streaming',
      category: 'Entretenimiento',
      amount: 20000,
      date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
      description: 'Suscripción mensual',
      icon: '🎬',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['Alimentación', 'Transporte', 'Entretenimiento', 'Vivienda', 'Salud'];

  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch = exp.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || exp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalExpenses = filteredExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Gestión de Gastos</h1>
            <p className="text-muted-foreground mt-2">
              Registro detallado de todos tus gastos
            </p>
          </div>

          {/* Summary Card */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total de gastos mostrados
                  </p>
                  <h2 className="text-4xl font-bold text-primary">
                    {formatSoles(totalExpenses)}
                  </h2>
                </div>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Nuevo Gasto
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar gastos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Expenses List */}
          <div className="space-y-3">
            {filteredExpenses.length > 0 ? (
              filteredExpenses
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((expense) => (
                  <Card key={expense.id} className="hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <span className="text-3xl">{expense.icon}</span>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">
                              {expense.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {expense.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {expense.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {format(
                                  new Date(expense.date),
                                  'dd MMM yyyy',
                                  { locale: es }
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xl font-bold text-primary">
                            {formatSoles(expense.amount)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteExpense(expense.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">No hay gastos que coincidan</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
