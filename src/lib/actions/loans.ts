'use server'

import { cookies } from 'next/headers'
import { apiFetch } from '../apis'

export interface Loan {
  id: string
  transaction_id: string
  lender: string
  due_date: string
  interest_rate: number
  status: string
  created_at: string
  updated_at: string | null
}

export interface CreateLoanRequest {
  transaction_id: string
  lender: string
  due_date: string
  interest_rate: number
  status: string
}

export interface UpdateLoanRequest {
  lender?: string
  due_date?: string
  interest_rate?: number
  status?: string
}

async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get('auth_token')?.value
}

export async function getLoans(): Promise<Loan[]> {
  const token = await getToken()
  const res = await apiFetch('/loans', token)
  const response = await res.json()
  return response.data || []
}

export async function createLoan(loan: CreateLoanRequest) {
  const token = await getToken()
  const res = await apiFetch('/loans', token, {
    method: 'POST',
    body: JSON.stringify(loan),
  })
  return res.json()
}

export async function updateLoan(
  id: string,
  loan: Partial<UpdateLoanRequest>
): Promise<{ data?: Loan; msg: string; status: number }> {
  const token = await getToken()
  const res = await apiFetch(`/loans/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(loan),
  })
  return res.json()
}

export async function deleteLoan(
  id: string
): Promise<{ msg: string; status: number }> {
  const token = await getToken()
  const res = await apiFetch(`/loans/${id}`, token, {
    method: 'DELETE',
  })
  return res.json()
}