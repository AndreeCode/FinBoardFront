import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ period: string }> }) {
  const { period } = await params
  const validPeriods = ['daily', 'weekly', 'monthly', 'quarterly', 'semiannual', 'annual']

  if (!validPeriods.includes(period)) {
    return NextResponse.json({ error: 'Invalid period' }, { status: 400 })
  }

  const token = req.cookies.get('auth_token')?.value

  const res = await fetch(`${process.env.BACKEND_URL}/dashboard?period=${period}`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
  })

  const data = await res.json()
  return NextResponse.json(data)
}
