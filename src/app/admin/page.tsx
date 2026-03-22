import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminPage() {
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('adminAuth') === 'true'
    
    // Redirect to dashboard if authenticated, otherwise to login
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true })
    } else {
      navigate('/admin/login', { replace: true })
    }
  }, [navigate])

  return (
    <div className='min-h-screen bg-background flex items-center justify-center'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto'></div>
        <p className='mt-4 text-muted-foreground'>Чиглүүлж байна...</p>
      </div>
    </div>
  )
}
