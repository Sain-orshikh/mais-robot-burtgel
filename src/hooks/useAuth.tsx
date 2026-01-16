'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface Organisation {
  _id: string
  organisationId: string
  type: string
  typeDetail: string
  aimag: string
  phoneNumber: string
  ner: string
  ovog: string
  email: string
  registriinDugaar?: string
  createdAt?: string
  lastLogin?: Date
}

interface AuthContextType {
  organisation: Organisation | null
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
}

interface RegisterData {
  type: string
  typeDetail: string
  aimag: string
  phoneNumber: string
  ner: string
  ovog: string
  registriinDugaar: string
  email: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [organisation, setOrganisation] = useState<Organisation | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/api/organisations/me`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setOrganisation(data)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/organisations/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Login failed')
    }

    const data = await response.json()
    setOrganisation(data)
    router.push('/dashboard')
  }

  const register = async (data: RegisterData) => {
    const response = await fetch(`${API_URL}/api/organisations/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Registration failed')
    }

    const orgData = await response.json()
    setOrganisation(orgData)
    router.push('/dashboard')
  }

  const logout = async () => {
    await fetch(`${API_URL}/api/organisations/logout`, {
      method: 'POST',
      credentials: 'include',
    })
    setOrganisation(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ organisation, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
