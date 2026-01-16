const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const paymentApi = {
  async submitPayment(data: {
    eventId: string
    receiptUrl: string
    teamIds: string[]
    amount: number
  }) {
    const response = await fetch(`${API_URL}/api/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to submit payment')
    }

    return response.json()
  },

  async getPaymentStatus(eventId: string) {
    const response = await fetch(`${API_URL}/api/payments/event/${eventId}`, {
      credentials: 'include',
    })

    if (response.status === 404) {
      return null // No payment submitted yet
    }

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to get payment status')
    }

    return response.json()
  },
}
