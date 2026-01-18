import { AppRoutes } from '@/router'
import { Toaster } from '@/components/ui/toaster'
import './App.css'

export default function App() {
  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  )
}
