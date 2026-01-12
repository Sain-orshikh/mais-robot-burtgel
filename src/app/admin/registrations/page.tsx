'use client'

import { useState } from 'react'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { ThemeToggle } from '@/app/components/shared/ThemeToggle'
import { RegistrationsTable } from '@/app/components/admin/RegistrationsTable'
import { RegistrationDetailsDialog } from '@/app/components/admin/RegistrationDetailsDialog'
import { RejectDialog } from '@/app/components/admin/RejectDialog'
import { EditRegistrationDialog } from '@/app/components/admin/EditRegistrationDialog'
import { RegistrationFilters } from '@/app/components/admin/RegistrationFilters'
import { mockRegistrations } from '@/data/mockRegistrations'
import { addAuditLogEntry } from '@/data/auditLog'
import type { Registration } from '@/data/mockRegistrations'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, FileText } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

export default function RegistrationsPage() {
  const { getAdminUsername, isAuthenticated, isChecking } = useAdminAuth()
  const { toast } = useToast()

  const [registrations, setRegistrations] = useState<Registration[]>(mockRegistrations)
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>(mockRegistrations)
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

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

  const handleViewDetails = (registration: Registration) => {
    setSelectedRegistration(registration)
    setDetailsDialogOpen(true)
  }

  const handleApprove = (registration: Registration) => {
    setRegistrations((prev) =>
      prev.map((reg) =>
        reg.id === registration.id ? { ...reg, status: 'approved' as const } : reg
      )
    )

    // Log the action
    addAuditLogEntry({
      adminUsername: getAdminUsername(),
      registrationId: registration.id,
      registrationNumber: registration.registrationNumber,
      teamName: registration.teamName,
      action: 'approve',
      changes: ['Төлөв: Хүлээгдэж буй → Зөвшөөрсөн'],
    })

    toast({
      title: 'Амжилттай',
      description: `${registration.teamName} багийн бүртгэлийг зөвшөөрлөө`,
    })
  }

  const handleReject = (registration: Registration, reason: string) => {
    setRegistrations((prev) =>
      prev.map((reg) =>
        reg.id === registration.id
          ? { ...reg, status: 'rejected' as const, rejectionReason: reason || undefined }
          : reg
      )
    )

    // Log the action
    addAuditLogEntry({
      adminUsername: getAdminUsername(),
      registrationId: registration.id,
      registrationNumber: registration.registrationNumber,
      teamName: registration.teamName,
      action: 'reject',
      changes: ['Төлөв: Хүлээгдэж буй → Татгалзсан'],
      reason: reason || undefined,
    })

    toast({
      title: 'Татгалзсан',
      description: `${registration.teamName} багийн бүртгэлийг татгалзлаа`,
      variant: 'destructive',
    })
  }

  const handleEdit = (registration: Registration) => {
    setSelectedRegistration(registration)
    setEditDialogOpen(true)
  }

  const handleEditConfirm = (updatedRegistration: Registration, changes: string[]) => {
    setRegistrations((prev) =>
      prev.map((reg) => (reg.id === updatedRegistration.id ? updatedRegistration : reg))
    )

    // Log the edit
    addAuditLogEntry({
      adminUsername: getAdminUsername(),
      registrationId: updatedRegistration.id,
      registrationNumber: updatedRegistration.registrationNumber,
      teamName: updatedRegistration.teamName,
      action: 'edit',
      changes,
    })

    toast({
      title: 'Амжилттай хадгаллаа',
      description: 'Өөрчлөлтүүд audit log-д бүртгэгдлээ',
    })
  }

  const handleExportCSV = () => {
    // Simple CSV export - use filtered registrations
    const headers = ['Дугаар', 'Баг', 'Сургууль', 'Төрөл', 'Огноо', 'Төлбөр', 'Төлөв']
    const rows = filteredRegistrations.map((reg) => [
      reg.registrationNumber,
      reg.teamName,
      reg.schoolName,
      reg.category,
      new Date(reg.registrationDate).toLocaleDateString(),
      reg.paymentStatus,
      reg.status,
    ])

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`
    link.click()

    toast({
      title: 'Амжилттай',
      description: `${filteredRegistrations.length} бүртгэлийг CSV файл руу хадгаллаа`,
    })
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='bg-card border-b border-border sticky top-0 z-10 shadow-sm'>
        <div className='container mx-auto px-6 py-4'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-4'>
              <Button variant='ghost' size='sm' asChild>
                <Link href='/admin/dashboard'>
                  <ArrowLeft size={18} />
                </Link>
              </Button>
              <div>
                <h1 className='text-2xl font-bold text-foreground'>Бүртгэлүүд</h1>
                <p className='text-sm text-muted-foreground'>
                  {registrations.length} бүртгэл
                </p>
              </div>
            </div>
            <div className='flex gap-2 items-center'>
              <ThemeToggle />
              <Button variant='outline' size='sm' asChild>
                <Link href='/admin/audit-log' className='gap-2'>
                  <FileText size={16} />
                  Audit Log
                </Link>
              </Button>
              <Button variant='outline' size='sm' onClick={handleExportCSV} className='gap-2'>
                <Download size={16} />
                CSV татах
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='container mx-auto px-6 py-8'>
        {/* Filters */}
        <RegistrationFilters
          registrations={registrations}
          onFilteredResults={setFilteredRegistrations}
        />

        {/* Table */}
        <RegistrationsTable
          registrations={filteredRegistrations}
          onViewDetails={handleViewDetails}
          onApprove={handleApprove}
          onReject={(reg) => {
            setSelectedRegistration(reg)
            setRejectDialogOpen(true)
          }}
          onEdit={handleEdit}
        />
      </main>

      {/* Dialogs */}
      <RegistrationDetailsDialog
        registration={selectedRegistration}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        onApprove={handleApprove}
        onReject={(reg) => {
          setSelectedRegistration(reg)
          setDetailsDialogOpen(false)
          setRejectDialogOpen(true)
        }}
      />

      <RejectDialog
        registration={selectedRegistration}
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        onConfirm={handleReject}
      />

      <EditRegistrationDialog
        registration={selectedRegistration}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onConfirm={handleEditConfirm}
        adminUsername={getAdminUsername()}
      />
    </div>
  )
}
