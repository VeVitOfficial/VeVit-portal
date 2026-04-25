const BASE = '/api/v2/portal'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const api = {
  stats: () => request<{ users: number; gamesPlayed: number; lessonsCompleted: number; toolsUsed: number; toolsAvailable: number; coursesAvailable: number }>('/stats'),

  activity: (limit = 20) => request<Array<{
    id: number; kind: string; user_nickname: string; user_avatar: string | null;
    payload: Record<string, unknown>; subdomain: string; created_at: string
  }>>(`/activity?limit=${limit}`),

  contact: (data: { name: string; email: string; subject?: string; message: string; honeypot?: string; turnstileToken?: string }) =>
    request<{ ok: boolean }>('/contact', { method: 'POST', body: JSON.stringify(data) }),

  newsletterSubscribe: (data: { email: string; language: string }) =>
    request<{ ok: boolean }>('/newsletter/subscribe', { method: 'POST', body: JSON.stringify(data) }),

  newsletterConfirm: (token: string) =>
    request<{ ok: boolean }>(`/newsletter/confirm?token=${token}`),

  newsletterUnsubscribe: (data: { email: string; token: string }) =>
    request<{ ok: boolean }>('/newsletter/unsubscribe', { method: 'POST', body: JSON.stringify(data) }),

  changelog: (subdomain = 'all', limit = 20) =>
    request<Array<{
      id: number; subdomain: string; version: string | null; title: string;
      body_md: string | null; kind: string; published_at: string
    }>>(`/changelog?subdomain=${subdomain}&limit=${limit}`),

  status: () =>
    request<Record<string, { status: string; responseTimeMs: number; lastChecked: string }>>('/status'),
}