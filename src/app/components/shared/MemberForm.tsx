'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format } from 'date-fns'

interface MemberFormProps {
  type: 'contestant' | 'coach'
  mode: 'add' | 'edit'
  initialData?: {
    firstName: string
    lastName: string
    registerNumber: string
    email: string
    birthdate: string
    gender: 'male' | 'female'
    phoneNumber: string
  }
  onSave: (data: any) => void
  onCancel: () => void
}

export function MemberForm({
  type,
  mode,
  initialData,
  onSave,
  onCancel,
}: MemberFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    registerNumber: '',
    email: '',
    birthdate: undefined as Date | undefined,
    gender: '',
    phoneNumber: '',
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        registerNumber: initialData.registerNumber,
        email: initialData.email,
        birthdate: new Date(initialData.birthdate),
        gender: initialData.gender,
        phoneNumber: initialData.phoneNumber,
      })
    }
  }, [initialData])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }
  const handleSubmit = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.registerNumber ||
      !formData.email ||
      !formData.birthdate ||
      !formData.gender ||
      !formData.phoneNumber
    ) {
      alert('Please fill in all required fields')
      return
    }
    onSave(formData)
  }

  const typeLabel = type === 'contestant' ? 'Contestant' : 'Coach'
  const modeLabel = mode === 'add' ? 'Add' : 'Edit'

  return (
    <div className='container mx-auto px-6 py-8'>
      <div className='mb-6 text-sm text-gray-600'>
        <Link href='/dashboard/team-members' className='hover:text-blue-500'>
          Team Members
        </Link>
        {' > '}
        <Link
          href={`/dashboard/team-members/${type}`}
          className='hover:text-blue-500'
        >
          {typeLabel}
        </Link>
        {' > '}
        <span className='text-gray-900 font-medium'>{modeLabel}</span>
      </div>

      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>
          {modeLabel} {typeLabel}
        </h1>
      </div>

      <div className='bg-white rounded-lg shadow p-6 max-w-3xl'>
        <div className='space-y-6'>
          <div className='grid gap-2'>
            <Label htmlFor='firstName'>
              First Name <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='firstName'
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder='Enter first name'
              required
            />
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='lastName'>
              Last Name <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='lastName'
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder='Enter last name'
              required
            />
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='registerNumber'>
              Register Number <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='registerNumber'
              value={formData.registerNumber}
              onChange={(e) =>
                handleInputChange('registerNumber', e.target.value)
              }
              placeholder='Enter register number'
              required
            />
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='email'>
              Email <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='email'
              type='email'
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder='Enter email address'
              required
            />
          </div>

          <div className='grid gap-2'>
            <Label>
              Birthdate <span className='text-red-500'>*</span>
            </Label>
            <div className='flex gap-2'>
              <Input
                type='date'
                value={formData.birthdate ? format(formData.birthdate, 'yyyy-MM-dd') : ''}
                onChange={(e) => {
                  const dateValue = e.target.value
                  if (dateValue) {
                    const parsedDate = new Date(dateValue + 'T00:00:00')
                    if (!isNaN(parsedDate.getTime())) {
                      setFormData((prev) => ({ ...prev, birthdate: parsedDate }))
                    }
                  } else {
                    setFormData((prev) => ({ ...prev, birthdate: undefined }))
                  }
                }}
                placeholder='YYYY-MM-DD'
                className='flex-1'
                max={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='gender'>
              Gender <span className='text-red-500'>*</span>
            </Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleInputChange('gender', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select gender' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='male'>Male</SelectItem>
                <SelectItem value='female'>Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='phoneNumber'>
              Phone Number <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='phoneNumber'
              type='tel'
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              placeholder='Enter phone number'
              required
            />
          </div>
        </div>

        <div className='flex justify-end gap-3 mt-8 pt-6 border-t'>
          <Button variant='outline' onClick={onCancel} className='px-6'>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className='bg-blue-500 hover:bg-blue-600 px-6'
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
