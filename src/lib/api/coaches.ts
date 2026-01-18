import { Coach, CoachFormData } from '@/types/models'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const coachApi = {
  // Get all coaches for the logged-in organisation
  getAll: async (): Promise<Coach[]> => {
    const response = await fetch(`${API_URL}/api/coaches`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch coaches')
    }

    return response.json()
  },

  // Get a single coach by ID
  getById: async (id: string): Promise<Coach> => {
    const response = await fetch(`${API_URL}/api/coaches/${id}`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch coach')
    }

    return response.json()
  },

  // Create a new coach
  create: async (data: CoachFormData): Promise<Coach> => {
    const response = await fetch(`${API_URL}/api/coaches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create coach')
    }

    return response.json()
  },

  // Update a coach
  update: async (id: string, data: Partial<CoachFormData>): Promise<Coach> => {
    const response = await fetch(`${API_URL}/api/coaches/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update coach')
    }

    return response.json()
  },

  // Delete a coach
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/api/coaches/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete coach')
    }
  },
}
