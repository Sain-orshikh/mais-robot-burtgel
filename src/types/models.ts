// Backend model types

export interface Contestant {
  _id: string
  contestantId: string
  ovog: string
  ner: string
  register: string
  email: string
  tursunUdur: string
  gender: 'male' | 'female'
  phoneNumber: string
  organisationId: string
  participations: {
    eventId: string
    category: string
    registeredAt: string
  }[]
  createdAt: string
  updatedAt: string
}

export interface Coach {
  _id: string
  coachId: string
  ovog: string
  ner: string
  register: string
  email: string
  tursunUdur: string
  gender: 'male' | 'female'
  phoneNumber: string
  organisationId: string
  participations: {
    eventId: string
    category: string
    registeredAt: string
  }[]
  createdAt: string
  updatedAt: string
}

export interface Team {
  _id: string
  teamId: string
  organisationId: string
  eventId: string
  categoryCode: string
  categoryName: string
  contestantIds: string[] | Contestant[]
  coachId: string | Coach
  status: 'active' | 'withdrawn'
  createdAt: string
  updatedAt: string
}

export interface EventCategory {
  code: string
  name: string
  maxTeamsPerOrg: number
  minContestantsPerTeam: number
  maxContestantsPerTeam: number
}

export interface Event {
  _id: string
  name: string
  description: string
  startDate: string
  endDate: string
  registrationStart: string
  registrationEnd: string
  location: string
  categories: {
    name: string
    description?: string
    maxTeamsPerOrg: number
    minContestantsPerTeam: number
    maxContestantsPerTeam: number
  }[]
  registrations: {
    organisationId: string
    category: string
    contestantIds: string[]
    coachId: string
    teamId: string
    registeredAt: string
    status: 'pending' | 'approved' | 'rejected'
  }[]
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

// Form data types
export interface ContestantFormData {
  ovog: string
  ner: string
  register: string
  email: string
  tursunUdur: string
  gender: 'male' | 'female'
  phoneNumber: string
}

export interface CoachFormData {
  ovog: string
  ner: string
  register: string
  email: string
  tursunUdur: string
  gender: 'male' | 'female'
  phoneNumber: string
}

export interface TeamFormData {
  eventId: string
  categoryCode: string
  contestantIds: string[]
  coachId: string
}
