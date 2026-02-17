'use client';

import { useState } from 'react';
import { Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Badge } from '@/src/components/ui/badge';

interface IncomeSubcategory {
  id: string;
  name: string;
  color: string;
}

interface IncomeCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  subcategories: IncomeSubcategory[];
  isExpanded: boolean;
}

export function IncomeManager() {
  const [categories, setCategories] = useState<IncomeCategory[]>([
    {
      id: '1',
      name: 'Trabajo',
      icon: '💼',
      color: 'bg-green-100',
      isExpanded: true,
      subcategories: [
        { id: '1-1', name: 'Salario', color: 'bg-green-50' },
        { id: '1-2', name: 'Bonos', color: 'bg-green-50' },
        { id: '1-3', name: 'Freelance', color: 'bg-green-50' },
      ],
    },
    {
      id: '2',
      name: 'Inversiones',
      icon: '📈',
      color: 'bg-blue-100',
      isExpanded: false,
      subcategories: [
        { id: '2-1', name: 'Dividendos', color: 'bg-blue-50' },
        { id: '2-2', name: 'Ganancias Bolsa', color: 'bg-blue-50' },
        { id: '2-3', name: 'Intereses', color: 'bg-blue-50' },
      ],
    },
  ]);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  const toggleCategory = (id: string) => {
    setCategories(
      categories.map((cat) =>
        cat.id === id ? { ...cat, isExpanded: !cat.isExpanded } : cat
      )
    );
  };

  const addCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: IncomeCategory = {
        id: Date.now().toString(),
        name: newCategoryName,
        icon: '💰',
        color: 'bg-emerald-100',
        subcategories: [],
        isExpanded: false,
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
    }
  };

  const addSubcategory = (categoryId: string) => {
    if (newSubcategoryName.trim()) {
      setCategories(
        categories.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                subcategories: [
                  ...cat.subcategories,
                  {
                    id: `${categoryId}-${Date.now()}`,
                    name: newSubcategoryName,
                    color: 'bg-emerald-50',
                  },
                ],
              }
            : cat
        )
      );
      setNewSubcategoryName('');
    }
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const deleteSubcategory = (categoryId: string, subcategoryId: string) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              subcategories: cat.subcategories.filter((sub) => sub.id !== subcategoryId),
            }
          : cat
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Add New Category */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Crear Nueva Fuente de Ingreso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Nombre de la fuente de ingreso"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCategory()}
            />
            <Button onClick={addCategory}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Income Categories List */}
      <div className="space-y-3">
        {categories.map((category) => (
          <Card key={category.id} className={category.color}>
            <div className="p-4">
              {/* Category Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h3 className="font-semibold text-foreground">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.subcategories.length} subcategorías
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCategory(category.id)}
                  >
                    {category.isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteCategory(category.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Subcategories */}
              {category.isExpanded && (
                <div className="space-y-3 border-t border-gray-300 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {category.subcategories.map((sub) => (
                      <div
                        key={sub.id}
                        className={`${sub.color} p-3 rounded-lg flex items-center justify-between`}
                      >
                        <span className="text-sm font-medium text-foreground">{sub.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSubcategory(category.id, sub.id)}
                          className="text-destructive hover:text-destructive h-auto p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Add Subcategory */}
                  {activeCategory === category.id && (
                    <div className="flex gap-2 pt-2 border-t border-gray-300">
                      <Input
                        placeholder="Nueva subcategoría"
                        value={newSubcategoryName}
                        onChange={(e) => setNewSubcategoryName(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === 'Enter' && addSubcategory(category.id)
                        }
                      />
                      <Button
                        size="sm"
                        onClick={() => addSubcategory(category.id)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() =>
                      setActiveCategory(
                        activeCategory === category.id ? '' : category.id
                      )
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {activeCategory === category.id
                      ? 'Cancelar'
                      : 'Agregar Subcategoría'}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
