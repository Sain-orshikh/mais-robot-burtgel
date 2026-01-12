'use client'

import { mockEvents } from '@/data/mockUserData'
import { Star } from 'lucide-react'

export default function EventsPage() {
  return (
    <div className='container mx-auto px-6 py-8'>
      <h1 className='text-2xl font-bold text-gray-800 mb-6'>Events</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {mockEvents.map((event) => (
          <div
            key={event.id}
            className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer'
          >
            {/* Event Image/Icon */}
            <div className='bg-gradient-to-br from-blue-400 to-blue-500 h-48 flex items-center justify-center'>
              <div className='text-white'>
                <svg
                  className='w-32 h-32'
                  viewBox='0 0 100 100'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  {/* Gear Icon */}
                  <circle cx='50' cy='50' r='15' fill='currentColor' />
                  <circle cx='50' cy='50' r='25' stroke='currentColor' strokeWidth='4' fill='none' />
                  {Array.from({ length: 8 }).map((_, i) => {
                    const angle = (i * 360) / 8
                    const rad = (angle * Math.PI) / 180
                    const x = 50 + Math.cos(rad) * 30
                    const y = 50 + Math.sin(rad) * 30
                    return (
                      <rect
                        key={i}
                        x={x - 3}
                        y={y - 6}
                        width='6'
                        height='12'
                        fill='currentColor'
                        transform={`rotate(${angle}, ${x}, ${y})`}
                      />
                    )
                  })}
                </svg>
              </div>
            </div>

            {/* Event Info */}
            <div className='p-4'>
              {/* Rating */}
              <div className='flex items-center justify-center mb-2'>
                {Array.from({ length: event.rating }).map((_, i) => (
                  <Star key={i} size={16} fill='#fbbf24' stroke='#fbbf24' />
                ))}
              </div>

              {/* Event Name */}
              <h3 className='text-center font-semibold text-gray-800'>{event.name}</h3>

              {/* Status */}
              <div className='text-center mt-2'>
                <span className='inline-block px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full'>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </div>

              {/* Dates */}
              <div className='mt-3 text-xs text-gray-600 text-center space-y-1'>
                <div>
                  <span className='font-medium'>Registration:</span>{' '}
                  {new Date(event.registrationDeadline).toLocaleDateString()}
                </div>
                <div>
                  <span className='font-medium'>Event:</span>{' '}
                  {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {mockEvents.length === 0 && (
          <div className='col-span-full text-center py-12 text-gray-500'>
            <p>No events available at the moment</p>
          </div>
        )}
      </div>
    </div>
  )
}
