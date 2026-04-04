import { useState, useEffect } from 'react'
import ExcelJS from 'exceljs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'
import { eventApi } from '@/lib/api/events'
import { Download, Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'

interface OrganisationReportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export function OrganisationReportModal({ open, onOpenChange }: OrganisationReportModalProps) {
  const { toast } = useToast()
  const { organisation } = useAuth()
  const [events, setEvents] = useState<any[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingEvents, setIsLoadingEvents] = useState(false)

  useEffect(() => {
    if (open) {
      void fetchEvents()
    }
  }, [open])

  const fetchEvents = async () => {
    try {
      setIsLoadingEvents(true)
      const eventsData = await eventApi.getAll()
      setEvents(eventsData)
      if (eventsData.length > 0) {
        setSelectedEventId(eventsData[0]._id)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      toast({
        title: 'Error',
        description: 'Error loading events',
        variant: 'destructive',
      })
    } finally {
      setIsLoadingEvents(false)
    }
  }

  const generateExcel = async () => {
    if (!organisation?._id) {
      toast({
        title: 'Error',
        description: 'Organization information not found',
        variant: 'destructive',
      })
      return
    }

    if (!selectedEventId) {
      toast({
        title: 'Warning',
        description: 'Please select an event',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsLoading(true)

      const response = await fetch(
        `${API_URL}/api/export/organisation-report?organisationId=${organisation._id}&eventId=${selectedEventId}`,
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
          description: 'No confirmed teams found for this event. Please register a team first.',
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

      worksheet.columns = [
        { width: 5 },
        { width: 15 },
        { width: 25 },
        { width: 30 },
      ]

      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
      })

      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${reportData.organisation.name}_report_${Date.now()}.xlsx`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: 'Success',
        description: `${reportData.organisation.name} - ${reportData.event.name} Excel file downloaded successfully`,
      })

      onOpenChange(false)
    } catch (error) {
      console.error('Error generating report:', error)
      toast({
        title: 'Error',
        description: 'Error generating report',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Download Excel Report</DialogTitle>
          <DialogDescription>
            Download an Excel report for your selected event with approved teams and members.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='event-select'>Choose Event</Label>
            <Select value={selectedEventId} onValueChange={setSelectedEventId}>
              <SelectTrigger id='event-select' disabled={isLoadingEvents}>
                <SelectValue placeholder='Choose Event' />
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
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={generateExcel} disabled={isLoading || !selectedEventId}>
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Loading...
              </>
            ) : (
              <>
                <Download className='mr-2 h-4 w-4' />
                Download
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
