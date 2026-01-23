import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Users, Users2, Building2, UserCheck } from 'lucide-react'

interface CSVExportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  registrations: any[]
  eventId: string
}

type ExportType = 'teams' | 'contestants' | 'coaches' | 'organisations' | null

const TEAMS_FIELDS = [
  { id: 'teamId', label: 'Team ID', key: 'teamId' },
  { id: 'teamName', label: 'Team Name', key: 'teamName' },
  { id: 'category', label: 'Category', key: 'category' },
  { id: 'organisation', label: 'Organisation', key: 'organisationName' },
  { id: 'contestantNames', label: 'Contestant Names', key: 'contestantNames' },
  { id: 'contestantCount', label: 'Contestant Count', key: 'participantCount' },
  { id: 'coachName', label: 'Coach Name', key: 'coachName' },
  { id: 'createdAt', label: 'Created Date', key: 'createdAt' },
  { id: 'status', label: 'Status', key: 'status' },
]

const CONTESTANTS_FIELDS = [
  { id: 'contestantId', label: 'Contestant ID', key: 'contestantId' },
  { id: 'ner', label: 'First Name', key: 'ner' },
  { id: 'ovog', label: 'Last Name', key: 'ovog' },
  { id: 'email', label: 'Email', key: 'email' },
  { id: 'phoneNumber', label: 'Phone', key: 'phoneNumber' },
  { id: 'register', label: 'Registration ID', key: 'register' },
  { id: 'gender', label: 'Gender', key: 'gender' },
  { id: 'tursunUdur', label: 'Date of Birth', key: 'tursunUdur' },
  { id: 'teamIds', label: 'Team IDs', key: 'teamIds' },
  { id: 'organisation', label: 'Organisation', key: 'organisationName' },
  { id: 'participationCount', label: 'Number of Participations', key: 'participationCount' },
]

const COACHES_FIELDS = [
  { id: 'coachId', label: 'Coach ID', key: 'coachId' },
  { id: 'ner', label: 'First Name', key: 'ner' },
  { id: 'ovog', label: 'Last Name', key: 'ovog' },
  { id: 'email', label: 'Email', key: 'email' },
  { id: 'phoneNumber', label: 'Phone', key: 'phoneNumber' },
  { id: 'register', label: 'Registration ID', key: 'register' },
  { id: 'gender', label: 'Gender', key: 'gender' },
  { id: 'tursunUdur', label: 'Date of Birth', key: 'tursunUdur' },
  { id: 'teamIds', label: 'Team IDs', key: 'teamIds' },
  { id: 'organisation', label: 'Organisation', key: 'organisationName' },
  { id: 'participationCount', label: 'Number of Participations', key: 'participationCount' },
]

const ORGANISATIONS_FIELDS = [
  { id: 'orgId', label: 'Organization ID', key: 'organisationId' },
  { id: 'orgName', label: 'Organization Name', key: 'typeDetail' },
  { id: 'orgType', label: 'Organization Type', key: 'type' },
  { id: 'aimag', label: 'Aimag', key: 'aimag' },
  { id: 'email', label: 'Email', key: 'email' },
  { id: 'phoneNumber', label: 'Phone Number', key: 'phoneNumber' },
  { id: 'registrationNumber', label: 'Registration Number', key: 'registriinDugaar' },
  { id: 'contactName', label: 'Contact Name', key: 'ner' },
  { id: 'contactSurname', label: 'Contact Surname', key: 'ovog' },
  { id: 'teams', label: 'Number of Teams', key: 'teamCount' },
  { id: 'registeredAt', label: 'Registration Date', key: 'registeredAt' },
]

const EXPORT_OPTIONS = [
  { id: 'teams', label: 'All Teams', icon: Users, description: 'Teams with contestant & coach details' },
  { id: 'contestants', label: 'All Contestants', icon: Users2, description: 'Contestants with team & category info' },
  { id: 'coaches', label: 'All Coaches', icon: UserCheck, description: 'Coaches with their teams' },
  { id: 'organisations', label: 'All Organisations', icon: Building2, description: 'Organization information' },
]

export function CSVExportModal({ open, onOpenChange, registrations, eventId }: CSVExportModalProps) {
  const { toast } = useToast()
  const [exportType, setExportType] = useState<ExportType>(null)
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set())
  const [allTeams, setAllTeams] = useState<any[]>([])
  const [allContestants, setAllContestants] = useState<any[]>([])
  const [allCoaches, setAllCoaches] = useState<any[]>([])
  const [allOrganisations, setAllOrganisations] = useState<any[]>([])
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [selectedTeamCategory, setSelectedTeamCategory] = useState<string>('all')
  const [teamCategories, setTeamCategories] = useState<string[]>([])

  // Fetch data from APIs based on export type
  useEffect(() => {
    if (!open || !exportType) return

    const fetchDataForExportType = async () => {
      setIsLoadingData(true)
      try {
        // Determine API URL based on environment
        const apiUrl = typeof window !== 'undefined' 
          ? (window.location.hostname === 'localhost' 
              ? 'http://localhost:5000'
              : 'https://mais-robot-burtgel.onrender.com')
          : 'http://localhost:5000'
        
        switch (exportType) {
          case 'teams':
            if (allTeams.length === 0) {
              const res = await fetch(`${apiUrl}/api/export/teams`, {
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                },
              })
              if (res.ok) {
                const data = await res.json()
                setAllTeams(data)
                // Extract unique categories
                const categories = Array.from(
                  new Set(data.map((t: any) => t.category || t.categoryName).filter(Boolean))
                )
                setTeamCategories(categories.sort() as string[])
              }
            }
            break
          case 'contestants':
            if (allContestants.length === 0) {
              const res = await fetch(`${apiUrl}/api/export/contestants`, {
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                },
              })
              if (res.ok) {
                const data = await res.json()
                setAllContestants(data)
              }
            }
            break
          case 'coaches':
            if (allCoaches.length === 0) {
              const res = await fetch(`${apiUrl}/api/export/coaches`, {
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                },
              })
              if (res.ok) {
                const data = await res.json()
                setAllCoaches(data)
              }
            }
            break
          case 'organisations':
            if (allOrganisations.length === 0) {
              const res = await fetch(`${apiUrl}/api/export/organisations`, {
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                },
              })
              if (res.ok) {
                const data = await res.json()
                setAllOrganisations(data)
              }
            }
            break
        }
      } catch (error) {
        console.error('Error fetching data for export:', error)
        toast({
          title: 'Error',
          description: 'Failed to load data for export',
          variant: 'destructive',
        })
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchDataForExportType()
  }, [open, exportType, allTeams.length, allContestants.length, allCoaches.length, allOrganisations.length, toast])

  const getFieldsForType = (type: ExportType) => {
    switch (type) {
      case 'teams':
        return TEAMS_FIELDS
      case 'contestants':
        return CONTESTANTS_FIELDS
      case 'coaches':
        return COACHES_FIELDS
      case 'organisations':
        return ORGANISATIONS_FIELDS
      default:
        return []
    }
  }

  const handleSelectExportType = (type: ExportType) => {
    setExportType(type)
    const fields = getFieldsForType(type)
    setSelectedFields(new Set(fields.slice(0, Math.ceil(fields.length / 2)).map(f => f.id)))
    setSelectedTeamCategory('all')
  }

  const handleSelectAll = () => {
    const fields = getFieldsForType(exportType)
    setSelectedFields(new Set(fields.map(f => f.id)))
  }

  const handleDeselectAll = () => {
    setSelectedFields(new Set())
  }

  const handleToggleField = (fieldId: string) => {
    const newSet = new Set(selectedFields)
    if (newSet.has(fieldId)) {
      newSet.delete(fieldId)
    } else {
      newSet.add(fieldId)
    }
    setSelectedFields(newSet)
  }

  const getValueByPath = (obj: any, path: string): any => {
    return path.split('.').reduce((current, prop) => current?.[prop], obj)
  }

  const prepareDataForExport = () => {
    let exportData: any[] = []
    
    switch (exportType) {
      case 'teams':
        // Use fetched teams data (already transformed and filtered by backend)
        if (allTeams.length > 0) {
          let teamsToExport = allTeams
          // Filter by category if selected
          if (selectedTeamCategory !== 'all') {
            teamsToExport = teamsToExport.filter(team => 
              (team.category || team.categoryName) === selectedTeamCategory
            )
          }
          exportData = teamsToExport.map(team => ({
            teamId: team.teamId || '',
            teamName: team.teamName || '',
            category: team.category || '',
            organisationName: team.organisationName || '',
            contestantNames: team.contestantNames || '',
            participantCount: team.participantCount || 0,
            coachName: team.coachName || '',
            createdAt: team.createdAt || '',
            status: team.status || '',
          }))
        } else if (registrations.length > 0) {
          // Fallback to registrations if no API data
          const teams = new Map()
          registrations.forEach(reg => {
            const teamId = reg._id || Math.random().toString()
            const teamName = reg.teamName || reg.team_name || `Team_${teamId}`
            const teamKey = `${teamId}_${teamName}`
            
            if (!teams.has(teamKey)) {
              teams.set(teamKey, {
                teamId: teamId,
                teamName: teamName,
                category: reg.category || reg.categoryDisplay || reg.category_name || '',
                organisationName: typeof reg.organisationId === 'object' ? (reg.organisationId.typeDetail || reg.organisationId.name || '') : '',
                contestantNames: [],
                participantCount: 0,
                coachName: reg.coachName || reg.coach_name || '',
                createdAt: reg.registeredAt || reg.created_at || '',
                status: reg.status || 'pending',
              })
            }
            const team = teams.get(teamKey)
            if (reg.participants && Array.isArray(reg.participants)) {
              team.contestantNames.push(...reg.participants.map((p: any) => typeof p === 'string' ? p : (p.name || (p.firstName && p.lastName ? `${p.firstName} ${p.lastName}` : p.firstName || p.lastName || p))))
            }
            team.participantCount = team.contestantNames.length
          })
          exportData = Array.from(teams.values())
        }
        break

      case 'contestants':
        // Use fetched contestants data
        if (allContestants.length > 0) {
          exportData = allContestants.map(contestant => ({
            contestantId: contestant.contestantId || '',
            ner: contestant.ner || '',
            ovog: contestant.ovog || '',
            email: contestant.email || '',
            phoneNumber: contestant.phoneNumber || '',
            register: contestant.register || '',
            gender: contestant.gender || '',
            tursunUdur: contestant.tursunUdur || '',
            teamIds: contestant.teamIds || '',
            organisationName: contestant.organisationName || '',
            participationCount: contestant.participationCount || 0,
          }))
        } else if (registrations.length > 0) {
          // Fallback to registrations
          const contestants: any[] = []
          registrations.forEach(reg => {
            const teamId = reg._id || ''
            if (reg.participants && Array.isArray(reg.participants)) {
              reg.participants.forEach((participant: any) => {
                contestants.push({
                  _id: participant._id || Math.random().toString(),
                  firstName: participant.firstName || participant.first_name || '',
                  lastName: participant.lastName || participant.last_name || '',
                  email: participant.email || '',
                  phone: participant.phone || participant.phone_number || '',
                  teamId: teamId,
                  teamName: reg.teamName || reg.team_name || '',
                  category: reg.category || reg.categoryDisplay || reg.category_name || '',
                  organisationName: typeof reg.organisationId === 'object' ? (reg.organisationId.typeDetail || reg.organisationId.name || '') : '',
                  registrationStatus: reg.status || 'pending',
                  registeredAt: reg.registeredAt || reg.created_at || '',
                })
              })
            }
          })
          exportData = contestants.length > 0 ? contestants : registrations.map((reg: any) => ({
            _id: reg._id || '',
            firstName: typeof reg.organisationId === 'object' ? reg.organisationId.ner || '' : '',
            lastName: typeof reg.organisationId === 'object' ? reg.organisationId.ovog || '' : '',
            email: typeof reg.organisationId === 'object' ? reg.organisationId.email || '' : '',
            phone: typeof reg.organisationId === 'object' ? reg.organisationId.phoneNumber || '' : '',
            teamId: reg._id || '',
            teamName: reg.teamName || '',
            category: reg.category || reg.categoryDisplay || '',
            organisationName: typeof reg.organisationId === 'object' ? reg.organisationId.typeDetail || '' : '',
            registrationStatus: reg.status || '',
            registeredAt: reg.registeredAt || '',
          }))
        }
        break

      case 'coaches':
        // Use fetched coaches data
        if (allCoaches.length > 0) {
          exportData = allCoaches.map(coach => ({
            coachId: coach.coachId || '',
            ner: coach.ner || '',
            ovog: coach.ovog || '',
            email: coach.email || '',
            phoneNumber: coach.phoneNumber || '',
            register: coach.register || '',
            gender: coach.gender || '',
            tursunUdur: coach.tursunUdur || '',
            teamIds: coach.teamIds || '',
            organisationName: coach.organisationName || '',
            participationCount: coach.participationCount || 0,
          }))
        } else if (registrations.length > 0) {
          // Fallback to registrations
          const coachesMap = new Map()
          registrations.forEach(reg => {
            const coachName = reg.coachName || reg.coach_name || ''
            if (coachName) {
              if (!coachesMap.has(coachName)) {
                coachesMap.set(coachName, {
                  _id: reg.coachId || Math.random().toString(),
                  firstName: coachName.split(' ')[0] || '',
                  lastName: coachName.split(' ')[1] || '',
                  email: reg.coachEmail || reg.coach_email || '',
                  phone: reg.coachPhone || reg.coach_phone || '',
                  teams: [],
                  teamCount: 0,
                  organisationName: typeof reg.organisationId === 'object' ? (reg.organisationId.typeDetail || reg.organisationId.name || '') : '',
                  qualifications: reg.coachQualifications || reg.coach_qualifications || '',
                  yearsExperience: reg.yearsExperience || reg.years_experience || '',
                })
              }
              const coach = coachesMap.get(coachName)
              const teamName = reg.teamName || reg.team_name || ''
              if (teamName && !coach.teams.includes(teamName)) {
                coach.teams.push(teamName)
              }
              coach.teamCount = coach.teams.length
            }
          })
          exportData = Array.from(coachesMap.values())
        }
        break

      case 'organisations':
        // Use fetched organisations data
        if (allOrganisations.length > 0) {
          exportData = allOrganisations.map(org => {
            // Count teams in this organisation
            const orgTeams = allTeams.filter(t => {
              const orgId = typeof t.organisationId === 'object' ? t.organisationId._id : t.organisationId
              return orgId === org._id || orgId === org.organisationId
            })
            
            return {
              organisationId: org._id || org.organisationId || '',
              typeDetail: org.typeDetail || org.name || '',
              type: org.type || org.org_type || '',
              aimag: org.aimag || org.province || '',
              email: org.email || '',
              phoneNumber: org.phoneNumber || org.phone_number || '',
              registriinDugaar: org.registriinDugaar || org.registration_number || '',
              ner: org.ner || org.contact_name || '',
              ovog: org.ovog || org.contact_surname || '',
              teamCount: orgTeams.length,
              registeredAt: org.createdAt || org.registered_at || '',
            }
          })
        } else if (registrations.length > 0) {
          // Fallback to registrations
          const orgsMap = new Map()
          registrations.forEach(reg => {
            const orgId = typeof reg.organisationId === 'string' ? reg.organisationId : reg.organisationId?.organisationId
            if (orgId && !orgsMap.has(orgId)) {
              const orgData = typeof reg.organisationId === 'object' ? reg.organisationId : {}
              orgsMap.set(orgId, {
                organisationId: orgId,
                typeDetail: orgData.typeDetail || orgData.name || '',
                type: orgData.type || orgData.org_type || '',
                aimag: orgData.aimag || orgData.province || '',
                email: orgData.email || '',
                phoneNumber: orgData.phoneNumber || orgData.phone_number || '',
                registriinDugaar: orgData.registriinDugaar || orgData.registration_number || '',
                ner: orgData.ner || orgData.contact_name || '',
                ovog: orgData.ovog || orgData.contact_surname || '',
                teamCount: 0,
                registeredAt: reg.registeredAt || '',
              })
            }
            if (orgId && orgsMap.has(orgId)) {
              orgsMap.get(orgId).teamCount++
            }
          })
          exportData = Array.from(orgsMap.values())
        }
        break
    }

    return exportData
  }

  const handleExport = () => {
    if (selectedFields.size === 0) {
      toast({
        title: 'Анхаар',
        description: 'Дор хаяж нэг талбар сонгоно уу',
        variant: 'destructive',
      })
      return
    }

    const exportData = prepareDataForExport()

    if (exportData.length === 0) {
      toast({
        title: 'Мэдээлэл',
        description: 'Экспорт хийх мэдээлэл олдсонгүй',
        variant: 'default',
      })
      return
    }

    const fields = getFieldsForType(exportType)
    const selectedFieldDefs = fields.filter(f => selectedFields.has(f.id))
    const headers = selectedFieldDefs.map(f => f.label)

    const rows = exportData.map(item => {
      return selectedFieldDefs.map(field => {
        const value = getValueByPath(item, field.key)
        
        if (Array.isArray(value)) {
          return value.join('; ')
        }
        if (typeof value === 'object' && value !== null) {
          return JSON.stringify(value)
        }
        return String(value || '')
      })
    })

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n')

    // Add UTF-8 BOM for proper encoding in Excel with Mongolian characters
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${exportType}_${eventId}_${Date.now()}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: 'Амжилттай',
      description: `${exportType} CSV файл руу экспорт хийлээ`,
    })

    onOpenChange(false)
    setExportType(null)
  }

  const fields = getFieldsForType(exportType)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
        {!exportType ? (
          <>
            <DialogHeader>
              <DialogTitle>CSV Экспорт</DialogTitle>
              <DialogDescription>
                Экспортлох мэдээллийн төрлийг сонгоно уу
              </DialogDescription>
            </DialogHeader>

            <div className='grid grid-cols-2 gap-4'>
              {EXPORT_OPTIONS.map(option => {
                const Icon = option.icon
                return (
                  <Button
                    key={option.id}
                    variant='outline'
                    className='h-auto flex-col py-4 px-3 text-left'
                    onClick={() => handleSelectExportType(option.id as ExportType)}
                  >
                    <Icon className='mb-2 h-6 w-6' />
                    <div className='font-semibold'>{option.label}</div>
                    <div className='text-xs text-muted-foreground'>{option.description}</div>
                  </Button>
                )
              })}
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                {EXPORT_OPTIONS.find(o => o.id === exportType)?.label} - CSV Экспорт
              </DialogTitle>
              <DialogDescription>
                CSV файлд оруулах талбаруудыг сонгоно уу ({selectedFields.size}/{fields.length})
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-4'>
              {exportType === 'teams' && teamCategories.length > 0 && (
                <div>
                  <Label htmlFor='teamCategory' className='text-sm font-medium mb-2 block'>
                    Баг категорээр шүүлтүүрлэх
                  </Label>
                  <Select value={selectedTeamCategory} onValueChange={setSelectedTeamCategory}>
                    <SelectTrigger id='teamCategory' className='w-full'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>Бүх категори</SelectItem>
                      {teamCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className='flex gap-2'>
                <Button variant='outline' size='sm' onClick={handleSelectAll}>
                  Бүгдийг Сонгох
                </Button>
                <Button variant='outline' size='sm' onClick={handleDeselectAll}>
                  Бүгдийг Цэгцлэх
                </Button>
              </div>

              <div className='grid grid-cols-2 gap-4 border rounded-lg p-4'>
                {fields.map(field => (
                  <div key={field.id} className='flex items-center space-x-2'>
                    <Checkbox
                      id={field.id}
                      checked={selectedFields.has(field.id)}
                      onCheckedChange={() => handleToggleField(field.id)}
                    />
                    <Label htmlFor={field.id} className='cursor-pointer text-sm'>
                      {field.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button variant='outline' onClick={() => setExportType(null)}>
                Буцах
              </Button>
              <Button variant='outline' onClick={() => onOpenChange(false)}>
                Цүүцэлэх
              </Button>
              <Button onClick={handleExport} disabled={selectedFields.size === 0 || isLoadingData}>
                {isLoadingData ? 'Мэдээлэл ачааллаж байна...' : 'CSV Экспорт'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
