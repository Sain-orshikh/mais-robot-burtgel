import { useEffect, useMemo, useState } from 'react'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { Link } from 'react-router-dom'
import CardBox from '@/app/components/shared/CardBox'
import { Button } from '@/components/ui/button'
import { ArrowLeft, TrendingUp, Users, School, Calendar, Award } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/app/components/shared/ThemeToggle'
import { useToast } from '@/hooks/use-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

type AnalyticsResponse = {
  stats: {
    total: number
    approved: number
    pending: number
    rejected: number
  }
  totals: {
    teams: number
    coaches: number
    organisations: number
    contestants: number
    paymentApprovedTeams: number
    paymentProcessedMNT: number
  }
  categoryStats: Record<string, number>
  schoolStats: { school: string; count: number }[]
  registrationsByDate: Record<string, number>
}

export default function AnalyticsPage() {
  const { isAuthenticated, isChecking } = useAdminAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      void fetchAnalytics()
    }
  }, [isAuthenticated])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/export/analytics`)
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to fetch analytics')
      }
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load analytics',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

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

  if (loading || !analytics) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto'></div>
          <p className='mt-4 text-muted-foreground'>Ачааллаж байна...</p>
        </div>
      </div>
    )
  }

  const { stats, totals, categoryStats, schoolStats, registrationsByDate } = analytics

  const allCategories = useMemo(
    () => Object.keys(categoryStats).sort((a, b) => (categoryStats[b] || 0) - (categoryStats[a] || 0)),
    [categoryStats]
  )

  const sortedDates = Object.entries(registrationsByDate).sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())

  // Top categories
  const topCategories = Object.entries(categoryStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  // Calculate approval rate
  const approvalRate = stats.total > 0 ? ((stats.approved / stats.total) * 100).toFixed(1) : '0'
  const rejectionRate = stats.total > 0 ? ((stats.rejected / stats.total) * 100).toFixed(1) : '0'
  const pendingRate = stats.total > 0 ? ((stats.pending / stats.total) * 100).toFixed(1) : '0'

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='bg-card border-b border-border sticky top-0 z-10 shadow-sm'>
        <div className='container mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Button asChild variant='ghost' size='sm'>
                <Link to='/admin/dashboard'>
                  <ArrowLeft size={20} />
                </Link>
              </Button>
              <div>
                <h1 className='text-2xl font-bold text-foreground'>Статистик ба тайлан</h1>
                <p className='text-sm text-muted-foreground'>MAIS Robot Challenge 2026 - Дэлгэрэнгүй мэдээлэл</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='container mx-auto px-6 py-8'>
        {/* Overview Stats */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <CardBox className='border-l-4 border-l-primary'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Нийт баг</p>
                <h3 className='text-3xl font-bold text-primary mt-2'>{totals.teams}</h3>
                <p className='text-xs text-muted-foreground mt-1'>Active registered teams</p>
              </div>
              <Users size={40} className='text-primary opacity-20' />
            </div>
          </CardBox>

          <CardBox className='border-l-4 border-l-success'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Нийт дасгалжуулагч</p>
                <h3 className='text-3xl font-bold text-success mt-2'>{totals.coaches}</h3>
                <p className='text-xs text-success mt-1'>Coach records</p>
              </div>
              <TrendingUp size={40} className='text-success opacity-20' />
            </div>
          </CardBox>

          <CardBox className='border-l-4 border-l-warning'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Нийт байгууллага</p>
                <h3 className='text-3xl font-bold text-warning mt-2'>{totals.organisations}</h3>
                <p className='text-xs text-warning mt-1'>Org accounts</p>
              </div>
              <Calendar size={40} className='text-warning opacity-20' />
            </div>
          </CardBox>

          <CardBox className='border-l-4 border-l-error'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Нийт оролцогч</p>
                <h3 className='text-3xl font-bold text-error mt-2'>{totals.contestants}</h3>
                <p className='text-xs text-error mt-1'>Contestant records</p>
              </div>
              <School size={40} className='text-error opacity-20' />
            </div>
          </CardBox>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <CardBox>
            <p className='text-sm text-muted-foreground'>Нийт бүртгэл</p>
            <h3 className='text-2xl font-bold mt-2'>{stats.total}</h3>
          </CardBox>
          <CardBox>
            <p className='text-sm text-muted-foreground'>Төлбөр баталгаажсан баг</p>
            <h3 className='text-2xl font-bold mt-2 text-success'>{totals.paymentApprovedTeams}</h3>
            <p className='text-xs text-muted-foreground mt-1'>1 баг = 20,000 MNT</p>
          </CardBox>
          <CardBox>
            <p className='text-sm text-muted-foreground'>Нийт боловсруулсан төлбөр</p>
            <h3 className='text-2xl font-bold mt-2 text-primary'>{totals.paymentProcessedMNT.toLocaleString()} MNT</h3>
          </CardBox>
        </div>

        {/* Two Column Layout */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          {/* Top Schools */}
          <CardBox>
            <div className='mb-6'>
              <h5 className='card-title text-lg font-semibold flex items-center gap-2'>
                <School size={20} />
                Сургуулиудын статистик
              </h5>
              <p className='text-sm text-muted-foreground font-normal'>
                Хамгийн их бүртгүүлсэн байгууллагууд
              </p>
            </div>

            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='text-sm font-semibold'>№</TableHead>
                    <TableHead className='text-sm font-semibold'>Сургууль</TableHead>
                    <TableHead className='text-sm font-semibold'>Багуудын тоо</TableHead>
                    <TableHead className='text-sm font-semibold'>Хувь</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schoolStats.map((school, index) => {
                    const percentage = ((school.count / stats.total) * 100).toFixed(1)
                    return (
                      <TableRow key={school.school}>
                        <TableCell className='font-medium'>{index + 1}</TableCell>
                        <TableCell>{school.school}</TableCell>
                        <TableCell>
                          <Badge className='bg-primary'>{school.count}</Badge>
                        </TableCell>
                        <TableCell className='text-muted-foreground'>{percentage}%</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardBox>

          {/* Top Categories */}
          <CardBox>
            <div className='mb-6'>
              <h5 className='card-title text-lg font-semibold flex items-center gap-2'>
                <Award size={20} />
                Тэмцээний төрлүүд
              </h5>
              <p className='text-sm text-muted-foreground font-normal'>
                Хамгийн их сонирхогдсон төрлүүд
              </p>
            </div>

            <div className='space-y-4'>
              {topCategories.map(([category, count], index) => {
                const percentage = ((count / stats.total) * 100).toFixed(1)
                const colors = ['bg-primary', 'bg-info', 'bg-success', 'bg-warning', 'bg-error']
                const color = colors[index % colors.length]

                return (
                  <div key={category}>
                    <div className='flex justify-between items-center mb-2'>
                      <span className='text-sm font-medium truncate pr-2'>{category}</span>
                      <Badge className={color}>{count}</Badge>
                    </div>
                    <div className='w-full bg-muted rounded-full h-2.5'>
                      <div
                        className={`${color} h-2.5 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className='text-xs text-muted-foreground mt-1'>{percentage}% of total</div>
                  </div>
                )
              })}
            </div>
          </CardBox>
        </div>

        {/* Registration Timeline */}
        <CardBox className='mb-8'>
          <div className='mb-6'>
            <h5 className='card-title text-lg font-semibold flex items-center gap-2'>
              <Calendar size={20} />
              Бүртгэлийн динамик
            </h5>
            <p className='text-sm text-muted-foreground font-normal'>
              Өдрөөр бүртгүүлсэн багуудын тоо
            </p>
          </div>

          <div className='overflow-x-auto'>
            <div className='flex items-end gap-2 h-64 min-w-max p-4'>
              {sortedDates.map(([date, count]) => {
                const maxCount = Math.max(...Object.values(registrationsByDate))
                const height = (count / maxCount) * 100

                return (
                  <div key={date} className='flex flex-col items-center gap-2' style={{ minWidth: '80px' }}>
                    <div className='text-xs font-semibold text-primary'>{count}</div>
                    <div
                      className='w-full bg-primary rounded-t transition-all duration-500 hover:bg-primary/80'
                      style={{ height: `${height}%`, minHeight: '20px' }}
                    />
                    <div className='text-xs text-muted-foreground rotate-45 origin-top-left whitespace-nowrap'>
                      {date}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardBox>

        {/* All Categories Breakdown */}
        <CardBox>
          <div className='mb-6'>
            <h5 className='card-title text-lg font-semibold'>Бүх төрлүүдийн статистик</h5>
            <p className='text-sm text-muted-foreground font-normal'>
              12 төрлийн тэмцээний дэлгэрэнгүй мэдээлэл
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {allCategories.map((category) => {
              const count = categoryStats[category] || 0
              const percentage = stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : '0'

              return (
                <div key={category} className='p-4 border rounded-lg hover:border-primary transition-colors'>
                  <h6 className='font-semibold text-sm mb-2 line-clamp-2' title={category}>
                    {category}
                  </h6>
                  <div className='flex items-center justify-between'>
                    <span className='text-2xl font-bold text-primary'>{count}</span>
                    <span className='text-sm text-muted-foreground'>{percentage}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardBox>
      </main>
    </div>
  )
}
