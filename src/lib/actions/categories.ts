'use server'

import { cookies } from 'next/headers'
import { apiFetch } from '../apis'


export interface Category {
  id: string
  name: string
  description: string
  parent_id: string | null
  user_id: string | null
  created_at: string
  updated_at: string | null
  deleted_at: string | null
  created_by: string
}

export interface CategoryInput {
  name: string
  description?: string
  parent_id?: string | null
  user_id?: string | null
  created_by?: string
}

async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get('auth_token')?.value
}

export async function getCategories(): Promise<Category[]> {
  const token = await getToken()
  const res = await apiFetch('/categories', token)
  const response = await res.json()
  return response.data || []
}

export async function createCategory(category: CategoryInput) {
  const token = await getToken()
  const res = await apiFetch('/categories', token, {
    method: 'POST',
    body: JSON.stringify(category),
  })
  return res.json()
}

export async function updateCategory(
  id: string,
  category: Partial<CategoryInput>
): Promise<{ data?: Category; msg: string; status: number }> {
  const token = await getToken()
  const res = await apiFetch(`/categories/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(category),
  })
  return res.json()
}

export async function deleteCategory(
  id: string
): Promise<{ msg: string; status: number }> {
  const token = await getToken()
  const res = await apiFetch(`/categories/${id}`, token, {
    method: 'DELETE',
  })
  return res.json()
}