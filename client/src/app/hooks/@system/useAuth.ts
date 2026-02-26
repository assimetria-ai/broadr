import { useState, useEffect } from 'react'
import { api } from '../lib/@system/api'

interface User {
  id: number
  email: string
  name: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<{ user: User }>('/api/sessions/me')
      .then(({ user }) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  return { user, loading, isAuthenticated: !!user }
}
