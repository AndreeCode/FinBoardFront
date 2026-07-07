
export async function apiFetch(path: string, token: string | undefined, init: RequestInit = {}) {
  const res = await fetch(`${process.env.BACKEND_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(init.headers ?? {}),
    },
  })

  return res
}