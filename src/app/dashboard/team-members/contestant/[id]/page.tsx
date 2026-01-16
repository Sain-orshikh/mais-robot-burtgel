'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { MemberForm } from '@/app/components/shared/MemberForm'
import { mockContestants } from '@/data/mockUserData'
import { useToast } from '@/hooks/use-toast'

export default function ContestantFormPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const id = params.id as string
  const isAddMode = id === 'add'
  const contestant = isAddMode
    ? null
    : mockContestants.find((c) => c.id === id)
  const handleSave = (formData: any) => {
    if (isAddMode) {
      console.log('Creating new contestant:', formData)
    } else {
      console.log('Updating contestant:', { id, ...formData })
    }
    toast({
      title: 'Success',
      description: isAddMode ? 'Contestant successfully created!' : 'Contestant successfully saved!',
    })
    setTimeout(() => {
      router.push('/dashboard/team-members/contestant')
    }, 1500)
  }

  const handleCancel = () => {
    router.push('/dashboard/team-members/contestant')
  }

  return (
    <MemberForm
      type='contestant'
      mode={isAddMode ? 'add' : 'edit'}
      initialData={
        contestant
          ? {
              firstName: contestant.firstName,
              lastName: contestant.lastName,
              registerNumber: contestant.youngId,
              email: contestant.email,
              birthdate: contestant.birthdate,
              gender: contestant.gender,
              phoneNumber: contestant.phoneNumber,
            }
          : undefined
      }
      onSave={handleSave}
      onCancel={handleCancel}
    />
  )
}
