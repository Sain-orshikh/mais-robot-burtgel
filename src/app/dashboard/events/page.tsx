'use client'

import { useRouter } from 'next/navigation'
import { mockEvents } from '@/data/mockUserData'
import { Star } from 'lucide-react'

export default function EventsPage() {
  const router = useRouter()

  return (
    <div className='container mx-auto px-6 py-8'>
      <h1 className='text-2xl font-bold text-gray-800 mb-6'>Events</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {mockEvents.map((event) => (
          <div
            key={event.id}
            onClick={() => router.push(`/dashboard/events/${event.id}`)}
            className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer'
          >
            {/* Event Image/Icon */}
            <div className='h-48 flex items-center justify-center overflow-hidden'>
              <img 
                src='/icons/12.jpg' 
                alt={event.name}
                className='w-full h-full object-cover'
              />
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
