const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export interface AdminCategory {
  categoryCode: string
  name: string
  maxTeamsPerOrg: number
  minContestantsPerTeam: number
  maxContestantsPerTeam: number
}

export interface PublicSettings {
  bankName: string
  bankAccountName: string
  bankAccountNumber: string
  loginLogoUrl: string
  availableCategories: AdminCategory[]
}

export const settingsApi = {
  getPublic: async (): Promise<PublicSettings> => {
    const response = await fetch(`${API_URL}/api/settings/public`)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch settings')
    }
    return response.json()
  },

  getAdmin: async (): Promise<any> => {
    const response = await fetch(`${API_URL}/api/settings/admin`)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch admin settings')
    }
    return response.json()
  },

  updateAdmin: async (payload: Partial<PublicSettings>): Promise<any> => {
    const response = await fetch(`${API_URL}/api/settings/admin`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update settings')
    }

    return response.json()
  },

  getOrganisations: async (): Promise<any[]> => {
    const response = await fetch(`${API_URL}/api/organisations/admin/all`)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch organisations')
    }
    return response.json()
  },

  deleteOrganisation: async (id: string): Promise<any> => {
    const response = await fetch(`${API_URL}/api/organisations/admin/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      const message = error.error || 'Failed to delete organisation'
      throw Object.assign(new Error(message), { code: error.code })
    }

    return response.json()
  },
}
