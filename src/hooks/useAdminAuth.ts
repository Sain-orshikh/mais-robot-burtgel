'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export const useAdminAuth = () => {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check authentication immediately
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const authenticated = localStorage.getItem('adminAuth') === 'true'
        setIsAuthenticated(authenticated)
        setIsChecking(false)
        
        if (!authenticated) {
          router.replace('/admin/login')
        }
      }
    }

    checkAuth()
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

  return { logout, getAdminUsername, isAuthenticated, isChecking }
}
