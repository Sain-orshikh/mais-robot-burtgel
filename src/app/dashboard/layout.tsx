'use client'

import { DashboardSidebar } from '@/app/components/dashboard/DashboardSidebar'
import { DashboardHeader } from '@/app/components/dashboard/DashboardHeader'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { organisation, loading } = useAuth()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    if (!loading && !organisation) {
      router.push('/')
    }
  }, [organisation, loading, router])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!organisation) {
    return null
  }

  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}
      >
        <DashboardSidebar />
      </div>
      
      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Header */}
        <DashboardHeader onToggleSidebar={toggleSidebar} />
        
        {/* Page Content */}
        <main className='flex-1 overflow-y-auto bg-gray-100'>
          {children}
        </main>
      </div>
    </div>
  )
}
