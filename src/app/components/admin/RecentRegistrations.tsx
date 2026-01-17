'use client'

import CardBox from '@/app/components/shared/CardBox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { mn } from 'date-fns/locale'

interface RecentRegistrationsProps {
  registrations: any[]
  limit?: number
}

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

export const RecentRegistrations = ({ registrations, limit = 5 }: RecentRegistrationsProps) => {
  const recentRegs = registrations.slice(0, limit)

  if (registrations.length === 0) {
    return (
      <CardBox>
        <div className='mb-6'>
          <h5 className='card-title text-lg font-semibold'>Сүүлийн бүртгэлүүд</h5>
          <p className='text-sm text-muted-foreground font-normal'>
            Хамгийн сүүлд бүртгүүлсэн багууд
          </p>
        </div>
        <div className='text-center py-8 text-muted-foreground'>
          Одоогоор бүртгэл байхгүй байна
        </div>
      </CardBox>
    )
  }

  return (
    <CardBox>
      <div className='mb-6'>
        <h5 className='card-title text-lg font-semibold'>Сүүлийн бүртгэлүүд</h5>
        <p className='text-sm text-muted-foreground font-normal'>
          Хамгийн сүүлд бүртгүүлсэн багууд
        </p>
      </div>

      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-sm font-semibold'>Дугаар</TableHead>
              <TableHead className='text-sm font-semibold'>Баг</TableHead>
              <TableHead className='text-sm font-semibold'>Төрөл</TableHead>
              <TableHead className='text-sm font-semibold'>Тоо</TableHead>
              <TableHead className='text-sm font-semibold'>Огноо</TableHead>
              <TableHead className='text-sm font-semibold'>Төлөв</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentRegs.map((reg: any) => (
              <TableRow key={reg._id} className='hover:bg-muted/50'>
                <TableCell className='font-medium'>{reg._id?.slice(-6) || 'N/A'}</TableCell>
                <TableCell>{reg.organisationId?.organisationId || reg.organisationId || 'Unknown'}</TableCell>
                <TableCell className='text-sm'>{reg.category || 'N/A'}</TableCell>
                <TableCell className='text-sm'>{reg.contestantIds?.length || 0}</TableCell>
                <TableCell className='text-sm'>
                  {formatDistanceToNow(new Date(reg.registeredAt), { 
                    addSuffix: true,
                    locale: mn 
                  })}
                </TableCell>
                <TableCell>{getStatusBadge(reg.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CardBox>
  )
}
