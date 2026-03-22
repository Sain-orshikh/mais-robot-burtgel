const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const getOrgIdString = (orgId: any): string => {
  if (!orgId) return 'N/A'
  if (typeof orgId === 'string') return orgId
  return orgId.organisationId || orgId._id || String(orgId)
}

export async function fetchNormalizedRegistrationsForEvent(eventId: string) {
  const [eventResponse, paymentsResponse] = await Promise.all([
    fetch(`${API_URL}/api/events/${eventId}`),
    fetch(`${API_URL}/api/payments/admin/all`),
  ])

  if (!eventResponse.ok) {
    const error = await eventResponse.json()
    throw new Error(error.error || 'Failed to fetch event')
  }

  const event = await eventResponse.json()
  const payments = paymentsResponse.ok ? await paymentsResponse.json() : []

  const paymentStatusMap = new Map(payments.map((p: any) => [String(p._id), p.status]))
  const paymentsForEvent = payments.filter(
    (p: any) => String(p.eventId?._id || p.eventId) === String(event._id)
  )

  const paymentsByOrg = new Map<string, any[]>()
  paymentsForEvent.forEach((payment: any) => {
    const orgKey = getOrgIdString(payment.organisationId)
    const current = paymentsByOrg.get(orgKey) || []
    current.push(payment)
    paymentsByOrg.set(orgKey, current)
  })

  const paymentDescriptionMap = new Map<string, string>()
  paymentsByOrg.forEach((orgPayments, orgKey) => {
    orgPayments
      .sort(
        (a, b) =>
          new Date(a.submittedAt || a.createdAt || 0).getTime() -
          new Date(b.submittedAt || b.createdAt || 0).getTime()
      )
      .forEach((payment: any, index: number) => {
        const paymentNumber = String(index + 1).padStart(3, '0')
        paymentDescriptionMap.set(String(payment._id), `${orgKey}-${paymentNumber}`)
      })
  })

  const registrations = (event.registrations || []).map((reg: any) => ({
    ...reg,
    eventId: event._id,
    eventName: event.name,
    categoryDisplay:
      Array.isArray(reg.categories) && reg.categories.length > 0
        ? reg.categories.length > 1
          ? `${reg.categories.join(', ')} (${reg.categories.length})`
          : reg.categories[0]
        : reg.category || 'N/A',
    paymentStatus: reg.paymentId
      ? paymentStatusMap.get(String(reg.paymentId)) || 'not_uploaded'
      : 'not_uploaded',
    paymentDescription: reg.paymentId
      ? paymentDescriptionMap.get(String(reg.paymentId)) || 'N/A'
      : 'N/A',
  }))

  return { event, registrations }
}
