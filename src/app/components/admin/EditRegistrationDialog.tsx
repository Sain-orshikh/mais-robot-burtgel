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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert } from '@/components/ui/alert'
import { AlertTriangle, Shield } from 'lucide-react'
import type { Registration } from '@/data/mockRegistrations'
import { COMPETITION_CATEGORIES } from '@/data/mockRegistrations'

interface EditRegistrationDialogProps {
  registration: Registration | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (updatedRegistration: Registration, changes: string[]) => void
  adminUsername: string
}

export const EditRegistrationDialog = ({
  registration,
  open,
  onOpenChange,
  onConfirm,
  adminUsername,
}: EditRegistrationDialogProps) => {
  const [formData, setFormData] = useState<Partial<Registration>>(registration || {})
  const [confirmEdit, setConfirmEdit] = useState(false)

  const handleSubmit = () => {
    if (!registration || !confirmEdit) return

    // Track changes
    const changes: string[] = []
    if (formData.teamName !== registration.teamName) {
      changes.push(`Багийн нэр: "${registration.teamName}" → "${formData.teamName}"`)
    }
    if (formData.schoolName !== registration.schoolName) {
      changes.push(`Сургууль: "${registration.schoolName}" → "${formData.schoolName}"`)
    }
    if (formData.category !== registration.category) {
      changes.push(`Төрөл: "${registration.category}" → "${formData.category}"`)
    }
    if (formData.location !== registration.location) {
      changes.push(`Байршил: "${registration.location}" → "${formData.location}"`)
    }

    const updatedRegistration: Registration = {
      ...registration,
      ...formData,
      lastModified: new Date().toISOString(),
      modifiedBy: adminUsername,
    }

    onConfirm(updatedRegistration, changes)
    setConfirmEdit(false)
    onOpenChange(false)
  }

  if (!registration) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Shield size={20} className='text-warning' />
            Бүртгэл засах (Хамгаалагдсан)
          </DialogTitle>
          <DialogDescription>
            {registration.registrationNumber} - {registration.teamName}
          </DialogDescription>
        </DialogHeader>

        <Alert className='border-warning bg-warning/10'>
          <AlertTriangle className='h-4 w-4 text-warning' />
          <div className='ml-2'>
            <p className='font-semibold text-warning'>Анхааруулга!</p>
            <p className='text-sm text-muted-foreground mt-1'>
              Энэ үйлдэл нь системд бүртгэгдэх ба audit log-д хадгалагдана.
              Хэн хэзээ юу өөрчилснийг дараа нь харах боломжтой.
            </p>
          </div>
        </Alert>

        <div className='space-y-4 py-4'>
          {/* Team Name */}
          <div>
            <Label htmlFor='teamName'>Багийн нэр</Label>
            <Input
              id='teamName'
              value={formData.teamName || ''}
              onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
            />
          </div>

          {/* School Name */}
          <div>
            <Label htmlFor='schoolName'>Сургуулийн нэр</Label>
            <Input
              id='schoolName'
              value={formData.schoolName || ''}
              onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
            />
          </div>

          {/* Location */}
          <div>
            <Label htmlFor='location'>Байршил</Label>
            <Input
              id='location'
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor='category'>Тэмцээний төрөл</Label>
            <Select
              value={formData.category || ''}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COMPETITION_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor='notes'>Тэмдэглэл (заавал биш)</Label>
            <Textarea
              id='notes'
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder='Нэмэлт тэмдэглэл...'
              rows={3}
            />
          </div>

          {/* Confirmation Checkbox */}
          <div className='flex items-start gap-3 p-4 bg-muted rounded'>
            <input
              type='checkbox'
              id='confirmEdit'
              checked={confirmEdit}
              onChange={(e) => setConfirmEdit(e.target.checked)}
              className='mt-1'
            />
            <label htmlFor='confirmEdit' className='text-sm cursor-pointer'>
              Би энэ өөрчлөлтийг хийхдээ итгэлтэй байна. Энэ үйлдэл бүртгэгдэж,
              <strong className='text-warning'> {adminUsername}</strong> хэрэглэгчийн нэр дээр хадгалагдах болно.
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Болих
          </Button>
          <Button onClick={handleSubmit} disabled={!confirmEdit}>
            Хадгалах
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
