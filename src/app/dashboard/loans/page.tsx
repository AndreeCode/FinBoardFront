import { CreditsManager } from '@/src/components/dashboard/credits-manager'

export default function CreditsPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Créditos</h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">Gestiona tus créditos y deudas</p>
      </div>

      <CreditsManager />
    </>
  )
}
