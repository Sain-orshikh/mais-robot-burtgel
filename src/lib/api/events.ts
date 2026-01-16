import { Event } from '@/types/models'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const eventApi = {
  // Get all events
  getAll: async (): Promise<Event[]> => {
    const response = await fetch(`${API_URL}/api/events`, {
      method: 'GET',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch events')
    }

    return response.json()
  },

  // Get a single event by ID
  getById: async (id: string): Promise<Event> => {
    const response = await fetch(`${API_URL}/api/events/${id}`, {
      method: 'GET',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch event')
    }

    return response.json()
  },
}
