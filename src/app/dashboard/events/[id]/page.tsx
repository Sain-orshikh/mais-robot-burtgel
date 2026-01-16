'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { mockEvents, mockContestants, mockCoaches } from '@/data/mockUserData'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

const eventTypes = [
  { id: 'mini-sumo-rc', name: 'Mini Sumo RC', maxContestants: 2, teamIdCode: 'MNR' },
  { id: 'mega-sumo-rc', name: 'Mega Sumo RC', maxContestants: 2, teamIdCode: 'MGR' },
  { id: 'mini-sumo-auto', name: 'Mini Sumo Auto', maxContestants: 2, teamIdCode: 'MNA' },
  { id: 'mega-sumo-auto', name: 'Mega Sumo Auto', maxContestants: 2, teamIdCode: 'MGA' },
  { id: 'robot-rugby', name: 'Robot Rugby', maxContestants: 4, teamIdCode: 'RRC' },
  { id: 'drone-rc', name: 'Drone RC', maxContestants: 2, teamIdCode: 'DRC' },
  { id: 'drone-auto', name: 'Drone Auto', maxContestants: 2, teamIdCode: 'DRA' },
  { id: 'line-follower-lego', name: 'Line Follower (Lego)', maxContestants: 2, teamIdCode: 'LFG' },
  { id: 'line-follower-high-speed', name: 'Line Follower (High Speed)', maxContestants: 2, teamIdCode: 'LFH' },
  { id: 'line-follower-low-speed', name: 'Line Follower (Low Speed)', maxContestants: 2, teamIdCode: 'LFL' },
  { id: 'lego-sumo', name: 'Lego Sumo', maxContestants: 2, teamIdCode: 'LSR' },
  { id: 'lego-unknown', name: 'Lego Unknown', maxContestants: 3, teamIdCode: 'LUR' },
]

interface Team {
  id: string
  eventType: string
  contestants: string[]
  coach: string
}

export default function EventDetailPage() {
  const router = useRouter()
  const params = useParams()
  const eventId = params.id as string
  
  const event = mockEvents.find((e) => e.id === eventId)
  
  const [selectedEventType, setSelectedEventType] = useState<string>('')
  const [showContestantSelection, setShowContestantSelection] = useState(false)
  const [selectedContestants, setSelectedContestants] = useState<string[]>([])
  const [showCoachSelection, setShowCoachSelection] = useState(false)
  const [selectedCoach, setSelectedCoach] = useState<string>('')
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)

  if (!event) {
    return (
      <div className='container mx-auto px-6 py-8'>
        <p>Event not found</p>
      </div>
    )
  }

  const currentEventType = eventTypes.find((et) => et.id === selectedEventType)
  const maxContestants = currentEventType?.maxContestants || 2

  const handleEventTypeChange = (eventTypeId: string) => {
    setSelectedEventType(eventTypeId)
    setShowContestantSelection(false)
    setShowCoachSelection(false)
    setSelectedContestants([])
    setSelectedCoach('')
  }

  const handleContestantToggle = (contestantId: string) => {
    setSelectedContestants((prev) => {
      if (prev.includes(contestantId)) {
        return prev.filter((id) => id !== contestantId)
      } else {
        if (prev.length < maxContestants) {
          return [...prev, contestantId]
        }
        return prev
      }
    })
  }

  const handleChooseContestant = () => {
    if (!selectedEventType) {
      alert('Please select an event type first')
      return
    }
    setShowContestantSelection(true)
  }

  const handleChooseCoach = () => {
    if (selectedContestants.length === 0) {
      alert('Please select at least one contestant first')
      return
    }
    setShowCoachSelection(true)
  }

  const handleCreateTeam = () => {
    if (!selectedEventType || selectedContestants.length === 0 || !selectedCoach) {
      alert('Please complete all selections before creating a team')
      return
    }

    const currentEventType = eventTypes.find((et) => et.id === selectedEventType)
    const teamIdCode = currentEventType?.teamIdCode || 'XXX'
    const eventTeams = teams.filter((t) => t.eventType === selectedEventType)
    const teamNumber = eventTeams.length + 1
    const teamId = `T${teamIdCode}${teamNumber.toString().padStart(3, '0')}`

    const newTeam: Team = {
      id: teamId,
      eventType: selectedEventType,
      contestants: selectedContestants,
      coach: selectedCoach,
    }

    setTeams([...teams, newTeam])
    
    // Reset selections
    setSelectedEventType('')
    setShowContestantSelection(false)
    setSelectedContestants([])
    setShowCoachSelection(false)
    setSelectedCoach('')
  }

  const getEventTypeName = (typeId: string) => {
    return eventTypes.find((et) => et.id === typeId)?.name || typeId
  }

  return (
    <div className='container mx-auto px-6 py-8'>
      <Button
        variant='ghost'
        onClick={() => router.push('/dashboard/events')}
        className='mb-4'
      >
        <ArrowLeft className='mr-2 h-4 w-4' />
        Back to Events
      </Button>

      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>{event.name}</h1>
        <p className='text-gray-600'>{event.description}</p>
        <div className='mt-4 flex gap-4 text-sm text-gray-600'>
          <div>
            <span className='font-medium'>Event Date:</span>{' '}
            {new Date(event.startDate).toLocaleDateString()} -{' '}
            {new Date(event.endDate).toLocaleDateString()}
          </div>
          <div>
            <span className='font-medium'>Registration Deadline:</span>{' '}
            {new Date(event.registrationDeadline).toLocaleDateString()}
          </div>
        </div>
      </div>

      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Step 1: Select Event Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {eventTypes.map((eventType) => (
              <div key={eventType.id} className='flex items-start space-x-3'>
                <Checkbox
                  id={eventType.id}
                  checked={selectedEventType === eventType.id}
                  onCheckedChange={() => handleEventTypeChange(eventType.id)}
                />
                <Label
                  htmlFor={eventType.id}
                  className='cursor-pointer font-normal'
                >
                  {eventType.name}
                  <span className='text-xs text-gray-500 ml-2'>
                    (max {eventType.maxContestants} contestants)
                  </span>
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedEventType && (
        <Card className='mb-6'>
          <CardHeader>
            <CardTitle>Step 2: Select Contestants</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleChooseContestant} className='mb-4'>
              Choose Contestant
            </Button>
            {showContestantSelection && (
              <div className='mt-4 p-4 border rounded-lg bg-gray-50'>
                <p className='mb-3 text-sm text-gray-600'>
                  Select up to {maxContestants} contestants for{' '}
                  {currentEventType?.name}
                </p>
                <div className='space-y-3'>
                  {mockContestants.map((contestant) => (
                    <div key={contestant.id} className='flex items-start space-x-3'>
                      <Checkbox
                        id={`contestant-${contestant.id}`}
                        checked={selectedContestants.includes(contestant.id)}
                        onCheckedChange={() => handleContestantToggle(contestant.id)}
                        disabled={
                          !selectedContestants.includes(contestant.id) &&
                          selectedContestants.length >= maxContestants
                        }
                      />
                      <Label
                        htmlFor={`contestant-${contestant.id}`}
                        className='cursor-pointer font-normal'
                      >
                        {contestant.listName} ({contestant.youngId})
                      </Label>
                    </div>
                  ))}
                </div>
                <p className='mt-3 text-sm text-gray-500'>
                  Selected: {selectedContestants.length}/{maxContestants}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedContestants.length > 0 && (
        <Card className='mb-6'>
          <CardHeader>
            <CardTitle>Step 3: Select Coach</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleChooseCoach} className='mb-4'>
              Choose Coach
            </Button>
            {showCoachSelection && (
              <div className='mt-4 p-4 border rounded-lg bg-gray-50'>
                <p className='mb-3 text-sm text-gray-600'>
                  Select one coach for the team
                </p>
                <div className='space-y-3'>
                  {mockCoaches.map((coach) => (
                    <div key={coach.id} className='flex items-start space-x-3'>
                      <Checkbox
                        id={`coach-${coach.id}`}
                        checked={selectedCoach === coach.id}
                        onCheckedChange={() => setSelectedCoach(coach.id)}
                      />
                      <Label
                        htmlFor={`coach-${coach.id}`}
                        className='cursor-pointer font-normal'
                      >
                        {coach.listName} ({coach.youngId})
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedCoach && (
        <div className='mb-6'>
          <Button
            onClick={handleCreateTeam}
            className='bg-green-600 hover:bg-green-700'
          >
            Create Team
          </Button>
        </div>
      )}

      {teams.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Created Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {teams.map((team) => (
                <div
                  key={team.id}
                  onClick={() =>
                    setSelectedTeam(selectedTeam === team.id ? null : team.id)
                  }
                  className='p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors'
                >
                  <div className='font-semibold text-lg mb-2'>
                    Team #{team.id}
                  </div>
                  
                  {selectedTeam === team.id && (
                    <div className='mt-3 space-y-2 text-sm'>
                      <div>
                        <span className='font-medium'>Event Type:</span>
                        <div className='text-gray-700 mt-1'>
                          {getEventTypeName(team.eventType)}
                        </div>
                      </div>
                      
                      <div>
                        <span className='font-medium'>Contestants:</span>
                        <div className='text-gray-700 mt-1'>
                          {team.contestants.map((contestantId) => {
                            const contestant = mockContestants.find(
                              (c) => c.id === contestantId
                            )
                            return (
                              <div key={contestantId}>
                                • {contestant?.listName}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      
                      <div>
                        <span className='font-medium'>Coach:</span>
                        <div className='text-gray-700 mt-1'>
                          {mockCoaches.find((c) => c.id === team.coach)?.listName}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
