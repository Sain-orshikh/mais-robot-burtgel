'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { eventApi } from '@/lib/api/events'
import { contestantApi } from '@/lib/api/contestants'
import { coachApi } from '@/lib/api/coaches'
import { teamApi } from '@/lib/api/teams'
import { paymentApi } from '@/lib/api/payments'
import { Event, Contestant, Coach, Team } from '@/types/models'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Users, Trophy, Calendar, MapPin, CreditCard, CheckCircle2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'
import { PaymentModal } from '@/app/components/events/PaymentModal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Category definitions from backend
const CATEGORIES = [
  { code: 'MNR', name: 'Mini Sumo RC', maxTeamsPerOrg: 10, minContestants: 1, maxContestants: 2 },
  { code: 'MGR', name: 'Mega Sumo RC', maxTeamsPerOrg: 10, minContestants: 1, maxContestants: 2 },
  { code: 'MNA', name: 'Mini Sumo Auto', maxTeamsPerOrg: 10, minContestants: 1, maxContestants: 2 },
  { code: 'MGA', name: 'Mega Sumo Auto', maxTeamsPerOrg: 10, minContestants: 1, maxContestants: 2 },
  { code: 'RRC', name: 'Robot Rugby', maxTeamsPerOrg: 10, minContestants: 1, maxContestants: 4 },
  { code: 'DRC', name: 'Drone RC', maxTeamsPerOrg: 5, minContestants: 1, maxContestants: 2 },
  { code: 'DRA', name: 'Drone Auto', maxTeamsPerOrg: 5, minContestants: 1, maxContestants: 2 },
  { code: 'LFG', name: 'Line Follower (Lego)', maxTeamsPerOrg: 10, minContestants: 1, maxContestants: 2 },
  { code: 'LFH', name: 'Line Follower (High Speed)', maxTeamsPerOrg: 10, minContestants: 1, maxContestants: 2 },
  { code: 'LFL', name: 'Line Follower (Low Speed)', maxTeamsPerOrg: 10, minContestants: 1, maxContestants: 2 },
  { code: 'LSR', name: 'Lego Sumo', maxTeamsPerOrg: 10, minContestants: 1, maxContestants: 2 },
  { code: 'LUR', name: 'Lego Unknown', maxTeamsPerOrg: 10, minContestants: 1, maxContestants: 3 },
]

export default function EventDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const { organisation } = useAuth()
  const eventId = params.id as string
  
  const [event, setEvent] = useState<Event | null>(null)
  const [contestants, setContestants] = useState<Contestant[]>([])
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [myTeams, setMyTeams] = useState<Team[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Team creation form state
  const [showTeamForm, setShowTeamForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedContestants, setSelectedContestants] = useState<string[]>([])
  const [selectedCoach, setSelectedCoach] = useState<string>('')
  const [creating, setCreating] = useState(false)
  
  // Payment state
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  useEffect(() => {
    fetchData()
  }, [eventId])

  const fetchData = async () => {
    try {
      const [eventData, contestantsData, coachesData, teamsData, paymentsData] = await Promise.all([
        eventApi.getById(eventId),
        contestantApi.getAll(),
        coachApi.getAll(),
        teamApi.getByEvent(eventId),
        paymentApi.getPaymentStatus(eventId).catch(() => []),
      ])
      
      setEvent(eventData)
      setContestants(contestantsData)
      setCoaches(coachesData)
      setMyTeams(teamsData)
      setPayments(Array.isArray(paymentsData) ? paymentsData : [])
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load event details',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleContestantToggle = (contestantId: string) => {
    setSelectedContestants((prev) => {
      if (prev.includes(contestantId)) {
        return prev.filter((id) => id !== contestantId)
      } else {
        const currentCategory = CATEGORIES.find(c => c.code === selectedCategory)
        if (prev.length < (currentCategory?.maxContestants || 2)) {
          return [...prev, contestantId]
        } else {
          toast({
            title: 'Maximum reached',
            description: `This category allows maximum ${currentCategory?.maxContestants} contestants per team`,
            variant: 'destructive',
          })
        }
        return prev
      }
    })
  }

  const handleCreateTeam = async () => {
    if (!selectedCategory || selectedContestants.length === 0 || !selectedCoach) {
      toast({
        title: 'Incomplete Selection',
        description: 'Please select category, contestants, and coach',
        variant: 'destructive',
      })
      return
    }

    const currentCategory = CATEGORIES.find(c => c.code === selectedCategory)
    if (selectedContestants.length < (currentCategory?.minContestants || 2)) {
      toast({
        title: 'Not Enough Contestants',
        description: `This category requires at least ${currentCategory?.minContestants} contestants`,
        variant: 'destructive',
      })
      return
    }

    setCreating(true)
    try {
      await teamApi.create({
        eventId,
        categoryCode: selectedCategory,
        contestantIds: selectedContestants,
        coachId: selectedCoach,
      })
      
      toast({
        title: 'Success',
        description: 'Team created successfully',
      })
      
      // Reset form and refresh teams
      setShowTeamForm(false)
      setSelectedCategory('')
      setSelectedContestants([])
      setSelectedCoach('')
      fetchData()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create team',
        variant: 'destructive',
      })
    } finally {
      setCreating(false)
    }
  }

  const handleWithdrawTeam = async (teamId: string) => {
    if (!confirm('Are you sure you want to withdraw this team?')) return

    try {
      await teamApi.withdraw(teamId)
      toast({
        title: 'Success',
        description: 'Team withdrawn successfully',
      })
      fetchData()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to withdraw team',
        variant: 'destructive',
      })
    }
  }
  const handlePaymentSubmit = async (receiptUrl: string) => {
    const unpaidTeams = myTeams.filter(t => t.status === 'active' && !(t as any).paymentId)
    const teamIds = unpaidTeams.map(t => t._id)
    const amount = unpaidTeams.length * 20000 // 20,000₮ per team

    await paymentApi.submitPayment({
      eventId,
      receiptUrl,
      teamIds,
      amount,
    })

    await fetchData() // Refresh to get payment status
  }
  if (loading) {
    return (
      <div className='container mx-auto px-6 py-8'>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading event details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className='container mx-auto px-6 py-8'>
        <p>Event not found</p>
      </div>
    )
  }

  // Check if registration is open - allow until 23:59:59 on the deadline date
  const isRegistrationOpen = (() => {
    if (event.status !== 'upcoming' && event.status !== 'ongoing') return false
    
    const now = new Date()
    const deadline = new Date(event.registrationDeadline)
    
    // Compare dates only (ignore time) - check if today's date is <= deadline date
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const deadlineDate = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate())
    
    return today <= deadlineDate
  })()

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

      {/* Event Header */}
      <div className='mb-8 bg-white p-6 rounded-lg shadow'>
        <div className='flex items-start justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800 mb-2'>{event.name}</h1>
            <p className='text-gray-600 mb-4'>{event.description}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            event.status === 'upcoming' || event.status === 'ongoing'
              ? 'bg-green-100 text-green-700' 
              : event.status === 'completed'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>
        
        <div className='mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
          <div className='flex items-center gap-2 text-gray-600'>
            <Calendar className='h-4 w-4' />
            <div>
              <div className='font-medium'>Event Date:</div>
              <div>{new Date(event.startDate).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              })} - {new Date(event.endDate).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              })}</div>
            </div>
          </div>
          
          <div className='flex items-center gap-2 text-gray-600'>
            <Calendar className='h-4 w-4' />
            <div>
              <div className='font-medium'>Registration Deadline:</div>
              <div>{new Date(event.registrationDeadline).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              })}</div>
            </div>
          </div>
          
          <div className='flex items-center gap-2 text-gray-600'>
            <MapPin className='h-4 w-4' />
            <div>
              <div className='font-medium'>Location:</div>
              <div>{event.location}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <Card className='mb-8'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <Trophy className='h-5 w-5' />
              Competition Categories
            </CardTitle>
            <span className='text-sm text-gray-500'>{event.categories.length} Categories Available</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {CATEGORIES.map((category) => {
              const eventCategory = event.categories.find(c => (c as any).categoryCode === category.code || c.name === category.name)
              const myTeamsInCategory = myTeams.filter(t => t.categoryCode === category.code)
              const canRegisterMore = myTeamsInCategory.length < category.maxTeamsPerOrg
              
              return (
                <div key={category.code} className='p-4 border rounded-lg bg-gray-50'>
                  <div className='font-semibold text-lg mb-2'>{category.name}</div>
                  <div className='text-sm text-gray-600 space-y-1'>
                    <div>Code: <span className='font-mono font-medium'>{category.code}</span></div>
                    <div>Team Size: {category.minContestants}-{category.maxContestants} contestants</div>
                    <div>Max Teams: {category.maxTeamsPerOrg} per organization</div>
                    <div className='pt-2'>
                      <span className='font-medium'>Your Teams: </span>
                      <span className={myTeamsInCategory.length > 0 ? 'text-green-600 font-medium' : 'text-gray-500'}>
                        {myTeamsInCategory.length}/{category.maxTeamsPerOrg}
                      </span>
                    </div>
                    {myTeamsInCategory.length > 0 && (
                      <div className='mt-2 text-xs'>
                        {myTeamsInCategory.map(team => (
                          <div key={team._id} className='font-mono'>{team.teamId}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Payment Section */}
      {myTeams.filter(t => t.status === 'active').length > 0 && (
        <Card className='mb-8'>
          <CardContent className='p-6'>
            {/* Show all payments */}
            {payments.length > 0 && (
              <div className='space-y-3 mb-4'>
                <h3 className='font-semibold text-gray-800'>Payment History</h3>
                {payments.map((payment) => (
                  <div key={payment._id} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                    <div className='flex items-center gap-3'>
                      <CheckCircle2 className='text-green-500' size={24} />
                      <div>
                        <div className='font-medium text-gray-800'>
                          {payment.teamIds.length} team(s) - {payment.amount.toLocaleString()}₮
                        </div>
                        <div className='text-sm text-gray-600'>
                          Status: <span className={`font-medium ${
                            payment.status === 'approved' ? 'text-green-600' :
                            payment.status === 'rejected' ? 'text-red-600' :
                            'text-yellow-600'
                          }`}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={payment.receiptUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-500 hover:underline text-sm'
                    >
                      View Receipt
                    </a>
                  </div>
                ))}
              </div>
            )}
            
            {/* Show unpaid teams section */}
            {myTeams.filter(t => t.status === 'active' && !(t as any).paymentId).length > 0 && (
              <div className='flex items-center justify-between border-t pt-4'>
                <div>
                  <div className='font-semibold text-gray-800 mb-1'>Unpaid Teams</div>
                  <div className='text-sm text-gray-600'>
                    Complete payment for {myTeams.filter(t => t.status === 'active' && !(t as any).paymentId).length} unpaid team(s)
                  </div>
                </div>
                <Button
                  onClick={() => setShowPaymentModal(true)}
                  className='bg-green-600 hover:bg-green-700'
                >
                  <CreditCard className='mr-2 h-4 w-4' />
                  Pay Now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Team Registration Form */}
      {isRegistrationOpen && !showTeamForm && (
        <div className='mb-8'>
          <Button
            onClick={() => setShowTeamForm(true)}
            className='bg-blue-600 hover:bg-blue-700'
          >
            <Users className='mr-2 h-4 w-4' />
            Register New Team
          </Button>
        </div>
      )}

      {showTeamForm && (
        <Card className='mb-8'>
          <CardHeader>
            <CardTitle>Register Team</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Step 1: Category Selection */}
            <div>
              <Label className='text-base font-semibold mb-3 block'>
                1. Select Category
              </Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => {
                    const myTeamsInCategory = myTeams.filter(t => t.categoryCode === category.code)
                    const canRegister = myTeamsInCategory.length < category.maxTeamsPerOrg
                    
                    return (
                      <SelectItem 
                        key={category.code} 
                        value={category.code}
                        disabled={!canRegister}
                      >
                        {category.name} {!canRegister && '(Limit Reached)'}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              {selectedCategory && (
                <p className='text-sm text-gray-600 mt-2'>
                  Team size: {CATEGORIES.find(c => c.code === selectedCategory)?.minContestants}-
                  {CATEGORIES.find(c => c.code === selectedCategory)?.maxContestants} contestants
                </p>
              )}
            </div>

            {/* Step 2: Contestant Selection */}
            {selectedCategory && (
              <div>
                <Label className='text-base font-semibold mb-3 block'>
                  2. Select Contestants (required: {CATEGORIES.find(c => c.code === selectedCategory)?.minContestants})
                </Label>
                <div className='space-y-2 max-h-60 overflow-y-auto border rounded-lg p-4'>
                  {contestants.length === 0 ? (
                    <p className='text-sm text-gray-500'>
                      No contestants available. Please add contestants first.
                    </p>
                  ) : (
                    contestants.map((contestant) => (
                      <div key={contestant._id} className='flex items-center space-x-2'>
                        <Checkbox
                          id={`contestant-${contestant._id}`}
                          checked={selectedContestants.includes(contestant._id)}
                          onCheckedChange={() => handleContestantToggle(contestant._id)}
                        />
                        <Label
                          htmlFor={`contestant-${contestant._id}`}
                          className='cursor-pointer font-normal flex-1'
                        >
                          {contestant.ovog} {contestant.ner} ({contestant.contestantId})
                        </Label>
                      </div>
                    ))
                  )}
                </div>
                <p className='text-sm text-gray-500 mt-2'>
                  Selected: {selectedContestants.length}/{CATEGORIES.find(c => c.code === selectedCategory)?.maxContestants}
                </p>
              </div>
            )}

            {/* Step 3: Coach Selection */}
            {selectedContestants.length > 0 && (
              <div>
                <Label className='text-base font-semibold mb-3 block'>
                  3. Select Coach (required)
                </Label>
                <Select value={selectedCoach} onValueChange={setSelectedCoach}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a coach" />
                  </SelectTrigger>
                  <SelectContent>
                    {coaches.length === 0 ? (
                      <SelectItem value="none" disabled>No coaches available</SelectItem>
                    ) : (
                      coaches.map((coach) => (
                        <SelectItem key={coach._id} value={coach._id}>
                          {coach.ovog} {coach.ner} ({coach.coachId})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Action Buttons */}
            <div className='flex gap-3 pt-4'>
              <Button
                onClick={handleCreateTeam}
                disabled={!selectedCategory || selectedContestants.length === 0 || !selectedCoach || creating}
                className='bg-green-600 hover:bg-green-700'
              >
                {creating ? 'Creating...' : 'Create Team'}
              </Button>
              <Button
                variant='outline'
                onClick={() => {
                  setShowTeamForm(false)
                  setSelectedCategory('')
                  setSelectedContestants([])
                  setSelectedCoach('')
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* My Registered Teams */}
      {myTeams.filter(t => t.status === 'active').length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Users className='h-5 w-5' />
              My Registered Teams ({myTeams.filter(t => t.status === 'active').length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {myTeams.filter(t => t.status === 'active').map((team) => {
                const category = CATEGORIES.find(c => c.code === team.categoryCode)
                
                // Backend returns populated contestant and coach objects, not just IDs
                const teamContestants = Array.isArray(team.contestantIds) && typeof team.contestantIds[0] === 'object'
                  ? team.contestantIds as any[] // Already populated
                  : contestants.filter(c => (team.contestantIds as any).includes(c._id)) // Fallback if IDs only
                
                const teamCoach = typeof team.coachId === 'object'
                  ? team.coachId as any // Already populated
                  : coaches.find(c => c._id === team.coachId) // Fallback if ID only
                
                const isPaid = !!(team as any).paymentId
                
                return (
                  <div key={team._id} className='p-4 border rounded-lg bg-white'>
                    <div className='flex items-start justify-between mb-3'>
                      <div>
                        <div className='font-mono font-bold text-lg'>{team.teamId}</div>
                        <div className='text-sm text-gray-600'>{category?.name}</div>
                        {isPaid && (
                          <span className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mt-1 inline-block'>
                            Paid
                          </span>
                        )}
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          team.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {team.status.charAt(0).toUpperCase() + team.status.slice(1)}
                        </span>
                        {team.status === 'active' && !isPaid && (
                          <Button
                            size='sm'
                            variant='destructive'
                            onClick={() => handleWithdrawTeam(team._id)}
                          >
                            Withdraw
                          </Button>
                        )}
                        {isPaid && (
                          <span className='text-xs text-gray-500 italic'>Locked (Paid)</span>
                        )}
                      </div>
                    </div>
                    
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                      <div>
                        <div className='font-medium text-gray-700 mb-1'>Contestants:</div>
                        {teamContestants.map((contestant) => (
                          <div key={contestant._id} className='text-gray-600'>
                            • {contestant.ovog} {contestant.ner} ({contestant.contestantId})
                          </div>
                        ))}
                      </div>
                      
                      <div>
                        <div className='font-medium text-gray-700 mb-1'>Coach:</div>
                        <div className='text-gray-600'>
                          {teamCoach ? `${teamCoach.ovog} ${teamCoach.ner} (${teamCoach.coachId})` : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {!isRegistrationOpen && (
        <div className='mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
          <p className='text-yellow-800 text-center'>
            {event.status === 'completed' || event.status === 'cancelled'
              ? 'Registration for this event has closed.' 
              : 'Registration deadline has passed.'}
          </p>
        </div>
      )}
      
      {/* Payment Modal */}
      {event && organisation && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          eventId={eventId}
          eventName={event.name}
          totalTeams={myTeams.filter(t => t.status === 'active' && !(t as any).paymentId).length}
          organisationId={organisation.organisationId}
          paymentCount={payments.length + 1}
          onPaymentSubmit={handlePaymentSubmit}
        />
      )}
    </div>
  )
}
