'use client'

import { useState, useEffect } from 'react'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { ThemeToggle } from '@/app/components/shared/ThemeToggle'
import { RegistrationsTable } from '@/app/components/admin/RegistrationsTable'
import { RegistrationDetailsDialog } from '@/app/components/admin/RegistrationDetailsDialog'
import { RegistrationFilters } from '@/app/components/admin/RegistrationFilters'
import { eventApi } from '@/lib/api/events'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
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
      
      // Extract registrations from the event
      // The organisationId should be populated by the backend
      const regs = (event.registrations || []).map((reg: any) => ({
        ...reg,
        eventId: event._id,
        eventName: event.name,
        // Calculate payment status from event's payment data if needed
        paymentStatus: reg.paymentStatus || 'not_uploaded'
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/api/payments/admin/all`, {
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        const payments = await response.json()
        
        // Extract the org ID (handle both string and populated object)
        const orgId = registration.organisationId?._id || registration.organisationId
        const orgIdStr = typeof orgId === 'string' ? orgId : String(orgId)
        
        console.log('Looking for payment:', {
          orgId: orgIdStr,
          eventId: selectedEventId,
          totalPayments: payments.length
        })
        
        // Find payment matching this registration's organisation and event
        const payment = payments.find((p: any) => {
          // Handle populated organisationId and eventId
          const pOrgId = typeof p.organisationId === 'object' ? p.organisationId._id : p.organisationId
          const pEventId = typeof p.eventId === 'object' ? p.eventId._id : p.eventId
          
          const pOrgIdStr = typeof pOrgId === 'string' ? pOrgId : String(pOrgId)
          const pEventIdStr = typeof pEventId === 'string' ? pEventId : String(pEventId)
          
          const match = pOrgIdStr === orgIdStr && pEventIdStr === selectedEventId
          
          if (match) {
            console.log('Found matching payment:', p)
          }
          
          return match
        })
        
        console.log('Selected payment:', payment || 'No payment found')
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
    try {
      // TODO: Implement API call to approve registration
      // await eventApi.updateRegistrationStatus(selectedEventId, registration._id, 'approved')
      
      toast({
        title: 'Амжилттай',
        description: 'Бүртгэлийг зөвшөөрлөө',
      })
      
      // Refresh registrations
      await fetchRegistrations()
    } catch (error) {
      console.error('Error approving registration:', error)
      toast({
        title: 'Алдаа',
        description: 'Бүртгэлийг зөвшөөрөхөд алдаа гарлаа',
        variant: 'destructive'
      })
    }
  }

  const handleReject = async (registration: any, reason: string) => {
    try {
      // TODO: Implement API call to reject registration
      // await eventApi.updateRegistrationStatus(selectedEventId, registration._id, 'rejected', reason)
      
      toast({
        title: 'Амжилттай',
        description: 'Бүртгэлийг татгалзлаа',
      })
      
      // Refresh registrations
      await fetchRegistrations()
    } catch (error) {
      console.error('Error rejecting registration:', error)
      toast({
        title: 'Алдаа',
        description: 'Бүртгэлийг татгалзахад алдаа гарлаа',
        variant: 'destructive'
      })
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

    // CSV header
    const headers = ['Org ID', 'Байгууллага', 'Төрөл', 'Аймаг', 'Категори', 'Огноо', 'Төлбөр', 'Төлөв']
    
    // CSV rows
    const rows = filteredRegistrations.map(reg => {
      const orgId = reg.organisationId 
        ? (typeof reg.organisationId === 'string' 
            ? reg.organisationId 
            : reg.organisationId.organisationId || reg.organisationId._id || '')
        : ''
      const orgName = reg.organisationId && typeof reg.organisationId === 'object'
        ? reg.organisationId.typeDetail || ''
        : ''
      const orgType = reg.organisationId && typeof reg.organisationId === 'object'
        ? reg.organisationId.type || ''
        : ''
      const aimag = reg.organisationId && typeof reg.organisationId === 'object'
        ? reg.organisationId.aimag || ''
        : ''
      
      return [
        orgId,
        orgName,
        orgType,
        aimag,
        reg.category || '',
        reg.registeredAt || '',
        reg.paymentStatus || 'not_uploaded',
        reg.status || 'pending'
      ]
    })

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `registrations_${selectedEventId}_${Date.now()}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: 'Амжилттай',
      description: 'Бүртгэлүүдийг CSV файл руу экспорт хийлээ',
    })
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
      <div className='border-b bg-card'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Link href='/admin/dashboard'>
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
              <Button variant='outline' size='sm' onClick={fetchRegistrations} disabled={loading}>
                <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                Шинэчлэх
              </Button>
              <Button variant='outline' size='sm' onClick={exportToCSV}>
                <Download size={16} className='mr-2' />
                CSV татах
              </Button>
              <ThemeToggle />
            </div>
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
        onReject={(reg) => handleReject(reg, 'Шалтгаан оруулаагүй')}
      />
    </div>
  )
}
