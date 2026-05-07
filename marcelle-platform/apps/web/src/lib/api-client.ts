import { getSession } from 'next-auth/react'

const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3001'

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async getHeaders(): Promise<HeadersInit> {
    const session = await getSession()
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    if (session?.user) {
      const accessToken = (session.user as any).accessToken
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`
      }
    }
    return headers
  }

  private buildUrl(path: string, params?: Record<string, string | number | undefined>) {
    let url = `${this.baseUrl}${path}`
    if (params) {
      const qs = new URLSearchParams()
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== '') qs.set(k, String(v))
      }
      const str = qs.toString()
      if (str) url += `?${str}`
    }
    return url
  }

  async get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
    const headers = await this.getHeaders()
    const res = await fetch(this.buildUrl(path, params), { headers })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    const json = await res.json()
    return (json.data ?? json) as T
  }

  // For endpoints that return { data: T[], total, hasMore, ... } directly (no wrapper)
  async list<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
    const headers = await this.getHeaders()
    const res = await fetch(this.buildUrl(path, params), { headers })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return res.json() as Promise<T>
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    const headers = await this.getHeaders()
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message ?? `API error: ${res.status}`)
    }
    const json = await res.json()
    return json.data as T
  }

  async patch<T>(path: string, body: unknown): Promise<T> {
    const headers = await this.getHeaders()
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message ?? `API error: ${res.status}`)
    }
    const json = await res.json()
    return json.data as T
  }

  async delete(path: string): Promise<void> {
    const headers = await this.getHeaders()
    const res = await fetch(`${this.baseUrl}${path}`, { method: 'DELETE', headers })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
  }
}

export const apiClient = new ApiClient(API_URL)
