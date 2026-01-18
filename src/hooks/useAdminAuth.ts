import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const useAdminAuth = () => {
  const navigate = useNavigate()
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
          navigate('/admin/login', { replace: true })
        }
      }
    }

    checkAuth()
  }, [navigate])

  const logout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminUsername')
    localStorage.removeItem('adminLoginTime')
    navigate('/admin/login')
  }

  const getAdminUsername = () => {
    if (typeof window === 'undefined') return 'Admin'
    return localStorage.getItem('adminUsername') || 'Admin'
  }

  return { logout, getAdminUsername, isAuthenticated, isChecking }
}
