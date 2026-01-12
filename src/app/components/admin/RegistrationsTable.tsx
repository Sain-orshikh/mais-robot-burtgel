'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, CheckCircle, XCircle, Edit } from 'lucide-react'
import type { Registration, RegistrationStatus } from '@/data/mockRegistrations'
import { format } from 'date-fns'

interface RegistrationsTableProps {
  registrations: Registration[]
  onViewDetails: (registration: Registration) => void
  onApprove: (registration: Registration) => void
  onReject: (registration: Registration) => void
  onEdit: (registration: Registration) => void
}

const getStatusBadge = (status: RegistrationStatus) => {
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

export const RegistrationsTable = ({
  registrations,
  onViewDetails,
  onApprove,
  onReject,
  onEdit,
}: RegistrationsTableProps) => {
  return (
    <div className='space-y-4'>
      {/* Table */}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дугаар</TableHead>
              <TableHead>Багийн нэр</TableHead>
              <TableHead>Сургууль</TableHead>
              <TableHead>Төрөл</TableHead>
              <TableHead>Огноо</TableHead>
              <TableHead>Төлбөр</TableHead>
              <TableHead>Төлөв</TableHead>
              <TableHead className='text-right'>Үйлдэл</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className='text-center py-8 text-muted-foreground'>
                  Бүртгэл олдсонгүй
                </TableCell>
              </TableRow>
            ) : (
              registrations.map((reg) => (
                <TableRow key={reg.id}>
                  <TableCell className='font-medium'>{reg.registrationNumber}</TableCell>
                  <TableCell>{reg.teamName}</TableCell>
                  <TableCell className='max-w-[200px] truncate'>{reg.schoolName}</TableCell>
                  <TableCell className='text-sm max-w-[150px] truncate'>{reg.category}</TableCell>
                  <TableCell className='text-sm'>
                    {format(new Date(reg.registrationDate), 'MM/dd HH:mm')}
                  </TableCell>
                  <TableCell>{getPaymentBadge(reg.paymentStatus)}</TableCell>
                  <TableCell>{getStatusBadge(reg.status)}</TableCell>
                  <TableCell>
                    <div className='flex justify-end gap-2'>
                      <Button
                        size='sm'
                        variant='ghost'
                        onClick={() => onViewDetails(reg)}
                        title='Дэлгэрэнгүй'
                      >
                        <Eye size={16} />
                      </Button>
                      {reg.status === 'pending' && (
                        <>
                          <Button
                            size='sm'
                            variant='ghost'
                            className='text-success hover:text-success'
                            onClick={() => onApprove(reg)}
                            title='Зөвшөөрөх'
                          >
                            <CheckCircle size={16} />
                          </Button>
                          <Button
                            size='sm'
                            variant='ghost'
                            className='text-error hover:text-error'
                            onClick={() => onReject(reg)}
                            title='Татгалзах'
                          >
                            <XCircle size={16} />
                          </Button>
                        </>
                      )}
                      <Button
                        size='sm'
                        variant='ghost'
                        onClick={() => onEdit(reg)}
                        title='Засах'
                      >
                        <Edit size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
