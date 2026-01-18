'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, Building2, CreditCard, FileText } from 'lucide-react'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { useToast } from '@/hooks/use-toast'
import heic2any from 'heic2any'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  eventId: string
  eventName: string
  totalTeams: number
  organisationId: string
  paymentCount: number
  onPaymentSubmit: (receiptUrl: string) => Promise<void>
}

export function PaymentModal({
  isOpen,
  onClose,
  eventId,
  eventName,
  totalTeams,
  organisationId,
  paymentCount,
  onPaymentSubmit,
}: PaymentModalProps) {
  const { toast } = useToast()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  
  // Get bank details from environment variables
  const bankName = import.meta.env.VITE_BANK_NAME || 'Bank Name'
  const accountName = import.meta.env.VITE_BANK_ACCOUNT_NAME || 'Account Name'
  const accountNumber = import.meta.env.VITE_BANK_ACCOUNT_NUMBER || ''
  
  // Format payment number with leading zeros (e.g., 001, 002, 003)
  const paymentNumber = String(paymentCount).padStart(3, '0')
  const paymentDescription = `${organisationId}-${paymentNumber}`

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const isHeic =
        file.type === 'image/heic' ||
        file.type === 'image/heif' ||
        /\.(heic|heif)$/i.test(file.name)

      let processedFile = file

      if (isHeic) {
        try {
          const convertedBlob = await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.9,
          })

          const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob
          processedFile = new File(
            [blob as Blob],
            file.name.replace(/\.(heic|heif)$/i, '.jpg'),
            { type: 'image/jpeg' }
          )
        } catch (error) {
          toast({
            title: 'Conversion failed',
            description: 'Please upload a JPG or PNG image instead',
            variant: 'destructive',
          })
          return
        }
      }

      if (processedFile.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select an image under 5MB',
          variant: 'destructive',
        })
        return
      }

      setSelectedFile(processedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(processedFile)
    }
  }

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({
        title: 'No file selected',
        description: 'Please upload your payment receipt',
        variant: 'destructive',
      })
      return
    }

    setUploading(true)
    try {
      const receiptUrl = await uploadToCloudinary(selectedFile)
      await onPaymentSubmit(receiptUrl)
      
      toast({
        title: 'Payment Submitted',
        description: 'Your payment receipt has been submitted successfully',
      })
      
      onClose()
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to submit payment',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  const registrationFee = totalTeams * 20000 // 20,000₮ per team

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>Complete Payment</DialogTitle>
        </DialogHeader>

        <div className='space-y-6 mt-4'>
          {/* Event Summary */}
          <div className='bg-blue-50 p-4 rounded-lg'>
            <h3 className='font-semibold text-gray-800 mb-2'>Event: {eventName}</h3>
            <div className='text-sm text-gray-600 space-y-1'>
              <div className='flex justify-between'>
                <span>Number of Teams:</span>
                <span className='font-medium'>{totalTeams}</span>
              </div>
              <div className='flex justify-between'>
                <span>Fee per Team:</span>
                <span className='font-medium'>20,000₮</span>
              </div>
              <div className='flex justify-between pt-2 border-t border-blue-200'>
                <span className='font-semibold'>Total Amount:</span>
                <span className='font-bold text-lg text-blue-600'>{registrationFee.toLocaleString()}₮</span>
              </div>
            </div>
          </div>

          {/* Bank Account Information */}
          <div className='border rounded-lg p-4'>
            <div className='flex items-center gap-2 mb-3'>
              <Building2 className='text-blue-500' size={20} />
              <h3 className='font-semibold text-gray-800'>Bank Account Details</h3>
            </div>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between py-2 border-b'>
                <span className='text-gray-600'>Bank Name:</span>
                <span className='font-medium'>{bankName}</span>
              </div>
              <div className='flex justify-between py-2 border-b'>
                <span className='text-gray-600'>Account Name:</span>
                <span className='font-medium'>{accountName}</span>
              </div>
              <div className='flex justify-between py-2 border-b'>
                <span className='text-gray-600'>Account Number (IBAN):</span>
                <span className='font-mono font-bold text-blue-600'>{accountNumber}</span>
              </div>
              <div className='flex justify-between py-2'>
                <span className='text-gray-600'>Description:</span>
                <span className='font-medium'>{paymentDescription}</span>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
            <div className='flex items-start gap-2'>
              <CreditCard className='text-yellow-600 mt-0.5' size={20} />
              <div className='text-sm text-gray-700'>
                <p className='font-medium mb-1'>Payment Instructions:</p>
                <ol className='list-decimal list-inside space-y-1 text-xs'>
                  <li>Transfer the total amount to the bank account above</li>
                  <li>Include the description in your transfer</li>
                  <li>Take a photo or screenshot of your payment receipt</li>
                  <li>Upload the receipt below and submit</li>
                </ol>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <Label htmlFor='receipt' className='text-base font-semibold mb-3 block'>
              Upload Payment Receipt *
            </Label>
            <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors'>
              <div className='flex flex-col items-center gap-3'>
                {previewUrl ? (
                  <div className='relative'>
                    <img
                      src={previewUrl}
                      alt='Receipt preview'
                      className='max-h-64 rounded-lg shadow-md'
                    />
                    <Button
                      size='sm'
                      variant='outline'
                      className='mt-2'
                      onClick={() => {
                        setSelectedFile(null)
                        setPreviewUrl('')
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className='text-gray-400' size={48} />
                    <div className='text-center'>
                      <p className='text-sm text-gray-600 mb-1'>
                        Click to upload or drag and drop
                      </p>
                      <p className='text-xs text-gray-500'>PNG, JPG, HEIC up to 5MB (HEIC will be converted)</p>
                    </div>
                    <Input
                      id='receipt'
                      type='file'
                      accept='image/*'
                      onChange={handleFileChange}
                      className='max-w-xs'
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3 pt-4'>
            <Button
              onClick={handleSubmit}
              disabled={!selectedFile || uploading}
              className='flex-1 bg-green-600 hover:bg-green-700'
            >
              {uploading ? 'Uploading...' : 'Submit Payment'}
            </Button>
            <Button
              variant='outline'
              onClick={onClose}
              disabled={uploading}
              className='flex-1'
            >
              Cancel
            </Button>
          </div>

          <p className='text-xs text-gray-500 text-center'>
            <FileText className='inline mr-1' size={14} />
            After payment submission, team registrations will be locked. Contestants and coaches can still be managed.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
