import { Contestant, ContestantFormData } from '@/types/models'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const contestantApi = {
  // Get all contestants for the logged-in organisation
  getAll: async (): Promise<Contestant[]> => {
    const response = await fetch(`${API_URL}/api/contestants`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch contestants')
    }

    return response.json()
  },

  // Get a single contestant by ID
  getById: async (id: string): Promise<Contestant> => {
    const response = await fetch(`${API_URL}/api/contestants/${id}`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch contestant')
    }

    return response.json()
  },

  // Create a new contestant
  create: async (data: ContestantFormData): Promise<Contestant> => {
    const response = await fetch(`${API_URL}/api/contestants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create contestant')
    }

    return response.json()
  },

  // Update a contestant
  update: async (id: string, data: Partial<ContestantFormData>): Promise<Contestant> => {
    const response = await fetch(`${API_URL}/api/contestants/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update contestant')
    }

    return response.json()
  },

  // Delete a contestant
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/api/contestants/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete contestant')
    }
  },
}
