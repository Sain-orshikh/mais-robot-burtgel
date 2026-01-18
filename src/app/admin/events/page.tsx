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
  registrationStart: string
  registrationEnd: string
  location: string
  status?: 'upcoming' | 'registration-open' | 'registration-closed' | 'ongoing' | 'completed'
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

  // Helper to convert stored date to local date/time parts (no manual timezone offset)
  const toLocalDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const isPM = hours >= 12
    const displayHours = hours % 12 || 12

    return {
      date: date.toISOString().split('T')[0],
      time: `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
      ampm: isPM ? 'PM' : 'AM'
    }
  }

  // Helper to convert local date/time to ISO string (no manual GMT+8 adjustment)
  const toLocalISO = (date: string, time: string, ampm: string) => {
    if (!date || !time) {
      throw new Error('Date and time are required')
    }
    
    // Parse the time from HH:mm format (24-hour from input[type=time])
    const [inputHours, minutes] = time.split(':').map(Number)
    if (isNaN(inputHours) || isNaN(minutes)) {
      throw new Error('Invalid time format')
    }
    
    // The input gives us 24-hour time, but we also have AM/PM selector
    // We need to convert the input hours to 12-hour format first, then apply AM/PM
    let hour24 = inputHours
    
    // If time input shows 12-hour format (0-12), convert with AM/PM
    // Otherwise if it's already 24-hour (0-23), use it directly
    if (inputHours <= 12) {
      // Treat as 12-hour format and apply AM/PM
      hour24 = inputHours
      if (ampm === 'PM' && inputHours !== 12) hour24 += 12
      if (ampm === 'AM' && inputHours === 12) hour24 = 0
    }
    
    const [year, month, day] = date.split('-').map(Number)
    const localDate = new Date(year, (month || 1) - 1, day || 1, hour24, minutes, 0)
    if (isNaN(localDate.getTime())) {
      throw new Error('Invalid date or time value')
    }

    return localDate.toISOString()
  }

  // Helper to compute event status based on dates
  const getEventStatus = (event: Event): { status: string; color: string; label: string } => {
    const now = new Date()
    const regStart = new Date(event.registrationStart)
    const regEnd = new Date(event.registrationEnd)
    const eventStart = new Date(event.startDate)
    const eventEnd = new Date(event.endDate)

    if (now < regStart) {
      return { status: 'upcoming', color: 'bg-gray-100 text-gray-800', label: 'Upcoming' }
    } else if (now >= regStart && now < regEnd) {
      return { status: 'registration-open', color: 'bg-green-100 text-green-800', label: 'Registration Open' }
    } else if (now >= regEnd && now < eventStart) {
      return { status: 'registration-closed', color: 'bg-yellow-100 text-yellow-800', label: 'Registration Closed' }
    } else if (now >= eventStart && now < eventEnd) {
      return { status: 'ongoing', color: 'bg-blue-100 text-blue-800', label: 'Ongoing' }
    } else {
      return { status: 'completed', color: 'bg-gray-100 text-gray-800', label: 'Completed' }
    }
  }

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    startTime: '09:00',
    startAMPM: 'AM',
    endDate: '',
    endTime: '05:00',
    endAMPM: 'PM',
    registrationStartDate: '',
    registrationStartTime: '09:00',
    registrationStartAMPM: 'AM',
    registrationEndDate: '',
    registrationEndTime: '11:59',
    registrationEndAMPM: 'PM',
    location: '',
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
      startTime: '09:00',
      startAMPM: 'AM',
      endDate: '',
      endTime: '05:00',
      endAMPM: 'PM',
      registrationStartDate: '',
      registrationStartTime: '09:00',
      registrationStartAMPM: 'AM',
      registrationEndDate: '',
      registrationEndTime: '11:59',
      registrationEndAMPM: 'PM',
      location: '',
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
    
    const startDateTime = toLocalDateTime(event.startDate)
    const endDateTime = toLocalDateTime(event.endDate)
    const regStartDateTime = toLocalDateTime(event.registrationStart)
    const regEndDateTime = toLocalDateTime(event.registrationEnd)
    
    setFormData({
      name: event.name,
      description: event.description,
      startDate: startDateTime.date,
      startTime: startDateTime.time,
      startAMPM: startDateTime.ampm,
      endDate: endDateTime.date,
      endTime: endDateTime.time,
      endAMPM: endDateTime.ampm,
      registrationStartDate: regStartDateTime.date,
      registrationStartTime: regStartDateTime.time,
      registrationStartAMPM: regStartDateTime.ampm,
      registrationEndDate: regEndDateTime.date,
      registrationEndTime: regEndDateTime.time,
      registrationEndAMPM: regEndDateTime.ampm,
      location: event.location,
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
        !formData.endDate || !formData.registrationStartDate || !formData.registrationEndDate || !formData.location) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    if (!formData.startTime || !formData.endTime || !formData.registrationStartTime || !formData.registrationEndTime) {
      toast({
        title: 'Validation Error',
        description: 'Please set the time for all dates',
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
        startDate: toLocalISO(formData.startDate, formData.startTime, formData.startAMPM),
        endDate: toLocalISO(formData.endDate, formData.endTime, formData.endAMPM),
        registrationStart: toLocalISO(formData.registrationStartDate, formData.registrationStartTime, formData.registrationStartAMPM),
        registrationEnd: toLocalISO(formData.registrationEndDate, formData.registrationEndTime, formData.registrationEndAMPM),
        location: formData.location,
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
                <TableHead>Registration Period</TableHead>
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
                events.map((event) => {
                  const eventStatus = getEventStatus(event)
                  return (
                  <TableRow key={event._id}>
                    <TableCell className='font-medium'>{event.name}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${eventStatus.color}`}>
                        {eventStatus.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className='text-sm'>
                        <div>{new Date(event.registrationStart).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })} - {new Date(event.registrationEnd).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}</div>
                      </div>
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
                  )
                })
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

              {/* Registration Period */}
              <div className='grid gap-4 p-4 border rounded-lg bg-gray-50'>
                <h3 className='font-semibold text-sm'>Registration Period (Ulaanbaatar Time GMT+8)</h3>
                
                <div className='grid grid-cols-2 gap-4'>
                  <div className='grid gap-2'>
                    <Label htmlFor='registrationStartDate'>
                      Start Date <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='registrationStartDate'
                      type='date'
                      value={formData.registrationStartDate}
                      onChange={(e) => setFormData({ ...formData, registrationStartDate: e.target.value })}
                    />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='registrationStartTime'>Time</Label>
                    <div className='flex gap-2'>
                      <Input
                        id='registrationStartTime'
                        type='time'
                        value={formData.registrationStartTime}
                        onChange={(e) => setFormData({ ...formData, registrationStartTime: e.target.value })}
                        className='flex-1'
                      />
                      <select
                        value={formData.registrationStartAMPM}
                        onChange={(e) => setFormData({ ...formData, registrationStartAMPM: e.target.value })}
                        className='border rounded-md px-3 py-2 appearance-none bg-white'
                        style={{ minWidth: '70px' }}
                      >
                        <option value='AM'>AM</option>
                        <option value='PM'>PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='grid gap-2'>
                    <Label htmlFor='registrationEndDate'>
                      End Date <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='registrationEndDate'
                      type='date'
                      value={formData.registrationEndDate}
                      onChange={(e) => setFormData({ ...formData, registrationEndDate: e.target.value })}
                    />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='registrationEndTime'>Time</Label>
                    <div className='flex gap-2'>
                      <Input
                        id='registrationEndTime'
                        type='time'
                        value={formData.registrationEndTime}
                        onChange={(e) => setFormData({ ...formData, registrationEndTime: e.target.value })}
                        className='flex-1'
                      />
                      <select
                        value={formData.registrationEndAMPM}
                        onChange={(e) => setFormData({ ...formData, registrationEndAMPM: e.target.value })}
                        className='border rounded-md px-3 py-2 appearance-none bg-white'
                        style={{ minWidth: '70px' }}
                      >
                        <option value='AM'>AM</option>
                        <option value='PM'>PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Dates */}
              <div className='grid gap-4 p-4 border rounded-lg bg-gray-50'>
                <h3 className='font-semibold text-sm'>Event Dates (Local Time)</h3>
                
                <div className='grid grid-cols-2 gap-4'>
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
                    <Label htmlFor='startTime'>Time</Label>
                    <div className='flex gap-2'>
                      <Input
                        id='startTime'
                        type='time'
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className='flex-1'
                      />
                      <select
                        value={formData.startAMPM}
                        onChange={(e) => setFormData({ ...formData, startAMPM: e.target.value })}
                        className='border rounded-md px-3 py-2 appearance-none bg-white'
                        style={{ minWidth: '70px' }}
                      >
                        <option value='AM'>AM</option>
                        <option value='PM'>PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
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
                  <div className='grid gap-2'>
                    <Label htmlFor='endTime'>Time</Label>
                    <div className='flex gap-2'>
                      <Input
                        id='endTime'
                        type='time'
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        className='flex-1'
                      />
                      <select
                        value={formData.endAMPM}
                        onChange={(e) => setFormData({ ...formData, endAMPM: e.target.value })}
                        className='border rounded-md px-3 py-2 appearance-none bg-white'
                        style={{ minWidth: '70px' }}
                      >
                        <option value='AM'>AM</option>
                        <option value='PM'>PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className='grid gap-2'>
                <div className='flex items-center justify-between'>
                  <Label>
                    Competition Categories <span className='text-red-500'>*</span>
                  </Label>
                  <div className='flex gap-2'>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => setFormData({ 
                        ...formData, 
                        selectedCategories: AVAILABLE_CATEGORIES.map(c => c.code) 
                      })}
                    >
                      Select All
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => setFormData({ 
                        ...formData, 
                        selectedCategories: [] 
                      })}
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
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
