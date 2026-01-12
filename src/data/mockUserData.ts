// Mock data for user dashboard

export interface Contestant {
  id: string
  listName: string
  firstName: string
  lastName: string
  youngId: string
  youngPassword: string
  email: string
  birthdate: string
  passportNo: string
  gender: 'male' | 'female'
  phoneNumber: string
  country: string
  clothingSize: string
  photo?: string
  affiliation?: string
  createdAt: string
}

export interface Coach {
  id: string
  listName: string
  firstName: string
  lastName: string
  youngId: string
  youngPassword: string
  email: string
  birthdate: string
  passportNo: string
  gender: 'male' | 'female'
  phoneNumber: string
  country: string
  clothingSize: string
  photo?: string
  affiliation?: string
  createdAt: string
}

export interface Event {
  id: string
  name: string
  description: string
  rating: number
  status: 'coming' | 'ongoing' | 'completed'
  image?: string
  startDate: string
  endDate: string
  registrationDeadline: string
}

export interface Organization {
  id: string
  name: string
  accountNumber: string
  type: 'Company' | 'School' | 'Club'
  location: string
  createdOn: string
}

// Mock contestants
export const mockContestants: Contestant[] = [
  {
    id: '1',
    listName: 'Ulziibayar Bilguun',
    firstName: 'Bilguun',
    lastName: 'Ulziibayar',
    youngId: 'CT026606',
    youngPassword: 'S2S1',
    email: 'bilguun@email.mn',
    birthdate: '2004-12-05',
    passportNo: 'E3209055',
    gender: 'male',
    phoneNumber: '86-10200100001',
    country: 'MONGOLIA',
    clothingSize: 'M',
    affiliation: 'Mongol aspiration',
    createdAt: '2025-06-29T14:41:00Z',
  },
  {
    id: '2',
    listName: 'Khashbat Tuya',
    firstName: 'Tuya',
    lastName: 'Khashbat',
    youngId: 'CT026605',
    youngPassword: 'KMFP',
    email: 'tuya.kh@email.mn',
    birthdate: '2005-10-28',
    passportNo: 'E3297603',
    gender: 'female',
    phoneNumber: '86-10200100002',
    country: 'MONGOLIA',
    clothingSize: 'S',
    affiliation: 'Mongol aspiration',
    createdAt: '2025-06-29T14:39:00Z',
  },
  {
    id: '3',
    listName: 'Batsaikhan Khuslen',
    firstName: 'Khuslen',
    lastName: 'Batsaikhan',
    youngId: 'CT026604',
    youngPassword: 'LkAW',
    email: 'khuslen.b@email.mn',
    birthdate: '2009-01-13',
    passportNo: 'PE0334896',
    gender: 'female',
    phoneNumber: '86-10200100003',
    country: 'MONGOLIA',
    clothingSize: 'S',
    affiliation: 'Mongol aspiration',
    createdAt: '2025-06-29T14:37:00Z',
  },
]

// Mock coaches
export const mockCoaches: Coach[] = [
  {
    id: '1',
    listName: 'Gankhuyag Iderjargal',
    firstName: 'Iderjargal',
    lastName: 'Gankhuyag',
    youngId: 'CH004282',
    youngPassword: 'NMy6',
    email: 'iderjargal.g@email.mn',
    birthdate: '1988-04-30',
    passportNo: 'E2450397',
    gender: 'male',
    phoneNumber: '86-10200010002',
    country: 'MONGOLIA',
    clothingSize: 'L',
    affiliation: 'Mongol aspiration',
    createdAt: '2025-06-29T11:36:00Z',
  },
  {
    id: '2',
    listName: 'Urtsaikhan Munkh Ochir',
    firstName: 'Munkh Ochir',
    lastName: 'Urtsaikhan',
    youngId: 'CH004281',
    youngPassword: 'vmAf',
    email: 'munkh.u@email.mn',
    birthdate: '1985-04-07',
    passportNo: 'E33B3265',
    gender: 'male',
    phoneNumber: '86-10200010001',
    country: 'MONGOLIA',
    clothingSize: 'XL',
    affiliation: 'Mongol aspiration',
    createdAt: '2025-06-29T09:20:00Z',
  },
]

// Mock events
export const mockEvents: Event[] = [
  {
    id: '1',
    name: 'MAIS Robot Challenge 2026',
    description: 'Annual robotics competition featuring 12 categories',
    rating: 5,
    status: 'coming',
    startDate: '2026-03-15',
    endDate: '2026-03-17',
    registrationDeadline: '2026-02-28',
  },
  {
    id: '2',
    name: 'Spring Mini Sumo Tournament',
    description: 'Specialized mini sumo robot competition',
    rating: 4,
    status: 'coming',
    startDate: '2026-04-20',
    endDate: '2026-04-21',
    registrationDeadline: '2026-04-10',
  },
]

// Mock organization
export const mockOrganization: Organization = {
  id: 'BB001563',
  name: 'Mongol aspiration',
  accountNumber: 'BB001563',
  type: 'Company',
  location: 'MONGOLIA',
  createdOn: '2023-06-22 16:32',
}

// Helper functions
export const getContestantById = (id: string) => {
  return mockContestants.find((c) => c.id === id)
}

export const getCoachById = (id: string) => {
  return mockCoaches.find((c) => c.id === id)
}

export const getEventById = (id: string) => {
  return mockEvents.find((e) => e.id === id)
}
