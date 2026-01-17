'use client'

import CardBox from '@/app/components/shared/CardBox'
import { RegistrationsTable } from '@/app/components/admin/RegistrationsTable'

interface RecentRegistrationsProps {
  registrations: any[]
  limit?: number
  onViewDetails?: (registration: any) => void
}

export const RecentRegistrations = ({
  registrations,
  limit = 5,
  onViewDetails,
}: RecentRegistrationsProps) => {
  const recentRegs = registrations.slice(0, limit)

  return (
    <CardBox>
      <div className='mb-6'>
        <h5 className='card-title text-lg font-semibold'>Сүүлийн бүртгэлүүд</h5>
        <p className='text-sm text-muted-foreground font-normal'>
          Хамгийн сүүлд бүртгүүлсэн багууд
        </p>
      </div>
      <RegistrationsTable
        registrations={recentRegs}
        onViewDetails={onViewDetails || (() => {})}
      />
    </CardBox>
  )
}
