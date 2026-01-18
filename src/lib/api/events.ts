import { Event } from '@/types/models'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

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

  // Approve a registration
  approveRegistration: async (eventId: string, registrationId: string): Promise<any> => {
    const response = await fetch(`${API_URL}/api/events/${eventId}/registrations/${registrationId}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to approve registration')
    }

    return response.json()
  },

  // Reject a registration
  rejectRegistration: async (eventId: string, registrationId: string, rejectionReason: string): Promise<any> => {
    const response = await fetch(`${API_URL}/api/events/${eventId}/registrations/${registrationId}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rejectionReason }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to reject registration')
    }

    return response.json()
  },
}
