import { NextRequest, NextResponse } from 'next/server'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const token = req.cookies.get('auth_token')?.value

  const res = await fetch(`${process.env.BACKEND_URL}/investments/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const token = req.cookies.get('auth_token')?.value

  const res = await fetch(`${process.env.BACKEND_URL}/investments/${id}`, {
    method: 'DELETE',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
  })

  const data = await res.json()
  return NextResponse.json(data)
}
