'use client'

import { DashboardSidebar } from '@/app/components/dashboard/DashboardSidebar'
import { DashboardHeader } from '@/app/components/dashboard/DashboardHeader'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Header */}
        <DashboardHeader />
        
        {/* Page Content */}
        <main className='flex-1 overflow-y-auto bg-gray-100'>
          {children}
        </main>
      </div>
    </div>
  )
}
