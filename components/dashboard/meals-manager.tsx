'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatSoles } from '@/lib/currency';

interface MealDetail {
  id: string;
  name: string;
  description: string;
  amount: number;
  time: string;
  date: string;
}

interface MealCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  details: MealDetail[];
  isExpanded: boolean;
  totalSpent: number;
}

export function MealsManager() {
  const [mealCategories, setMealCategories] = useState<MealCategory[]>([
    {
      id: 'lunch',
      name: 'Almuerzo',
      icon: '🍜',
      color: 'bg-amber-100',
      isExpanded: true,
      totalSpent: 45000,
      details: [
        {
          id: '1',
          name: 'Arroz con pollo',
          description: 'En la comida de la oficina',
          amount: 15000,
          time: '12:30',
          date: new Date().toISOString().split('T')[0],
        },
        {
          id: '2',
          name: 'Pizza',
          description: 'Con colegas',
          amount: 30000,
          time: '13:00',
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        },
      ],
    },
    {
      id: 'dinner',
      name: 'Cena',
      icon: '🍽️',
      color: 'bg-violet-100',
      isExpanded: true,
      totalSpent: 38000,
      details: [
        {
          id: '3',
          name: 'Pasta a la carbonara',
          description: 'Cena en casa',
          amount: 22000,
          time: '19:30',
          date: new Date().toISOString().split('T')[0],
        },
        {
          id: '4',
          name: 'Hamburguesa con papas',
          description: 'En restaurante familiar',
          amount: 16000,
          time: '19:45',
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        },
      ],
    },
  ]);

  const [showForm, setShowForm] = useState<string | null>(null);
  const [newMeal, setNewMeal] = useState({
    name: '',
    description: '',
    amount: '',
    time: '',
  });

  const toggleCategory = (id: string) => {
    setMealCategories(
      mealCategories.map((cat) =>
        cat.id === id ? { ...cat, isExpanded: !cat.isExpanded } : cat
      )
    );
  };

  const addMeal = (categoryId: string) => {
    if (newMeal.name && newMeal.amount && newMeal.time) {
      const today = new Date().toISOString().split('T')[0];
      setMealCategories(
        mealCategories.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                details: [
                  ...cat.details,
                  {
                    id: Date.now().toString(),
                    name: newMeal.name,
                    description: newMeal.description,
                    amount: parseFloat(newMeal.amount),
                    time: newMeal.time,
                    date: today,
                  },
                ],
                totalSpent: cat.totalSpent + parseFloat(newMeal.amount),
              }
            : cat
        )
      );
      setNewMeal({ name: '', description: '', amount: '', time: '' });
      setShowForm(null);
    }
  };

  const deleteMeal = (categoryId: string, mealId: string) => {
    setMealCategories(
      mealCategories.map((cat) => {
        if (cat.id === categoryId) {
          const meal = cat.details.find((d) => d.id === mealId);
          return {
            ...cat,
            details: cat.details.filter((d) => d.id !== mealId),
            totalSpent: cat.totalSpent - (meal?.amount || 0),
          };
        }
        return cat;
      })
    );
  };

  const groupByDate = (details: MealDetail[]) => {
    return details.reduce(
      (acc, detail) => {
        if (!acc[detail.date]) {
          acc[detail.date] = [];
        }
        acc[detail.date].push(detail);
        return acc;
      },
      {} as Record<string, MealDetail[]>
    );
  };

  return (
    <div className="space-y-6">
      {mealCategories.map((category) => (
        <Card key={category.id}>
          <CardHeader className={`${category.color} border-b`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{category.icon}</span>
                <div>
                  <CardTitle>{category.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {category.details.length} registros - Total: {formatSoles(category.totalSpent)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleCategory(category.id)}
              >
                {category.isExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </Button>
            </div>
          </CardHeader>

          {category.isExpanded && (
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Meals by Date */}
                {Object.entries(groupByDate(category.details))
                  .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
                  .map(([date, meals]) => (
                    <div key={date} className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold text-sm text-muted-foreground mb-3">
                        {format(new Date(date), 'EEEE, d MMMM', { locale: es })}
                      </h4>
                      <div className="space-y-2">
                        {meals
                          .sort((a, b) => b.time.localeCompare(a.time))
                          .map((meal) => (
                            <div
                              key={meal.id}
                              className="bg-muted p-4 rounded-lg flex items-start justify-between"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-semibold text-foreground">
                                    {meal.name}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {meal.time}
                                  </Badge>
                                </div>
                                {meal.description && (
                                  <p className="text-sm text-muted-foreground">
                                    {meal.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-3 ml-4">
                                <span className="text-sm font-semibold text-primary">
                                  {formatSoles(meal.amount)}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    deleteMeal(category.id, meal.id)
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
                  ))}

                {/* Add Meal Form */}
                {showForm === category.id && (
                  <div className="border-t pt-6 space-y-4 bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold">Registrar nueva comida</h4>
                    <Input
                      placeholder="Nombre del platillo"
                      value={newMeal.name}
                      onChange={(e) =>
                        setNewMeal({ ...newMeal, name: e.target.value })
                      }
                    />
                    <Textarea
                      placeholder="Descripción (opcional)"
                      value={newMeal.description}
                      onChange={(e) =>
                        setNewMeal({ ...newMeal, description: e.target.value })
                      }
                      className="resize-none"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="number"
                        placeholder="Monto gastado"
                        value={newMeal.amount}
                        onChange={(e) =>
                          setNewMeal({ ...newMeal, amount: e.target.value })
                        }
                      />
                      <Input
                        type="time"
                        value={newMeal.time}
                        onChange={(e) =>
                          setNewMeal({ ...newMeal, time: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => addMeal(category.id)}
                      >
                        Guardar
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => {
                          setShowForm(null);
                          setNewMeal({
                            name: '',
                            description: '',
                            amount: '',
                            time: '',
                          });
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Add Meal Button */}
                {showForm !== category.id && (
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setShowForm(category.id)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Comida
                  </Button>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
