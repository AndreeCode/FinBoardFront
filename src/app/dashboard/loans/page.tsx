'use client';

import { DetailedLoans } from '@/src/components/dashboard/detailed-loans';

export default function LoansPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Gestión de Préstamos</h1>
            <p className="text-muted-foreground mt-2">
              Controla todos tus préstamos, pagos e inversiones realizadas a terceros
            </p>
          </div>

          <DetailedLoans />
        </div>
      </div>
    </div>
  );
}
