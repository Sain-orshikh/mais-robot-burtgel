'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const provinces = [
  'Arkhangai',
  'Bayan-Ölgii',
  'Bayankhongor',
  'Bulgan',
  'Darkhan-Uul',
  'Dornod',
  'Dornogovi',
  'Dundgovi',
  'Govi-Altai',
  'Govisümber',
  'Khentii',
  'Khovd',
  'Khövsgöl',
  'Ömnögovi',
  'Orkhon',
  'Övörkhangai',
  'Selenge',
  'Sükhbaatar',
  'Töv',
  'Uvs',
  'Zavkhan',
]

const institutionTypes = ['Club', 'School', 'Individual']

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    institutionType: '',
    province: '',
    firstName: '',
    lastName: '',
    registerNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.institutionType) newErrors.institutionType = 'Institution type is required'
    if (!formData.province) newErrors.province = 'Province is required'
    if (!formData.firstName) newErrors.firstName = 'First name is required'
    if (!formData.lastName) newErrors.lastName = 'Last name is required'
    if (!formData.registerNumber) newErrors.registerNumber = 'Register number is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required'
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }
    console.log('Register:', formData)
    alert('Registration successful! Please login.')
    router.push('/login')
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-500 px-4 py-8'>
      <Card className='w-full max-w-2xl'>
        <CardHeader className='space-y-2 pb-4'>
          <h1 className='text-2xl font-bold text-center'>Register Account</h1>
          <p className='text-sm text-gray-600 text-center'>
            Already have an account?{' '}
            <Link href='/login' className='text-blue-600 hover:text-blue-700 font-medium'>
              Login here
            </Link>
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Institution Type */}
            <div className='space-y-2'>
              <Label>
                Institution Type <span className='text-red-500'>*</span>
              </Label>
              <RadioGroup
                value={formData.institutionType}
                onValueChange={(value) =>
                  setFormData({ ...formData, institutionType: value })
                }
              >
                <div className='flex flex-row space-x-6'>
                  {institutionTypes.map((type) => (
                    <div key={type} className='flex items-center space-x-2'>
                      <RadioGroupItem
                        value={type.toLowerCase()}
                        id={`institution-${type.toLowerCase()}`}
                      />
                      <Label
                        htmlFor={`institution-${type.toLowerCase()}`}
                        className='cursor-pointer font-normal'
                      >
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
              {errors.institutionType && (
                <p className='text-xs text-red-500'>{errors.institutionType}</p>
              )}
            </div>

            {/* aimag */}
            <div className='space-y-2'>
              <Label htmlFor='province'>
                Province <span className='text-red-500'>*</span>
              </Label>
              <Select
                value={formData.province}
                onValueChange={(value) =>
                  setFormData({ ...formData, province: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select province' />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.province && (
                <p className='text-xs text-red-500'>{errors.province}</p>
              )}
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='firstName'>
                  First Name <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='firstName'
                  placeholder='Enter first name'
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
                {errors.firstName && (
                  <p className='text-xs text-red-500'>{errors.firstName}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='lastName'>
                  Last Name <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='lastName'
                  placeholder='Enter last name'
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                />
                {errors.lastName && (
                  <p className='text-xs text-red-500'>{errors.lastName}</p>
                )}
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='registerNumber'>
                Register Number <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='registerNumber'
                placeholder='Enter register number'
                value={formData.registerNumber}
                onChange={(e) =>
                  setFormData({ ...formData, registerNumber: e.target.value })
                }
                required
              />
              {errors.registerNumber && (
                <p className='text-xs text-red-500'>{errors.registerNumber}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>
                Email <span className='text-red-500'>*</span>
              </Label>
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
              {errors.email && (
                <p className='text-xs text-red-500'>{errors.email}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>
                Password <span className='text-red-500'>*</span>
              </Label>
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
              {errors.password && (
                <p className='text-xs text-red-500'>{errors.password}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>
                Confirm Password <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='confirmPassword'
                type='password'
                placeholder='Confirm your password'
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
              />
              {errors.confirmPassword && (
                <p className='text-xs text-red-500'>{errors.confirmPassword}</p>
              )}
            </div>

            <Button type='submit' className='w-full bg-blue-600 hover:bg-blue-700 mt-6'>
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
