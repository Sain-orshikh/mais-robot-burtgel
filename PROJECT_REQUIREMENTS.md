# MAIS Robot Challenge Competition - Project Requirements

## Project Overview
- **Event**: Robot Challenge Competition at MAIS (Mongol Aspiration International School)
- **Scope**: National competition - participants from all over Mongolia
- **Development Team**: 
  - Registration page: Another developer
  - Admin page + Backend: You

---

## Competition Categories

### Line Following Robots
1. **Шугам дагагч робот (Насанд хүрэгчид)** - Line follower robot (Adults)
2. **Цагаан шугам дагагч робот (8-12 анги)** - White line follower robot (Grades 8-12)
3. **Цагаан шугам дагагч LEGO робот (6-10 анги)** - White line follower LEGO robot (Grades 6-10)
   - Equipment: LEGO Mindstorms EV3 or SPIKE set

### Sumo Robots
4. **Сумо робот (Автомат, 3 кг)** - Sumo robot (Automatic, 3 kg)
5. **Сумо робот (Радио удирдлагатай, 3 кг)** - Sumo robot (Radio controlled, 3 kg)
6. **Мини сумо робот (Автомат, 500 г)** - Mini sumo robot (Automatic, 500 g)
7. **Мини сумо робот (Радио удирдлагатай, 500 г)** - Mini sumo robot (Radio controlled, 500 g)
8. **LEGO сумо робот (Автомат, 1 кг, 8-10 анги)** - LEGO sumo robot (Automatic, 1 kg, Grades 8-10)

### LEGO Competitions
9. **FLL (6-10 анги)** - First LEGO League (Grades 6-10)
   - Equipment: LEGO Mindstorms EV3 or SPIKE set

### Drone Competitions
10. **Drone RC control** - Drone with remote control
11. **Drone code Automat** - Autonomous drone (code-based)

### Robot Sports
12. **Rugby** - Robot rugby competition

---

## Registration & Participant Data

### Team Structure
- **Registration Type**: Team-based (not individual)
- **Team Size**: Varies by competition category
  - Rugby: 5 members per team
  - Sumo robots: 2 members per team
  - Other categories: TBD
- **Age/Grade Groups**: No age restrictions - all students compete together

### Required Information (To be confirmed)
**Personal Information:**
- Full name
- Contact information
- (Other personal details TBD)

**School/Organization Details:**
- School or organization name
- Location/region
- (Other organizational details TBD)

**Team Information:**
- Team name
- Team members list
- Selected competition category

### Payment & Registration Flow
1. **Payment Required**: Yes, registration fee applies
2. **Payment Process**:
   - User pays registration fee
   - User uploads payment receipt
   - Admin reviews and confirms payment
   - Upon approval, registration is confirmed
3. **Registration Status Flow**:
   - Pending → Payment uploaded → Admin review → Approved/Rejected

---

## Admin Page Functionalities

### Core Features (Phase 1)

1. **Registration Management**
   - ✅ View all registrations in list/table view
   - ✅ Approve/reject registrations
   - ✅ Edit registration details (EXTREME CASE ONLY)
     - Must be logged with timestamp and admin identifier
     - Protected action - requires confirmation
     - Audit trail for accountability
   - ✅ Search and filter registrations:
     - By school/organization
     - By competition category
     - By registration status (pending, approved, rejected)
   - ✅ View and verify payment receipts

2. **Analytics & Dashboard**
   - ✅ Total registrations count
   - ✅ Registrations by school
   - ✅ Registrations by category
   - ✅ Registration status breakdown
   - ✅ Registration trends over time

### Future Features (Phase 2 - Post Launch)

3. **Competition Day Management**
   - Assign teams to time slots/brackets
   - Track competition results/scores
   - Generate participant badges/certificates

### Authentication & Security

**Admin Authentication:**
- Single super admin account
- Simple authentication - acts as "paper wall"
- No complex backend authentication system needed
- Purpose: Prevent unauthorized access to admin page
- No role-based permissions or multi-user management

---

## Technical Stack (Current)
- **Frontend**: Next.js + Tailwind CSS (template cloned)
- **Backend**: To be developed
- **Database**: TBD
- **Hosting**: Netlify (based on netlify.toml presence)

---

*Last updated: January 13, 2026*
