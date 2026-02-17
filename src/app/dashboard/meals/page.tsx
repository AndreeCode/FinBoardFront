'use client';

import { MealsManager } from '@/src/components/dashboard/meals-manager';

export default function MealsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Registro de Comidas</h1>
            <p className="text-muted-foreground mt-2">
              Controla tus gastos en alimentación con registro detallado por comida
            </p>
          </div>

          <MealsManager />
        </div>
      </div>
    </div>
  );
}
