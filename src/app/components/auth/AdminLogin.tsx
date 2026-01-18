import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CardBox from '../shared/CardBox'
import { ThemeToggle } from '../shared/ThemeToggle'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'

export const AdminLogin = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simple authentication - paper wall as requested
    // In production, credentials should be in environment variables
    const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin'
    const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'

    // Simulate a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Store admin session
      localStorage.setItem('adminAuth', 'true')
      localStorage.setItem('adminUsername', username)
      localStorage.setItem('adminLoginTime', new Date().toISOString())
      
      // Redirect to admin dashboard
      navigate('/admin/dashboard')
    } else {
      setError('Нэвтрэх нэр эсвэл нууц үг буруу байна')
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className='h-screen w-full flex justify-center items-center bg-lightprimary dark:bg-background relative'>
        <div className='absolute top-6 right-6'>
          <ThemeToggle />
        </div>
        <div className='md:min-w-[450px] min-w-max'>
          <CardBox>
            <div className='flex justify-center mb-4'>
              <div className='text-4xl font-bold text-primary'>MAIS</div>
            </div>
            <h2 className='text-2xl font-bold text-center mb-2'>
              Админ Удирдлагын Систем
            </h2>
            <p className='text-sm text-muted-foreground text-center mb-6'>
              MAIS Robot Challenge 2026
            </p>

            {error && (
              <Alert className='mb-4 border-error text-error'>
                {error}
              </Alert>
            )}

            <form onSubmit={handleLogin}>
              <div className='mb-4'>
                <div className='mb-2 block'>
                  <Label htmlFor='username' className='font-medium'>
                    Нэвтрэх нэр
                  </Label>
                </div>
                <Input
                  id='username'
                  type='text'
                  placeholder='Нэвтрэх нэрээ оруулна уу'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className='mb-6'>
                <div className='mb-2 block'>
                  <Label htmlFor='password' className='font-medium'>
                    Нууц үг
                  </Label>
                </div>
                <Input
                  id='password'
                  type='password'
                  placeholder='Нууц үгээ оруулна уу'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button 
                type='submit' 
                className='w-full'
                disabled={isLoading}
              >
                {isLoading ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
              </Button>
            </form>

            <div className='mt-6 p-4 bg-muted rounded-lg'>
              <p className='text-xs text-muted-foreground text-center'>
                <strong>Анхааруулга:</strong> Энэ систем нь зөвхөн администраторуудад зориулагдсан.
              </p>
            </div>
          </CardBox>
        </div>
      </div>
    </>
  )
}
