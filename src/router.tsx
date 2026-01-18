import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

// Auth pages
import LoginPage from '@/app/login/page'
import RegisterPage from '@/app/register/page'
import ForgotPasswordPage from '@/app/forgot-password/page'
import AdminLoginPage from '@/app/admin/login/page'

// Public pages
import HomePage from '@/app/page'

// Dashboard pages
import DashboardPage from '@/app/dashboard/page'
import DashboardProfilePage from '@/app/dashboard/profile/page'
import DashboardEventsPage from '@/app/dashboard/events/page'
import EventDetailPage from '@/app/dashboard/events/[id]/page'
import DashboardTeamContestantPage from '@/app/dashboard/team-members/contestant/page'
import DashboardTeamCoachPage from '@/app/dashboard/team-members/coach/page'

// Admin pages
import AdminDashboardPage from '@/app/admin/dashboard/page'
import AdminEventsPage from '@/app/admin/events/page'
import AdminRegistrationsPage from '@/app/admin/registrations/page'
import AdminAnalyticsPage from '@/app/admin/analytics/page'
import AdminAuditLogPage from '@/app/admin/audit-log/page'

// Protected route wrapper
function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const { organisation, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!organisation) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Dashboard routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/profile"
        element={
          <ProtectedRoute>
            <DashboardProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/events"
        element={
          <ProtectedRoute>
            <DashboardEventsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/events/:id"
        element={
          <ProtectedRoute>
            <EventDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/team-members/contestant"
        element={
          <ProtectedRoute>
            <DashboardTeamContestantPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/team-members/coach"
        element={
          <ProtectedRoute>
            <DashboardTeamCoachPage />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requireAdmin>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/events"
        element={
          <ProtectedRoute requireAdmin>
            <AdminEventsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/registrations"
        element={
          <ProtectedRoute requireAdmin>
            <AdminRegistrationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute requireAdmin>
            <AdminAnalyticsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit-log"
        element={
          <ProtectedRoute requireAdmin>
            <AdminAuditLogPage />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
