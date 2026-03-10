import { useState } from 'react'

// Користувачі системи
const USERS = [
  {
    id: 1,
    login: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Адміністратор',
  },
  {
    id: 2,
    login: 'viewer',
    password: 'view123',
    role: 'viewer',
    name: 'Перегляд',
  },
]

const load = (key, fallback) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(() =>
    load('currentUser', null),
  )

  const login = (loginInput, passwordInput) => {
    const user = USERS.find(
      (u) => u.login === loginInput && u.password === passwordInput,
    )
    if (user) {
      const safeUser = {
        id: user.id,
        login: user.login,
        role: user.role,
        name: user.name,
      }
      localStorage.setItem('currentUser', JSON.stringify(safeUser))
      setCurrentUser(safeUser)
      return true
    }
    return false
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('currentUser')
  }

  const isAdmin = currentUser?.role === 'admin'
  const isViewer = currentUser?.role === 'viewer'
  const isLoggedIn = !!currentUser

  return {
    currentUser,
    login,
    logout,
    isAdmin,
    isViewer,
    isLoggedIn,
  }
}
