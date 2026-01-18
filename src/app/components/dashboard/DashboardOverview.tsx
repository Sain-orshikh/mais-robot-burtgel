import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CardBox from '@/app/components/shared/CardBox'
import { UserPlus, Users, Calendar, Trophy, CheckCircle2, AlertCircle, ArrowRight, Info } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { contestantApi } from '@/lib/api/contestants'
import { coachApi } from '@/lib/api/coaches'
import { teamApi } from '@/lib/api/teams'
import { eventApi } from '@/lib/api/events'

export function DashboardOverview() {
  const { organisation } = useAuth()
  const [stats, setStats] = useState({
    contestants: 0,
    coaches: 0,
    activeTeams: 0,
    upcomingEvents: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [contestants, coaches, events, teams] = await Promise.all([
        contestantApi.getAll(),
        coachApi.getAll(),
        eventApi.getAll(),
        teamApi.getAll(),
      ])
      
      // Count upcoming events (startDate not passed)
      const now = new Date()
      const upcoming = events.filter(e => new Date(e.startDate) >= now).length
      
      const activeTeamsCount = teams.filter((team: any) => team.status === 'active').length

      setStats({
        contestants: contestants.length,
        coaches: coaches.length,
        activeTeams: activeTeamsCount,
        upcomingEvents: upcoming,
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const registrationSteps = [
    {
      step: 1,
      title: 'Add Contestants & Coaches',
      description: 'Navigate to Team Members section and add contestants and coaches to your organization.',
      icon: Users,
      color: 'bg-blue-500',
      action: '/dashboard/team-members/contestant',
    },
    {
      step: 2,
      title: 'Browse Available Events',
      description: 'Go to Events page to view all upcoming robotics competitions and their categories.',
      icon: Calendar,
      color: 'bg-purple-500',
      action: '/dashboard/events',
    },
    {
      step: 3,
      title: 'Register Your Teams',
      description: 'Click on an event, select a category, choose 2–4 contestants (depending on the category) and 1 coach to form a team.',
      icon: Trophy,
      color: 'bg-green-500',
      action: '/dashboard/events',
    },
    {
      step: 4,
      title: 'Submit Payment',
      description: 'Upload payment receipt and submit — 20,000₮ per team. You can track the status after submission.',
      icon: CheckCircle2,
      color: 'bg-orange-500',
      action: '/dashboard/events',
    },
  ]

  return (
    <div className='container mx-auto px-6 py-8'>
      {/* Organization Header */}
      <div className='mb-8 bg-linear-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-100'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Welcome back!</h1>
        <p className='text-lg text-gray-700 font-medium'>{organisation?.typeDetail || 'Organization'}</p>
        <div className='flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600'>
          <span className='flex items-center gap-1'>
            <span className='text-gray-400'></span> {organisation?.aimag || 'Mongolia'}
          </span>
          <span className='flex items-center gap-1'>
            <span className='text-blue-500 font-medium'>Type:</span> {organisation?.type || 'Company'}
          </span>
          <span className='flex items-center gap-1'>
            <span className='text-gray-500'></span> {organisation?.phoneNumber}
          </span>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-500 font-medium'>Contestants</p>
                <p className='text-3xl font-bold text-gray-800 mt-1'>
                  {loading ? '...' : stats.contestants}
                </p>
              </div>
              <div className='bg-blue-100 p-3 rounded-full'>
                <Users className='text-blue-600' size={24} />
              </div>
            </div>
            <Link to='/dashboard/team-members/contestant'>
              <Button variant='link' className='p-0 h-auto mt-2 text-blue-500 text-sm'>
                Manage →
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-500 font-medium'>Coaches</p>
                <p className='text-3xl font-bold text-gray-800 mt-1'>
                  {loading ? '...' : stats.coaches}
                </p>
              </div>
              <div className='bg-purple-100 p-3 rounded-full'>
                <UserPlus className='text-purple-600' size={24} />
              </div>
            </div>
            <Link to='/dashboard/team-members/coach'>
              <Button variant='link' className='p-0 h-auto mt-2 text-purple-500 text-sm'>
                Manage →
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-500 font-medium'>Upcoming Events</p>
                <p className='text-3xl font-bold text-gray-800 mt-1'>
                  {loading ? '...' : stats.upcomingEvents}
                </p>
              </div>
              <div className='bg-green-100 p-3 rounded-full'>
                <Calendar className='text-green-600' size={24} />
              </div>
            </div>
            <Link to='/dashboard/events'>
              <Button variant='link' className='p-0 h-auto mt-2 text-green-500 text-sm'>
                Browse →
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-500 font-medium'>Active Teams</p>
                <p className='text-3xl font-bold text-gray-800 mt-1'>
                  {loading ? '...' : stats.activeTeams}
                </p>
              </div>
              <div className='bg-orange-100 p-3 rounded-full'>
                <Trophy className='text-orange-600' size={24} />
              </div>
            </div>
            <Link to='/dashboard/events'>
              <Button variant='link' className='p-0 h-auto mt-2 text-orange-500 text-sm'>
                View →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Registration Guide - Takes 2 columns */}
        <div className='lg:col-span-2'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Info className='text-blue-500' size={24} />
                Team Registration Guide
              </CardTitle>
              <p className='text-sm text-gray-500 mt-1'>
                Follow these steps to register your teams for robotics competitions
              </p>
            </CardHeader>
            <CardContent className='space-y-6'>
              {registrationSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={step.step} className='flex gap-4 group'>
                    <div className='flex flex-col items-center'>
                      <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center text-white font-bold shadow-md transition-transform group-hover:scale-110`}>
                        <Icon size={20} />
                      </div>
                      {index < registrationSteps.length - 1 && (
                        <div className='w-0.5 h-12 bg-gray-200 my-2'></div>
                      )}
                    </div>
                    <div className='flex-1 pb-2'>
                      <div className='flex items-center justify-between mb-2'>
                        <h3 className='font-semibold text-gray-800 text-base'>{step.title}</h3>
                        <span className='text-xs text-gray-400 font-medium'>Step {step.step}</span>
                      </div>
                      <p className='text-sm text-gray-600 mb-3'>{step.description}</p>
                      <Link to={step.action}>
                        <Button 
                          size='sm' 
                          variant='outline' 
                          className='text-xs group-hover:bg-gray-50'
                        >
                          Go to {step.title.split(' ')[0]} <ArrowRight className='ml-1' size={14} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right Section - Important Info */}
        <div className='space-y-6'>
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className='gap-y-3'>
              <Link to='/dashboard/team-members/contestant'>
                <Button className='w-full bg-blue-500 hover:bg-blue-600' size='sm'>
                  <Users className='mr-2' size={16} />
                  Add Contestant
                </Button>
              </Link>
              <Link to='/dashboard/team-members/coach'>
                <Button className='w-full bg-purple-500 hover:bg-purple-600 mt-1' size='sm'>
                  <UserPlus className='mr-2' size={16} />
                  Add Coach
                </Button>
              </Link>
              <Link to='/dashboard/events'>
                <Button className='w-full bg-green-500 hover:bg-green-600 mt-1' size='sm'>
                  <Calendar className='mr-2' size={16} />
                  Browse Events
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card className='border-orange-200 bg-orange-50'>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2 text-orange-800'>
                <AlertCircle size={20} />
                Important Notes
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3 text-sm text-gray-700'>
              <div className='flex gap-2'>
                <span className='text-orange-500 shrink-0'>•</span>
                <p>Each team requires <strong>1-4 contestants</strong> (varies by category) and <strong>1 coach</strong></p>
              </div>
              <div className='flex gap-2'>
                <span className='text-orange-500 shrink-0'>•</span>
                <p>Maximum <strong>10 teams per category</strong> (5 for Drone categories)</p>
              </div>
              <div className='flex gap-2'>
                <span className='text-orange-500 shrink-0'>•</span>
                <p>Register before the <strong>deadline</strong> shown on each event</p>
              </div>
              <div className='flex gap-2'>
                <span className='text-orange-500 shrink-0'>•</span>
                <p>Teams can be withdrawn anytime before the event starts</p>
              </div>
            </CardContent>
          </Card>

          {/* Competition Categories Preview */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Competition Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2 text-xs text-gray-600'>
                <div className='flex justify-between py-1 border-b'>
                  <span>Mini Sumo (RC/Auto)</span>
                  <span className='text-gray-400'>MNR, MNA</span>
                </div>
                <div className='flex justify-between py-1 border-b'>
                  <span>Mega Sumo (RC/Auto)</span>
                  <span className='text-gray-400'>MGR, MGA</span>
                </div>
                <div className='flex justify-between py-1 border-b'>
                  <span>Line Follower</span>
                  <span className='text-gray-400'>LFG, LFH, LFL</span>
                </div>
                <div className='flex justify-between py-1 border-b'>
                  <span>Drone (RC/Auto)</span>
                  <span className='text-gray-400'>DRC, DRA</span>
                </div>
                <div className='flex justify-between py-1'>
                  <span>Robot Rugby & More</span>
                  <span className='text-gray-400'>RRC, LSR, LUR</span>
                </div>
              </div>
              <Link to='/dashboard/events'>
                <Button variant='link' className='p-0 h-auto mt-3 text-blue-500 text-xs'>
                  View all categories →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
