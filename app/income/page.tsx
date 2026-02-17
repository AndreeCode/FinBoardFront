'use client';

import { IncomeManager } from '@/components/dashboard/income-manager';

export default function IncomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Gestión de Ingresos</h1>
            <p className="text-muted-foreground mt-2">Organiza y controla tus fuentes de ingreso</p>
          </div>

          {/* Income Manager */}
          <IncomeManager />
        </div>
      </div>
    </div>
  );
}
