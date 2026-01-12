'use client'

import { Settings, Search, Bell, User, X, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className='bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-md'>
      <div className='flex items-center justify-between px-6 py-3'>
        {/* Left Section - Settings */}
        <div className='flex items-center space-x-4'>
          <Button
            variant='ghost'
            size='icon'
            className='text-white hover:bg-blue-600'
          >
            <Settings size={24} />
          </Button>
        </div>

        {/* Center Section - Search */}
        <div className='flex-1 max-w-2xl mx-8'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60' size={20} />
            <Input
              type='text'
              placeholder='Search...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full bg-white/20 border-white/30 text-white placeholder-white/60 pl-10 focus:bg-white/30 focus:border-white'
            />
          </div>
        </div>

        {/* Right Section - User Actions */}
        <div className='flex items-center space-x-4'>
          <Button
            variant='ghost'
            size='icon'
            className='text-white hover:bg-blue-600 relative'
          >
            <Bell size={24} />
            <span className='absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full'></span>
          </Button>
          
          <Button
            variant='ghost'
            size='icon'
            className='bg-yellow-500 hover:bg-yellow-600 text-white rounded-full'
          >
            <User size={24} />
          </Button>

          <div className='text-right text-sm'>
            <div className='font-medium'>shine-od.g@mongolaspiration.edu.mn</div>
          </div>
        </div>
      </div>
    </header>
  )
}
