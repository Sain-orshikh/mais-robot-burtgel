'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { MemberForm } from '@/app/components/shared/MemberForm'
import { coachApi } from '@/lib/api/coaches'
import { Coach } from '@/types/models'
import { useToast } from '@/hooks/use-toast'

export default function CoachFormPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const id = params.id as string
  const isAddMode = id === 'add'
  
  const [coach, setCoach] = useState<Coach | null>(null)
  const [loading, setLoading] = useState(!isAddMode)

  useEffect(() => {
    if (!isAddMode) {
      fetchCoach()
    }
  }, [id])

  const fetchCoach = async () => {
    try {
      const data = await coachApi.getById(id)
      setCoach(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load coach',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (formData: any) => {
    try {
      if (isAddMode) {
        await coachApi.create(formData)
        toast({
          title: 'Success',
          description: 'Coach successfully created!',
        })
      } else {
        await coachApi.update(id, formData)
        toast({
          title: 'Success',
          description: 'Coach successfully updated!',
        })
      }
      setTimeout(() => {
        router.push('/dashboard/team-members/coach')
      }, 1500)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save coach',
        variant: 'destructive',
      })
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/team-members/coach')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <MemberForm
      type='coach'
      mode={isAddMode ? 'add' : 'edit'}
      initialData={
        coach
          ? {
              ner: coach.ner,
              ovog: coach.ovog,
              register: coach.register,
              email: coach.email,
              tursunUdur: coach.tursunUdur,
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
