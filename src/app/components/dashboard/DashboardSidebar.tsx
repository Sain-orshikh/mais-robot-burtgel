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
  Settings
} from 'lucide-react'
import { mockOrganization } from '@/data/mockUserData'

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
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['team-members'])

  const toggleMenu = (id: string) => {
    setExpandedMenus((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <div className='w-64 bg-white shadow-lg flex flex-col'>
      {/* Organization Header */}
      <div className='p-6 bg-gradient-to-br from-blue-400 to-blue-500 relative overflow-hidden'>
        {/* Geometric background pattern */}
        <div className='absolute top-0 left-0 w-full h-32 opacity-20'>
          <svg viewBox='0 0 200 100' className='w-full h-full'>
            <polygon points='0,100 100,0 200,100' fill='rgba(255,255,255,0.3)' />
            <polygon points='0,100 150,30 200,100' fill='rgba(255,255,255,0.15)' />
          </svg>
        </div>
        
        {/* Account Number */}
        <div className='relative text-center mb-3'>
          <div className='text-gray-700 text-2xl font-bold'>
            {mockOrganization.accountNumber}
          </div>
          <div className='text-gray-600 text-sm'>
            {mockOrganization.name}
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
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
