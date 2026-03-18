# MAIS Robot Challenge 2026 - Complete Project Context

**Last Updated**: March 18, 2026  
**Project Status**: Framework migration complete, ready for deployment  
**Conversion**: Next.js 16.1.1 → Vite 5.0.8 + React Router 6.20.0

---

## 📋 Project Overview

**MAIS Robot Challenge 2026** is a comprehensive competition management system for Mongolia's premier robotics challenge. The project consists of a full-stack application with:

- **Frontend**: Vite + React 19.2.3 with TypeScript 5.9.3 (converted from Next.js)
- **Backend**: Express.js 5.2.1 with Node.js
- **Database**: MongoDB 9.0.1
- **Hosting**: cPanel, Netlify, Docker, and Vercel ready

### Key Statistics
- **Frontend Build Size**: 589 kB (gzip) - 131 files in dist/
- **Build Time**: ~35 seconds
- **Framework Migration**: Complete ✅
- **Type Safety**: Full TypeScript coverage
- **UI Components**: shadcn/ui + Tailwind CSS

---

## 🎯 Purpose & Scope

The system manages:
1. **Competition registration** - Teams register for robotics competitions
2. **Admin panel** - Manage registrations, verify payments, generate reports
3. **User dashboard** - Participants track their teams and contest status
4. **Payment tracking** - Verify and manage registration fees
5. **Analytics & reporting** - Export data, view statistics, audit logs

### Competition Categories (12 Total)

1. **Line Following Robots**
   - Цагаан шугам дагагч робот (8-12 анги) - White line follower, grades 8-12
   - Цагаан шугам дагагч LEGO робот (6-10 анги) - LEGO line follower, grades 6-10
   - Шугам дагагч робот (Насанд хүрэгчид) - Line follower, adults

2. **Sumo Robots** (5 categories)
   - Automatic 3 kg, Radio-controlled 3 kg
   - Automatic 500 g, Radio-controlled 500 g
   - LEGO automatic 1 kg (grades 8-10)

3. **Other Competitions** (4 categories)
   - FLL (First LEGO League, grades 6-10)
   - Rugby
   - Drone RC control
   - Drone code Automat

---

## 🏗️ Architecture Overview

### Frontend Architecture
```
src/
├── main.tsx              # React entry point
├── App.tsx               # Root component wrapper
├── router.tsx            # Route configuration (13 routes)
├── vite-env.d.ts         # Vite environment types
├── index.css             # Global styles
├── App.css               # App styles
├── app/                  # Page components
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   ├── admin/            # Admin panel
│   │   ├── login/        # Admin login
│   │   ├── dashboard/    # Dashboard, analytics, audit log, events
│   │   ├── registrations/# Registration management
│   │   └── layout.tsx    # Admin layout
│   ├── dashboard/        # User dashboard
│   │   ├── profile/      # Profile management
│   │   ├── events/       # Event viewing
│   │   └── team-members/ # Team management
│   ├── login/            # User login
│   ├── register/         # Registration page
│   ├── forgot-password/  # Password recovery
│   └── [...slug]/        # Catch-all/404 handling
├── components/
│   ├── admin/            # Admin-specific components
│   ├── auth/             # Auth components
│   ├── dashboard/        # Dashboard components
│   ├── events/           # Event components
│   ├── shared/           # Shared components
│   ├── ui/               # shadcn/ui components
│   └── theme-provider.tsx# Theme context
├── hooks/
│   ├── useAuth.tsx       # Authentication hook
│   ├── useAdminAuth.ts   # Admin authentication
│   └── use-toast.ts      # Toast notifications
├── lib/
│   ├── api/              # API integration
│   ├── cloudinary.ts     # Cloudinary config
│   └── utils.ts          # Utility functions
├── types/
│   ├── models.ts         # TypeScript models
│   └── heic2any.d.ts     # HEIC image type definitions
├── data/
│   ├── mockRegistrations.ts # Sample data (24 registrations)
│   ├── mockUserData.ts      # User mock data
│   └── auditLog.ts          # Audit log data structure
└── css/
    ├── app.css              # App styles
    ├── globals.css          # Global styles
    ├── layouts/             # Layout styles
    └── override/            # Override styles
```

### Backend Architecture
```
backend/
├── server.js             # Express server entry point
├── package.json          # Backend dependencies
├── .env                  # Environment variables
├── db/
│   └── connectMongoDB.js # MongoDB connection
├── config/
│   └── categories.js     # Competition categories definition
├── models/               # Mongoose schemas
│   ├── admin.model.js
│   ├── coach.model.js
│   ├── contestant.model.js # Player information
│   ├── counter.model.js     # Auto-increment IDs
│   ├── event.model.js       # Event/competition data
│   ├── organisation.model.js# School/organization info
│   ├── payment.model.js     # Payment records
│   └── team.model.js        # Team registration data
├── controllers/          # Business logic
│   ├── admin.controller.js
│   ├── auth.controller.js
│   ├── coach.controller.js
│   ├── contestant.controller.js
│   ├── event.controller.js
│   ├── export.controller.js  # CSV export functionality
│   ├── organisation.controller.js
│   ├── payment.controller.js
│   └── team.controller.js
├── routes/               # API endpoints
│   ├── admin.route.js
│   ├── auth.route.js
│   ├── coach.route.js
│   ├── contestant.route.js
│   ├── event.route.js
│   ├── export.route.js
│   ├── organisation.route.js
│   ├── payment.route.js
│   └── team.route.js
├── middleware/           # Express middleware
│   ├── optionalAuth.js
│   ├── protectOrganisationRoute.js
│   └── protectRoute.js
└── utils/
    ├── createAdmin.js
    ├── dropEmailIndex.js
    ├── generateIds.js       # Generate team/event IDs
    ├── generateOrgId.js     # Generate organization IDs
    ├── generateToken.js     # JWT token generation
    ├── sendEmail.js         # Email notifications
    └── uploadToCloudinary.js
```

---

## 🔐 Authentication System

### Admin Authentication
- **Type**: Simple authentication (localStorage-based)
- **Default Credentials** (from `.env.local`):
  - Username: `admin`
  - Password: `mais2026`
- **Access**: Admin dashboard at `/admin/login`
- **Purpose**: Prevent unauthorized access to admin panel
- **Note**: Simple "paper wall" - not complex backend auth system

### User Authentication
- **Type**: Organization/School-based authentication
- **Storage**: localStorage with secure token (JWT)
- **Protected Routes**: Dashboard and profile pages
- **Session**: Automatic logout on token expiration or page refresh without auth

### Route Protection
- **Public Routes**: `/`, `/login`, `/register`, `/forgot-password`, `/admin/login`
- **Protected Routes**: `/dashboard/*`, `/admin/*` (except admin login)
- **Protection Method**: ProtectedRoute wrapper component in router.tsx

---

## 🛠️ Technology Stack

### Frontend Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| React | 19.2.3 | UI framework |
| TypeScript | 5.9.3 | Type safety |
| Vite | 5.0.8 | Build tool |
| React Router DOM | 6.20.0 | Client-side routing |
| Tailwind CSS | 4.1.18 | Styling |
| shadcn/ui | Latest | UI components |
| Lucide React | 0.540.0 | Icons |
| ApexCharts | 3.49.1 | Charts and graphs |
| date-fns | 4.1.0 | Date manipulation (Mongolian locale) |
| React Table | 8.21.3 | Data tables |
| TanStack React Query (via SWR) | 2.3.3 | Data fetching |
| Embla Carousel | 8.6.0 | Carousel component |
| Heic2Any | 0.0.4 | HEIC image conversion |

### Backend Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| Express | 5.2.1 | Web server |
| Node.js | 20+ | Runtime |
| MongoDB Mongoose | 9.0.1 | Database ODM |
| JWT | 9.0.3 | Token authentication |
| Bcryptjs | 3.0.3 | Password hashing |
| Cors | 2.8.5 | CORS handling |
| Nodemailer | 6.10.1 | Email sending |
| Cloudinary | 2.8.0 | Image/file hosting |
| Multer | 2.0.2 | File upload handling |
| Cookie Parser | 1.4.7 | Cookie processing |
| Dotenv | 17.2.3 | Environment variables |

### Development Tools
| Package | Purpose |
|---------|---------|
| Vite | Fast build and dev server |
| Vite React Plugin | React JSX support in Vite |
| TypeScript | Type checking |
| ESLint | Code linting |
| PostCSS | CSS processing |
| Tailwind CSS | Utility-first CSS |

---

## 📁 Key Files & Configuration

### Root Level Configuration
| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite build configuration, API proxy setup |
| `tsconfig.json` | TypeScript compiler options |
| `tailwind.config.ts` | Tailwind CSS customization |
| `postcss.config.mjs` | PostCSS plugins (Tailwind) |
| `index.html` | Vite entry point (root HTML) |
| `components.json` | shadcn/ui configuration |
| `vercel.json` | Vercel deployment config |
| `netlify.toml` | Netlify deployment config |
| `dockerfile` | Docker containerization config |
| `.htaccess` | cPanel routing (in dist/) |

### Environment Variables

**Frontend** (`src/.env.local` or `.env.production`):
```env
VITE_API_URL=http://localhost:5000          # Backend API URL
VITE_ADMIN_USERNAME=admin                   # Admin panel username
VITE_ADMIN_PASSWORD=mais2026                # Admin panel password
VITE_CLOUDINARY_CLOUD_NAME=                 # Cloudinary config
VITE_CLOUDINARY_UPLOAD_PRESET=              # Cloudinary preset
VITE_CLOUDINARY_API_KEY=                    # Image upload
VITE_CLOUDINARY_API_SECRET=                 # Image upload secret
VITE_BANK_NAME=                             # Payment info
VITE_BANK_ACCOUNT_NAME=                     # Payment info
VITE_BANK_ACCOUNT_NUMBER=                   # Payment info
```

**Backend** (`backend/.env`):
```env
PORT=5000
MONGODB_URI=                                # MongoDB connection
JWT_SECRET=                                 # JWT secret key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=mais2026
CLOUDINARY_CLOUD_NAME=                      # Cloudinary config
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
VITE_CLOUDINARY_ALUMNI_WEBP_B_CLOUD_NAME=  # Secondary Cloudinary
CLOUDINARY_ALUMNI_WEBP_B_API_KEY=
CLOUDINARY_ALUMNI_WEBP_B_API_SECRET=
NODEMAILER_USER=                            # Email config
NODEMAILER_PASSWORD=                        # App-specific password
FRONTEND_URL=http://localhost:3000          # Frontend URL for CORS
```

---

## 🚀 Developer Workflows

### Local Development

**Setup:**
```bash
# Install dependencies (frontend)
npm install

# Install dependencies (backend)
cd backend
npm install

# Create .env files with configuration
```

**Development Servers:**
```bash
# Terminal 1: Frontend (port 3000)
npm run dev

# Terminal 2: Backend (port 5000)
cd backend
npm run dev

# API proxy: /api/* routes go to http://localhost:5000
```

**Build:**
```bash
# Frontend - creates dist/ folder
npm run build

# After building with env variables set, dist/ is production-ready
```

### Testing Admin Panel
- **Access**: http://localhost:3000/admin/login
- **Username**: admin (from VITE_ADMIN_USERNAME)
- **Password**: mais2026 (from VITE_ADMIN_PASSWORD)

---

## 📊 Admin Dashboard Features

### Core Pages
1. **Dashboard** (`/admin/dashboard`)
   - 8 statistic cards (registrations, approvals, payments)
   - Event countdown timer
   - Recent activity feed
   - Quick stats overview

2. **Registrations** (`/admin/registrations`)
   - List/table view of all registrations
   - Multi-criteria filtering:
     - Status (pending, approved, rejected)
     - Payment status (verified, uploaded, not uploaded)
     - Location/school
     - Competition category
   - Search across team names, registration numbers, schools
   - Approve/reject actions with audit trail
   - View payment receipts
   - Edit registration details (with timestamp audit)

3. **Analytics** (`/admin/analytics`)
   - Category distribution charts
   - Top schools statistics
   - Payment breakdown
   - CSV export of filtered data

4. **Audit Log** (`/admin/audit-log`)
   - Complete history of admin actions
   - Timestamps and admin identifiers
   - Sortable and filterable activity log

---

## 📱 User Dashboard Features

### Pages
1. **Dashboard** (`/dashboard`)
   - Overview of team registrations
   - Event participation status

2. **Profile** (`/dashboard/profile`)
   - Organization/school information
   - Contact details
   - Profile settings

3. **Events** (`/dashboard/events`)
   - View available events
   - See registration deadlines
   - View team assignments

4. **Team Members** (`/dashboard/team-members`)
   - Contestant management
   - Coach information
   - Team roster

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new organization
- `POST /api/auth/logout` - Logout user
- `GET /api/health` - Health check

### Admin APIs
- `GET /api/admins` - Get admin info
- `POST /api/admins/login` - Admin login

### Organisations
- `GET /api/organisations` - List all organizations
- `POST /api/organisations` - Create organization
- `PUT /api/organisations/:id` - Update organization
- `DELETE /api/organisations/:id` - Delete organization

### Contestants (Players)
- `GET /api/contestants` - List contestants
- `POST /api/contestants` - Create contestant
- `PUT /api/contestants/:id` - Update contestant
- `DELETE /api/contestants/:id` - Delete contestant

### Coaches
- `GET /api/coaches` - List coaches
- `POST /api/coaches` - Create coach
- `PUT /api/coaches/:id` - Update coach
- `DELETE /api/coaches/:id` - Delete coach

### Teams
- `GET /api/teams` - List teams
- `POST /api/teams` - Register team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team

### Events
- `GET /api/events` - List events
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event

### Payments
- `GET /api/payments` - List payments
- `POST /api/payments` - Create payment
- `PUT /api/payments/:id` - Verify payment

### Export
- `GET /api/export/csv` - Export filtered data to CSV

---

## 📦 Build & Deployment

### Build Output
```
dist/                          # Production build directory
├── index.html                 # SPA entry point
├── .htaccess                  # Routing config (cPanel)
├── manifest.json              # PWA manifest
├── sw.js                      # Service worker
├── favicon.ico                # Favicon
├── assets/
│   ├── index-*.js            # Bundled JavaScript (584 kB gzip)
│   └── index-*.css           # Bundled CSS (4.84 kB gzip)
├── icons/                     # App icons
├── images/                    # Static images
└── news/                      # News data
```

### Deployment Options

#### 1. cPanel Deployment (Recommended)
- **Type**: Static file hosting
- **Process**: Upload `dist/` contents to `public_html`
- **Requirements**: `.htaccess` file for routing
- **Documentation**: See `CPANEL_DEPLOYMENT.md`
- **Node.js**: NOT required (static files only)

#### 2. Netlify Deployment
- **Configuration**: `netlify.toml` included
- **Automatic**: Push to Netlify-connected repository
- **Redirect**: Configured for SPA routing

#### 3. Vercel Deployment
- **Configuration**: `vercel.json` included
- **Framework**: Set to Vite
- **Output**: Uses `dist/` directory

#### 4. Docker Deployment
- **Dockerfile**: Included for containerization
- **Image**: Node.js Alpine 20
- **Port**: 3001
- **Use**: `docker build . -t mais-robot` and `docker run`

---

## 🔄 Framework Migration Summary

### Conversion Completed: Next.js → Vite + React Router

**What Changed:**
1. **Entry Point**: `app/layout.tsx` → `src/main.tsx`
2. **Router**: Next.js App Router → React Router v6
3. **Navigation**: `Link href→to`, `router.push()→navigate()`
4. **Paths**: `usePathname()→useLocation().pathname`
5. **Theme**: `next-themes→custom context provider`
6. **Build**: `npm run build` (same, but output to `dist/`)

**Migration Statistics:**
- ✅ 30+ files converted
- ✅ 26 Link href→to replacements
- ✅ 20+ router.push→navigate replacements
- ✅ 10+ useRouter→useNavigate conversions
- ✅ All TypeScript types maintained
- ✅ Zero breaking changes for UI

**Why Migrate?**
- Better performance (Vite vs Next.js build)
- Faster dev server (Vite = sub-100ms HMR)
- Smaller bundle size (~584 kB vs larger Next.js)
- Better cPanel compatibility (pure static files)
- Simpler deployment (no Node.js needed on server)

---

## 🐛 Troubleshooting & Common Issues

### Environment Variables Not Loading
- **Issue**: Vite compiles variables at build time
- **Solution**: Set variables in `.env.local` BEFORE building
- **Change after build**: Rebuild with new `.env` file

### API Calls 404
- **Issue**: Backend not running or CORS origin not allowed
- **Solution**: 
  1. Start backend: `cd backend && npm run dev`
  2. Check backend CORS config in `server.js` (allowedOrigins)
  3. Verify `VITE_API_URL` matches backend URL

### Admin Login Not Working
- **Issue**: Wrong credentials
- **Solution**: Check `VITE_ADMIN_USERNAME` and `VITE_ADMIN_PASSWORD` in `.env.local`
- **Default**: admin / mais2026

### Build Fails with TypeScript Errors
- **Solution**: Run `npm run build` to see detailed errors
- **Note**: Frontend uses strict TypeScript config

### Service Worker Issues
- **Location**: `public/sw.js`
- **For PWA**: Verify `manifest.json` configuration
- **Cache clearing**: Hard refresh (Ctrl+Shift+R)

---

## 📝 Data Models

### Key Mongoose Schemas

#### Contestant (Player)
```
- contestantId: Unique ID
- ovog: Last name
- ner: First name
- register: Registration number
- email: Email address
- tursunUdur: Date of birth
- gender: male/female
- phoneNumber: Contact number
- organisationId: Reference to school
- participations: Array of event registrations
```

#### Team
```
- teamId: Unique team identifier
- organisationId: School/organization reference
- eventId: Event reference
- categoryCode: Competition category (MNR, MGR, etc.)
- categoryName: Full category name
- robotName: Team's robot name
- contestantIds: Array of players
- coachId: Coach reference
- status: active/withdrawn
- paymentId: Payment reference
```

#### Event
```
- name: Event name
- description: Event details
- startDate: Event start
- endDate: Event end
- registrationStart: Registration opens
- registrationEnd: Registration closes
- location: Event location
- categories: Array of competition categories with constraints
- registrations: Array of team registrations
```

#### Payment
```
- teamId: Team being charged
- amount: Registration fee
- status: pending/verified/rejected
- receiptUrl: Payment proof image
- verifiedBy: Admin who verified
- verifiedAt: Verification timestamp
```

---

## 📚 Project Resources

### Documentation Files
- `README.md` - Quick start guide
- `PROJECT_REQUIREMENTS.md` - Original requirements document
- `VITE_CONVERSION_SUMMARY.md` - Migration details
- `VITE_DEPLOYMENT.md` - Frontend deployment guide
- `CPANEL_DEPLOYMENT.md` - cPanel-specific guide
- `PRE_DEPLOYMENT_CHECKLIST.md` - Deployment verification
- `PUBLIC_FOLDER_CLEANUP.md` - Cleanup instructions

### Key Hooks & Utilities
- `useAuth.tsx` - User authentication state
- `useAdminAuth.ts` - Admin authentication
- `use-toast.ts` - Toast notifications
- `lib/utils.ts` - Utility functions
- `lib/api/` - API integration functions
- `lib/cloudinary.ts` - Image upload configuration

---

## 🎓 For New Developers

### Getting Started Checklist
1. Clone repository
2. Run `npm install` in root
3. Run `npm install` in backend/
4. Create `.env.local` with backend URL and admin credentials
5. Create `backend/.env` with MongoDB and email config
6. Run `npm run dev` (frontend)
7. Run `cd backend && npm run dev` (backend in another terminal)
8. Visit http://localhost:3000
9. Admin panel at http://localhost:3000/admin/login

### Key Decisions Made
- **Vite instead of Next.js**: Better for static hosting, faster builds
- **React Router instead of Next.js Router**: Standard React approach, simpler routing
- **Tailwind + shadcn/ui**: Modern, maintainable styling
- **TypeScript strict mode**: Catch errors early, better IDE support
- **MongoDB**: Flexible schema for competition structure
- **JWT auth**: Stateless authentication
- **Cloudinary**: Reliable image hosting for payment receipts

### Common Customization Points
- **Categories**: Edit `backend/config/categories.js`
- **Admin credentials**: `VITE_ADMIN_USERNAME` and `VITE_ADMIN_PASSWORD`
- **Colors/Theme**: Tailwind config in `tailwind.config.ts`
- **API endpoints**: Update `VITE_API_URL` in environment
- **Email templates**: Modify `backend/utils/sendEmail.js`
- **Payment info**: Set bank details in environment variables

---

## 📞 Support & Questions

### Common Questions

**Q: Can I run the backend on a cPanel server?**
A: Yes, but requires cPanel Node.js support. Easier to use a separate API hosting (Railway, Render, etc.)

**Q: How do I backup the MongoDB data?**
A: Use MongoDB Atlas backups or `mongodump` command

**Q: Where do I store large files?**
A: Cloudinary is configured for image uploads (payment receipts, team photos)

**Q: How do update competitions after launch?**
A: Create new Event in database, configure categories, list in admin panel

**Q: Can I add more admin users?**
A: Currently single admin account. To add: Modify auth controller and create user management

---

## 🏁 Deployment Readiness

### Frontend Status: ✅ READY
- [x] Fully converted to Vite + React Router
- [x] All routes configured and tested
- [x] TypeScript compilation: 0 errors
- [x] Build succeeds consistently
- [x] Production build: 589 kB (gzip)
- [x] `.htaccess` included for SPA routing
- [x] Environment variables documented
- [x] Deployment guides created

### Backend Status: ✅ READY
- [x] Express server configured
- [x] MongoDB connection setup
- [x] All API routes defined
- [x] CORS configured
- [x] Error handling in place
- [x] Cloudinary integration complete

### Deployment Checklist
- [ ] Set up MongoDB instance (MongoDB Atlas or local)
- [ ] Configure environment variables
- [ ] Test locally with both frontend and backend
- [ ] Build frontend: `npm run build`
- [ ] Deploy frontend to cPanel/Netlify/Vercel
- [ ] Deploy backend to hosting provider
- [ ] Update CORS allowed origins in backend
- [ ] Test production deployment
- [ ] Set up SSL/HTTPS
- [ ] Monitor for errors

---

## 📅 Timeline & Next Steps

**Completed:**
- Framework migration (Next.js → Vite) ✅
- React Router configuration ✅
- TypeScript strict mode ✅
- Admin dashboard implementation ✅
- Backend API design ✅

**In Progress**
- Database configuration
- Email notifications
- Payment verification system

**Upcoming:**
- Competition day management
- Result tracking
- Badge/certificate generation
- Advanced reporting

---

**Generated**: March 18, 2026  
**Maintained by**: Development Team  
**Last Review**: Framework migration completion
