'use client';

import { CategoriesManager } from '@/src/components/dashboard/categories-manager';

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Gestión de Categorías</h1>
            <p className="text-muted-foreground mt-2">
              Organiza tus gastos por categorías y subcategorías
            </p>
          </div>

          <CategoriesManager />
        </div>
      </div>
    </div>
  );
}
