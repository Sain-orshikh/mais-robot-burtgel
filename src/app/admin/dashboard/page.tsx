'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { AdminHeader } from '@/app/components/admin/AdminHeader'
import { AdminStatsCards } from '@/app/components/admin/AdminStatsCards'
import { RecentRegistrations } from '@/app/components/admin/RecentRegistrations'
import { eventApi } from '@/lib/api/events'
import { teamApi } from '@/lib/api/teams'
import { paymentApi } from '@/lib/api/payments'
import { Button } from '@/components/ui/button'
import { Users, BarChart3, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

export default function AdminDashboard() {
  const { isAuthenticated, isChecking } = useAdminAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    paymentVerified: 0,
    paymentUploaded: 0,
    paymentNotUploaded: 0
  })
  const [recentTeams, setRecentTeams] = useState<any[]>([])

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData()
    }
  }, [isAuthenticated])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch all events and then load each event with populated registrations
      const events = await eventApi.getAll()

      const populatedEvents = await Promise.all(
        events.map((event: any) => eventApi.getById(event._id))
      )

      // Extract all registrations from all events (populated org/coach/contestants)
      const allRegistrations = populatedEvents.flatMap((event: any) =>
        (event.registrations || []).map((reg: any) => ({
          ...reg,
          eventId: event._id,
          eventName: event.name,
          paymentStatus: reg.paymentStatus || 'not_uploaded'
        }))
      )
      
      // Fetch all teams to get actual team data
      const teamPromises = events.map(event => 
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams/event/${event._id}`, {
          credentials: 'include'
        }).then(res => res.ok ? res.json() : []).catch(() => [])
      )
      
      const teamsArrays = await Promise.all(teamPromises)
      const allTeams = teamsArrays.flat()
      
      // Calculate stats
      const totalTeams = allTeams.length
      const activeTeams = allTeams.filter((t: any) => t.status === 'active')
      const deletedTeams = allTeams.filter((t: any) => t.status === 'deleted')
      
      // Get all payments
      const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/admin/all`, {
        credentials: 'include'
      })
      const allPayments = paymentResponse.ok ? await paymentResponse.json() : []
      
      // Calculate payment stats
      const verifiedPayments = allPayments.filter((p: any) => p.status === 'verified').length
      const pendingPayments = allPayments.filter((p: any) => p.status === 'pending').length
      
      // Count teams without payment (teams that don't have a teamId in any payment)
      const teamsWithPayment = new Set()
      allPayments.forEach((payment: any) => {
        payment.teamIds?.forEach((teamId: any) => {
          teamsWithPayment.add(teamId.toString())
        })
      })
      const teamsWithoutPayment = activeTeams.filter((t: any) => 
        !teamsWithPayment.has(t._id.toString())
      ).length
      
      setStats({
        total: allRegistrations.length,
        pending: pendingPayments,
        approved: activeTeams.length,
        rejected: deletedTeams.length,
        paymentVerified: verifiedPayments,
        paymentUploaded: pendingPayments,
        paymentNotUploaded: teamsWithoutPayment
      })
      
      // Get recent registrations (last 10)
      const sortedRegs = allRegistrations
        .sort((a: any, b: any) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
        .slice(0, 10)
      setRecentTeams(sortedRegs)
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

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

  if (loading) {
    return (
      <div className='min-h-screen bg-background'>
        <AdminHeader />
        <div className='container mx-auto px-6 py-8 flex items-center justify-center h-96'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto'></div>
            <p className='mt-4 text-muted-foreground'>Мэдээлэл ачааллаж байна...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <AdminHeader />

      {/* Main Content */}
      <main className='container mx-auto px-6 py-8'>
        {/* Quick Actions */}
        <div className='flex gap-4 mb-8'>
          <Button asChild className='gap-2'>
            <Link href='/admin/events'>
              <Calendar size={20} />
              Тэмцээн удирдах
            </Link>
          </Button>
          <Button asChild variant='outline' className='gap-2'>
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

        <div className='grid grid-cols-1 gap-6'>
          <RecentRegistrations
            registrations={recentTeams}
            limit={8}
            onViewDetails={() => router.push('/admin/registrations')}
          />
        </div>
      </main>
    </div>
  )
}
