import { Sidebar } from '@/src/components/dashboard/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64 flex-shrink-0 hidden md:block">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-auto">
        <div className="min-h-screen bg-background overflow-auto">
          <div className="px-4 py-4 md:px-6 md:py-5">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
