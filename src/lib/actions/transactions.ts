'use server'

import { cookies } from 'next/headers'
import { apiFetch } from '../apis'

export interface Transaction {
  id: string
  user_id: string
  category_id: string | null
  amount: number
  type: string
  transaction_date: string
  received_date: string | null
  due_date: string | null
  canceled: boolean | null
  description: string
  created_at: string
  updated_at: string | null
  deleted_at: string | null
  created_by: string
}

export interface CreateTransactionRequest {
  user_id: string
  category_id: string | null
  amount: number
  type: 'income' | 'expense' | 'investment'
  transaction_date: string
  received_date: string | null
  due_date: string | null
  canceled: boolean | null
  description: string
}

export interface UpdateTransactionRequest {
  category_id?: string | null
  amount?: number | null
  type?: string | null
  transaction_date?: string | null
  received_date?: string | null
  due_date?: string | null
  canceled?: boolean | null
  description?: string | null
}

async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get('auth_token')?.value
}

async function getUserId(): Promise<string> {
  const cookieStore = await cookies()
  return cookieStore.get('auth_token')?.value || ''
}

export async function getTransactions(): Promise<Transaction[]> {
  const token = await getToken()
  const res = await apiFetch('/transactions', token)
  const response = await res.json()
  return response.data || []
}

export async function getTransactionsByCategory(categoryId: string): Promise<Transaction[]> {
  const token = await getToken()
  const res = await apiFetch(`/transactions?category_id=${categoryId}`, token)
  const response = await res.json()
  return response.data || []
}

export async function createTransaction(transaction: Omit<CreateTransactionRequest, 'user_id'>) {
  const token = await getToken()
  const res = await apiFetch('/transactions', token, {
    method: 'POST',
    body: JSON.stringify(transaction),
  })
  return res.json()
}

export async function updateTransaction(
  id: string,
  transaction: Partial<UpdateTransactionRequest>
): Promise<{ data?: Transaction; msg: string; status: number }> {
  const token = await getToken()
  const res = await apiFetch(`/transactions/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(transaction),
  })
  return res.json()
}

export async function deleteTransaction(
  id: string
): Promise<{ msg: string; status: number }> {
  const token = await getToken()
  const res = await apiFetch(`/transactions/${id}`, token, {
    method: 'DELETE',
  })
  return res.json()
}