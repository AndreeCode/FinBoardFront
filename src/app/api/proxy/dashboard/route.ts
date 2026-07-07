import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const period = searchParams.get('period') || 'monthly'
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
