import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value

  const res = await fetch(`${process.env.BACKEND_URL}/debts`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
  })

  const data = await res.json()
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const token = req.cookies.get('auth_token')?.value

  const res = await fetch(`${process.env.BACKEND_URL}/debts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  return NextResponse.json(data)
}
