'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LogOut, Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/app/components/shared/ThemeToggle'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { Link } from 'react-router-dom'

export function AdminHeader() {
  const { logout, getAdminUsername } = useAdminAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/registrations', label: 'Registrations' },
    { to: '/admin/events', label: 'Events' },
    { to: '/admin/settings', label: 'Settings' },
  ]

  const handleLogout = () => {
    logout()
    setIsMobileMenuOpen(false)
  }

  return (
    <header className='bg-card border-b border-border sticky top-0 z-10 shadow-sm'>
      <div className='container mx-auto px-4 sm:px-6 py-4'>
        <div className='flex justify-between items-start sm:items-center gap-3'>
          <div>
            <h1 className='text-xl sm:text-2xl font-bold text-foreground'>
              Админ удирдлагын систем
            </h1>
            <p className='text-sm text-muted-foreground'>
              MAIS Robot Challenge 2026
            </p>
            <div className='hidden md:flex flex-wrap gap-4 mt-2 text-sm'>
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className='text-muted-foreground hover:text-foreground'>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className='hidden md:flex items-center gap-3'>
            <ThemeToggle />
            <span className='text-sm text-muted-foreground'>
              Сайн байна уу, <strong>{getAdminUsername()}</strong>
            </span>
            <Button
              variant='outline'
              size='sm'
              onClick={handleLogout}
              className='gap-2'
            >
              <LogOut size={16} />
              Гарах
            </Button>
          </div>

          <div className='md:hidden flex items-center gap-2'>
            <ThemeToggle />
            <Button
              variant='outline'
              size='icon'
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label='Toggle admin menu'
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <>
          <div className='fixed inset-0 bg-black/40 z-40 md:hidden' onClick={() => setIsMobileMenuOpen(false)} />
          <aside className='fixed top-0 left-0 h-full w-72 max-w-[90vw] bg-card border-r border-border z-50 md:hidden p-4'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='font-semibold'>Admin Menu</h2>
              <Button variant='ghost' size='icon' onClick={() => setIsMobileMenuOpen(false)}>
                <X size={18} />
              </Button>
            </div>

            <div className='space-y-2'>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className='block rounded-md border px-3 py-2 text-sm hover:bg-muted'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className='mt-6 border-t pt-4'>
              <p className='text-sm text-muted-foreground mb-3'>Сайн байна уу, <strong>{getAdminUsername()}</strong></p>
              <Button variant='outline' className='w-full gap-2' onClick={handleLogout}>
                <LogOut size={16} />
                Гарах
              </Button>
            </div>
          </aside>
        </>
      )}
    </header>
  )
}
