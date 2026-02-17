'use client';

import { InvestmentsSection } from '@/components/dashboard/investments-section';

export default function InvestmentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Mi Portafolio de Inversiones</h1>
            <p className="text-muted-foreground mt-2">
              Gestiona y supervisa todas tus inversiones en un solo lugar
            </p>
          </div>

          <InvestmentsSection />
        </div>
      </div>
    </div>
  );
}
