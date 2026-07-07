'use server'

import { cookies } from 'next/headers'
import { apiFetch } from '../apis'

export interface Investment {
  id: string
  transaction_id: string
  expected_gain: number
  risk_level: string
  status: string
  created_at: string
  updated_at: string | null
}

export interface CreateInvestmentRequest {
  transaction_id: string
  expected_gain: number
  risk_level: string
  status: string
}

export interface UpdateInvestmentRequest {
  expected_gain?: number
  risk_level?: string
  status?: string
}

async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get('auth_token')?.value
}

export async function getInvestments(): Promise<Investment[]> {
  const token = await getToken()
  const res = await apiFetch('/investments', token)
  const response = await res.json()
  return response.data || []
}

export async function createInvestment(investment: CreateInvestmentRequest) {
  const token = await getToken()
  const res = await apiFetch('/investments', token, {
    method: 'POST',
    body: JSON.stringify(investment),
  })
  return res.json()
}

export async function updateInvestment(
  id: string,
  investment: Partial<UpdateInvestmentRequest>
): Promise<{ data?: Investment; msg: string; status: number }> {
  const token = await getToken()
  const res = await apiFetch(`/investments/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(investment),
  })
  return res.json()
}

export async function deleteInvestment(
  id: string
): Promise<{ msg: string; status: number }> {
  const token = await getToken()
  const res = await apiFetch(`/investments/${id}`, token, {
    method: 'DELETE',
  })
  return res.json()
}