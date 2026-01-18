import { DashboardSidebar } from '@/app/components/dashboard/DashboardSidebar'
import { DashboardHeader } from '@/app/components/dashboard/DashboardHeader'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { organisation, loading } = useAuth()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    if (!loading && !organisation) {
      navigate('/')
    }
  }, [organisation, loading, navigate])

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
    <div className='relative h-screen bg-gray-50 md:flex'>
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 h-screen bg-white transform transition-transform duration-300 md:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <DashboardSidebar />
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:block transition-all duration-300 overflow-hidden ${
          isSidebarOpen ? 'w-64' : 'w-0'
        }`}
      >
        <div className='h-full bg-white'>
          <DashboardSidebar />
        </div>
      </div>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/40 md:hidden'
          onClick={toggleSidebar}
        />
      )}
      
      {/* Main Content */}
      <div className='flex flex-col overflow-hidden md:flex-1'>
        {/* Header */}
        <DashboardHeader onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        {/* Page Content */}
        <main className='flex-1 overflow-y-auto bg-gray-100'>
          {children}
        </main>
      </div>
    </div>
  )
}
