import { AppRoutes } from '@/router'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/hooks/useAuth'
import { ThemeProvider } from '@/components/theme-provider'
import './app/css/globals.css'
import './App.css'

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange
      >
        <>
          <AppRoutes />
          <Toaster />
        </>
      </ThemeProvider>
    </AuthProvider>
  )
}
