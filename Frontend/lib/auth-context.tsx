'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('auth_token')
    if (stored) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    // Simulate API call with validation
    if (!username.trim() || !password.trim()) {
      throw new Error('Username and password are required')
    }
    
    // Simulate successful login
    localStorage.setItem('auth_token', btoa(`${username}:${password}`))
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return null
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
