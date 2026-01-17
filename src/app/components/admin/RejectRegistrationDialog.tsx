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
import { AlertCircle } from 'lucide-react'

interface RejectRegistrationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (reason: string) => void
  isLoading?: boolean
  organisationName?: string
}

export const RejectRegistrationDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  organisationName,
}: RejectRegistrationDialogProps) => {
  const [rejectionReason, setRejectionReason] = useState('')
  const [error, setError] = useState('')

  const handleConfirm = () => {
    if (!rejectionReason.trim()) {
      setError('Татгалзах шалтгааныг заавал бичнэ үү')
      return
    }

    onConfirm(rejectionReason)
    setRejectionReason('')
    setError('')
  }

  const handleCancel = () => {
    setRejectionReason('')
    setError('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-red-600'>
            <AlertCircle className='h-5 w-5' />
            Бүртгэлийг татгалзах
          </DialogTitle>
          <DialogDescription>
            {organisationName && (
              <span className='block mb-2 font-medium text-foreground'>
                {organisationName}
              </span>
            )}
            Та энэ бүртгэлийг татгалзах гэж байна. Татгалзсаны дараа байгууллага шалтгааныг харах боломжтой бөгөөд дахин бүртгүүлэх боломжтой болно.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='reason' className='text-sm font-medium'>
              Татгалзах шалтгаан <span className='text-red-500'>*</span>
            </Label>
            <Textarea
              id='reason'
              placeholder='Жишээ нь: Тоног төхөөрөмж шаардлага хангахгүй байна, Дутуу мэдээлэл ирүүлсэн, гэх мэт...'
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value)
                setError('')
              }}
              className={`min-h-[120px] ${error ? 'border-red-500' : ''}`}
              disabled={isLoading}
            />
            {error && (
              <p className='text-sm text-red-500 flex items-center gap-1'>
                <AlertCircle className='h-3 w-3' />
                {error}
              </p>
            )}
          </div>

          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-3'>
            <p className='text-sm text-yellow-800'>
              <strong>Санамж:</strong> Татгалзсны дараа байгууллага дахин бүртгүүлэх боломжтой болно.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={handleCancel}
            disabled={isLoading}
          >
            Цуцлах
          </Button>
          <Button
            variant='destructive'
            onClick={handleConfirm}
            disabled={isLoading || !rejectionReason.trim()}
          >
            {isLoading ? 'Уншиж байна...' : 'Татгалзах'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
