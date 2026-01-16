'use client'

import { useState, useEffect } from 'react'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search, Edit, Trash2, Plus } from 'lucide-react'
import Link from 'next/link'
import { coachApi } from '@/lib/api/coaches'
import { Coach } from '@/types/models'
import { useToast } from '@/hooks/use-toast'

export default function CoachLibraryPage() {
  const { toast } = useToast()
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [entriesPerPage, setEntriesPerPage] = useState('10')
  const [currentPage, setCurrentPage] = useState(1)
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null)
  const [saving, setSaving] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState<{
    ner: string
    ovog: string
    register: string
    email: string
    tursunUdur: string
    gender: 'male' | 'female' | ''
    phoneNumber: string
  }>({
    ner: '',
    ovog: '',
    register: '',
    email: '',
    tursunUdur: '',
    gender: '',
    phoneNumber: '',
  })

  useEffect(() => {
    fetchCoaches()
  }, [])

  const fetchCoaches = async () => {
    try {
      const data = await coachApi.getAll()
      setCoaches(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load coaches',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter coaches based on search
  const filteredCoaches = coaches.filter((coach) =>
    `${coach.ner} ${coach.ovog}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coach.coachId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coach.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Pagination
  const totalPages = Math.ceil(filteredCoaches.length / parseInt(entriesPerPage))
  const startIndex = (currentPage - 1) * parseInt(entriesPerPage)
  const paginatedCoaches = filteredCoaches.slice(
    startIndex,
    startIndex + parseInt(entriesPerPage)
  )

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this coach?')) {
      try {
        await coachApi.delete(id)
        setCoaches((prev) => prev.filter((c) => c._id !== id))
        toast({
          title: 'Success',
          description: 'Coach deleted successfully',
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to delete coach',
          variant: 'destructive',
        })
      }
    }
  }

  const openAddModal = () => {
    setEditingCoach(null)
    setFormData({
      ner: '',
      ovog: '',
      register: '',
      email: '',
      tursunUdur: '',
      gender: '',
      phoneNumber: '',
    })
    setIsModalOpen(true)
  }

  const openEditModal = (coach: Coach) => {
    setEditingCoach(coach)
    setFormData({
      ner: coach.ner,
      ovog: coach.ovog,
      register: coach.register,
      email: coach.email,
      tursunUdur: new Date(coach.tursunUdur).toISOString().split('T')[0],
      gender: coach.gender,
      phoneNumber: coach.phoneNumber,
    })
    setIsModalOpen(true)
  }

  const handleSaveCoach = async () => {
    if (!formData.ner || !formData.ovog || !formData.register || !formData.email || 
        !formData.tursunUdur || !formData.gender || !formData.phoneNumber) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    try {
      const submitData = {
        ner: formData.ner,
        ovog: formData.ovog,
        register: formData.register,
        email: formData.email,
        tursunUdur: new Date(formData.tursunUdur).toISOString(),
        gender: formData.gender as 'male' | 'female',
        phoneNumber: formData.phoneNumber,
      }

      if (editingCoach) {
        await coachApi.update(editingCoach._id, submitData)
        setCoaches((prev) =>
          prev.map((c) => (c._id === editingCoach._id ? { ...c, ...submitData } : c))
        )
        toast({
          title: 'Success',
          description: 'Coach updated successfully',
        })
      } else {
        const newCoach = await coachApi.create(submitData)
        setCoaches((prev) => [...prev, newCoach])
        toast({
          title: 'Success',
          description: 'Coach created successfully',
        })
      }
      
      setIsModalOpen(false)
      fetchCoaches()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save coach',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading coaches...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-6 py-8'>
      {/* Breadcrumb */}
      <div className='mb-6 text-sm text-gray-600'>
        <Link href='/dashboard/team-members' className='hover:text-blue-500'>
          Team Members
        </Link>
        {' > '}
        <span className='text-gray-900 font-medium'>Coach</span>
      </div>

      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Coach Library</h1>
        <Button className='bg-blue-500 hover:bg-blue-600' onClick={openAddModal}>
          <Plus size={18} className='mr-2' />
          Add
        </Button>
      </div>

      {/* Table Card */}
      <div className='bg-white rounded-lg shadow'>
        {/* Controls */}
        <div className='p-4 border-b flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-600'>Show</span>
            <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
              <SelectTrigger className='w-20'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='10'>10</SelectItem>
                <SelectItem value='25'>25</SelectItem>
                <SelectItem value='50'>50</SelectItem>
                <SelectItem value='100'>100</SelectItem>
              </SelectContent>
            </Select>
            <span className='text-sm text-gray-600'>entries</span>
          </div>

          <div className='flex items-center gap-2'>
            <Search size={16} className='text-gray-400' />
            <Input
              placeholder='Search...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-64'
            />
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Coach ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>National ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Birth Date</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead className='text-right'>Operate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCoaches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className='text-center py-8 text-gray-500'>
                  No data available in table
                </TableCell>
              </TableRow>
            ) : (
              paginatedCoaches.map((coach) => (
                <TableRow key={coach._id}>
                  <TableCell className='font-medium'>{coach.coachId}</TableCell>
                  <TableCell>{coach.ovog} {coach.ner}</TableCell>
                  <TableCell>{coach.register}</TableCell>
                  <TableCell>{coach.email}</TableCell>
                  <TableCell>
                    {new Date(coach.tursunUdur).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </TableCell>
                  <TableCell className='capitalize'>{coach.gender}</TableCell>
                  <TableCell>
                    <div className='flex justify-end gap-2'>
                      <Button 
                        size='sm' 
                        className='bg-blue-500 hover:bg-blue-600'
                        onClick={() => openEditModal(coach)}
                      >
                        <Edit size={14} className='mr-1' />
                        Edit
                      </Button>
                      <Button
                        size='sm'
                        variant='destructive'
                        onClick={() => handleDelete(coach._id)}
                      >
                        <Trash2 size={14} className='mr-1' />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Footer */}
        <div className='p-4 border-t flex justify-between items-center'>
          <div className='text-sm text-gray-600'>
            Showing {startIndex + 1} to {Math.min(startIndex + parseInt(entriesPerPage), filteredCoaches.length)} of {filteredCoaches.length} entries
          </div>

          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size='sm'
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? 'bg-blue-500 hover:bg-blue-600' : ''}
              >
                {page}
              </Button>
            ))}

            <Button
              variant='outline'
              size='sm'
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>
              {editingCoach ? 'Edit Coach' : 'Add Coach'}
            </DialogTitle>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='ovog'>
                  Ovog (Last Name) <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='ovog'
                  value={formData.ovog}
                  onChange={(e) => setFormData({ ...formData, ovog: e.target.value })}
                  placeholder='Enter last name'
                />
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='ner'>
                  Ner (First Name) <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='ner'
                  value={formData.ner}
                  onChange={(e) => setFormData({ ...formData, ner: e.target.value })}
                  placeholder='Enter first name'
                />
              </div>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='register'>
                Registriin Dugaar (National ID) <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='register'
                value={formData.register}
                onChange={(e) => setFormData({ ...formData, register: e.target.value })}
                placeholder='Enter national ID number'
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
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder='Enter email address'
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='tursunUdur'>
                Tursun Udur (Birth Date) <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='tursunUdur'
                type='date'
                value={formData.tursunUdur}
                onChange={(e) => setFormData({ ...formData, tursunUdur: e.target.value })}
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='gender'>
                Gender <span className='text-red-500'>*</span>
              </Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value as 'male' | 'female' })}>
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
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder='Enter phone number'
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCoach} disabled={saving}>
              {saving ? 'Saving...' : editingCoach ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
