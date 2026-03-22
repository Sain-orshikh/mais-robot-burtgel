import { useState, useEffect } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { AdminStatsCards } from '@/app/components/admin/AdminStatsCards'
import { RegistrationsTable } from '@/app/components/admin/RegistrationsTable'
import { RegistrationFilters } from '@/app/components/admin/RegistrationFilters'
import { eventApi } from '@/lib/api/events'
import { fetchNormalizedRegistrationsForEvent } from '@/lib/api/adminRegistrations'
import { Button } from '@/components/ui/button'
import { Users, BarChart3, Calendar, Settings } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

// Compatibility wrapper
const Link = RouterLink

export default function AdminDashboard() {
  const { isAuthenticated, isChecking } = useAdminAuth()
  const navigate = useNavigate()
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
  const [events, setEvents] = useState<any[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [registrations, setRegistrations] = useState<any[]>([])
  const [filteredRegistrations, setFilteredRegistrations] = useState<any[]>([])

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData()
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (selectedEventId) {
      void fetchEventRegistrations(selectedEventId)
    }
  }, [selectedEventId])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      const events = await eventApi.getAll()
      setEvents(events)
      if (events.length > 0 && !selectedEventId) {
        setSelectedEventId(events[0]._id)
      }

      const populatedEvents = await Promise.all(
        events.map((event: any) => eventApi.getById(event._id))
      )

      const allRegistrations = populatedEvents.flatMap((event: any) =>
        (event.registrations || []).map((reg: any) => ({
          ...reg,
          eventId: event._id,
          eventName: event.name,
        }))
      )

      const paymentResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/admin/all`, {
        credentials: 'include'
      })
      const allPayments = paymentResponse.ok ? await paymentResponse.json() : []

      const verifiedPayments = allPayments.filter((p: any) => p.status === 'approved').length
      const pendingPayments = allPayments.filter((p: any) => p.status === 'pending').length
      const approvedCount = allRegistrations.filter((reg: any) => reg.status === 'approved').length
      const rejectedCount = allRegistrations.filter((reg: any) => reg.status === 'rejected').length
      const teamsWithoutPayment = allRegistrations.filter((reg: any) => !reg.paymentId).length
      
      setStats({
        total: allRegistrations.length,
        pending: pendingPayments,
        approved: approvedCount,
        rejected: rejectedCount,
        paymentVerified: verifiedPayments,
        paymentUploaded: pendingPayments,
        paymentNotUploaded: teamsWithoutPayment
      })
      
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

  const fetchEventRegistrations = async (eventId: string) => {
    try {
      const { registrations } = await fetchNormalizedRegistrationsForEvent(eventId)
      setRegistrations(registrations)
      setFilteredRegistrations(registrations)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load registrations',
        variant: 'destructive',
      })
    }
  }

  const selectedEvent = events.find((event) => event._id === selectedEventId)
  const categories = selectedEvent?.categories?.map((category: any) => category.name) || []

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
      {/* Main Content */}
      <main className='container mx-auto px-6 py-8'>
        {/* Quick Actions */}
        <div className='flex gap-4 mb-8'>
          <Button asChild className='gap-2'>
            <Link to='/admin/events'>
              <Calendar size={20} />
              Тэмцээн удирдах
            </Link>
          </Button>
          <Button asChild variant='outline' className='gap-2'>
            <Link to='/admin/registrations'>
              <Users size={20} />
              Бүртгэлүүд харах
            </Link>
          </Button>
          <Button asChild variant='outline' className='gap-2'>
            <Link to='/admin/analytics'>
              <BarChart3 size={20} />
              Статистик
            </Link>
          </Button>
          <Button asChild variant='outline' className='gap-2'>
            <Link to='/admin/settings'>
              <Settings size={20} />
              Тохиргоо
            </Link>
          </Button>
        </div>

        {/* Stats Cards - Now includes 8th countdown card */}
        <div className='mb-8'>
          <AdminStatsCards stats={stats} />
        </div>

        <div className='mb-6 p-4 bg-card rounded-lg border'>
          <div className='flex items-center gap-4'>
            <div className='flex-1 max-w-md'>
              <Label htmlFor='event-select' className='text-sm font-medium mb-2 block'>
                Тэмцээн сонгох
              </Label>
              <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                <SelectTrigger id='event-select'>
                  <SelectValue placeholder='Тэмцээн сонгоно уу' />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event._id} value={event._id}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedEvent && (
              <div className='text-sm text-muted-foreground'>
                <p>Нийт бүртгэл: <span className='font-semibold text-foreground'>{registrations.length}</span></p>
                <p>Шүүлтсэн: <span className='font-semibold text-foreground'>{filteredRegistrations.length}</span></p>
              </div>
            )}
          </div>
        </div>

        {selectedEventId ? (
          <div className='space-y-4'>
            <RegistrationFilters
              registrations={registrations}
              categories={categories}
              onFilteredResults={setFilteredRegistrations}
            />

            <RegistrationsTable
              registrations={filteredRegistrations}
              onViewDetails={() => navigate('/admin/registrations')}
            />
          </div>
        ) : (
          <div className='text-center py-12 text-muted-foreground'>
            <p>Тэмцээн сонгоно уу</p>
          </div>
        )}
      </main>
    </div>
  )
}
