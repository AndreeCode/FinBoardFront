import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const categoryId = searchParams.get('category_id')
  const token = req.cookies.get('auth_token')?.value

  let url = `${process.env.BACKEND_URL}/transactions`
  if (categoryId) {
    url += `?category_id=${categoryId}`
  }

  const res = await fetch(url, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
  })

  const data = await res.json()
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const token = req.cookies.get('auth_token')?.value

  const res = await fetch(`${process.env.BACKEND_URL}/transactions`, {
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