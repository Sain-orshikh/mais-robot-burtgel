'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { MemberForm } from '@/app/components/shared/MemberForm'
import { mockCoaches } from '@/data/mockUserData'
import { useToast } from '@/hooks/use-toast'

export default function CoachFormPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const id = params.id as string
  const isAddMode = id === 'add'
  const coach = isAddMode ? null : mockCoaches.find((c) => c.id === id)
  const handleSave = (formData: any) => {
    if (isAddMode) {
      console.log('Creating new coach:', formData)
    } else {
      console.log('Updating coach:', { id, ...formData })
    }
    toast({
      title: 'Success',
      description: isAddMode ? 'Coach successfully created!' : 'Coach successfully saved!',
    })
    setTimeout(() => {
      router.push('/dashboard/team-members/coach')
    }, 1500)
  }
  const handleCancel = () => {
    router.push('/dashboard/team-members/coach')
  }

  return (
    <MemberForm
      type='coach'
      mode={isAddMode ? 'add' : 'edit'}
      initialData={
        coach
          ? {
              firstName: coach.firstName,
              lastName: coach.lastName,
              registerNumber: coach.youngId,
              email: coach.email,
              birthdate: coach.birthdate,
              gender: coach.gender,
              phoneNumber: coach.phoneNumber,
            }
          : undefined
      }
      onSave={handleSave}
      onCancel={handleCancel}
    />
  )
}
