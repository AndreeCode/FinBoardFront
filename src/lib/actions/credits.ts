'use server'

import { cookies } from 'next/headers'
import { apiFetch } from '../apis'

export interface Credit {
  id: string
  person_name: string
  amount: number
  interest_rate: number
  is_creditor: boolean
  is_secure: boolean
  due_date: string | null
  status: string
  created_at: string
  updated_at: string | null
}

export interface CreateCreditRequest {
  person_name: string
  amount: number
  interest_rate: number
  is_creditor: boolean
  is_secure: boolean
  due_date?: string
  status: string
}

export interface UpdateCreditRequest {
  person_name?: string
  amount?: number
  interest_rate?: number
  is_creditor?: boolean
  is_secure?: boolean
  due_date?: string
  status?: string
}

async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get('auth_token')?.value
}

export async function getCredits(): Promise<Credit[]> {
  const token = await getToken()
  const res = await apiFetch('/credits', token)
  const response = await res.json()
  return response.data || []
}

export async function getCredit(id: string): Promise<Credit | null> {
  const token = await getToken()
  const res = await apiFetch(`/credits/${id}`, token)
  const response = await res.json()
  return response.data || null
}

export async function createCredit(credit: CreateCreditRequest) {
  const token = await getToken()
  const res = await apiFetch('/credits', token, {
    method: 'POST',
    body: JSON.stringify(credit),
  })
  return res.json()
}

export async function updateCredit(
  id: string,
  credit: Partial<UpdateCreditRequest>
): Promise<{ data?: Credit; msg: string; status: number }> {
  const token = await getToken()
  const res = await apiFetch(`/credits/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(credit),
  })
  return res.json()
}

export async function deleteCredit(
  id: string
): Promise<{ msg: string; status: number }> {
  const token = await getToken()
  const res = await apiFetch(`/credits/${id}`, token, {
    method: 'DELETE',
  })
  return res.json()
}
