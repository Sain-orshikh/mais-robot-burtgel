import { AdminHeader } from '@/app/components/admin/AdminHeader'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navigate = useNavigate()

  useEffect(() => {
    const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('adminAuth') === 'true'
    if (!isAuthenticated) {
      navigate('/admin/login', { replace: true })
    }
  }, [navigate])

  return (
    <div className='relative h-screen bg-gray-50 flex flex-col'>
      {/* Admin Header */}
      <AdminHeader />
      
      {/* Main Content */}
      <main className='flex-1 overflow-y-auto bg-gray-100'>
        {children}
      </main>
    </div>
  )
}
