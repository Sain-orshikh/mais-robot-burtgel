'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { eventApi } from '@/lib/api/events'
import { Event } from '@/types/models'
import { Star } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function EventsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const data = await eventApi.getAll()
      setEvents(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load events',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='container mx-auto px-6 py-8'>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-6 py-8'>
      <h1 className='text-2xl font-bold text-gray-800 mb-6'>Events</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {events.map((event) => (
          <div
            key={event._id}
            onClick={() => router.push(`/dashboard/events/${event._id}`)}
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
              {/* Event Name */}
              <h3 className='text-center font-semibold text-gray-800 mb-2'>{event.name}</h3>

              {/* Location */}
              <p className='text-center text-sm text-gray-600 mb-2'>{event.location}</p>

              {/* Status */}
              <div className='text-center mt-2'>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                  event.status === 'upcoming' || event.status === 'ongoing'
                    ? 'text-green-700 bg-green-100' 
                    : event.status === 'completed'
                    ? 'text-blue-700 bg-blue-100'
                    : 'text-gray-700 bg-gray-100'
                }`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </div>

              {/* Dates */}
              <div className='mt-3 text-xs text-gray-600 text-center space-y-1'>
                <div>
                  <span className='font-medium'>Registration Period:</span>{' '}
                  {new Date(event.registrationStart).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })} - {new Date(event.registrationEnd).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
                <div>
                  <span className='font-medium'>Event Date:</span>{' '}
                  {new Date(event.startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })} - {new Date(event.endDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>

              {/* Categories Count */}
              <div className='mt-3 text-center'>
                <span className='text-xs text-gray-500'>
                  {event.categories.length} Categories Available
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {events.length === 0 && (
          <div className='col-span-full text-center py-12 text-gray-500'>
            <p>No events available at the moment</p>
          </div>
        )}
      </div>
    </div>
  )
}
