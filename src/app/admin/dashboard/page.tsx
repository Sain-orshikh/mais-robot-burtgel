'use client'

import { useAdminAuth } from '@/hooks/useAdminAuth'
import { AdminStatsCards } from '@/app/components/admin/AdminStatsCards'
import { RecentRegistrations } from '@/app/components/admin/RecentRegistrations'
import { CategoryDistribution } from '@/app/components/admin/CategoryDistribution'
import { mockRegistrations, getRegistrationStats, getCategoryStats } from '@/data/mockRegistrations'
import { Button } from '@/components/ui/button'
import { LogOut, Users, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  useAdminAuth() // Protect this route
  const { logout, getAdminUsername } = useAdminAuth()

  const stats = getRegistrationStats()
  const categoryStats = getCategoryStats()

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='bg-card border-b border-border sticky top-0 z-10'>
        <div className='container mx-auto px-6 py-4'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-2xl font-bold text-foreground'>
                Админ удирдлагын систем
              </h1>
              <p className='text-sm text-muted-foreground'>
                MAIS Robot Challenge 2026
              </p>
            </div>
            <div className='flex items-center gap-4'>
              <span className='text-sm text-muted-foreground'>
                Сайн байна уу, <strong>{getAdminUsername()}</strong>
              </span>
              <Button
                variant='outline'
                size='sm'
                onClick={logout}
                className='gap-2'
              >
                <LogOut size={16} />
                Гарах
              </Button>
            </div>
          </div>
        </div>
      </header>

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
