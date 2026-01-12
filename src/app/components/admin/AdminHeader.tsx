'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { ThemeToggle } from '@/app/components/shared/ThemeToggle'
import { useAdminAuth } from '@/hooks/useAdminAuth'

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
