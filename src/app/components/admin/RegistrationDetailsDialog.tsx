'use client'

import { useState, useEffect } from 'react'
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
import { format } from 'date-fns'
import { Users, Building2, Calendar, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react'

interface RegistrationDetailsDialogProps {
  registration: any | null
  payment?: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove?: (registration: any) => void
  onReject?: (registration: any) => void
}

export const RegistrationDetailsDialog = ({
  registration,
  payment,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: RegistrationDetailsDialogProps) => {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  
  // Reset image states when dialog opens or payment changes
  useEffect(() => {
    if (open && payment?.receiptUrl) {
      setImageLoading(true)
      setImageError(false)
    }
  }, [open, payment?.receiptUrl])
  
  if (!registration) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className='bg-success text-white flex items-center gap-1'>
            <CheckCircle size={14} />
            Зөвшөөрсөн
          </Badge>
        )
      case 'rejected':
        return (
          <Badge className='bg-error text-white flex items-center gap-1'>
            <XCircle size={14} />
            Татгалзсан
          </Badge>
        )
      case 'pending':
      default:
        return (
          <Badge className='bg-warning text-white flex items-center gap-1'>
            <Clock size={14} />
            Хүлээгдэж буй
          </Badge>
        )
    }
  }

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className='bg-success text-white'>Баталгаажсан</Badge>
      case 'pending':
        return <Badge className='bg-info text-white'>Хүлээгдэж буй</Badge>
      case 'not_uploaded':
      default:
        return <Badge variant='outline'>Төлөөгүй</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; color: string }> = {
      company: { label: 'Компани', color: 'bg-blue-500' },
      school: { label: 'Сургууль', color: 'bg-green-500' },
      individual: { label: 'Хувь хүн', color: 'bg-purple-500' },
    }
    const typeInfo = typeMap[type] || { label: type, color: 'bg-gray-500' }
    return <Badge className={`${typeInfo.color} text-white`}>{typeInfo.label}</Badge>
  }

  // Helper functions
  const getOrgIdString = (orgId: any): string => {
    if (!orgId) return 'N/A'
    if (typeof orgId === 'string') return orgId
    // Prioritize organisationId field (MN00001 format) over MongoDB _id
    return orgId.organisationId || orgId._id || String(orgId)
  }

  const getOrgName = (orgId: any): string => {
    if (!orgId || typeof orgId !== 'object') return 'N/A'
    return orgId.typeDetail || 'N/A'
  }

  const getOrgType = (orgId: any): string => {
    if (!orgId || typeof orgId !== 'object') return 'N/A'
    return orgId.type || 'N/A'
  }

  const getOrgContact = (orgId: any) => {
    if (!orgId || typeof orgId !== 'object') return { name: 'N/A', phone: 'N/A', email: 'N/A' }
    return {
      name: `${orgId.ovog || ''} ${orgId.ner || ''}`.trim() || 'N/A',
      phone: orgId.phoneNumber || 'N/A',
      email: orgId.email || 'N/A'
    }
  }

  const contact = getOrgContact(registration.organisationId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>Бүртгэлийн дэлгэрэнгүй</DialogTitle>
          <DialogDescription>
            ID: {registration._id ? registration._id.slice(-8) : 'N/A'}
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
              {getPaymentBadge(registration.paymentStatus || 'not_uploaded')}
            </div>
          </div>

          <Separator />

          {/* Organisation Information */}
          <div>
            <h3 className='font-semibold text-lg mb-3 flex items-center gap-2'>
              <Building2 size={20} />
              Байгууллагын мэдээлэл
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Байгууллагын ID</p>
                <p className='font-mono text-sm font-medium'>{getOrgIdString(registration.organisationId)}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Төрөл</p>
                <div className='mt-1'>{getTypeBadge(getOrgType(registration.organisationId))}</div>
              </div>
              <div className='col-span-2'>
                <p className='text-sm text-muted-foreground'>Байгууллагын нэр</p>
                <p className='font-medium'>{getOrgName(registration.organisationId)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h3 className='font-semibold text-lg mb-3'>Холбоо барих мэдээлэл</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Нэр</p>
                <p className='font-medium'>{contact.name}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Утас</p>
                <p className='font-medium'>{contact.phone}</p>
              </div>
              <div className='col-span-2'>
                <p className='text-sm text-muted-foreground'>Имэйл</p>
                <p className='font-medium'>{contact.email}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Competition Details */}
          <div>
            <h3 className='font-semibold text-lg mb-3'>Тэмцээний мэдээлэл</h3>
            <div className='space-y-3'>
              <div>
                <p className='text-sm text-muted-foreground'>Категори</p>
                <p className='p-3 bg-primary/10 rounded font-medium mt-1'>{registration.category || 'N/A'}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Тэмцээн</p>
                <p className='font-medium'>{registration.eventName || 'N/A'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Team Members */}
          <div>
            <h3 className='font-semibold text-lg mb-3 flex items-center gap-2'>
              <Users size={20} />
              Оролцогчид ({registration.contestantIds?.length || 0})
            </h3>
            <div className='space-y-2'>
              {registration.contestantIds && registration.contestantIds.length > 0 ? (
                registration.contestantIds.map((contestant: any, index: number) => {
                  // Handle both populated (object) and unpopulated (string) contestant IDs
                  const contestantName = typeof contestant === 'object' && contestant !== null
                    ? `${contestant.ovog || ''} ${contestant.ner || ''}`.trim() || contestant._id
                    : contestant
                  const contestantKey = typeof contestant === 'object' && contestant !== null
                    ? contestant._id || index
                    : contestant || index
                    
                  return (
                    <div key={contestantKey} className='flex items-center gap-2 p-2 bg-muted rounded'>
                      <span className='font-medium'>{index + 1}.</span>
                      <span className='text-sm'>{contestantName}</span>
                    </div>
                  )
                })
              ) : (
                <p className='text-sm text-muted-foreground'>Оролцогч бүртгээгүй байна</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Coach Information */}
          {registration.coachId && (
            <>
              <div>
                <h3 className='font-semibold text-lg mb-3'>Багш</h3>
                <p className='p-3 bg-muted rounded text-sm'>
                  {typeof registration.coachId === 'object' && registration.coachId !== null
                    ? `${registration.coachId.ovog || ''} ${registration.coachId.ner || ''}`.trim() || registration.coachId._id || 'N/A'
                    : registration.coachId}
                </p>
              </div>
              <Separator />
            </>
          )}

          {/* Payment Receipt */}
          {payment && payment.receiptUrl && (
            <>
              <div>
                <h3 className='font-semibold text-lg mb-3'>Төлбөрийн баримт</h3>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-muted-foreground'>Төлөв:</span>
                    {getPaymentBadge(payment.status || 'pending')}
                  </div>
                  {payment.amount && (
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-muted-foreground'>Дүн:</span>
                      <span className='font-medium'>{payment.amount.toLocaleString()}₮</span>
                    </div>
                  )}
                  <div className='mt-3 space-y-2'>
                    <div className='text-xs text-muted-foreground break-all p-2 bg-muted rounded'>
                      <strong>URL:</strong> {payment.receiptUrl}
                    </div>
                    <div className='border rounded-lg overflow-hidden bg-muted relative'>
                      {imageLoading && !imageError && (
                        <div className='absolute inset-0 flex items-center justify-center bg-muted'>
                          <Loader2 className='h-8 w-8 animate-spin text-primary' />
                        </div>
                      )}
                      {imageError ? (
                        <div className='flex flex-col items-center justify-center py-12 px-4 text-center'>
                          <XCircle className='h-12 w-12 text-error mb-3' />
                          <p className='text-sm text-muted-foreground mb-2'>Зураг ачаалагдсангүй</p>
                          <p className='text-xs text-muted-foreground'>URL шалгана уу</p>
                        </div>
                      ) : (
                        <img 
                          src={payment.receiptUrl} 
                          alt='Payment receipt from Cloudinary' 
                          className='w-full h-auto max-h-[500px] object-contain'
                          onLoad={() => setImageLoading(false)}
                          onError={() => {
                            setImageLoading(false)
                            setImageError(true)
                          }}
                          style={{ display: imageLoading ? 'none' : 'block' }}
                        />
                      )}
                    </div>
                  </div>
                  <Button 
                    variant='outline' 
                    size='sm' 
                    className='w-full'
                    onClick={() => window.open(payment.receiptUrl, '_blank')}
                  >
                    Баримтыг шинэ цонхонд нээх
                  </Button>
                </div>
              </div>
              <Separator />
            </>
          )}

          {!payment && (
            <>
              <div>
                <h3 className='font-semibold text-lg mb-3'>Төлбөрийн баримт</h3>
                <p className='text-sm text-muted-foreground p-4 bg-muted rounded'>Төлбөрийн мэдээлэл олдсонгүй</p>
              </div>
              <Separator />
            </>
          )}

          {/* Registration Date */}
          <div>
            <h3 className='font-semibold text-lg mb-3 flex items-center gap-2'>
              <Calendar size={20} />
              Бүртгүүлсэн огноо
            </h3>
            <p className='font-medium'>
              {registration.registeredAt 
                ? format(new Date(registration.registeredAt), 'yyyy-MM-dd HH:mm:ss')
                : 'N/A'}
            </p>
          </div>

          {/* Action Buttons */}
          {registration.status === 'pending' && (
            <>
              <Separator />
              <div className='flex gap-3 pt-4'>
                <Button
                  className='flex-1 bg-success hover:bg-success/90'
                  onClick={() => {
                    onApprove?.(registration)
                    onOpenChange(false)
                  }}
                >
                  <CheckCircle size={18} className='mr-2' />
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
                  <XCircle size={18} className='mr-2' />
                  Татгалзах
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
