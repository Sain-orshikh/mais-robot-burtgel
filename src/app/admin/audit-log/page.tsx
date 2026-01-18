import { useAdminAuth } from '@/hooks/useAdminAuth'
import { ThemeToggle } from '@/app/components/shared/ThemeToggle'
import { getAuditLog } from '@/data/auditLog'
import type { AuditLogEntry } from '@/data/auditLog'
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
import { ArrowLeft, Shield } from 'lucide-react'
import { Link as RouterLink } from 'react-router-dom'
import { format } from 'date-fns'
import CardBox from '@/app/components/shared/CardBox'

const Link = RouterLink

export default function AuditLogPage() {
  const { isAuthenticated, isChecking } = useAdminAuth()

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

  const auditLog = getAuditLog()

  const getActionBadge = (action: AuditLogEntry['action']) => {
    switch (action) {
      case 'approve':
        return <Badge className='bg-success text-white'>Зөвшөөрсөн</Badge>
      case 'reject':
        return <Badge className='bg-error text-white'>Татгалзсан</Badge>
      case 'edit':
        return <Badge className='bg-warning text-white'>Засварласан</Badge>
    }
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='bg-card border-b border-border sticky top-0 z-10 shadow-sm'>
        <div className='container mx-auto px-6 py-4'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-4'>
              <Button variant='ghost' size='sm' asChild>
                <Link to='/admin/registrations'>
                  <ArrowLeft size={18} />
                </Link>
              </Button>
              <div className='flex items-center gap-3'>
                <Shield size={24} className='text-primary' />
                <div>
                  <h1 className='text-2xl font-bold text-foreground'>Audit Log</h1>
                  <p className='text-sm text-muted-foreground'>
                    Бүх үйлдлүүдийн түүх
                  </p>
                </div>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='container mx-auto px-6 py-8'>
        <CardBox>
          <div className='mb-6'>
            <p className='text-sm text-muted-foreground'>
              Энэ хуудас нь админуудын бүх үйлдлүүдийг хянах боломжийг олгоно.
              Зөвшөөрөл, татгалзал, засварласан бүртгэлүүд бүгд энд харагдана.
            </p>
          </div>

          {auditLog.length === 0 ? (
            <div className='text-center py-12'>
              <Shield size={48} className='mx-auto text-muted-foreground mb-4' />
              <p className='text-muted-foreground'>
                Одоогоор audit log хоосон байна
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Огноо/Цаг</TableHead>
                    <TableHead>Админ</TableHead>
                    <TableHead>Бүртгэл</TableHead>
                    <TableHead>Үйлдэл</TableHead>
                    <TableHead>Өөрчлөлтүүд</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLog.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className='text-sm whitespace-nowrap'>
                        {format(new Date(entry.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline'>{entry.adminUsername}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className='font-medium'>{entry.teamName}</div>
                          <div className='text-xs text-muted-foreground'>
                            {entry.registrationNumber}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getActionBadge(entry.action)}</TableCell>
                      <TableCell>
                        <div className='max-w-md'>
                          {entry.changes.map((change, idx) => (
                            <div key={idx} className='text-sm mb-1'>
                              • {change}
                            </div>
                          ))}
                          {entry.reason && (
                            <div className='text-sm text-muted-foreground mt-2'>
                              <strong>Шалтгаан:</strong> {entry.reason}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardBox>
      </main>
    </div>
  )
}
