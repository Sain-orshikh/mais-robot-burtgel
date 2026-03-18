'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { ThemeToggle } from '@/app/components/shared/ThemeToggle'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { Link } from 'react-router-dom'

export function AdminHeader() {
  const { logout, getAdminUsername } = useAdminAuth()

  return (
    <header className='bg-card border-b border-border sticky top-0 z-10 shadow-sm'>
      <div className='container mx-auto px-6 py-4'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-2xl font-bold text-foreground'>
              Админ удирдлагын систем
            </h1>
            <p className='text-sm text-muted-foreground'>
              MAIS Robot Challenge 2026
            </p>
            <div className='flex gap-4 mt-2 text-sm'>
              <Link to='/admin/dashboard' className='text-muted-foreground hover:text-foreground'>Dashboard</Link>
              <Link to='/admin/registrations' className='text-muted-foreground hover:text-foreground'>Registrations</Link>
              <Link to='/admin/events' className='text-muted-foreground hover:text-foreground'>Events</Link>
              <Link to='/admin/settings' className='text-muted-foreground hover:text-foreground'>Settings</Link>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <ThemeToggle />
            <span className='text-sm text-muted-foreground'>
              Сайн байна уу, <strong>{getAdminUsername()}</strong>
            </span>
            <Button
              variant='outline'
              size='sm'
              onClick={logout}
              className='gap-2'
            >
              <LogOut size={16} />
              Гарах
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
