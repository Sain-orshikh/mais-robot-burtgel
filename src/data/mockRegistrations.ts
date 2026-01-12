// Mock registration data for testing

export type RegistrationStatus = 'pending' | 'approved' | 'rejected';
export type PaymentStatus = 'not_uploaded' | 'uploaded' | 'verified';

export interface TeamMember {
  name: string;
  grade?: string;
  role?: string;
}

export interface Registration {
  id: string;
  registrationNumber: string;
  teamName: string;
  schoolName: string;
  location: string; // City/Province in Mongolia
  category: string;
  teamSize: number;
  teamMembers: TeamMember[];
  contactPerson: {
    name: string;
    phone: string;
    email: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  registrationDate: string; // ISO date
  paymentStatus: PaymentStatus;
  paymentReceipt?: string; // URL to receipt image
  status: RegistrationStatus;
  rejectionReason?: string;
  notes?: string;
  lastModified?: string;
  modifiedBy?: string;
}

export const COMPETITION_CATEGORIES = [
  'Шугам дагагч робот (Насанд хүрэгчид)',
  'Цагаан шугам дагагч робот (8-12 анги)',
  'Цагаан шугам дагагч LEGO робот (6-10 анги)',
  'Сумо робот (Автомат, 3 кг)',
  'Сумо робот (Радио удирдлагатай, 3 кг)',
  'Мини сумо робот (Автомат, 500 г)',
  'Мини сумо робот (Радио удирдлагатай, 500 г)',
  'LEGO сумо робот (Автомат, 1 кг, 8-10 анги)',
  'FLL (6-10 анги)',
  'Drone RC control',
  'Drone code Automat',
  'Rugby',
];

export const mockRegistrations: Registration[] = [
  {
    id: '1',
    registrationNumber: 'RC2026-001',
    teamName: 'Tech Warriors',
    schoolName: 'Mongol Aspiration International School',
    location: 'Улаанбаатар',
    category: 'Сумо робот (Автомат, 3 кг)',
    teamSize: 2,
    teamMembers: [
      { name: 'Батбаяр Ганбаатар', grade: '10', role: 'Programmer' },
      { name: 'Энхжаргал Мөнх-Эрдэнэ', grade: '11', role: 'Builder' },
    ],
    contactPerson: {
      name: 'Ганбаатар Цэрэнпил',
      phone: '+976 9911-1234',
      email: 'ganbaatar@email.com',
    },
    emergencyContact: {
      name: 'Цэрэнпил Бат',
      phone: '+976 9911-5678',
      relationship: 'Эцэг',
    },
    registrationDate: '2026-01-05T10:30:00Z',
    paymentStatus: 'verified',
    paymentReceipt: '/receipts/receipt-001.jpg',
    status: 'approved',
  },
  {
    id: '2',
    registrationNumber: 'RC2026-002',
    teamName: 'Robot Legends',
    schoolName: 'Orchlon School',
    location: 'Улаанбаатар',
    category: 'Rugby',
    teamSize: 5,
    teamMembers: [
      { name: 'Болдбаатар Энхбат', grade: '9', role: 'Captain' },
      { name: 'Мөнхжаргал Төмөр', grade: '9', role: 'Player' },
      { name: 'Ганзориг Пүрэв', grade: '10', role: 'Player' },
      { name: 'Наранбаатар Бат', grade: '10', role: 'Player' },
      { name: 'Энхтайван Өлзий', grade: '9', role: 'Player' },
    ],
    contactPerson: {
      name: 'Энхбат Дорж',
      phone: '+976 8811-2345',
      email: 'enkhbat@orchlon.edu.mn',
    },
    emergencyContact: {
      name: 'Дорж Батсайхан',
      phone: '+976 8811-6789',
      relationship: 'Эцэг',
    },
    registrationDate: '2026-01-06T14:20:00Z',
    paymentStatus: 'uploaded',
    paymentReceipt: '/receipts/receipt-002.jpg',
    status: 'pending',
  },
  {
    id: '3',
    registrationNumber: 'RC2026-003',
    teamName: 'Line Followers',
    schoolName: 'New World International School',
    location: 'Улаанбаатар',
    category: 'Цагаан шугам дагагч робот (8-12 анги)',
    teamSize: 3,
    teamMembers: [
      { name: 'Алтанцэцэг Баяр', grade: '11', role: 'Lead Programmer' },
      { name: 'Номин-Эрдэнэ Батжаргал', grade: '10', role: 'Designer' },
      { name: 'Тэмүүжин Болд', grade: '12', role: 'Tester' },
    ],
    contactPerson: {
      name: 'Баяр Сүхбаатар',
      phone: '+976 9922-3456',
      email: 'bayar@newworld.edu.mn',
    },
    emergencyContact: {
      name: 'Сүхбаатар Дашдорж',
      phone: '+976 9922-7890',
      relationship: 'Эцэг',
    },
    registrationDate: '2026-01-07T09:15:00Z',
    paymentStatus: 'verified',
    paymentReceipt: '/receipts/receipt-003.jpg',
    status: 'approved',
  },
  {
    id: '4',
    registrationNumber: 'RC2026-004',
    teamName: 'LEGO Masters',
    schoolName: 'Hobby School',
    location: 'Улаанбаатар',
    category: 'Цагаан шугам дагагч LEGO робот (6-10 анги)',
    teamSize: 2,
    teamMembers: [
      { name: 'Ууганбаяр Мөнх', grade: '8', role: 'Builder' },
      { name: 'Сарангэрэл Ариунаа', grade: '9', role: 'Programmer' },
    ],
    contactPerson: {
      name: 'Мөнх Батболд',
      phone: '+976 8833-4567',
      email: 'munkh@hobby.edu.mn',
    },
    emergencyContact: {
      name: 'Батболд Цэнд',
      phone: '+976 8833-8901',
      relationship: 'Эцэг',
    },
    registrationDate: '2026-01-08T11:45:00Z',
    paymentStatus: 'not_uploaded',
    status: 'pending',
  },
  {
    id: '5',
    registrationNumber: 'RC2026-005',
    teamName: 'Mini Bots',
    schoolName: 'Ikh Zasag School',
    location: 'Дархан',
    category: 'Мини сумо робот (Автомат, 500 г)',
    teamSize: 2,
    teamMembers: [
      { name: 'Мөнхболд Батсайхан', grade: '10', role: 'Engineer' },
      { name: 'Энхтүвшин Ганбаатар', grade: '11', role: 'Programmer' },
    ],
    contactPerson: {
      name: 'Батсайхан Төмөр',
      phone: '+976 7011-2345',
      email: 'batsaikhan@ikhzasag.edu.mn',
    },
    emergencyContact: {
      name: 'Төмөр Баатар',
      phone: '+976 7011-6789',
      relationship: 'Эцэг',
    },
    registrationDate: '2026-01-08T16:30:00Z',
    paymentStatus: 'uploaded',
    paymentReceipt: '/receipts/receipt-005.jpg',
    status: 'pending',
  },
  {
    id: '6',
    registrationNumber: 'RC2026-006',
    teamName: 'Sky Pilots',
    schoolName: 'Mongol Aspiration International School',
    location: 'Улаанбаатар',
    category: 'Drone RC control',
    teamSize: 2,
    teamMembers: [
      { name: 'Ариунболд Энхтайван', grade: '12', role: 'Pilot' },
      { name: 'Тэмүүлэн Баяр', grade: '11', role: 'Navigator' },
    ],
    contactPerson: {
      name: 'Энхтайван Дашдорж',
      phone: '+976 9933-5678',
      email: 'enkhtaivan@mais.edu.mn',
    },
    emergencyContact: {
      name: 'Дашдорж Батмөнх',
      phone: '+976 9933-9012',
      relationship: 'Эцэг',
    },
    registrationDate: '2026-01-09T13:20:00Z',
    paymentStatus: 'verified',
    paymentReceipt: '/receipts/receipt-006.jpg',
    status: 'approved',
  },
  {
    id: '7',
    registrationNumber: 'RC2026-007',
    teamName: 'FLL Champions',
    schoolName: 'Shine Ue School',
    location: 'Улаанбаатар',
    category: 'FLL (6-10 анги)',
    teamSize: 4,
    teamMembers: [
      { name: 'Баттөр Мөнхбат', grade: '9', role: 'Team Leader' },
      { name: 'Номин Сэргэлэн', grade: '8', role: 'Programmer' },
      { name: 'Ганзориг Болд', grade: '9', role: 'Builder' },
      { name: 'Энхжин Баяр', grade: '8', role: 'Researcher' },
    ],
    contactPerson: {
      name: 'Мөнхбат Төмөр',
      phone: '+976 8844-6789',
      email: 'munkhbat@shineue.edu.mn',
    },
    emergencyContact: {
      name: 'Төмөр Батсайхан',
      phone: '+976 8844-0123',
      relationship: 'Эцэг',
    },
    registrationDate: '2026-01-09T15:50:00Z',
    paymentStatus: 'uploaded',
    paymentReceipt: '/receipts/receipt-007.jpg',
    status: 'pending',
  },
  {
    id: '8',
    registrationNumber: 'RC2026-008',
    teamName: 'Code Drones',
    schoolName: 'International School of Ulaanbaatar',
    location: 'Улаанбаатар',
    category: 'Drone code Automat',
    teamSize: 3,
    teamMembers: [
      { name: 'Алтангэрэл Батаа', grade: '12', role: 'Lead Programmer' },
      { name: 'Мөнхцэцэг Ариунаа', grade: '11', role: 'Algorithm Designer' },
      { name: 'Болдбаатар Энхбат', grade: '12', role: 'Hardware Specialist' },
    ],
    contactPerson: {
      name: 'Батаа Дорж',
      phone: '+976 9944-7890',
      email: 'bataa@isu.edu.mn',
    },
    emergencyContact: {
      name: 'Дорж Ганбаатар',
      phone: '+976 9944-1234',
      relationship: 'Эцэг',
    },
    registrationDate: '2026-01-10T10:10:00Z',
    paymentStatus: 'uploaded',
    paymentReceipt: '/receipts/receipt-008.jpg',
    status: 'pending',
  },
  {
    id: '9',
    registrationNumber: 'RC2026-009',
    teamName: 'Remote Control Masters',
    schoolName: 'Erdenet School #5',
    location: 'Эрдэнэт',
    category: 'Сумо робот (Радио удирдлагатай, 3 кг)',
    teamSize: 2,
    teamMembers: [
      { name: 'Энхболд Батжаргал', grade: '11', role: 'Operator' },
      { name: 'Төмөрхүү Ганбаатар', grade: '10', role: 'Engineer' },
    ],
    contactPerson: {
      name: 'Батжаргал Мөнх',
      phone: '+976 7522-3456',
      email: 'batjargal@erdenet5.edu.mn',
    },
    emergencyContact: {
      name: 'Мөнх Батсайхан',
      phone: '+976 7522-7890',
      relationship: 'Эцэг',
    },
    registrationDate: '2026-01-10T14:30:00Z',
    paymentStatus: 'not_uploaded',
    status: 'pending',
  },
  {
    id: '10',
    registrationNumber: 'RC2026-010',
    teamName: 'LEGO Warriors',
    schoolName: 'Orchlon School',
    location: 'Улаанбаатар',
    category: 'LEGO сумо робот (Автомат, 1 кг, 8-10 анги)',
    teamSize: 2,
    teamMembers: [
      { name: 'Баярмагнай Төмөр', grade: '9', role: 'Builder' },
      { name: 'Санжмятав Энхбат', grade: '10', role: 'Programmer' },
    ],
    contactPerson: {
      name: 'Төмөр Баатар',
      phone: '+976 8855-4567',
      email: 'tumur@orchlon.edu.mn',
    },
    emergencyContact: {
      name: 'Баатар Болд',
      phone: '+976 8855-8901',
      relationship: 'Эцэг',
    },
    registrationDate: '2026-01-11T09:00:00Z',
    paymentStatus: 'verified',
    paymentReceipt: '/receipts/receipt-010.jpg',
    status: 'rejected',
    rejectionReason: 'Баримт бичиг дутуу',
  },
  {
    id: '11',
    registrationNumber: 'RC2026-011',
    teamName: 'Adult Line Trackers',
    schoolName: 'NUM - National University of Mongolia',
    location: 'Улаанбаатар',
    category: 'Шугам дагагч робот (Насанд хүрэгчид)',
    teamSize: 2,
    teamMembers: [
      { name: 'Батболд Ганбаатар', role: 'Lead Engineer' },
      { name: 'Мөнхбаяр Дашдорж', role: 'Programmer' },
    ],
    contactPerson: {
      name: 'Батболд Ганбаатар',
      phone: '+976 9955-6789',
      email: 'batbold@num.edu.mn',
    },
    emergencyContact: {
      name: 'Ганбаатар Төмөр',
      phone: '+976 9955-0123',
      relationship: 'Эцэг',
    },
    registrationDate: '2026-01-11T16:45:00Z',
    paymentStatus: 'verified',
    paymentReceipt: '/receipts/receipt-011.jpg',
    status: 'approved',
  },
  {
    id: '12',
    registrationNumber: 'RC2026-012',
    teamName: 'Mini RC Fighters',
    schoolName: 'Darkhan School #3',
    location: 'Дархан',
    category: 'Мини сумо робот (Радио удирдлагатай, 500 г)',
    teamSize: 2,
    teamMembers: [
      { name: 'Энхжин Батаа', grade: '11', role: 'Controller' },
      { name: 'Тэмүүлэн Болд', grade: '11', role: 'Builder' },
    ],
    contactPerson: {
      name: 'Батаа Мөнх',
      phone: '+976 7033-7890',
      email: 'bataa@darkhan3.edu.mn',
    },
    emergencyContact: {
      name: 'Мөнх Баатар',
      phone: '+976 7033-1234',
      relationship: 'Эцэг',
    },
    registrationDate: '2026-01-12T11:20:00Z',
    paymentStatus: 'uploaded',
    paymentReceipt: '/receipts/receipt-012.jpg',
    status: 'pending',
  },
  {
    id: '13',
    registrationNumber: 'RC2026-013',
    teamName: 'Future Engineers',
    schoolName: '98th School',
    location: 'Улаанбаатар',
    category: 'Цагаан шугам дагагч робот (8-12 анги)',
    teamSize: 3,
    teamMembers: [
      { name: 'Батхишиг Энхбаяр', grade: '12', role: 'Captain' },
      { name: 'Оюунбилэг Мөнхсайхан', grade: '11', role: 'Engineer' },
      { name: 'Ганболд Төмөрбаатар', grade: '12', role: 'Programmer' },
    ],
    contactPerson: {
      name: 'Энхбаяр Дашдондог',
      phone: '+976 9966-1111',
      email: 'enkhbayar@98school.edu.mn',
    },
    emergencyContact: {
      name: 'Дашдондог Баярсайхан',
      phone: '+976 9966-2222',
      relationship: 'Эцэг',
    },
    registrationDate: '2026-01-12T14:30:00Z',
    paymentStatus: 'verified',
    paymentReceipt: '/receipts/receipt-013.jpg',
    status: 'approved',
  },
  {
    id: '14',
    registrationNumber: 'RC2026-014',
    teamName: 'Phoenix Robotics',
    schoolName: 'American School of Ulaanbaatar',
    location: 'Улаанбаатар',
    category: 'Drone code Automat',
    teamSize: 2,
    teamMembers: [
      { name: 'Тэгшбаяр Цэрэндулам', grade: '12', role: 'AI Developer' },
      { name: 'Номинцэцэг Баярмаа', grade: '11', role: 'Flight Controller' },
    ],
    contactPerson: {
      name: 'Цэрэндулам Батсайхан',
      phone: '+976 9977-3333',
      email: 'tseren@asu.edu.mn',
    },
    emergencyContact: {
      name: 'Батсайхан Ганбаатар',
      phone: '+976 9977-4444',
      relationship: 'Эцэг',
    },
    registrationDate: '2026-01-12T16:45:00Z',
    paymentStatus: 'uploaded',
    paymentReceipt: '/receipts/receipt-014.jpg',
    status: 'pending',
  },
  {
    id: '15',
    registrationNumber: 'RC2026-015',
    teamName: 'Smart Builders',
    schoolName: 'Ulaanbaatar International School',
    location: 'Улаанбаатар',
    category: 'LEGO сумо робот (Автомат, 1 кг, 8-10 анги)',
    teamSize: 2,
    teamMembers: [
      { name: 'Мөнхбаяр Энхтөр', grade: '9', role: 'Designer' },
      { name: 'Ариунбаяр Батдэлгэр', grade: '10', role: 'Coder' },
    ],
    contactPerson: {
      name: 'Энхтөр Баатар',
      phone: '+976 9988-5555',
      email: 'enkhtur@uis.edu.mn',
    },
    emergencyContact: {
      name: 'Баатар Мөнх',
      phone: '+976 9988-6666',
      relationship: 'Эцэг',
    },
    registrationDate: '2026-01-12T18:00:00Z',
    paymentStatus: 'verified',
    paymentReceipt: '/receipts/receipt-015.jpg',
    status: 'approved',
  },
  {
    id: '16',
    registrationNumber: 'RC2026-016',
    teamName: 'Robo Warriors',
    schoolName: 'Zavkhan School #1',
    location: 'Завхан',
    category: 'Сумо робот (Автомат, 3 кг)',
    teamSize: 2,
    teamMembers: [
      { name: 'Баярсайхан Төгөлдөр', grade: '11', role: 'Mechanic' },
      { name: 'Энхмөнх Батзориг', grade: '12', role: 'Programmer' },
    ],
    contactPerson: {
      name: 'Төгөлдөр Дорж',
      phone: '+976 7044-7777',
      email: 'tuguldur@zavkhan.edu.mn',
    },
    emergencyContact: {
      name: 'Дорж Баатар',
      phone: '+976 7044-8888',
      relationship: 'Эцэг',
    },
    registrationDate: '2026-01-13T08:15:00Z',
    paymentStatus: 'not_uploaded',
    status: 'pending',
  },
  {
    id: '17',
    registrationNumber: 'RC2026-017',
    teamName: 'Speed Demons',
    schoolName: 'New World International School',
    location: 'Улаанбаатар',
    category: 'Мини сумо робот (Автомат, 500 г)',
    teamSize: 2,
    teamMembers: [
      { name: 'Баттөр Энхтайван', grade: '10', role: 'Engineer' },
      { name: 'Номинбаяр Ганбаатар', grade: '11', role: 'Strategist' },
    ],
    contactPerson: {
      name: 'Энхтайван Бат',
      phone: '+976 9999-9999',
      email: 'enkhtaivan@newworld.edu.mn',
    },
    emergencyContact: {
      name: 'Бат Төмөр',
      phone: '+976 9999-0000',
      relationship: 'Эцэг',
    },
    registrationDate: '2026-01-13T09:30:00Z',
    paymentStatus: 'uploaded',
    paymentReceipt: '/receipts/receipt-017.jpg',
    status: 'pending',
  },
  {
    id: '18',
    registrationNumber: 'RC2026-018',
    teamName: 'Eagle Eyes',
    schoolName: 'Hobby School',
    location: 'Улаанбаатар',
    category: 'Drone RC control',
    teamSize: 2,
    teamMembers: [
      { name: 'Эрдэнэбаяр Ариунболд', grade: '11', role: 'Pilot' },
      { name: 'Сэргэлэн Баярмагнай', grade: '12', role: 'Spotter' },
    ],
    contactPerson: {
      name: 'Ариунболд Батсүх',
      phone: '+976 8800-1111',
      email: 'ariunbold@hobby.edu.mn',
    },
    emergencyContact: {
      name: 'Батсүх Энхболд',
      phone: '+976 8800-2222',
      relationship: 'Эцэг',
    },
    registrationDate: '2026-01-13T10:45:00Z',
    paymentStatus: 'verified',
    paymentReceipt: '/receipts/receipt-018.jpg',
    status: 'approved',
  },
  {
    id: '19',
    registrationNumber: 'RC2026-019',
    teamName: 'Innovation Squad',
    schoolName: 'Shine Ue School',
    location: 'Улаанбаатар',
    category: 'Rugby',
    teamSize: 5,
    teamMembers: [
      { name: 'Ганбаатар Төгөлдөр', grade: '10', role: 'Captain' },
      { name: 'Батмөнх Энхбаяр', grade: '10', role: 'Forward' },
      { name: 'Мөнхжаргал Баярсайхан', grade: '9', role: 'Defender' },
      { name: 'Төмөрбаатар Дашзэвэг', grade: '11', role: 'Midfielder' },
      { name: 'Энхтөр Ганбаатар', grade: '10', role: 'Goalkeeper' },
    ],
    contactPerson: {
      name: 'Төгөлдөр Батаа',
      phone: '+976 8811-3333',
      email: 'tuguldur@shineue.edu.mn',
    },
    emergencyContact: {
      name: 'Батаа Мөнх',
      phone: '+976 8811-4444',
      relationship: 'Эцэг',
    },
    registrationDate: '2026-01-13T11:30:00Z',
    paymentStatus: 'uploaded',
    paymentReceipt: '/receipts/receipt-019.jpg',
    status: 'pending',
  },
  {
    id: '20',
    registrationNumber: 'RC2026-020',
    teamName: 'Tech Titans',
    schoolName: 'Orchlon School',
    location: 'Улаанбаатар',
    category: 'FLL (6-10 анги)',
    teamSize: 4,
    teamMembers: [
      { name: 'Баярмагнай Цэрэндулам', grade: '9', role: 'Project Manager' },
      { name: 'Энхболд Батжаргал', grade: '8', role: 'Builder' },
      { name: 'Номинбаяр Төмөр', grade: '9', role: 'Programmer' },
      { name: 'Ариунаа Сэргэлэн', grade: '8', role: 'Presenter' },
    ],
    contactPerson: {
      name: 'Цэрэндулам Баатар',
      phone: '+976 8822-5555',
      email: 'tseren@orchlon.edu.mn',
    },
    emergencyContact: {
      name: 'Баатар Ганбаатар',
      phone: '+976 8822-6666',
      relationship: 'Эцэг',
    },
    registrationDate: '2026-01-13T13:00:00Z',
    paymentStatus: 'verified',
    paymentReceipt: '/receipts/receipt-020.jpg',
    status: 'approved',
  },
  {
    id: '21',
    registrationNumber: 'RC2026-021',
    teamName: 'Code Breakers',
    schoolName: 'Mongol Aspiration International School',
    location: 'Улаанбаатар',
    category: 'Цагаан шугам дагагч LEGO робот (6-10 анги)',
    teamSize: 2,
    teamMembers: [
      { name: 'Батдэлгэр Энхтайван', grade: '8', role: 'Developer' },
      { name: 'Мөнхцэцэг Баярмаа', grade: '9', role: 'Tester' },
    ],
    contactPerson: {
      name: 'Энхтайван Төмөр',
      phone: '+976 9900-7777',
      email: 'enkhtaivan@mais.edu.mn',
    },
    emergencyContact: {
      name: 'Төмөр Баатар',
      phone: '+976 9900-8888',
      relationship: 'Эцэг',
    },
    registrationDate: '2026-01-13T14:20:00Z',
    paymentStatus: 'not_uploaded',
    status: 'pending',
  },
  {
    id: '22',
    registrationNumber: 'RC2026-022',
    teamName: 'Sumo Kings',
    schoolName: 'Ikh Zasag School',
    location: 'Дархан',
    category: 'Сумо робот (Радио удирдлагатай, 3 кг)',
    teamSize: 2,
    teamMembers: [
      { name: 'Төмөрхүү Баттөр', grade: '12', role: 'Operator' },
      { name: 'Энхжаргал Мөнхбаяр', grade: '11', role: 'Technician' },
    ],
    contactPerson: {
      name: 'Баттөр Дорж',
      phone: '+976 7055-9999',
      email: 'battur@ikhzasag.edu.mn',
    },
    emergencyContact: {
      name: 'Дорж Баатар',
      phone: '+976 7055-0000',
      relationship: 'Эцэг',
    },
    registrationDate: '2026-01-13T15:10:00Z',
    paymentStatus: 'uploaded',
    paymentReceipt: '/receipts/receipt-022.jpg',
    status: 'pending',
  },
  {
    id: '23',
    registrationNumber: 'RC2026-023',
    teamName: 'Ultimate Racers',
    schoolName: 'International School of Ulaanbaatar',
    location: 'Улаанбаатар',
    category: 'Шугам дагагч робот (Насанд хүрэгчид)',
    teamSize: 2,
    teamMembers: [
      { name: 'Ганбаатар Баярсайхан', role: 'Engineer' },
      { name: 'Батсүх Энхболд', role: 'Designer' },
    ],
    contactPerson: {
      name: 'Ганбаатар Баярсайхан',
      phone: '+976 9911-1122',
      email: 'ganbaatar@isu.edu.mn',
    },
    emergencyContact: {
      name: 'Баярсайхан Төмөр',
      phone: '+976 9911-3344',
      relationship: 'Эцэг',
    },
    registrationDate: '2026-01-13T16:00:00Z',
    paymentStatus: 'verified',
    paymentReceipt: '/receipts/receipt-023.jpg',
    status: 'rejected',
    rejectionReason: 'Тоног төхөөрөмж шаардлага хангахгүй байна',
  },
  {
    id: '24',
    registrationNumber: 'RC2026-024',
    teamName: 'Mini Masters',
    schoolName: 'Erdenet School #5',
    location: 'Эрдэнэт',
    category: 'Мини сумо робот (Радио удирдлагатай, 500 г)',
    teamSize: 2,
    teamMembers: [
      { name: 'Батболд Төгөлдөр', grade: '10', role: 'Controller' },
      { name: 'Энхмөнх Баярмагнай', grade: '11', role: 'Builder' },
    ],
    contactPerson: {
      name: 'Төгөлдөр Ганбаатар',
      phone: '+976 7066-5555',
      email: 'tuguldur@erdenet5.edu.mn',
    },
    emergencyContact: {
      name: 'Ганбаатар Мөнх',
      phone: '+976 7066-6666',
      relationship: 'Эцэг',
    },
    registrationDate: '2026-01-13T17:30:00Z',
    paymentStatus: 'verified',
    paymentReceipt: '/receipts/receipt-024.jpg',
    status: 'approved',
  },
];

// Helper functions
export const getRegistrationsByStatus = (status: RegistrationStatus) => {
  return mockRegistrations.filter((reg) => reg.status === status);
};

export const getRegistrationsByCategory = (category: string) => {
  return mockRegistrations.filter((reg) => reg.category === category);
};

export const getRegistrationStats = () => {
  return {
    total: mockRegistrations.length,
    pending: mockRegistrations.filter((r) => r.status === 'pending').length,
    approved: mockRegistrations.filter((r) => r.status === 'approved').length,
    rejected: mockRegistrations.filter((r) => r.status === 'rejected').length,
    paymentVerified: mockRegistrations.filter((r) => r.paymentStatus === 'verified').length,
    paymentUploaded: mockRegistrations.filter((r) => r.paymentStatus === 'uploaded').length,
    paymentNotUploaded: mockRegistrations.filter((r) => r.paymentStatus === 'not_uploaded').length,
  };
};

export const getCategoryStats = () => {
  const stats: { [key: string]: number } = {};
  COMPETITION_CATEGORIES.forEach((category) => {
    stats[category] = mockRegistrations.filter((r) => r.category === category).length;
  });
  return stats;
};

export const getSchoolStats = () => {
  const stats: { [key: string]: number } = {};
  mockRegistrations.forEach((reg) => {
    stats[reg.schoolName] = (stats[reg.schoolName] || 0) + 1;
  });
  return Object.entries(stats)
    .map(([school, count]) => ({ school, count }))
    .sort((a, b) => b.count - a.count);
};
