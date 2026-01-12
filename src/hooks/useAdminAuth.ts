'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const useAdminAuth = () => {
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth')
    if (!isAuthenticated) {
      router.push('/admin/login')
    }
  }, [router])

  const logout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminUsername')
    localStorage.removeItem('adminLoginTime')
    router.push('/admin/login')
  }

  const getAdminUsername = () => {
    if (typeof window === 'undefined') return 'Admin'
    return localStorage.getItem('adminUsername') || 'Admin'
  }

  return { logout, getAdminUsername }
}
