'use server'

import { cookies } from 'next/headers'
import { apiFetch } from '../apis'

export interface DashboardSummary {
  total_income: number
  total_expenses: number
  total_investments: number
  total_credits: number
  you_owe: number
  you_are_owed: number
  balance: number
  average_income: number
  average_expenses: number
  savings: number
  savings_rate: number
}

export interface DashboardTrend {
  period: string
  income: number
  expenses: number
  investments: number
  credits: number
  net_flow: number
}

export interface DashboardCategory {
  category_id: string
  category_name: string
  total: number
  percentage: number
  count: number
}

export interface DashboardDailyAverage {
  daily_income: number
  daily_expenses: number
  weekly_income: number
  weekly_expenses: number
  monthly_income: number
  monthly_expenses: number
}

export interface DashboardPeriodComparison {
  period: string
  income: number
  expenses: number
  net_flow: number
}

export interface DashboardData {
  summary: DashboardSummary
  trends: DashboardTrend[]
  by_category: DashboardCategory[]
  daily_average: DashboardDailyAverage
  period_comparison: DashboardPeriodComparison[]
}

async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get('auth_token')?.value
}

export async function getDashboardData(period: string = 'monthly'): Promise<DashboardData> {
  const token = await getToken()
  const res = await apiFetch(`/dashboard?period=${period}`, token)
  const response = await res.json()

  const data = response?.data

  if (!data || !data.summary) {
    console.warn('Invalid dashboard response:', response)
    return {
      summary: {
        total_income: 0,
        total_expenses: 0,
        total_investments: 0,
        total_credits: 0,
        you_owe: 0,
        you_are_owed: 0,
        balance: 0,
        average_income: 0,
        average_expenses: 0,
        savings: 0,
        savings_rate: 0
      },
      trends: [],
      by_category: [],
      daily_average: {
        daily_income: 0,
        daily_expenses: 0,
        weekly_income: 0,
        weekly_expenses: 0,
        monthly_income: 0,
        monthly_expenses: 0
      },
      period_comparison: []
    }
  }

  return data
}