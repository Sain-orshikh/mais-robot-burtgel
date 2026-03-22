import { Link } from 'react-router-dom'
import CardBox from '@/app/components/shared/CardBox'
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  Receipt,
  FileCheck,
  AlertCircle,
  Calendar as CalendarIcon
} from 'lucide-react'
import { EventCountdownCard } from './EventCountdownCard'

interface StatCardProps {
  title: string
  value: number | string
  description?: string
  icon: React.ReactNode
  color: string
  bgColor: string
  href?: string
}

const StatCard = ({ title, value, description, icon, color, bgColor, href }: StatCardProps) => {
  const content = (
    <CardBox className={`${bgColor} border-none transition-transform hover:scale-105 cursor-pointer`}>
      <div className='flex items-center justify-between'>
        <div>
          <p className={`text-sm font-medium ${color} opacity-90`}>{title}</p>
          <h3 className={`text-3xl font-bold ${color} mt-2`}>{value}</h3>
          {description && (
            <p className={`text-xs ${color} opacity-80 mt-1`}>{description}</p>
          )}
        </div>
        <div className={`${color} opacity-70`}>
          {icon}
        </div>
      </div>
    </CardBox>
  )

  if (href) {
    return <Link to={href}>{content}</Link>
  }

  return content
}

interface AdminStatsCardsProps {
  stats: {
    total: number
    pending: number
    approved: number
    rejected: number
    paymentVerified: number
    paymentUploaded: number
    paymentNotUploaded: number
  }
}

export const AdminStatsCards = ({ stats }: AdminStatsCardsProps) => {
  const cards = [
    {
      title: 'Нийт бүртгэл',
      value: stats.total,
      description: 'Бүх бүртгэлүүд',
      icon: <Users size={48} />,
      color: 'text-primary',
      bgColor: 'bg-blue-100 dark:bg-primary/10',
      href: '/admin/registrations'
    },
    {
      title: 'Зөвшөөрсөн',
      value: stats.approved,
      description: 'Баталгаажсан бүртгэл',
      icon: <CheckCircle size={48} />,
      color: 'text-green-700 dark:text-success',
      bgColor: 'bg-green-100 dark:bg-success/10',
      href: '/admin/registrations'
    },
    {
      title: 'Хүлээгдэж буй',
      value: stats.pending,
      description: 'Хянах шаардлагатай',
      icon: <Clock size={48} />,
      color: 'text-orange-700 dark:text-warning',
      bgColor: 'bg-orange-100 dark:bg-warning/10',
      href: '/admin/registrations'
    },
    {
      title: 'Татгалзсан',
      value: stats.rejected,
      description: 'Цуцлагдсан бүртгэл',
      icon: <XCircle size={48} />,
      color: 'text-red-700 dark:text-error',
      bgColor: 'bg-red-100 dark:bg-error/10',
      href: '/admin/registrations'
    },
    {
      title: 'Төлбөр баталгаажсан',
      value: stats.paymentVerified,
      description: 'Төлбөр шалгагдсан',
      icon: <FileCheck size={48} />,
      color: 'text-cyan-700 dark:text-info',
      bgColor: 'bg-cyan-100 dark:bg-info/10',
      href: '/admin/registrations'
    },
    {
      title: 'Төлбөр хүлээгдэж буй',
      value: stats.paymentUploaded,
      description: 'Баримт хянах шаардлагатай',
      icon: <Receipt size={48} />,
      color: 'text-purple-700 dark:text-secondary',
      bgColor: 'bg-purple-100 dark:bg-secondary/10',
      href: '/admin/registrations'
    },
    {
      title: 'Төлбөр оруулаагүй',
      value: stats.paymentNotUploaded,
      description: 'Баримт оруулаагүй',
      icon: <AlertCircle size={48} />,
      color: 'text-gray-700 dark:text-muted-foreground',
      bgColor: 'bg-gray-200 dark:bg-muted',
      href: '/admin/registrations'
    },
  ]

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
      {/* Event Countdown Card as 8th card */}
      <EventCountdownCard />
    </div>
  )
}
