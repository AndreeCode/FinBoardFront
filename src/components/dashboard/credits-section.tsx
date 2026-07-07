'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Banknote, ArrowUpDown, Loader2 } from 'lucide-react';
import { formatSoles } from '@/src/lib/currency';
import { getCredits, Credit } from '@/src/lib/actions/credits';

export function CreditsSection() {
  const [credits, setCredits] = useState<Credit[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const creditData = await getCredits()
        setCredits(creditData)
      } catch (error) {
        console.error('Error loading credits:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const activeCredits = credits.filter(c => c.status === 'active').slice(0, 3)
  const youOwe = credits.filter(c => !c.is_creditor && c.status === 'active').reduce((sum, c) => sum + c.amount, 0)
  const youAreOwed = credits.filter(c => c.is_creditor && c.status === 'active').reduce((sum, c) => sum + c.amount, 0)

  if (isLoading) {
    return (
      <Card className="border-border">
        <CardContent className="p-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (activeCredits.length === 0) {
    return (
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">Créditos</CardTitle>
            <Banknote className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">No hay créditos activos</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">Créditos</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-500 border-green-500">
              +{formatSoles(youAreOwed)}
            </Badge>
            <Badge variant="outline" className="text-red-500 border-red-500">
              -{formatSoles(youOwe)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeCredits.map((credit) => (
            <div key={credit.id} className="p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{credit.is_creditor ? '📥' : '📤'}</span>
                  <div>
                    <h4 className="font-semibold text-foreground">{credit.person_name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {credit.is_creditor ? 'Te deben' : 'Debes'}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {credit.is_secure ? 'Seguro' : 'Inseguro'}
                </Badge>
              </div>
              <p className={`text-xl font-bold ${credit.is_creditor ? 'text-green-500' : 'text-red-500'}`}>
                {credit.is_creditor ? '+' : '-'}{formatSoles(credit.amount)}
              </p>
              {credit.due_date && (
                <p className="text-xs text-muted-foreground mt-1">
                  Vence: {new Date(credit.due_date).toLocaleDateString('es-ES')}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
