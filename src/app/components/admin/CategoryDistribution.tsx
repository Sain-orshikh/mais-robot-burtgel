'use client'

import CardBox from '@/app/components/shared/CardBox'

interface CategoryDistributionProps {
  categoryStats: { [key: string]: number }
}

export const CategoryDistribution = ({ categoryStats }: CategoryDistributionProps) => {
  const sortedCategories = Object.entries(categoryStats)
    .sort(([, a], [, b]) => b - a)
    .filter(([, count]) => count > 0)

  const total = Object.values(categoryStats).reduce((sum, count) => sum + count, 0)

  const colors = [
    'bg-primary',
    'bg-info',
    'bg-success',
    'bg-warning',
    'bg-error',
    'bg-secondary',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-cyan-500',
  ]

  return (
    <CardBox>
      <div className='mb-6'>
        <h5 className='card-title text-lg font-semibold'>Төрлөөр ангилал</h5>
        <p className='text-sm text-muted-foreground font-normal'>
          Тэмцээний төрөл бүрийн бүртгэл
        </p>
      </div>

      <div className='space-y-4'>
        {sortedCategories.map(([category, count], index) => {
          const percentage = total > 0 ? (count / total) * 100 : 0
          const color = colors[index % colors.length]

          return (
            <div key={category}>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-sm font-medium truncate pr-2'>{category}</span>
                <span className='text-sm font-semibold'>{count}</span>
              </div>
              <div className='w-full bg-muted rounded-full h-2.5'>
                <div
                  className={`${color} h-2.5 rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className='text-xs text-muted-foreground mt-1'>
                {percentage.toFixed(1)}%
              </div>
            </div>
          )
        })}

        {sortedCategories.length === 0 && (
          <p className='text-center text-muted-foreground py-8'>
            Одоогоор бүртгэл байхгүй байна
          </p>
        )}
      </div>
    </CardBox>
  )
}
