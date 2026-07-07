'use server'

import { cookies } from 'next/headers'
import { apiFetch } from '../apis'

export interface Debt {
  id: string
  transaction_id: string
  creditor: string
  due_date: string
  interest_rate: number
  original_amount: number
  remaining_amount: number
  status: string
  created_at: string
  updated_at: string | null
}

export interface CreateDebtRequest {
  transaction_id: string
  creditor: string
  due_date?: string
  interest_rate: number
  original_amount: number
  status: string
}

export interface UpdateDebtRequest {
  creditor?: string
  due_date?: string
  interest_rate?: number
  remaining_amount?: number
  status?: string
}

async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get('auth_token')?.value
}

export async function getDebts(): Promise<Debt[]> {
  const token = await getToken()
  const res = await apiFetch('/debts', token)
  const response = await res.json()
  return response.data || []
}

export async function getDebt(id: string): Promise<Debt | null> {
  const token = await getToken()
  const res = await apiFetch(`/debts/${id}`, token)
  const response = await res.json()
  return response.data || null
}

export async function createDebt(debt: CreateDebtRequest) {
  const token = await getToken()
  const res = await apiFetch('/debts', token, {
    method: 'POST',
    body: JSON.stringify(debt),
  })
  return res.json()
}

export async function updateDebt(
  id: string,
  debt: Partial<UpdateDebtRequest>
): Promise<{ data?: Debt; msg: string; status: number }> {
  const token = await getToken()
  const res = await apiFetch(`/debts/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(debt),
  })
  return res.json()
}

export async function deleteDebt(
  id: string
): Promise<{ msg: string; status: number }> {
  const token = await getToken()
  const res = await apiFetch(`/debts/${id}`, token, {
    method: 'DELETE',
  })
  return res.json()
}
