import * as React from "react"

interface ThemeContextType {
  theme: string
  setTheme: (theme: string) => void
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({
  children,
  ...props
}: {
  children: React.ReactNode
  [key: string]: any
}) {
  const [theme, setTheme] = React.useState('light')

  React.useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light'
    setTheme(storedTheme)
    document.documentElement.classList.toggle('dark', storedTheme === 'dark')
  }, [])

  const updateTheme = (newTheme: string) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}