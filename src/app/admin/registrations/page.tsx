import { useState, useEffect } from 'react'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { ThemeToggle } from '@/app/components/shared/ThemeToggle'
import { RegistrationsTable } from '@/app/components/admin/RegistrationsTable'
import { RegistrationDetailsDialog } from '@/app/components/admin/RegistrationDetailsDialog'
import { RegistrationFilters } from '@/app/components/admin/RegistrationFilters'
import { RejectRegistrationDialog } from '@/app/components/admin/RejectRegistrationDialog'
import { CSVExportModal } from '@/app/components/admin/CSVExportModal'
import { eventApi } from '@/lib/api/events'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, RefreshCw } from 'lucide-react'
import { Link as RouterLink } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'

const Link = RouterLink
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

export default function RegistrationsPage() {
  const { getAdminUsername, isAuthenticated, isChecking } = useAdminAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<any[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [registrations, setRegistrations] = useState<any[]>([])
  const [filteredRegistrations, setFilteredRegistrations] = useState<any[]>([])
  const [selectedRegistration, setSelectedRegistration] = useState<any | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [csvExportModalOpen, setCSVExportModalOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents()
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (selectedEventId) {
      fetchRegistrations()
    }
  }, [selectedEventId])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const eventsData = await eventApi.getAll()
      setEvents(eventsData)
      
      // Auto-select the first event
      if (eventsData.length > 0) {
        setSelectedEventId(eventsData[0]._id)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      toast({
        title: 'Алдаа',
        description: 'Тэмцээнүүдийг ачааллахад алдаа гарлаа',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchRegistrations = async () => {
    if (!selectedEventId) return
    
    try {
      setLoading(true)
      
      // Fetch the selected event with populated organisationId
      const event = await eventApi.getById(selectedEventId)

      // Fetch payments for mapping payment status
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const paymentsResponse = await fetch(`${apiUrl}/api/payments/admin/all`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const payments = paymentsResponse.ok ? await paymentsResponse.json() : []
      const paymentStatusMap = new Map(
        payments.map((p: any) => [String(p._id), p.status])
      )

      const getOrgIdString = (orgId: any): string => {
        if (!orgId) return 'N/A'
        if (typeof orgId === 'string') return orgId
        return orgId.organisationId || orgId._id || String(orgId)
      }

      const paymentsForEvent = payments.filter((p: any) => String(p.eventId?._id || p.eventId) === String(event._id))
      const paymentsByOrg = new Map<string, any[]>()

      paymentsForEvent.forEach((payment: any) => {
        const orgKey = getOrgIdString(payment.organisationId)
        const current = paymentsByOrg.get(orgKey) || []
        current.push(payment)
        paymentsByOrg.set(orgKey, current)
      })

      const paymentDescriptionMap = new Map<string, string>()
      paymentsByOrg.forEach((orgPayments, orgKey) => {
        orgPayments
          .sort((a, b) => new Date(a.submittedAt || a.createdAt || 0).getTime() - new Date(b.submittedAt || b.createdAt || 0).getTime())
          .forEach((payment: any, index: number) => {
            const paymentNumber = String(index + 1).padStart(3, '0')
            paymentDescriptionMap.set(String(payment._id), `${orgKey}-${paymentNumber}`)
          })
      })
      
      // Extract registrations from the event
      // The organisationId should be populated by the backend
      const regs = (event.registrations || []).map((reg: any) => ({
        ...reg,
        eventId: event._id,
        eventName: event.name,
        categoryDisplay: Array.isArray(reg.categories) && reg.categories.length > 0
          ? (reg.categories.length > 1
              ? `${reg.categories.join(', ')} (${reg.categories.length})`
              : reg.categories[0])
          : (reg.category || 'N/A'),
        // Payment status from payment record if linked
        paymentStatus: reg.paymentId
          ? (paymentStatusMap.get(String(reg.paymentId)) || 'not_uploaded')
          : 'not_uploaded',
        paymentDescription: reg.paymentId
          ? (paymentDescriptionMap.get(String(reg.paymentId)) || 'N/A')
          : 'N/A'
      }))
      
      setRegistrations(regs)
      setFilteredRegistrations(regs)
    } catch (error) {
      console.error('Error fetching registrations:', error)
      toast({
        title: 'Алдаа',
        description: 'Бүртгэлүүдийг ачааллахад алдаа гарлаа',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = async (registration: any) => {
    setSelectedRegistration(registration)
    setDetailsDialogOpen(true)
    
    // Fetch payment for this registration
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/api/payments/admin/all`, {
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        const payments = await response.json()
        const payment = registration?.paymentId
          ? payments.find((p: any) => String(p._id) === String(registration.paymentId))
          : null

        setSelectedPayment(payment || null)
      } else {
        console.error('Failed to fetch payments:', response.status)
        setSelectedPayment(null)
      }
    } catch (error) {
      console.error('Error fetching payment:', error)
      setSelectedPayment(null)
    }
  }

  const handleApprove = async (registration: any) => {
    if (!selectedEventId) return

    const registrationId = registration?._id || registration?.id
    if (!registrationId) {
      toast({
        title: 'Алдаа',
        description: 'Бүртгэлийн ID олдсонгүй',
        variant: 'destructive'
      })
      return
    }
    
    try {
      setActionLoading(true)
      await eventApi.approveRegistration(selectedEventId, registrationId)
      
      toast({
        title: 'Амжилттай',
        description: 'Бүртгэлийг зөвшөөрлөө',
      })
      
      setDetailsDialogOpen(false)
      // Refresh registrations
      await fetchRegistrations()
    } catch (error) {
      console.error('Error approving registration:', error)
      toast({
        title: 'Алдаа',
        description: error instanceof Error ? error.message : 'Бүртгэлийг зөвшөөрөхөд алдаа гарлаа',
        variant: 'destructive'
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleRejectClick = (registration: any) => {
    setSelectedRegistration(registration)
    setDetailsDialogOpen(false)
    setRejectDialogOpen(true)
  }

  const handleRejectConfirm = async (rejectionReason: string) => {
    if (!selectedEventId || !selectedRegistration) return

    const registrationId = selectedRegistration?._id || selectedRegistration?.id
    if (!registrationId) {
      toast({
        title: 'Алдаа',
        description: 'Бүртгэлийн ID олдсонгүй',
        variant: 'destructive'
      })
      return
    }
    
    try {
      setActionLoading(true)
      await eventApi.rejectRegistration(selectedEventId, registrationId, rejectionReason)
      
      toast({
        title: 'Амжилттай',
        description: 'Бүртгэлийг татгалзлаа',
      })
      
      setRejectDialogOpen(false)
      setSelectedRegistration(null)
      // Refresh registrations
      await fetchRegistrations()
    } catch (error) {
      console.error('Error rejecting registration:', error)
      toast({
        title: 'Алдаа',
        description: error instanceof Error ? error.message : 'Бүртгэлийг татгалзахад алдаа гарлаа',
        variant: 'destructive'
      })
    } finally {
      setActionLoading(false)
    }
  }

  const exportToCSV = () => {
    if (filteredRegistrations.length === 0) {
      toast({
        title: 'Мэдээлэл',
        description: 'Экспорт хийх бүртгэл олдсонгүй',
        variant: 'default'
      })
      return
    }
    setCSVExportModalOpen(true)
  }

  // Get unique categories from selected event
  const categories = selectedEventId && events.length > 0
    ? (() => {
        const event = events.find(e => e._id === selectedEventId)
        return event?.categories?.map((c: any) => c.name) || []
      })()
    : []

  if (isChecking) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto'></div>
          <p className='mt-4 text-muted-foreground'>Ачааллаж байна...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const selectedEvent = events.find(e => e._id === selectedEventId)

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <div className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Link to='/admin/dashboard'>
              <Button variant='ghost' size='sm'>
                <ArrowLeft size={20} className='mr-2' />
                Буцах
              </Button>
            </Link>
            <div>
              <h1 className='text-2xl font-bold'>Бүртгэлүүд</h1>
              <p className='text-sm text-muted-foreground'>
                Админ: {getAdminUsername()}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={fetchRegistrations}
              disabled={loading}
            >
              <RefreshCw size={16} className='mr-2' />
              Дахин ачаалах
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={exportToCSV}
              disabled={filteredRegistrations.length === 0}
            >
              <Download size={16} className='mr-2' />
              CSV экспорт
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto px-4 py-6'>
        {/* Event Selector */}
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
          <>
            {/* Filters */}
            <RegistrationFilters
              registrations={registrations}
              categories={categories}
              onFilteredResults={setFilteredRegistrations}
            />

            {/* Table */}
            <RegistrationsTable
              registrations={filteredRegistrations}
              onViewDetails={handleViewDetails}
            />
          </>
        ) : (
          <div className='text-center py-12 text-muted-foreground'>
            <p>Тэмцээн сонгоно уу</p>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <RegistrationDetailsDialog
        registration={selectedRegistration}
        payment={selectedPayment}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        onApprove={handleApprove}
        onReject={handleRejectClick}
      />
      
      <RejectRegistrationDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        onConfirm={handleRejectConfirm}
        isLoading={actionLoading}
        organisationName={
          selectedRegistration?.organisationId?.typeDetail || 'N/A'
        }
      />

      <CSVExportModal
        open={csvExportModalOpen}
        onOpenChange={setCSVExportModalOpen}
        registrations={filteredRegistrations}
        eventId={selectedEventId}
      />
    </div>
  )
}
