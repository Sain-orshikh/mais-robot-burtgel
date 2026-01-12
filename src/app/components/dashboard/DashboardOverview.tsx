'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import CardBox from '@/app/components/shared/CardBox'
import { UserPlus, Users, Edit } from 'lucide-react'
import { mockContestants, mockCoaches } from '@/data/mockUserData'

export function DashboardOverview() {
  const contestantCount = mockContestants.length
  const coachCount = mockCoaches.length

  const registrationSteps = [
    {
      step: 1,
      title: 'Management players/ coaches',
      description: 'Add new players /coaches to form your players library/ coaches library and manage them.',
      color: 'bg-gray-400',
    },
    {
      step: 2,
      title: 'Choose event to be participated',
      description: 'Choose the event you will participate in and enter the appropriate registration page.',
      color: 'bg-blue-400',
    },
    {
      step: 3,
      title: 'Select people involved in this event',
      description: 'In your players library/ coaches library, select the players/coaches involved in the event.',
      color: 'bg-red-400',
    },
    {
      step: 4,
      title: 'Team(Robots)',
      description: 'In this step, the team(robots) are added and the team information is improved accordingly.',
      color: 'bg-blue-400',
    },
  ]

  return (
    <div className='container mx-auto px-6 py-8'>
      {/* Organization Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800'>Mongol aspiration</h1>
        <p className='text-gray-500 flex items-center gap-2 mt-1'>
          <span className='text-gray-400'>📍</span> MONGOLIA
        </p>
        <div className='flex items-center gap-4 mt-2 text-sm text-gray-600'>
          <span className='text-blue-500 font-medium'>Type: Company</span>
          <span>Created on 2023-06-22 16:32</span>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left Section - Team Stats */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Contestant Card */}
          <CardBox className='border-none shadow-md'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Users className='text-blue-500' size={24} />
                <h3 className='text-lg font-semibold text-gray-700'>Contestant</h3>
              </div>
            </div>
            <div className='mt-6 text-center'>
              <div className='text-6xl font-bold text-gray-700'>{contestantCount}</div>
              <Link href='/dashboard/team-members/contestant'>
                <Button variant='link' className='mt-4 text-blue-500'>
                  Add / Edit
                </Button>
              </Link>
            </div>
          </CardBox>

          {/* Coach Card */}
          <CardBox className='border-none shadow-md'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <UserPlus className='text-blue-500' size={24} />
                <h3 className='text-lg font-semibold text-gray-700'>Coach</h3>
              </div>
            </div>
            <div className='mt-6 text-center'>
              <div className='text-6xl font-bold text-gray-700'>{coachCount}</div>
              <Link href='/dashboard/team-members/coach'>
                <Button variant='link' className='mt-4 text-blue-500'>
                  Add / Edit
                </Button>
              </Link>
            </div>
          </CardBox>

          {/* World Map Placeholder */}
          <CardBox className='border-none shadow-md bg-gradient-to-br from-green-400 to-green-500 min-h-[300px]'>
            <div className='flex items-center justify-center h-full text-white'>
              <div className='text-center'>
                <p className='text-lg font-medium'>World Map Visualization</p>
                <p className='text-sm opacity-80 mt-2'>Global event participation</p>
              </div>
            </div>
          </CardBox>
        </div>

        {/* Right Section - Registration Process */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>Event registration process</h2>
          
          {registrationSteps.map((step) => (
            <div key={step.step} className='flex gap-3'>
              <div className='flex-shrink-0'>
                <div className={`w-8 h-8 rounded flex items-center justify-center ${step.color} text-white`}>
                  <Edit size={16} />
                </div>
              </div>
              <div>
                <div className='flex items-center gap-2 mb-1'>
                  <h3 className='font-medium text-gray-700 text-sm'>{step.title}</h3>
                  <span className='text-xs text-gray-500'>Step{step.step}</span>
                </div>
                <p className='text-xs text-gray-600 leading-relaxed'>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
