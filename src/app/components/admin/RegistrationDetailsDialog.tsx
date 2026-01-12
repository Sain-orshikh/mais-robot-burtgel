'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { Registration } from '@/data/mockRegistrations'
import { format } from 'date-fns'
import { Users, School, MapPin, Calendar, Receipt, Phone, Mail, AlertTriangle } from 'lucide-react'

interface RegistrationDetailsDialogProps {
  registration: Registration | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove?: (registration: Registration) => void
  onReject?: (registration: Registration) => void
}

export const RegistrationDetailsDialog = ({
  registration,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: RegistrationDetailsDialogProps) => {
  if (!registration) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className='bg-success text-white'>Зөвшөөрсөн</Badge>
      case 'rejected':
        return <Badge className='bg-error text-white'>Татгалзсан</Badge>
      case 'pending':
      default:
        return <Badge className='bg-warning text-white'>Хүлээгдэж буй</Badge>
    }
  }

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className='bg-success text-white'>Баталгаажсан</Badge>
      case 'uploaded':
        return <Badge className='bg-info text-white'>Хүлээгдэж буй</Badge>
      case 'not_uploaded':
      default:
        return <Badge variant='outline'>Оруулаагүй</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>Бүртгэлийн дэлгэрэнгүй</DialogTitle>
          <DialogDescription>
            {registration.registrationNumber} - {registration.teamName}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          {/* Status Section */}
          <div className='flex items-center gap-4'>
            <div>
              <p className='text-sm text-muted-foreground mb-1'>Төлөв</p>
              {getStatusBadge(registration.status)}
            </div>
            <div>
              <p className='text-sm text-muted-foreground mb-1'>Төлбөр</p>
              {getPaymentBadge(registration.paymentStatus)}
            </div>
          </div>

          <Separator />

          {/* Team Information */}
          <div>
            <h3 className='font-semibold text-lg mb-3 flex items-center gap-2'>
              <Users size={20} />
              Багийн мэдээлэл
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Багийн нэр</p>
                <p className='font-medium'>{registration.teamName}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Багийн хэмжээ</p>
                <p className='font-medium'>{registration.teamSize} хүн</p>
              </div>
            </div>

            <div className='mt-4'>
              <p className='text-sm text-muted-foreground mb-2'>Багийн гишүүд</p>
              <div className='space-y-2'>
                {registration.teamMembers.map((member, index) => (
                  <div key={index} className='flex items-center gap-2 p-2 bg-muted rounded'>
                    <span className='font-medium'>{index + 1}.</span>
                    <span>{member.name}</span>
                    {member.grade && (
                      <Badge variant='outline' className='ml-auto'>
                        {member.grade} анги
                      </Badge>
                    )}
                    {member.role && (
                      <Badge variant='secondary'>{member.role}</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* School Information */}
          <div>
            <h3 className='font-semibold text-lg mb-3 flex items-center gap-2'>
              <School size={20} />
              Сургуулийн мэдээлэл
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Сургуулийн нэр</p>
                <p className='font-medium'>{registration.schoolName}</p>
              </div>
              <div className='flex items-center gap-2'>
                <MapPin size={16} className='text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Байршил</p>
                  <p className='font-medium'>{registration.location}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Competition Category */}
          <div>
            <h3 className='font-semibold text-lg mb-3'>Тэмцээний төрөл</h3>
            <p className='p-3 bg-primary/10 rounded font-medium'>{registration.category}</p>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h3 className='font-semibold text-lg mb-3'>Холбоо барих мэдээлэл</h3>
            <div className='space-y-3'>
              <div>
                <p className='text-sm text-muted-foreground mb-1'>Хариуцагч</p>
                <p className='font-medium'>{registration.contactPerson.name}</p>
                <div className='flex items-center gap-4 mt-2 text-sm'>
                  <div className='flex items-center gap-1'>
                    <Phone size={14} />
                    {registration.contactPerson.phone}
                  </div>
                  <div className='flex items-center gap-1'>
                    <Mail size={14} />
                    {registration.contactPerson.email}
                  </div>
                </div>
              </div>

              <div>
                <p className='text-sm text-muted-foreground mb-1'>Яаралтай тохиолдлын холбоо барих</p>
                <p className='font-medium'>{registration.emergencyContact.name}</p>
                <div className='flex items-center gap-4 mt-2 text-sm'>
                  <div className='flex items-center gap-1'>
                    <Phone size={14} />
                    {registration.emergencyContact.phone}
                  </div>
                  <Badge variant='outline'>{registration.emergencyContact.relationship}</Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          <div>
            <h3 className='font-semibold text-lg mb-3 flex items-center gap-2'>
              <Receipt size={20} />
              Төлбөрийн мэдээлэл
            </h3>
            <div className='space-y-2'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-muted-foreground'>Төлбөрийн төлөв</span>
                {getPaymentBadge(registration.paymentStatus)}
              </div>
              {registration.paymentReceipt && (
                <div>
                  <p className='text-sm text-muted-foreground mb-2'>Төлбөрийн баримт</p>
                  <Button variant='outline' size='sm' asChild>
                    <a href={registration.paymentReceipt} target='_blank' rel='noopener noreferrer'>
                      Баримт харах
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Registration Date */}
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <Calendar size={16} />
            Бүртгүүлсэн огноо: {format(new Date(registration.registrationDate), 'yyyy-MM-dd HH:mm')}
          </div>

          {/* Rejection Reason */}
          {registration.status === 'rejected' && registration.rejectionReason && (
            <div className='p-4 bg-error/10 border border-error/20 rounded'>
              <div className='flex items-start gap-2'>
                <AlertTriangle size={20} className='text-error mt-0.5' />
                <div>
                  <p className='font-semibold text-error mb-1'>Татгалзсан шалтгаан</p>
                  <p className='text-sm'>{registration.rejectionReason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {registration.status === 'pending' && (
            <div className='flex gap-3 pt-4'>
              <Button
                className='flex-1 bg-success hover:bg-success/90'
                onClick={() => {
                  onApprove?.(registration)
                  onOpenChange(false)
                }}
              >
                Зөвшөөрөх
              </Button>
              <Button
                className='flex-1'
                variant='destructive'
                onClick={() => {
                  onReject?.(registration)
                  onOpenChange(false)
                }}
              >
                Татгалзах
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
