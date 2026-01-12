'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('adminAuth') === 'true'
    
    // Redirect to dashboard if authenticated, otherwise to login
    if (isAuthenticated) {
      router.replace('/admin/dashboard')
    } else {
      router.replace('/admin/login')
    }
  }, [router])

  return (
    <div className='min-h-screen bg-background flex items-center justify-center'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto'></div>
        <p className='mt-4 text-muted-foreground'>Чиглүүлж байна...</p>
      </div>
    </div>
  )
}
