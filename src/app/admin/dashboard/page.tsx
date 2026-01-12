'use client'

import { useAdminAuth } from '@/hooks/useAdminAuth'
import { AdminHeader } from '@/app/components/admin/AdminHeader'
import { AdminStatsCards } from '@/app/components/admin/AdminStatsCards'
import { RecentRegistrations } from '@/app/components/admin/RecentRegistrations'
import { CategoryDistribution } from '@/app/components/admin/CategoryDistribution'
import { mockRegistrations, getRegistrationStats, getCategoryStats } from '@/data/mockRegistrations'
import { Button } from '@/components/ui/button'
import { Users, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const { isAuthenticated, isChecking } = useAdminAuth()

  // Show loading state while checking authentication
  if (isChecking || !isAuthenticated) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto'></div>
          <p className='mt-4 text-muted-foreground'>Уншиж байна...</p>
        </div>
      </div>
    )
  }

  const stats = getRegistrationStats()
  const categoryStats = getCategoryStats()

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <AdminHeader />

      {/* Main Content */}
      <main className='container mx-auto px-6 py-8'>
        {/* Quick Actions */}
        <div className='flex gap-4 mb-8'>
          <Button asChild className='gap-2'>
            <Link href='/admin/registrations'>
              <Users size={20} />
              Бүртгэлүүд харах
            </Link>
          </Button>
          <Button asChild variant='outline' className='gap-2'>
            <Link href='/admin/analytics'>
              <BarChart3 size={20} />
              Статистик
            </Link>
          </Button>
        </div>

        {/* Stats Cards - Now includes 8th countdown card */}
        <div className='mb-8'>
          <AdminStatsCards stats={stats} />
        </div>

        {/* Two Column Layout */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Recent Registrations - Takes 2 columns */}
          <div className='lg:col-span-2'>
            <RecentRegistrations registrations={mockRegistrations} limit={8} />
          </div>

          {/* Category Distribution - Takes 1 column */}
          <div className='lg:col-span-1'>
            <CategoryDistribution categoryStats={categoryStats} />
          </div>
        </div>
      </main>
    </div>
  )
}
