import { useEffect, useState } from 'react'
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
import DashboardLayout from '@/app/dashboard/layout'

// Admin pages
import AdminDashboardPage from '@/app/admin/dashboard/page'
import AdminEventsPage from '@/app/admin/events/page'
import AdminRegistrationsPage from '@/app/admin/registrations/page'
import AdminAnalyticsPage from '@/app/admin/analytics/page'
import AdminAuditLogPage from '@/app/admin/audit-log/page'
import AdminSettingsPage from '@/app/admin/settings/page'
import AdminLayout from '@/app/admin/layout'

function UserProtectedRoute({ children }: { children: React.ReactNode }) {
  const { organisation, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!organisation) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const authenticated = typeof window !== 'undefined' && localStorage.getItem('adminAuth') === 'true'
    setIsAuthenticated(authenticated)
    setIsChecking(false)
  }, [])

  if (isChecking) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
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

      {/* Dashboard routes with layout */}
      <Route
        path="/dashboard"
        element={
          <UserProtectedRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </UserProtectedRoute>
        }
      />
      <Route
        path="/dashboard/profile"
        element={
          <UserProtectedRoute>
            <DashboardLayout>
              <DashboardProfilePage />
            </DashboardLayout>
          </UserProtectedRoute>
        }
      />
      <Route
        path="/dashboard/events"
        element={
          <UserProtectedRoute>
            <DashboardLayout>
              <DashboardEventsPage />
            </DashboardLayout>
          </UserProtectedRoute>
        }
      />
      <Route
        path="/dashboard/events/:id"
        element={
          <UserProtectedRoute>
            <DashboardLayout>
              <EventDetailPage />
            </DashboardLayout>
          </UserProtectedRoute>
        }
      />
      <Route
        path="/dashboard/team-members/contestant"
        element={
          <UserProtectedRoute>
            <DashboardLayout>
              <DashboardTeamContestantPage />
            </DashboardLayout>
          </UserProtectedRoute>
        }
      />
      <Route
        path="/dashboard/team-members/coach"
        element={
          <UserProtectedRoute>
            <DashboardLayout>
              <DashboardTeamCoachPage />
            </DashboardLayout>
          </UserProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminDashboardPage />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminDashboardPage />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/events"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminEventsPage />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/registrations"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminRegistrationsPage />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminAnalyticsPage />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/audit-log"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminAuditLogPage />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminSettingsPage />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
