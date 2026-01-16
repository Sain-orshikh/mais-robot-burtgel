import { Team, TeamFormData } from '@/types/models'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const teamApi = {
  // Get all teams for the logged-in organisation
  getAll: async (): Promise<Team[]> => {
    const response = await fetch(`${API_URL}/api/teams`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch teams')
    }

    return response.json()
  },

  // Get teams for a specific event
  getByEvent: async (eventId: string): Promise<Team[]> => {
    const response = await fetch(`${API_URL}/api/teams/event/${eventId}`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch teams')
    }

    return response.json()
  },

  // Get a single team by ID
  getById: async (id: string): Promise<Team> => {
    const response = await fetch(`${API_URL}/api/teams/${id}`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch team')
    }

    return response.json()
  },

  // Create a new team
  create: async (data: TeamFormData): Promise<Team> => {
    const response = await fetch(`${API_URL}/api/teams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create team')
    }

    return response.json()
  },

  // Withdraw a team
  withdraw: async (id: string): Promise<Team> => {
    const response = await fetch(`${API_URL}/api/teams/${id}/withdraw`, {
      method: 'PUT',
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to withdraw team')
    }

    return response.json()
  },
}
