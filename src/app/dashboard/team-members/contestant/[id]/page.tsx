'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { MemberForm } from '@/app/components/shared/MemberForm'
import { contestantApi } from '@/lib/api/contestants'
import { Contestant } from '@/types/models'
import { useToast } from '@/hooks/use-toast'

export default function ContestantFormPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const id = params.id as string
  const isAddMode = id === 'add'
  
  const [contestant, setContestant] = useState<Contestant | null>(null)
  const [loading, setLoading] = useState(!isAddMode)

  useEffect(() => {
    if (!isAddMode) {
      fetchContestant()
    }
  }, [id])

  const fetchContestant = async () => {
    try {
      const data = await contestantApi.getById(id)
      setContestant(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load contestant',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (formData: any) => {
    try {
      if (isAddMode) {
        await contestantApi.create(formData)
        toast({
          title: 'Success',
          description: 'Contestant successfully created!',
        })
      } else {
        await contestantApi.update(id, formData)
        toast({
          title: 'Success',
          description: 'Contestant successfully updated!',
        })
      }
      setTimeout(() => {
        router.push('/dashboard/team-members/contestant')
      }, 1500)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save contestant',
        variant: 'destructive',
      })
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/team-members/contestant')
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
      type='contestant'
      mode={isAddMode ? 'add' : 'edit'}
      initialData={
        contestant
          ? {
              ner: contestant.ner,
              ovog: contestant.ovog,
              register: contestant.register,
              email: contestant.email,
              tursunUdur: contestant.tursunUdur,
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
