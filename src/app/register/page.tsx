import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'

// Compatibility wrapper
const Link = RouterLink
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
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { ThemeToggle } from '@/app/components/shared/ThemeToggle'

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
  'Ulaanbaatar',
]

const institutionTypes = ['company', 'school', 'individual']

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: '',
    typeDetail: '',
    aimag: '',
    phoneNumber: '',
    ner: '',
    ovog: '',
    registriinDugaar: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.type) newErrors.type = 'Institution type is required'
    if (!formData.typeDetail) newErrors.typeDetail = 'Organization name is required'
    if (!formData.aimag) newErrors.aimag = 'Province is required'
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required'
    if (!formData.ner) newErrors.ner = 'First name is required'
    if (!formData.ovog) newErrors.ovog = 'Last name is required'
    if (!formData.registriinDugaar) newErrors.registriinDugaar = 'Register number is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required'
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    try {
      await register({
        type: formData.type,
        typeDetail: formData.typeDetail,
        aimag: formData.aimag,
        phoneNumber: formData.phoneNumber,
        ner: formData.ner,
        ovog: formData.ovog,
        registriinDugaar: formData.registriinDugaar,
        email: formData.email,
        password: formData.password,
      })
      toast({
        title: 'Registration successful',
        description: 'Your account has been created!',
      })
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'Please check your information',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-blue-400 to-blue-500 px-4 py-8'>
      <div className='flex justify-end mb-4'>
        <ThemeToggle />
      </div>
      <div className='flex-1 flex items-center justify-center'>
        <Card className='w-full max-w-2xl'>
          <CardHeader className='space-y-2 pb-4'>
            <h1 className='text-2xl font-bold text-center'>Register Account</h1>
            <p className='text-sm text-gray-600 text-center'>
              Already have an account?{' '}
              <Link to='/login' className='text-blue-600 hover:text-blue-700 font-medium'>
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
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <div className='flex flex-row space-x-6'>
                  {institutionTypes.map((type) => (
                    <div key={type} className='flex items-center space-x-2'>
                      <RadioGroupItem
                        value={type}
                        id={`institution-${type}`}
                      />
                      <Label
                        htmlFor={`institution-${type}`}
                        className='cursor-pointer font-normal capitalize'
                      >
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
              {errors.type && (
                <p className='text-xs text-red-500'>{errors.type}</p>
              )}
            </div>

            {/* Organization Name */}
            <div className='space-y-2'>
              <Label htmlFor='typeDetail'>
                Organization Name <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='typeDetail'
                placeholder='Enter organization name'
                value={formData.typeDetail}
                onChange={(e) =>
                  setFormData({ ...formData, typeDetail: e.target.value })
                }
                required
              />
              {errors.typeDetail && (
                <p className='text-xs text-red-500'>{errors.typeDetail}</p>
              )}
            </div>

            {/* Province */}
            <div className='space-y-2'>
              <Label htmlFor='aimag'>
                Province (Aimag) <span className='text-red-500'>*</span>
              </Label>
              <Select
                value={formData.aimag}
                onValueChange={(value) =>
                  setFormData({ ...formData, aimag: value })
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
              {errors.aimag && (
                <p className='text-xs text-red-500'>{errors.aimag}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className='space-y-2'>
              <Label htmlFor='phoneNumber'>
                Phone Number <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='phoneNumber'
                type='tel'
                placeholder='Enter phone number'
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                required
              />
              {errors.phoneNumber && (
                <p className='text-xs text-red-500'>{errors.phoneNumber}</p>
              )}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='ner'>
                  First Name (Ner) <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='ner'
                  placeholder='Enter first name'
                  value={formData.ner}
                  onChange={(e) =>
                    setFormData({ ...formData, ner: e.target.value })
                  }
                  required
                />
                {errors.ner && (
                  <p className='text-xs text-red-500'>{errors.ner}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='ovog'>
                  Last Name (Ovog) <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='ovog'
                  placeholder='Enter last name'
                  value={formData.ovog}
                  onChange={(e) =>
                    setFormData({ ...formData, ovog: e.target.value })
                  }
                  required
                />
                {errors.ovog && (
                  <p className='text-xs text-red-500'>{errors.ovog}</p>
                )}
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='registriinDugaar'>
                National ID (Registriin Dugaar) <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='registriinDugaar'
                placeholder='Enter national ID number'
                value={formData.registriinDugaar}
                onChange={(e) =>
                  setFormData({ ...formData, registriinDugaar: e.target.value })
                }
                required
              />
              {errors.registriinDugaar && (
                <p className='text-xs text-red-500'>{errors.registriinDugaar}</p>
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

            <Button 
              type='submit' 
              className='w-full bg-blue-600 hover:bg-blue-700 mt-6'
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Register'}
            </Button>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
