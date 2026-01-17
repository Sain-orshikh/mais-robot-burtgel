'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { format } from 'date-fns'

interface RegistrationsTableProps {
  registrations: any[]
  onViewDetails: (registration: any) => void
}

export const RegistrationsTable = ({ registrations, onViewDetails }: RegistrationsTableProps) => {
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

  // Helper to extract org ID string
  // Helper to extract org ID string
  const getOrgIdString = (orgId: any): string => {
    if (!orgId) return 'N/A'
    if (typeof orgId === 'string') return orgId
    // Prioritize organisationId field (MN00001 format) over MongoDB _id
    return orgId.organisationId || orgId._id || String(orgId)
  }

  // Helper to get org name from populated data
  const getOrgName = (orgId: any): string => {
    if (!orgId) return 'N/A'
    if (typeof orgId === 'object' && orgId.typeDetail) {
      return orgId.typeDetail
    }
    return 'N/A'
  }

  // Helper to get org type
  const getOrgType = (orgId: any): string => {
    if (!orgId) return 'N/A'
    if (typeof orgId === 'object' && orgId.type) {
      return orgId.type
    }
    return 'N/A'
  }

  // Helper to get aimag
  const getAimag = (orgId: any): string => {
    if (!orgId) return 'N/A'
    if (typeof orgId === 'object' && orgId.aimag) {
      return orgId.aimag
    }
    return 'N/A'
  }

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>Org ID</TableHead>
            <TableHead className='w-[150px]'>Байгууллага</TableHead>
            <TableHead className='w-[100px]'>Төрөл</TableHead>
            <TableHead className='w-[120px]'>Аймаг</TableHead>
            <TableHead className='w-[200px]'>Категори</TableHead>
            <TableHead className='w-[120px]'>Огноо</TableHead>
            <TableHead className='w-[120px]'>Төлбөр</TableHead>
            <TableHead className='w-[120px]'>Төлөв</TableHead>
            <TableHead className='text-right w-[80px]'>Үйлдэл</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className='text-center py-8 text-muted-foreground'>
                Бүртгэл олдсонгүй
              </TableCell>
            </TableRow>
          ) : (
            registrations.map((reg) => (
              <TableRow key={reg._id}>
                <TableCell className='font-mono text-xs font-medium'>
                  {getOrgIdString(reg.organisationId)}
                </TableCell>
                <TableCell className='max-w-[150px] truncate font-medium'>
                  {getOrgName(reg.organisationId)}
                </TableCell>
                <TableCell>
                  {getTypeBadge(getOrgType(reg.organisationId))}
                </TableCell>
                <TableCell className='text-sm'>
                  {getAimag(reg.organisationId)}
                </TableCell>
                <TableCell className='text-sm max-w-[200px] truncate'>
                  {reg.category || 'N/A'}
                </TableCell>
                <TableCell className='text-sm'>
                  {reg.registeredAt ? format(new Date(reg.registeredAt), 'MM/dd HH:mm') : 'N/A'}
                </TableCell>
                <TableCell>
                  {getPaymentBadge(reg.paymentStatus || 'not_uploaded')}
                </TableCell>
                <TableCell>
                  {getStatusBadge(reg.status)}
                </TableCell>
                <TableCell>
                  <div className='flex justify-end gap-2'>
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => onViewDetails(reg)}
                    >
                      <Eye className='h-4 w-4' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
