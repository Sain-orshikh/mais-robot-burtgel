import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { eventApi } from '@/lib/api/events'
import { contestantApi } from '@/lib/api/contestants'
import { coachApi } from '@/lib/api/coaches'
import { teamApi } from '@/lib/api/teams'
import { paymentApi } from '@/lib/api/payments'
import { Event, Contestant, Coach, Team } from '@/types/models'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Users, Trophy, Calendar, MapPin, CreditCard, CheckCircle2, XCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react'
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

// Category code mapping for matching event categories with codes
const CATEGORY_CODE_MAP: { [key: string]: string } = {
  'Mini Sumo RC': 'MNR',
  'Mega Sumo RC': 'MGR',
  'Mini Sumo Auto': 'MNA',
  'Mega Sumo Auto': 'MGA',
  'Robot Rugby': 'RRC',
  'Drone RC': 'DRC',
  'Drone Auto': 'DRA',
  'Line Follower (Lego)': 'LFG',
  'Line Follower (High Speed)': 'LFH',
  'Line Follower (Low Speed)': 'LFL',
  'Lego Sumo': 'LSR',
  'Lego Unknown': 'LUR',
}

// Backend category configuration (source of truth for rules)
const BACKEND_CATEGORY_CONFIG: { [key: string]: { maxTeamsPerOrg: number, minContestants: number, maxContestants: number } } = {
  'MNR': { maxTeamsPerOrg: 10, minContestants: 1, maxContestants: 2 },
  'MGR': { maxTeamsPerOrg: 10, minContestants: 1, maxContestants: 2 },
  'MNA': { maxTeamsPerOrg: 10, minContestants: 1, maxContestants: 2 },
  'MGA': { maxTeamsPerOrg: 10, minContestants: 1, maxContestants: 2 },
  'RRC': { maxTeamsPerOrg: 10, minContestants: 1, maxContestants: 4 },
  'DRC': { maxTeamsPerOrg: 5, minContestants: 1, maxContestants: 2 },
  'DRA': { maxTeamsPerOrg: 5, minContestants: 1, maxContestants: 2 },
  'LFG': { maxTeamsPerOrg: 10, minContestants: 1, maxContestants: 2 },
  'LFH': { maxTeamsPerOrg: 10, minContestants: 1, maxContestants: 2 },
  'LFL': { maxTeamsPerOrg: 10, minContestants: 1, maxContestants: 2 },
  'LSR': { maxTeamsPerOrg: 10, minContestants: 1, maxContestants: 2 },
  'LUR': { maxTeamsPerOrg: 10, minContestants: 1, maxContestants: 3 },
}

export default function EventDetailPage() {
  const navigate = useNavigate()
  const { id: eventId } = useParams<{ id: string }>()
  const { toast } = useToast()
  const { organisation } = useAuth()
  
  // Type guard for eventId
  const validEventId = eventId || ''
  
  const [event, setEvent] = useState<Event | null>(null)
  const [contestants, setContestants] = useState<Contestant[]>([])
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [myTeams, setMyTeams] = useState<Team[]>([])
  const [myRegistrations, setMyRegistrations] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Team creation form state
  const [showTeamForm, setShowTeamForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [robotName, setRobotName] = useState<string>('')
  const [selectedContestants, setSelectedContestants] = useState<string[]>([])
  const [selectedCoach, setSelectedCoach] = useState<string>('')
  const [creating, setCreating] = useState(false)
  
  // Payment state
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  // Map event categories to include codes and use backend config as source of truth
  const eventCategories = event?.categories.map(cat => {
    const code = CATEGORY_CODE_MAP[cat.name] || ''
    const backendConfig = BACKEND_CATEGORY_CONFIG[code]
    
    return {
      code,
      name: cat.name,
      // Use backend config if available, otherwise fall back to event data
      maxTeamsPerOrg: backendConfig?.maxTeamsPerOrg || cat.maxTeamsPerOrg,
      minContestants: backendConfig?.minContestants || cat.minContestantsPerTeam,
      maxContestants: backendConfig?.maxContestants || cat.maxContestantsPerTeam,
    }
  }) || []

  const lockedContestants = useMemo(() => {
    if (!selectedCategory) return new Set<string>()

    const rejectedTeamIds = new Set(
      (myRegistrations || [])
        .filter((reg: any) => reg?.status === 'rejected')
        .flatMap((reg: any) => {
          const teamIds = Array.isArray(reg?.teamIds) ? reg.teamIds : []
          const mappedTeamIds = teamIds.map((id: any) => (typeof id === 'object' && id?._id ? id._id : id))
          const singleTeamId = reg?.teamId && typeof reg.teamId === 'object' ? reg.teamId._id : reg?.teamId
          return [...mappedTeamIds, singleTeamId].filter(Boolean)
        })
        .map((id: any) => id.toString())
    )

    return new Set(
      myTeams
        .filter(t => t.status === 'active' && t.categoryCode === selectedCategory && !rejectedTeamIds.has(t._id.toString()))
        .flatMap(t => Array.isArray(t.contestantIds)
          ? t.contestantIds.map((c: any) => typeof c === 'object' ? c._id : c)
          : [])
        .filter(Boolean)
        .map((id: any) => id.toString())
    )
  }, [myTeams, myRegistrations, selectedCategory])

  useEffect(() => {
    if (validEventId) {
      fetchData()
    }
  }, [validEventId])

  const fetchData = async () => {
    try {
      const [eventData, contestantsData, coachesData, teamsData, paymentsData] = await Promise.all([
        eventApi.getById(validEventId),
        contestantApi.getAll(),
        coachApi.getAll(),
        teamApi.getByEvent(validEventId),
        paymentApi.getPaymentStatus(validEventId).catch(() => []),
      ])
      
      // Fetch my registrations from the event
      const myRegs = eventData.registrations?.filter(
        (reg: any) => reg.organisationId?._id === organisation?._id || reg.organisationId === organisation?._id
      ) || []
      
      setEvent(eventData)
      setContestants(contestantsData)
      setCoaches(coachesData)
      setMyTeams(teamsData)
      setMyRegistrations(myRegs)
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
        const currentCategory = eventCategories.find(c => c.code === selectedCategory)
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
    if (!selectedCategory || !robotName || selectedContestants.length === 0 || !selectedCoach) {
      toast({
        title: 'Incomplete Selection',
        description: 'Please select category, robot name, contestants, and coach',
        variant: 'destructive',
      })
      return
    }

    const currentCategory = eventCategories.find(c => c.code === selectedCategory)
    if (selectedContestants.length < (currentCategory?.minContestants || 1)) {
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
        eventId: validEventId,
        categoryCode: selectedCategory,
        robotName,
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
      setRobotName('')
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
      eventId: validEventId,
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

  // Check if registration is open
  const isRegistrationOpen = (() => {
    if (!event) return false
    
    const now = new Date()
    const regStart = new Date(event.registrationStart)
    const regEnd = new Date(event.registrationEnd)
    
    // Registration is open if current time is between start and end
    return now >= regStart && now <= regEnd
  })()

  return (
    <div className='container mx-auto px-6 py-8'>
      <Button
        variant='ghost'
        onClick={() => navigate('/dashboard/events')}
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
              <div className='font-medium'>Registration Period:</div>
              <div>{new Date(event.registrationStart).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric'
              })} - {new Date(event.registrationEnd).toLocaleDateString('en-US', {
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
            {eventCategories.map((category) => {
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
                  {eventCategories.map((category) => {
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
                  Team size: {eventCategories.find(c => c.code === selectedCategory)?.minContestants}-
                  {eventCategories.find(c => c.code === selectedCategory)?.maxContestants} contestants
                </p>
              )}
            </div>

            {/* Step 2: Contestant Selection */}
            {selectedCategory && (
              <div>
                <Label className='text-base font-semibold mb-3 block'>
                  2. Select Contestants (required: {eventCategories.find(c => c.code === selectedCategory)?.minContestants})
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
                          disabled={lockedContestants.has(contestant._id)}
                        />
                        <Label
                          htmlFor={`contestant-${contestant._id}`}
                          className={`cursor-pointer font-normal flex-1 ${lockedContestants.has(contestant._id) ? 'text-gray-400' : ''}`}
                        >
                          {contestant.ovog} {contestant.ner} ({contestant.contestantId})
                          {lockedContestants.has(contestant._id) && (
                            <span className='ml-2 text-xs text-gray-400'>Already in this category</span>
                          )}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
                <p className='text-sm text-gray-500 mt-2'>
                  Selected: {selectedContestants.length}/{eventCategories.find(c => c.code === selectedCategory)?.maxContestants}
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

            {/* Step 4: Robot Name */}
            {selectedContestants.length > 0 && selectedCoach && (
              <div>
                <Label className='text-base font-semibold mb-3 block'>
                  4. Robot Name
                </Label>
                <Input
                  id='robotName'
                  type='text'
                  placeholder='Enter robot name'
                  value={robotName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRobotName(e.target.value)}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className='flex gap-3 pt-4'>
              <Button
                onClick={handleCreateTeam}
                disabled={!selectedCategory || !robotName || selectedContestants.length === 0 || !selectedCoach || creating}
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

      {/* My Registered Teams - Comprehensive View */}
      {(myTeams.filter(t => t.status === 'active').length > 0 || myRegistrations.length > 0) && (
        <Card className='mb-8'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle className='flex items-center gap-2'>
                <Users className='h-5 w-5' />
                My Registered Teams ({myTeams.filter(t => t.status === 'active').length})
              </CardTitle>
              {myTeams.filter(t => t.status === 'active' && !(t as any).paymentId).length > 0 && (
                <Button
                  onClick={() => setShowPaymentModal(true)}
                  className='bg-green-600 hover:bg-green-700'
                  size='sm'
                >
                  <CreditCard className='mr-2 h-4 w-4' />
                  Pay Now ({myTeams.filter(t => t.status === 'active' && !(t as any).paymentId).length} team(s))
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Payment History Section */}
            {payments.length > 0 && (
              <div className='mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                <h3 className='font-semibold text-gray-800 mb-3 flex items-center gap-2'>
                  <CreditCard size={18} />
                  Payment History
                </h3>
                <div className='space-y-2'>
                  {payments.map((payment) => (
                    <div key={payment._id} className='flex items-center justify-between p-3 bg-white rounded-lg border'>
                      <div className='flex items-center gap-3'>
                        <CheckCircle2 className='text-green-500' size={20} />
                        <div>
                          <div className='font-medium text-gray-800 text-sm'>
                            {payment.teamIds.length} team(s) - {payment.amount.toLocaleString()}₮
                          </div>
                          <div className='text-xs text-gray-600'>
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
                        className='text-blue-500 hover:underline text-xs'
                      >
                        View Receipt
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Teams List */}
            <div className='space-y-4'>
              {myTeams.filter(t => t.status === 'active').map((team) => {
                const category = eventCategories.find(c => c.code === team.categoryCode)
                
                // Backend returns populated contestant and coach objects, not just IDs
                const teamContestants = Array.isArray(team.contestantIds) && typeof team.contestantIds[0] === 'object'
                  ? team.contestantIds as any[] // Already populated
                  : contestants.filter(c => (team.contestantIds as any).includes(c._id)) // Fallback if IDs only
                
                const teamCoach = typeof team.coachId === 'object'
                  ? team.coachId as any // Already populated
                  : coaches.find(c => c._id === team.coachId) // Fallback if ID only
                
                const isPaid = !!(team as any).paymentId
                
                // Find corresponding registration to show status
                const matchingRegistrations = myRegistrations.filter((reg: any) => {
                  const teamId = team._id
                  const regTeamIds = Array.isArray(reg?.teamIds)
                    ? reg.teamIds
                        .map((id: any) => (typeof id === 'object' && id?._id ? id._id : id))
                        .filter(Boolean)
                    : []

                  if (teamId && regTeamIds.some((id: any) => id.toString() === teamId.toString())) {
                    return true
                  }

                  const regTeamId = reg?.teamId && typeof reg.teamId === 'object' ? reg.teamId._id : reg?.teamId
                  if (regTeamId && teamId && regTeamId.toString() === teamId.toString()) {
                    return true
                  }

                  const teamCategoryCode = team.categoryCode
                  const categoryName = category?.name
                  const regCategory = reg?.category
                  if (regCategory && (regCategory === teamCategoryCode || regCategory === categoryName)) {
                    return true
                  }

                  const regCategories = Array.isArray(reg?.categories) ? reg.categories : []
                  return regCategories.includes(teamCategoryCode) || (categoryName ? regCategories.includes(categoryName) : false)
                })

                const registration = matchingRegistrations
                  .sort((a: any, b: any) => {
                    const statusRank = (status?: string) => {
                      if (status === 'approved') return 2
                      if (status === 'pending') return 1
                      return 0
                    }
                    const statusDiff = statusRank(b?.status) - statusRank(a?.status)
                    if (statusDiff !== 0) return statusDiff
                    const aTime = new Date(a?.registeredAt || 0).getTime()
                    const bTime = new Date(b?.registeredAt || 0).getTime()
                    return bTime - aTime
                  })[0]
                
                const getStatusBadge = (status?: string) => {
                  if (!status) return null
                  switch (status) {
                    case 'approved':
                      return (
                        <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700'>
                          <CheckCircle2 size={14} />
                          Approved
                        </span>
                      )
                    case 'rejected':
                      return (
                        <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700'>
                          <XCircle size={14} />
                          Rejected
                        </span>
                      )
                    default:
                      return (
                        <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700'>
                          <Clock size={14} />
                          Pending Review
                        </span>
                      )
                  }
                }
                
                const getPaymentStatusBadge = (status?: string, hasPayment?: boolean) => {
                  if (!hasPayment) {
                    return (
                      <span className='text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded inline-flex items-center gap-1'>
                        <Clock size={12} />
                        Payment Not Submitted
                      </span>
                    )
                  }
                  switch (status) {
                    case 'approved':
                    case 'verified':
                      return (
                        <span className='text-xs bg-green-100 text-green-700 px-2 py-1 rounded inline-flex items-center gap-1'>
                          <CheckCircle2 size={12} />
                          Payment Approved
                        </span>
                      )
                    case 'rejected':
                      return (
                        <span className='text-xs bg-red-100 text-red-700 px-2 py-1 rounded inline-flex items-center gap-1'>
                          <XCircle size={12} />
                          Payment Rejected
                        </span>
                      )
                    case 'pending':
                    default:
                      return (
                        <span className='text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded inline-flex items-center gap-1'>
                          <Clock size={12} />
                          Payment Pending
                        </span>
                      )
                  }
                }
                
                return (
                  <div 
                    key={team._id} 
                    className={`p-4 border rounded-lg ${
                      registration?.status === 'rejected' ? 'bg-red-50 border-red-200' : 
                      registration?.status === 'approved' ? 'bg-green-50 border-green-200' : 
                      'bg-white'
                    }`}
                  >
                    <div className='flex items-start justify-between mb-3'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-1'>
                          <div className='font-mono font-bold text-lg'>{team.teamId}</div>
                          {registration ? getStatusBadge(registration.status) : (
                            <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500'>
                              Not Registered
                            </span>
                          )}
                        </div>
                        <div className='text-sm text-gray-600'>{category?.name}</div>
                        <div className='text-xs text-gray-500'>Robot: {team.robotName || 'N/A'}</div>
                        <div className='flex items-center gap-2 mt-1'>
                          {(() => {
                            // Find payment for this team
                            const teamPayment = payments.find((p) => Array.isArray(p.teamIds) && p.teamIds.includes(team._id))
                            return getPaymentStatusBadge(teamPayment?.status, !!teamPayment)
                          })()}
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
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

                    {/* Registration Date */}
                    {registration && (
                      <div className='mt-3 pt-3 border-t text-xs text-gray-600'>
                        Registered: {new Date(registration.registeredAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    )}

                    {/* Rejection Reason */}
                    {registration?.status === 'rejected' && registration.rejectionReason && (
                      <div className='mt-3 p-3 bg-red-100 border border-red-200 rounded-lg'>
                        <div className='flex items-start gap-2'>
                          <AlertCircle className='h-5 w-5 text-red-600 shrink-0 mt-0.5' />
                          <div>
                            <div className='font-medium text-red-800 mb-1'>Rejection Reason:</div>
                            <div className='text-sm text-red-700'>{registration.rejectionReason}</div>
                            <div className='mt-2'>
                <p className='text-xs text-red-600'>
                  Please create new teams and submit again. Rejected registrations don’t allow resubmission.
                </p>
                <p className='text-xs text-red-600 mt-1'>
                  If you already paid and the registration wasn’t accepted, request a refund via email or contact Shine‑Od Ganbold.
                </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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
              : new Date() < new Date(event.registrationStart)
              ? `Registration opens on ${new Date(event.registrationStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
              : 'Registration has ended.'}
          </p>
        </div>
      )}
      
      {/* Payment Modal */}
      {event && organisation && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          eventId={validEventId}
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
