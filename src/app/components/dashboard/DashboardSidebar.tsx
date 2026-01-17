'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Users, 
  Diamond, 
  Calendar, 
  MessageSquare, 
  History,
  ChevronDown,
  ChevronRight,
  Building2
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'

const menuItems = [
  {
    id: 'team-members',
    label: 'Team Members',
    icon: Users,
    href: '/dashboard/team-members',
    submenu: [
      { label: 'Contestant', href: '/dashboard/team-members/contestant' },
      { label: 'Coach', href: '/dashboard/team-members/coach' },
    ],
  },
  {
    id: 'events',
    label: 'Events',
    icon: Diamond,
    href: '/dashboard/events',
  },
  {
    id: 'program',
    label: 'Program',
    icon: Calendar,
    href: '/dashboard/program',
  },
  {
    id: 'feedback',
    label: 'Feedback',
    icon: MessageSquare,
    href: '/dashboard/feedback',
  },
  {
    id: 'history',
    label: 'History Score',
    icon: History,
    href: '/dashboard/history',
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { organisation } = useAuth()
  const { toast } = useToast()
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['team-members'])

  const toggleMenu = (id: string) => {
    setExpandedMenus((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const handleComingSoon = (feature: string) => {
    toast({
      title: 'Coming Soon',
      description: `${feature} feature is currently under development.`,
    })
  }

  return (
    <div className='w-64 bg-white flex flex-col'>
      {/* Organization Header */}
      <div className='p-6 bg-gradient-to-br from-blue-500 to-blue-600 relative overflow-hidden'>
        {/* Geometric background pattern */}
        <div className='absolute top-0 right-0 w-32 h-32 opacity-10'>
          <Building2 size={120} className='text-white' />
        </div>
        
        {/* Organization Info */}
        <div className='relative'>
          <div className='flex items-center gap-2 mb-2'>
            <div className='w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm'>
              <Building2 size={20} className='text-white' />
            </div>
            <div className='flex-1'>
              <div className='text-white text-xs font-medium opacity-90'>Organization ID</div>
              <div className='text-white text-lg font-bold tracking-wide'>
                {organisation?.organisationId || 'Loading...'}
              </div>
            </div>
          </div>
          <div className='bg-white/10 backdrop-blur-sm rounded-lg p-3 mt-3'>
            <div className='text-white text-sm font-medium truncate'>
              {organisation?.typeDetail || organisation?.type || 'Organization'}
            </div>
            <div className='text-white/80 text-xs mt-1 flex items-center gap-1'>
              <span className='truncate'>{organisation?.aimag || 'Mongolia'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className='flex-1 p-4 overflow-y-auto'>
        <ul className='space-y-1'>
          {/* Dashboard Home */}
          <li>
            <Link
              href='/dashboard'
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === '/dashboard'
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Home size={20} />
              <span>Dashboard</span>
            </Link>
          </li>

          {/* Main Menu Items */}
          {menuItems.map((item) => (
            <li key={item.id}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-gray-100 text-gray-900 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className='flex items-center space-x-3'>
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </div>
                    {expandedMenus.includes(item.id) ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>
                  
                  {/* Submenu */}
                  {expandedMenus.includes(item.id) && (
                    <ul className='mt-1 ml-4 space-y-1'>
                      {item.submenu.map((subItem) => (
                        <li key={subItem.href}>
                          <Link
                            href={subItem.href}
                            className={`block px-4 py-2 rounded-lg transition-colors ${
                              pathname === subItem.href
                                ? 'bg-blue-50 text-blue-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {subItem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                item.id === 'events' ? (
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-gray-100 text-gray-900 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => handleComingSoon(item.label)}
                    className='w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-50'
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </button>
                )
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
