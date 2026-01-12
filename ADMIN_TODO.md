# Admin Page Development TODO

## Template Analysis - Available Components

### ✅ UI Components (from shadcn/ui)
- **Tables**: `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell` - Perfect for registration list
- **Cards**: `CardBox` component - For dashboard stats
- **Badges**: For status indicators (Pending, Approved, Rejected)
- **Buttons**: For actions (Approve, Reject, Edit)
- **Dialogs**: For confirmation modals and edit forms
- **Input/Select/Textarea**: For search, filters, and edit forms
- **Tabs**: For organizing different views
- **Dropdown Menu**: For action menus
- **Avatar**: For displaying user/school icons
- **Alert**: For warnings/notifications
- **Switch/Checkbox**: For filters
- **Calendar**: For date filtering

### ✅ Layout Components
- **Sidebar**: Already exists - need to customize menu items
- **Header**: Already exists - can reuse
- **Dashboard Layout**: Grid system already set up

### ✅ Dashboard Components We Can Adapt
- **TopCards**: Convert to stats cards (Total Registrations, Pending, Approved, etc.)
- **ProductPerformance Table**: Convert to Registrations Table
- **SalesOverview Chart**: Convert to Registration Trends Chart
- **RecentTransaction**: Convert to Recent Registrations Activity
- **YearlyBreakup**: Convert to Category Distribution Chart

---

## Phase 1: Core Admin Features

### 1. Authentication & Setup
- [ ] Create simple admin login page (`/admin/login`)
  - Username/password form
  - Store credentials in environment variables
  - Use localStorage/sessionStorage for session management
  - Redirect to dashboard on success
- [ ] Create admin route protection middleware
- [ ] Set up logout functionality

### 2. Dashboard Overview Page (`/admin/dashboard`)
- [ ] **Stats Cards** (adapt TopCards component)
  - [ ] Total Registrations count
  - [ ] Pending Approvals count
  - [ ] Approved Registrations count
  - [ ] Rejected Registrations count
  - [ ] Registrations by Category breakdown
- [ ] **Registration Trends Chart** (adapt SalesOverview)
  - [ ] Line/bar chart showing registrations over time
  - [ ] Filter by date range
- [ ] **Category Distribution Chart** (adapt YearlyBreakup)
  - [ ] Pie/donut chart showing registrations per category
- [ ] **Recent Activity Feed** (adapt RecentTransaction)
  - [ ] Latest 5-10 registrations
  - [ ] Color-coded by status
  - [ ] Quick action buttons

### 3. Registrations Management Page (`/admin/registrations`)
- [ ] **Registrations Table** (adapt ProductPerformance)
  - [ ] Columns:
    - ID/Registration Number
    - Team Name
    - School/Organization
    - Competition Category
    - Registration Date
    - Payment Status (Receipt uploaded/verified)
    - Status (Pending/Approved/Rejected)
    - Actions (View/Approve/Reject/Edit)
  - [ ] Pagination
  - [ ] Sortable columns
  - [ ] Row selection (bulk actions)
  
- [ ] **Search & Filter Panel**
  - [ ] Search by: Team name, School, ID
  - [ ] Filter by:
    - Status (All/Pending/Approved/Rejected)
    - Competition Category (dropdown)
    - School/Organization (dropdown/autocomplete)
    - Date range (date picker)
    - Payment status
  - [ ] Clear filters button
  - [ ] Export filtered data button (CSV/Excel)

- [ ] **View Registration Details Dialog**
  - [ ] Full registration information
  - [ ] Team members list
  - [ ] Contact information
  - [ ] Payment receipt viewer/downloader
  - [ ] Registration timestamp
  - [ ] Action buttons (Approve/Reject)

- [ ] **Approve/Reject Actions**
  - [ ] Approve button with confirmation dialog
  - [ ] Reject button with reason input (optional)
  - [ ] Bulk approve/reject for selected registrations
  - [ ] Status change notification/feedback

- [ ] **Edit Registration (Protected)**
  - [ ] Edit dialog with form
  - [ ] All fields editable
  - [ ] Confirmation warning: "This action will be logged"
  - [ ] Log edit action with:
    - Timestamp
    - Admin identifier (from login)
    - Fields changed (before/after values)
  - [ ] Require confirmation before saving

### 4. Analytics Page (`/admin/analytics`)
- [ ] **Overview Statistics**
  - [ ] Total registrations (with growth %)
  - [ ] Registrations per category (bar chart)
  - [ ] Registrations per school (top 10 table)
  - [ ] Registration timeline (line chart)
  
- [ ] **Category Breakdown**
  - [ ] Pie chart of all 12 categories
  - [ ] Table with count per category
  
- [ ] **School/Organization Analysis**
  - [ ] Table showing all schools with registration counts
  - [ ] Geographic distribution (if location data available)

- [ ] **Time-based Analysis**
  - [ ] Registrations per day/week
  - [ ] Peak registration times
  - [ ] Days until deadline tracker

### 5. Audit Log Page (`/admin/audit-log`)
- [ ] **Edit History Table**
  - [ ] Timestamp
  - [ ] Admin identifier
  - [ ] Registration ID/Team affected
  - [ ] Fields changed (before → after)
  - [ ] Search and filter by date, admin, registration
  - [ ] Export audit log

### 6. Sidebar Navigation Updates
- [ ] Update sidebar menu items:
  - Dashboard (stats overview)
  - Registrations (main management page)
  - Analytics (charts and reports)
  - Audit Log (edit history)
  - Settings (admin password change, etc.)
  - Logout

---

## Phase 2: Backend Integration (After Frontend Complete)

### 7. API Integration
- [ ] Set up API endpoints:
  - [ ] GET `/api/registrations` - Fetch all registrations
  - [ ] GET `/api/registrations/:id` - Fetch single registration
  - [ ] PUT `/api/registrations/:id/approve` - Approve registration
  - [ ] PUT `/api/registrations/:id/reject` - Reject registration
  - [ ] PUT `/api/registrations/:id` - Edit registration (protected)
  - [ ] GET `/api/stats` - Dashboard statistics
  - [ ] GET `/api/audit-log` - Fetch audit logs
  - [ ] POST `/api/auth/login` - Admin login
  - [ ] POST `/api/auth/logout` - Admin logout

- [ ] Connect frontend to backend APIs
- [ ] Add loading states for all API calls
- [ ] Add error handling and user feedback
- [ ] Implement optimistic updates where appropriate

### 8. Data Management
- [ ] Define database schema for:
  - Registrations table
  - Teams table
  - Audit log table
  - Admin user (simple, just one account)
  
- [ ] Set up file storage for payment receipts
- [ ] Implement data export functionality (CSV/Excel)

---

## Phase 3: Polish & Deployment

### 9. UX Enhancements
- [ ] Add loading skeletons for tables/cards
- [ ] Add empty states for no data
- [ ] Add success/error toast notifications
- [ ] Add keyboard shortcuts for common actions
- [ ] Improve mobile responsiveness
- [ ] Add dark mode support (already in template)

### 10. Testing & Optimization
- [ ] Test all user flows
- [ ] Test with mock data
- [ ] Performance optimization
- [ ] Security audit (especially edit logging)

### 11. Documentation
- [ ] Admin user guide
- [ ] API documentation for backend team
- [ ] Deployment instructions

---

## Priority Order (Recommended)

### Week 1: Foundation
1. Authentication (login page + protection)
2. Dashboard layout with stats cards
3. Basic registrations table

### Week 2: Core Features
4. Registration details view
5. Approve/reject functionality
6. Search and filters
7. Edit with audit logging

### Week 3: Analytics & Polish
8. Analytics page with charts
9. Audit log viewer
10. Export functionality
11. UX polish and testing

---

## Notes
- The template already has excellent table, card, and chart components
- Focus on adapting existing components rather than building from scratch
- Keep it simple initially - can add features incrementally
- Test the edit logging thoroughly - it's a critical security feature
