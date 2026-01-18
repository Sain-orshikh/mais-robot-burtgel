import React from 'react'
import './css/globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/hooks/useAuth'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {  
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link rel='icon' href='/favicon.ico' type='image/x-icon' />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#5d87ff" />
      </head>
      <body className="font-sans">
        <AuthProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
