import { Menu, X, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNavigate } from 'react-router-dom'
import { ThemeToggle } from '@/app/components/shared/ThemeToggle'

interface DashboardHeaderProps {
  onToggleSidebar: () => void
  isSidebarOpen: boolean
}

export function DashboardHeader({ onToggleSidebar, isSidebarOpen }: DashboardHeaderProps) {
  const { organisation, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
  }

  const handleProfile = () => {
    navigate('/dashboard/profile')
  }

  const handleChangePassword = () => {
    navigate('/dashboard/profile#password')
  }

  return (
    <header className='bg-linear-to-r from-blue-400 to-blue-500 text-white shadow-md'>
      <div className='flex items-center justify-between px-6 py-3'>
        {/* Left Section - Close Sidebar Button */}
        <div className='flex items-center space-x-4'>
          <Button
            variant='ghost'
            size='icon'
            className='text-white hover:bg-blue-600'
            onClick={onToggleSidebar}
            title='Toggle Sidebar'
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Right Section - User Info and Actions */}
        <div className='flex items-center space-x-4 ml-auto'>
          <ThemeToggle />
          
          <div className='text-right text-sm'>
            <div className='font-medium'>{organisation?.email}</div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='bg-yellow-500 hover:bg-yellow-600 text-white rounded-full'
              >
                <User size={24} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem onClick={handleProfile}>
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleChangePassword}>
                Change Password
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className='text-red-600'>
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
