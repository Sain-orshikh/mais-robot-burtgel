import { useEffect, useMemo, useState } from 'react'
import ExcelJS from 'exceljs'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Download, Loader2 } from 'lucide-react'

type AdminOrganisation = {
  organisationId: string
  typeDetail: string
}

type EventOption = {
  _id: string
  name: string
}

interface AdminOrganisationReportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  events: EventOption[]
  defaultEventId?: string
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export function AdminOrganisationReportModal({
  open,
  onOpenChange,
  events,
  defaultEventId,
}: AdminOrganisationReportModalProps) {
  const { toast } = useToast()
  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [organisations, setOrganisations] = useState<AdminOrganisation[]>([])
  const [selectedOrganisationId, setSelectedOrganisationId] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    if (!open) return

    if (defaultEventId) {
      setSelectedEventId(defaultEventId)
    } else if (events.length > 0) {
      setSelectedEventId(events[0]._id)
    }

    setSearchText('')
    setSelectedOrganisationId('')
  }, [open, defaultEventId, events])

  useEffect(() => {
    if (!open || !selectedEventId) return

    const fetchOrganisations = async () => {
      try {
        setIsLoadingOrgs(true)
        const response = await fetch(`${API_URL}/api/export/organisations?eventId=${selectedEventId}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.error || 'Failed to load organisations')
        }

        const data = await response.json()
        setOrganisations(Array.isArray(data) ? data : [])
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to load organisations',
          variant: 'destructive',
        })
        setOrganisations([])
      } finally {
        setIsLoadingOrgs(false)
      }
    }

    void fetchOrganisations()
  }, [open, selectedEventId, toast])

  const filteredOrganisations = useMemo(() => {
    const keyword = searchText.trim().toLowerCase()
    if (!keyword) return organisations

    return organisations.filter((org) => {
      const name = (org.typeDetail || '').toLowerCase()
      const businessId = (org.organisationId || '').toLowerCase()
      return name.includes(keyword) || businessId.includes(keyword)
    })
  }, [organisations, searchText])

  const selectedOrganisation = useMemo(
    () => organisations.find((org) => org.organisationId === selectedOrganisationId),
    [organisations, selectedOrganisationId]
  )

  const generateExcel = async () => {
    if (!selectedEventId || !selectedOrganisationId) {
      toast({
        title: 'Warning',
        description: 'Please select event and organisation',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsDownloading(true)

      const response = await fetch(
        `${API_URL}/api/export/organisation-report?organisationId=${selectedOrganisationId}&eventId=${selectedEventId}`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch report data')
      }

      const reportData = await response.json()

      if (!reportData.teams || reportData.teams.length === 0 || !reportData.members || reportData.members.length === 0) {
        toast({
          title: 'No Teams Registered',
          description: 'No confirmed teams found for this event.',
          variant: 'default',
        })
        return
      }

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Report')

      const headerFill: any = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' },
      }

      const headerFont = {
        bold: true,
        color: { argb: 'FFFFFFFF' },
        size: 11,
      }

      const headerAlignment: any = {
        horizontal: 'center',
        vertical: 'middle',
      }

      const eventRow1 = worksheet.addRow([reportData.event.name, '', '', reportData.event.code])
      worksheet.mergeCells('A1:C1')
      eventRow1.getCell(1).font = headerFont
      eventRow1.getCell(1).fill = headerFill
      eventRow1.getCell(1).alignment = headerAlignment
      eventRow1.getCell(4).font = headerFont
      eventRow1.getCell(4).fill = headerFill
      eventRow1.getCell(4).alignment = headerAlignment

      worksheet.addRow([])

      const orgHeaderRow = worksheet.addRow(['Organization ID', '', '', 'Organization Name'])
      worksheet.mergeCells('A3:C3')
      orgHeaderRow.getCell(1).font = headerFont
      orgHeaderRow.getCell(1).fill = headerFill
      orgHeaderRow.getCell(1).alignment = headerAlignment
      orgHeaderRow.getCell(4).font = headerFont
      orgHeaderRow.getCell(4).fill = headerFill
      orgHeaderRow.getCell(4).alignment = headerAlignment

      const orgDataRow = worksheet.addRow([reportData.organisation.id, '', '', reportData.organisation.name])
      worksheet.mergeCells('A4:C4')
      orgDataRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' }
      orgDataRow.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' }

      worksheet.addRow([])

      const summaryHeaderRow = worksheet.addRow(['Total Coach', '', 'Total Member', 'Total Team'])
      worksheet.mergeCells('A6:B6')
      summaryHeaderRow.getCell(1).font = headerFont
      summaryHeaderRow.getCell(1).fill = headerFill
      summaryHeaderRow.getCell(1).alignment = headerAlignment
      summaryHeaderRow.getCell(3).font = headerFont
      summaryHeaderRow.getCell(3).fill = headerFill
      summaryHeaderRow.getCell(3).alignment = headerAlignment
      summaryHeaderRow.getCell(4).font = headerFont
      summaryHeaderRow.getCell(4).fill = headerFill
      summaryHeaderRow.getCell(4).alignment = headerAlignment

      const totalCoaches = reportData.coaches ? reportData.coaches.length : 0
      const summaryDataRow = worksheet.addRow([totalCoaches, '', reportData.summary.totalMembers, reportData.summary.totalTeams])
      worksheet.mergeCells('A7:B7')
      summaryDataRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' }
      summaryDataRow.getCell(1).font = { size: 12, bold: true }
      summaryDataRow.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' }
      summaryDataRow.getCell(3).font = { size: 12, bold: true }
      summaryDataRow.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' }
      summaryDataRow.getCell(4).font = { size: 12, bold: true }

      worksheet.addRow([])
      worksheet.addRow([])

      const teamsHeaderRow = worksheet.addRow(['№', 'Team ID', 'Robot name', 'Member ID'])
      teamsHeaderRow.getCell(1).font = headerFont
      teamsHeaderRow.getCell(1).fill = headerFill
      teamsHeaderRow.getCell(1).alignment = headerAlignment
      teamsHeaderRow.getCell(2).font = headerFont
      teamsHeaderRow.getCell(2).fill = headerFill
      teamsHeaderRow.getCell(2).alignment = headerAlignment
      teamsHeaderRow.getCell(3).font = headerFont
      teamsHeaderRow.getCell(3).fill = headerFill
      teamsHeaderRow.getCell(3).alignment = headerAlignment
      teamsHeaderRow.getCell(4).font = headerFont
      teamsHeaderRow.getCell(4).fill = headerFill
      teamsHeaderRow.getCell(4).alignment = headerAlignment

      reportData.teams.forEach((team: any, index: number) => {
        const teamRow = worksheet.addRow([index + 1, team.teamId, team.robotName, team.memberIds])
        teamRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' }
        teamRow.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' }
        teamRow.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' }
        teamRow.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' }
      })

      worksheet.addRow([])
      worksheet.addRow([])

      const membersHeaderRow = worksheet.addRow(['№', 'Member ID', 'Member Name', 'Team ID'])
      membersHeaderRow.getCell(1).font = headerFont
      membersHeaderRow.getCell(1).fill = headerFill
      membersHeaderRow.getCell(1).alignment = headerAlignment
      membersHeaderRow.getCell(2).font = headerFont
      membersHeaderRow.getCell(2).fill = headerFill
      membersHeaderRow.getCell(2).alignment = headerAlignment
      membersHeaderRow.getCell(3).font = headerFont
      membersHeaderRow.getCell(3).fill = headerFill
      membersHeaderRow.getCell(3).alignment = headerAlignment
      membersHeaderRow.getCell(4).font = headerFont
      membersHeaderRow.getCell(4).fill = headerFill
      membersHeaderRow.getCell(4).alignment = headerAlignment

      reportData.members.forEach((member: any, index: number) => {
        const teamIds = member.teams.join(', ')
        const memberRow = worksheet.addRow([index + 1, member.contestantId, member.fullName, teamIds])
        memberRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' }
        memberRow.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' }
        memberRow.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' }
        memberRow.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' }
      })

      worksheet.addRow([])
      worksheet.addRow([])

      const coachesHeaderRow = worksheet.addRow(['№', 'Coach ID', 'Coach Name', 'Team ID'])
      coachesHeaderRow.getCell(1).font = headerFont
      coachesHeaderRow.getCell(1).fill = headerFill
      coachesHeaderRow.getCell(1).alignment = headerAlignment
      coachesHeaderRow.getCell(2).font = headerFont
      coachesHeaderRow.getCell(2).fill = headerFill
      coachesHeaderRow.getCell(2).alignment = headerAlignment
      coachesHeaderRow.getCell(3).font = headerFont
      coachesHeaderRow.getCell(3).fill = headerFill
      coachesHeaderRow.getCell(3).alignment = headerAlignment
      coachesHeaderRow.getCell(4).font = headerFont
      coachesHeaderRow.getCell(4).fill = headerFill
      coachesHeaderRow.getCell(4).alignment = headerAlignment

      if (reportData.coaches && reportData.coaches.length > 0) {
        reportData.coaches.forEach((coach: any, index: number) => {
          const teamIds = coach.teams.join(', ')
          const coachRow = worksheet.addRow([index + 1, coach.coachId, coach.fullName, teamIds])
          coachRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' }
          coachRow.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' }
          coachRow.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' }
          coachRow.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' }
        })
      }

      worksheet.columns = [{ width: 5 }, { width: 15 }, { width: 25 }, { width: 30 }]

      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
      })

      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${reportData.organisation.id}_report_${Date.now()}.xlsx`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: 'Success',
        description: `${reportData.organisation.name} - ${reportData.event.name} report downloaded`,
      })

      onOpenChange(false)
    } catch (error) {
      console.error('Error generating admin organisation report:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error generating report',
        variant: 'destructive',
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>Organisation Report</DialogTitle>
          <DialogDescription>
            Download the same approved-team report as organisation accounts.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-2'>
          <div className='space-y-2'>
            <Label htmlFor='admin-org-report-event'>Choose Event</Label>
            <Select value={selectedEventId} onValueChange={setSelectedEventId}>
              <SelectTrigger id='admin-org-report-event'>
                <SelectValue placeholder='Select event' />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event._id} value={event._id}>
                    {event.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='admin-org-search'>Search Organisation</Label>
            <Input
              id='admin-org-search'
              placeholder='Search by organisation name or MN00001'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='admin-org-select'>Matching Organisations</Label>
            <Select value={selectedOrganisationId} onValueChange={setSelectedOrganisationId}>
              <SelectTrigger id='admin-org-select' disabled={isLoadingOrgs || filteredOrganisations.length === 0}>
                <SelectValue
                  placeholder={isLoadingOrgs ? 'Loading organisations...' : 'Select organisation'}
                />
              </SelectTrigger>
              <SelectContent>
                {filteredOrganisations.map((org) => (
                  <SelectItem key={org.organisationId} value={org.organisationId}>
                    {org.organisationId} - {org.typeDetail}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!isLoadingOrgs && filteredOrganisations.length === 0 && (
              <p className='text-sm text-muted-foreground'>No participating organisations found for this event.</p>
            )}
            {selectedOrganisation ? (
              <p className='text-sm text-muted-foreground'>
                Selected: {selectedOrganisation.organisationId} - {selectedOrganisation.typeDetail}
              </p>
            ) : null}
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={generateExcel} disabled={isDownloading || !selectedEventId || !selectedOrganisationId}>
            {isDownloading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Generating...
              </>
            ) : (
              <>
                <Download className='mr-2 h-4 w-4' />
                Download Report
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
