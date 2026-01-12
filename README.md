# MAIS Robot Challenge 2026 - Admin System

Competition registration and management system for Mongolia's premier robotics challenge.

## 🚀 Features

### Admin Dashboard
- **Authentication System**: Secure login/logout with localStorage-based auth
- **Statistics Overview**: 8 comprehensive stat cards tracking registrations, approvals, payments
- **Event Countdown**: Live countdown timer for registration and competition dates
- **Recent Activity**: Quick view of latest registrations

### Registration Management
- **Full CRUD Operations**: Create, read, update, and delete registrations
- **Status Management**: Approve, reject, or mark as pending
- **Payment Verification**: Track payment status (verified, uploaded, not uploaded)
- **Detailed View**: Complete registration information with team members and contacts

### Advanced Filtering
- **Multi-criteria Filtering**: Status, payment, location, school, category
- **Search Functionality**: Search across team names, registration numbers, schools, contacts
- **URL Parameter Support**: Direct links to filtered views from dashboard cards
- **Dynamic Options**: School and location filters auto-populate from actual data

### Analytics & Reporting
- **Comprehensive Statistics**: Category distribution, top schools, payment breakdown
- **Visual Charts**: Category visualization and trends
- **CSV Export**: Export filtered data for external analysis
- **Audit Log**: Complete history of admin actions with timestamps

## 🛠 Tech Stack

- **Framework**: Next.js 16.1.1 with Turbopack
- **UI Library**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript 5.9.3
- **Icons**: lucide-react
- **Date Handling**: date-fns with Mongolian locale
- **State Management**: React hooks

## 📋 Competition Categories

1. Цагаан шугам дагагч робот (8-12 анги)
2. Цагаан шугам дагагч LEGO робот (6-10 анги)
3. Шугам дагагч робот (Насанд хүрэгчид)
4. Сумо робот (Автомат, 3 кг)
5. Сумо робот (Радио удирдлагатай, 3 кг)
6. Мини сумо робот (Автомат, 500 г)
7. Мини сумо робот (Радио удирдлагатай, 500 г)
8. LEGO сумо робот (Автомат, 1 кг, 8-10 анги)
9. FLL (6-10 анги)
10. Rugby
11. Drone code Automat
12. Drone RC control

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Admin Login

Default credentials (stored in `.env.local`):
- Username: `admin`
- Password: `mais2026`

Access admin dashboard at [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── dashboard/         # Main admin dashboard
│   │   ├── registrations/     # Registration management
│   │   ├── analytics/         # Statistics and reports
│   │   ├── audit-log/        # Action history
│   │   └── login/            # Admin authentication
│   └── components/
│       └── admin/            # Admin-specific components
├── data/
│   ├── mockRegistrations.ts  # Sample data (24 registrations)
│   └── auditLog.ts          # Audit trail storage
├── hooks/
│   └── useAdminAuth.ts      # Authentication hook
└── components/ui/           # shadcn/ui components
```

## 🎯 Key Components

- **AdminStatsCards**: Dashboard statistics with clickable filters
- **EventCountdownCard**: Live countdown to event milestones
- **RegistrationFilters**: Advanced filtering with URL sync
- **RegistrationsTable**: Data table with inline actions
- **EditRegistrationDialog**: Full registration editing
- **AuditLog**: Complete admin action history

## 📊 Mock Data

Includes 24 sample registrations with:
- Diverse schools across Mongolia (Улаанбаатар, Дархан, Завхан, Эрдэнэт)
- All 12 competition categories represented
- Mixed statuses: approved, pending, rejected
- Varied payment statuses
- Realistic Mongolian names and contact information

## 🔐 Security Note

Current implementation uses localStorage-based authentication for frontend-only demo purposes. For production deployment, implement proper backend authentication with:
- JWT tokens or session-based auth
- Password hashing (bcrypt)
- HTTPS-only cookies
- Rate limiting
- CSRF protection

## 🌐 Language

Interface is in Mongolian (Cyrillic script) to serve the local robotics community.

## 📝 Next Steps

- [ ] Backend API development (Express.js/Node.js)
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Real authentication system
- [ ] Email notifications
- [ ] Public registration form
- [ ] Payment gateway integration
- [ ] Certificate generation
- [ ] Mobile app consideration

## 📄 License

Private project for MAIS Robot Challenge 2026

## 👥 Contact

For questions about the competition or system:
- Organization: Mongol Aspiration International School
- Event: MAIS Robot Challenge 2026
