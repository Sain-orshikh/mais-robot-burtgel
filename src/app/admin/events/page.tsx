'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Plus, Edit, Trash2, Calendar } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { AdminHeader } from '@/app/components/admin/AdminHeader'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// 12 competition categories
const AVAILABLE_CATEGORIES = [
  { code: 'MNR', name: 'Mini Sumo RC', maxTeamsPerOrg: 2, minContestants: 2, maxContestants: 2 },
  { code: 'MGR', name: 'Mega Sumo RC', maxTeamsPerOrg: 2, minContestants: 2, maxContestants: 2 },
  { code: 'MNA', name: 'Mini Sumo Auto', maxTeamsPerOrg: 2, minContestants: 2, maxContestants: 2 },
  { code: 'MGA', name: 'Mega Sumo Auto', maxTeamsPerOrg: 2, minContestants: 2, maxContestants: 2 },
  { code: 'RRC', name: 'Robot Rugby', maxTeamsPerOrg: 2, minContestants: 2, maxContestants: 2 },
  { code: 'DRC', name: 'Drone RC', maxTeamsPerOrg: 2, minContestants: 2, maxContestants: 2 },
  { code: 'DRA', name: 'Drone Auto', maxTeamsPerOrg: 2, minContestants: 2, maxContestants: 2 },
  { code: 'LFG', name: 'Line Follower (Lego)', maxTeamsPerOrg: 2, minContestants: 2, maxContestants: 2 },
  { code: 'LFH', name: 'Line Follower (High Speed)', maxTeamsPerOrg: 2, minContestants: 2, maxContestants: 2 },
  { code: 'LFL', name: 'Line Follower (Low Speed)', maxTeamsPerOrg: 2, minContestants: 2, maxContestants: 2 },
  { code: 'LSR', name: 'Lego Sumo', maxTeamsPerOrg: 2, minContestants: 2, maxContestants: 2 },
  { code: 'LUR', name: 'Lego Unknown', maxTeamsPerOrg: 2, minContestants: 2, maxContestants: 2 },
]

interface Event {
  _id: string
  name: string
  description: string
  startDate: string
  endDate: string
  registrationDeadline: string
  location: string
  status: 'open' | 'closed' | 'completed'
  categories: {
    categoryCode: string
    name: string
    maxTeamsPerOrg: number
    minContestantsPerTeam: number
    maxContestantsPerTeam: number
  }[]
}

export default function AdminEventsPage() {
  const { toast } = useToast()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    location: '',
    status: 'open' as 'open' | 'closed' | 'completed',
    selectedCategories: [] as string[],
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/events`)
      if (!response.ok) throw new Error('Failed to fetch events')
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load events',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const openAddModal = () => {
    setEditingEvent(null)
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      registrationDeadline: '',
      location: '',
      status: 'open',
      selectedCategories: [],
    })
    setIsModalOpen(true)
  }

  const openEditModal = (event: Event) => {
    setEditingEvent(event)
    
    // Extract category codes from event categories
    const categoryCodes = event.categories.map(c => {
      // Try to find matching category by name if categoryCode is missing
      const matchingCat = AVAILABLE_CATEGORIES.find(ac => ac.name === c.name)
      return matchingCat?.code || ''
    }).filter(Boolean)
    
    setFormData({
      name: event.name,
      description: event.description,
      startDate: new Date(event.startDate).toISOString().split('T')[0],
      endDate: new Date(event.endDate).toISOString().split('T')[0],
      registrationDeadline: new Date(event.registrationDeadline).toISOString().split('T')[0],
      location: event.location,
      status: event.status,
      selectedCategories: categoryCodes,
    })
    setIsModalOpen(true)
  }

  const handleCategoryToggle = (categoryCode: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(categoryCode)
        ? prev.selectedCategories.filter(c => c !== categoryCode)
        : [...prev.selectedCategories, categoryCode],
    }))
  }

  const handleSaveEvent = async () => {
    if (!formData.name || !formData.description || !formData.startDate || 
        !formData.endDate || !formData.registrationDeadline || !formData.location) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    if (formData.selectedCategories.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please select at least one category',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    try {
      const categories = formData.selectedCategories.map(code => {
        const cat = AVAILABLE_CATEGORIES.find(c => c.code === code)!
        return {
          categoryCode: cat.code,
          name: cat.name,
          maxTeamsPerOrg: cat.maxTeamsPerOrg,
          minContestantsPerTeam: cat.minContestants,
          maxContestantsPerTeam: cat.maxContestants,
        }
      })

      const submitData = {
        name: formData.name,
        description: formData.description,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        registrationDeadline: new Date(formData.registrationDeadline).toISOString(),
        location: formData.location,
        status: formData.status,
        categories,
      }

      const url = editingEvent 
        ? `${API_URL}/api/events/${editingEvent._id}`
        : `${API_URL}/api/events`
      
      const method = editingEvent ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save event')
      }

      toast({
        title: 'Success',
        description: `Event ${editingEvent ? 'updated' : 'created'} successfully`,
      })

      setIsModalOpen(false)
      fetchEvents()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save event',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event? This will also remove all team registrations.')) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/events/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete event')

      toast({
        title: 'Success',
        description: 'Event deleted successfully',
      })

      fetchEvents()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete event',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <AdminHeader />
      
      <div className='container mx-auto px-6 py-8'>
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h1 className='text-2xl font-bold text-gray-800'>Event Management</h1>
            <p className='text-sm text-gray-600 mt-1'>Create and manage competition events</p>
          </div>
          <Button className='bg-blue-500 hover:bg-blue-600' onClick={openAddModal}>
            <Plus size={18} className='mr-2' />
            Add Event
          </Button>
        </div>

        <div className='bg-white rounded-lg shadow'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registration Deadline</TableHead>
                <TableHead>Event Date</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className='text-center py-8 text-gray-500'>
                    No events available. Create your first event.
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow key={event._id}>
                    <TableCell className='font-medium'>{event.name}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.status === 'open' 
                          ? 'bg-green-100 text-green-700' 
                          : event.status === 'closed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(event.registrationDeadline).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      {new Date(event.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })} - {new Date(event.endDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <span className='text-sm text-gray-600'>{event.categories.length} categories</span>
                    </TableCell>
                    <TableCell>
                      <div className='flex justify-end gap-2'>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => openEditModal(event)}
                        >
                          <Edit size={14} className='mr-1' />
                          Edit
                        </Button>
                        <Button
                          size='sm'
                          variant='destructive'
                          onClick={() => handleDeleteEvent(event._id)}
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
        </div>

        {/* Add/Edit Event Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2'>
                <Calendar className='h-5 w-5' />
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </DialogTitle>
            </DialogHeader>

            <div className='grid gap-4 py-4'>
              <div className='grid gap-2'>
                <Label htmlFor='name'>
                  Event Name <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='name'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder='e.g., MAIS Robot Competition 2026'
                />
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='description'>
                  Description <span className='text-red-500'>*</span>
                </Label>
                <Textarea
                  id='description'
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder='Event description and details...'
                  rows={3}
                />
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='location'>
                  Location <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='location'
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder='e.g., Ulaanbaatar, Mongolia'
                />
              </div>

              <div className='grid grid-cols-3 gap-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='registrationDeadline'>
                    Registration Deadline <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='registrationDeadline'
                    type='date'
                    value={formData.registrationDeadline}
                    onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                  />
                </div>

                <div className='grid gap-2'>
                  <Label htmlFor='startDate'>
                    Start Date <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='startDate'
                    type='date'
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div className='grid gap-2'>
                  <Label htmlFor='endDate'>
                    End Date <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='endDate'
                    type='date'
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className='grid gap-2'>
                <Label>
                  Event Status <span className='text-red-500'>*</span>
                </Label>
                <div className='flex gap-4'>
                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='radio'
                      name='status'
                      value='open'
                      checked={formData.status === 'open'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    />
                    <span>Open</span>
                  </label>
                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='radio'
                      name='status'
                      value='closed'
                      checked={formData.status === 'closed'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    />
                    <span>Closed</span>
                  </label>
                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='radio'
                      name='status'
                      value='completed'
                      checked={formData.status === 'completed'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    />
                    <span>Completed</span>
                  </label>
                </div>
              </div>

              <div className='grid gap-2'>
                <Label>
                  Competition Categories <span className='text-red-500'>*</span>
                </Label>
                <p className='text-sm text-gray-600 mb-2'>Select categories available for this event</p>
                <div className='grid grid-cols-2 gap-3 border rounded-lg p-4 max-h-60 overflow-y-auto'>
                  {AVAILABLE_CATEGORIES.map((category) => (
                    <div key={category.code} className='flex items-start space-x-2'>
                      <Checkbox
                        id={`cat-${category.code}`}
                        checked={formData.selectedCategories.includes(category.code)}
                        onCheckedChange={() => handleCategoryToggle(category.code)}
                      />
                      <Label
                        htmlFor={`cat-${category.code}`}
                        className='cursor-pointer font-normal text-sm'
                      >
                        <div className='font-medium'>{category.name}</div>
                        <div className='text-xs text-gray-500'>
                          {category.code} • {category.minContestants}-{category.maxContestants} contestants
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
                <p className='text-sm text-gray-500'>
                  Selected: {formData.selectedCategories.length} / {AVAILABLE_CATEGORIES.length}
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant='outline' onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEvent} disabled={saving}>
                {saving ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
