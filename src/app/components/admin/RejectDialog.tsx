'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { AlertTriangle } from 'lucide-react'
import type { Registration } from '@/data/mockRegistrations'

interface RejectDialogProps {
  registration: Registration | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (registration: Registration, reason: string) => void
}

export const RejectDialog = ({
  registration,
  open,
  onOpenChange,
  onConfirm,
}: RejectDialogProps) => {
  const [reason, setReason] = useState('')

  const handleConfirm = () => {
    if (!registration) return
    onConfirm(registration, reason)
    setReason('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-error'>
            <AlertTriangle size={20} />
            Бүртгэлийг татгалзах
          </DialogTitle>
          <DialogDescription>
            {registration?.teamName} багийн бүртгэлийг татгалзах гэж байна.
          </DialogDescription>
        </DialogHeader>

        <div className='py-4'>
          <Label htmlFor='reason' className='mb-2 block'>
            Татгалзсан шалтгаан (заавал биш)
          </Label>
          <Textarea
            id='reason'
            placeholder='Жишээ: Баримт бичиг дутуу, холбоо барих мэдээлэл буруу, гэх мэт...'
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
          />
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Болих
          </Button>
          <Button variant='destructive' onClick={handleConfirm}>
            Татгалзах
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
