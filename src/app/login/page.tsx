'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      alert('Please fill in all fields')
      return
    }
    console.log('Login:', formData)
    router.push('/dashboard')
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-500 px-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-4 pb-4'>
          <div className='flex justify-center'>
            <img 
              src='/icons/12.jpg' 
              alt='Logo'
              className='w-32 h-32 object-contain rounded-lg'
            />
          </div>
          <h1 className='text-2xl font-bold text-center'>User Login</h1>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='Enter your email'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='Enter your password'
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
            <Button type='submit' className='w-full bg-blue-600 hover:bg-blue-700'>
              Login
            </Button>

            <div className='text-center text-sm text-gray-600 mt-4'>
              Doesn&apos;t have an account?{' '}
              <Link href='/register' className='text-blue-600 hover:text-blue-700 font-medium'>
                register here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
