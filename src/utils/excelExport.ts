import ExcelJS from 'exceljs'

interface Team {
  teamId: string
  robotName: string
  memberIds: string[]
}

interface Contestant {
  contestantId: string
  name: string
  teamIds: string[]
}

interface Coach {
  coachId: string
  name: string
  teamIds: string[]
}

interface OrganisationData {
  organisationId: string
  typeDetail: string
  type: string
  aimag: string
  email: string
  phoneNumber: string
  registriinDugaar: string
  ner: string
  ovog: string
  totalTeams: number
  totalContestants: number
  totalCoaches: number
  teams: Team[]
  contestants: Contestant[]
  coaches: Coach[]
}

/**
 * Generate Excel file with organizations divided into sheets
 * - Individual sheets: One per organization matching the photo layout
 * - Each sheet contains: Header, Stats, Teams table, Contestants table, Coaches table
 */
export const generateOrganisationsExcelFile = async (
  organisations: OrganisationData[],
  scope: string,
  eventName: string
) => {
  try {
    const workbook = new ExcelJS.Workbook()
    
    console.log('Excel generation started with organisations:', organisations.length)
    console.log('First org data:', organisations[0])

    organisations.forEach((org, index) => {
      try {
        const sheetName = truncateSheetName(`${org.typeDetail || `Org_${index + 1}`}`)
        const orgSheet = workbook.addWorksheet(sheetName)

        console.log(`Processing org ${index}: ${org.typeDetail}, teams: ${org.totalTeams}, contestants: ${org.totalContestants}, coaches: ${org.totalCoaches}`)

        // Set column widths - No. column should be narrow, others for content
        orgSheet.columns = [
          { key: 'col1', width: 3 },
          { key: 'col2', width: 18 },     // Col B - ID columns / part of merged cells
          { key: 'col3', width: 18 },     // Col C - Name/Robot name or merged part
          { key: 'col4', width: 35 },     // Col D - Name/Robot name columns
          { key: 'col5', width: 40 },     // Col E - Multi-ID columns (Member IDs, Team IDs)
        ]

        let rowNum = 1

    // === Header Section ===
    // Row 1: Empty
    rowNum++

    // Row 2: Event name spanning B-D, EVENT label in E - BLUE BACKGROUND
    orgSheet.mergeCells(`B${rowNum}:D${rowNum}`)
    const eventRow = orgSheet.getRow(rowNum)
    eventRow.getCell(2).value = eventName || 'EVENT'
    eventRow.getCell(2).font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } }
    eventRow.getCell(2).fill = {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FF4472C4' },
    }
    eventRow.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' }
    eventRow.getCell(5).value = 'EVENT'
    eventRow.getCell(5).font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } }
    eventRow.getCell(5).fill = {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FF4472C4' },
    }
    eventRow.getCell(5).alignment = { horizontal: 'center', vertical: 'middle' }
    eventRow.height = 20
    rowNum++

    // Row 3: Empty
    rowNum++

    // Row 4: Organization ID and Name headers - BLUE BACKGROUND, merged cells
    orgSheet.mergeCells(`B${rowNum}:C${rowNum}`)
    const orgIdHeaderRow = orgSheet.getRow(rowNum)
    orgIdHeaderRow.getCell(2).value = 'Organization ID'
    orgIdHeaderRow.getCell(2).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 }
    orgIdHeaderRow.getCell(2).fill = {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FF4472C4' },
    }
    orgIdHeaderRow.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' }
    orgSheet.mergeCells(`D${rowNum}:E${rowNum}`)
    orgSheet.getCell(`D${rowNum}`).value = 'Organization Name'
    orgSheet.getCell(`D${rowNum}`).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 }
    orgSheet.getCell(`D${rowNum}`).fill = {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FF4472C4' },
    }
    orgSheet.getCell(`D${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle' }
    orgIdHeaderRow.height = 18
    rowNum++

    // Row 5: Organization data - merged cells (not repeated)
    orgSheet.mergeCells(`B${rowNum}:C${rowNum}`)
    const orgDataRow = orgSheet.getRow(rowNum)
    orgDataRow.getCell(2).value = org.organisationId
    orgDataRow.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' }
    orgSheet.mergeCells(`D${rowNum}:E${rowNum}`)
    orgDataRow.getCell(4).value = org.typeDetail
    orgDataRow.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' }
    orgDataRow.height = 18
    rowNum++

    // Row 6: Empty
    rowNum++

    // Row 7: Stats headers - BLUE BACKGROUND, merged cells
    const statsHeaderRow = orgSheet.getRow(rowNum)
    orgSheet.mergeCells(`B${rowNum}:C${rowNum}`)
    statsHeaderRow.getCell(2).value = 'Total Coach'
    statsHeaderRow.getCell(2).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 }
    statsHeaderRow.getCell(2).fill = {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FF4472C4' },
    }
    statsHeaderRow.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' }
    statsHeaderRow.getCell(4).value = 'Total Member'
    statsHeaderRow.getCell(4).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 }
    statsHeaderRow.getCell(4).fill = {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FF4472C4' },
    }
    statsHeaderRow.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' }
    statsHeaderRow.getCell(5).value = 'Total Team'
    statsHeaderRow.getCell(5).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 }
    statsHeaderRow.getCell(5).fill = {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FF4472C4' },
    }
    statsHeaderRow.getCell(5).alignment = { horizontal: 'center', vertical: 'middle' }
    statsHeaderRow.height = 18
    rowNum++

    // Row 8: Stats values - merged cells to match headers
    const statsRow = orgSheet.getRow(rowNum)
    console.log(`Stats for ${org.typeDetail}: coaches=${org.totalCoaches}, contestants=${org.totalContestants}, teams=${org.totalTeams}`)
    orgSheet.mergeCells(`B${rowNum}:C${rowNum}`)
    statsRow.getCell(2).value = org.totalCoaches || 0
    statsRow.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' }
    statsRow.getCell(4).value = org.totalContestants || 0
    statsRow.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' }
    statsRow.getCell(5).value = org.totalTeams || 0
    statsRow.getCell(5).alignment = { horizontal: 'center', vertical: 'middle' }
    statsRow.height = 18
    rowNum++

    // Row 9: Empty
    rowNum++

    // === Teams Section ===
    // Teams header
    const teamsHeaderRow = orgSheet.getRow(rowNum)
    teamsHeaderRow.getCell(2).value = 'No'
    teamsHeaderRow.getCell(2).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 }
    teamsHeaderRow.getCell(2).fill = {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FF4472C4' },
    }
    teamsHeaderRow.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' }
    teamsHeaderRow.getCell(3).value = 'Team ID'
    teamsHeaderRow.getCell(3).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 }
    teamsHeaderRow.getCell(3).fill = {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FF4472C4' },
    }
    teamsHeaderRow.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' }
    teamsHeaderRow.getCell(4).value = 'Robot name'
    teamsHeaderRow.getCell(4).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 }
    teamsHeaderRow.getCell(4).fill = {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FF4472C4' },
    }
    teamsHeaderRow.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' }
    teamsHeaderRow.getCell(5).value = 'Member ID'
    teamsHeaderRow.getCell(5).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 }
    teamsHeaderRow.getCell(5).fill = {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FF4472C4' },
    }
    teamsHeaderRow.getCell(5).alignment = { horizontal: 'left', vertical: 'middle' }
    teamsHeaderRow.height = 18
    rowNum++

    // Teams data
    console.log(`Teams data for ${org.typeDetail}:`, org.teams)
    const teamsArray = org.teams || []
    teamsArray.forEach((team, idx) => {
      const teamRow = orgSheet.getRow(rowNum)
      teamRow.getCell(2).value = idx + 1
      teamRow.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' }
      teamRow.getCell(3).value = team.teamId
      teamRow.getCell(3).alignment = { horizontal: 'left', vertical: 'middle' }
      teamRow.getCell(4).value = team.robotName
      teamRow.getCell(4).alignment = { horizontal: 'left', vertical: 'middle' }
      const memberIdsStr = (team.memberIds || []).join(', ')
      teamRow.getCell(5).value = memberIdsStr
      teamRow.getCell(5).alignment = { horizontal: 'left', vertical: 'top', wrapText: memberIdsStr.length > 20 }
      // Auto-adjust height if content is long
      const lineCount = Math.ceil(memberIdsStr.length / 30) || 1
      teamRow.height = Math.max(15, lineCount * 15)
      rowNum++
    })

    // Empty row
    rowNum++

    // === Contestants Section ===
    const contestantsHeaderRow = orgSheet.getRow(rowNum)
    contestantsHeaderRow.getCell(2).value = 'No'
    contestantsHeaderRow.getCell(2).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 }
    contestantsHeaderRow.getCell(2).fill = {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FF4472C4' },
    }
    contestantsHeaderRow.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' }
    contestantsHeaderRow.getCell(3).value = 'Member ID'
    contestantsHeaderRow.getCell(3).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 }
    contestantsHeaderRow.getCell(3).fill = {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FF4472C4' },
    }
    contestantsHeaderRow.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' }
    contestantsHeaderRow.getCell(4).value = 'Member Name'
    contestantsHeaderRow.getCell(4).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 }
    contestantsHeaderRow.getCell(4).fill = {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FF4472C4' },
    }
    contestantsHeaderRow.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' }
    contestantsHeaderRow.getCell(5).value = 'Team ID'
    contestantsHeaderRow.getCell(5).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 }
    contestantsHeaderRow.getCell(5).fill = {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FF4472C4' },
    }
    contestantsHeaderRow.getCell(5).alignment = { horizontal: 'left', vertical: 'middle' }
    contestantsHeaderRow.height = 18
    rowNum++

    // Contestants data
    const contestantsArray = org.contestants || []
    contestantsArray.forEach((contestant, idx) => {
      const contestantRow = orgSheet.getRow(rowNum)
      contestantRow.getCell(2).value = idx + 1
      contestantRow.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' }
      contestantRow.getCell(3).value = contestant.contestantId
      contestantRow.getCell(3).alignment = { horizontal: 'left', vertical: 'middle' }
      contestantRow.getCell(4).value = contestant.name
      contestantRow.getCell(4).alignment = { horizontal: 'left', vertical: 'middle' }
      const teamIdsStr = (contestant.teamIds || []).join(', ')
      contestantRow.getCell(5).value = teamIdsStr
      contestantRow.getCell(5).alignment = { horizontal: 'left', vertical: 'top', wrapText: teamIdsStr.length > 20 }
      const lineCount = Math.ceil(teamIdsStr.length / 30) || 1
      contestantRow.height = Math.max(15, lineCount * 15)
      rowNum++
    })

    // Empty row
    rowNum++

    // === Coaches Section ===
    const coachesHeaderRow = orgSheet.getRow(rowNum)
    coachesHeaderRow.getCell(2).value = 'No'
    coachesHeaderRow.getCell(2).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 }
    coachesHeaderRow.getCell(2).fill = {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FF4472C4' },
    }
    coachesHeaderRow.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' }
    coachesHeaderRow.getCell(3).value = 'Coach ID'
    coachesHeaderRow.getCell(3).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 }
    coachesHeaderRow.getCell(3).fill = {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FF4472C4' },
    }
    coachesHeaderRow.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' }
    coachesHeaderRow.getCell(4).value = 'Coach Name'
    coachesHeaderRow.getCell(4).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 }
    coachesHeaderRow.getCell(4).fill = {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FF4472C4' },
    }
    coachesHeaderRow.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' }
    coachesHeaderRow.getCell(5).value = 'Team ID'
    coachesHeaderRow.getCell(5).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 }
    coachesHeaderRow.getCell(5).fill = {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FF4472C4' },
    }
    coachesHeaderRow.getCell(5).alignment = { horizontal: 'left', vertical: 'middle' }
    coachesHeaderRow.height = 18
    rowNum++

    // Coaches data
    const coachesArray = org.coaches || []
    coachesArray.forEach((coach, idx) => {
      const coachRow = orgSheet.getRow(rowNum)
      coachRow.getCell(2).value = idx + 1
      coachRow.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' }
      coachRow.getCell(3).value = coach.coachId
      coachRow.getCell(3).alignment = { horizontal: 'left', vertical: 'middle' }
      coachRow.getCell(4).value = coach.name
      coachRow.getCell(4).alignment = { horizontal: 'left', vertical: 'middle' }
      const teamIdsStr = (coach.teamIds || []).join(', ')
      coachRow.getCell(5).value = teamIdsStr
      coachRow.getCell(5).alignment = { horizontal: 'left', vertical: 'top', wrapText: teamIdsStr.length > 20 }
      // Auto-adjust height for coaches with many teams
      const lineCount = Math.ceil(teamIdsStr.length / 30) || 1
      coachRow.height = Math.max(15, lineCount * 15)
      rowNum++
    })
      } catch (orgError) {
        console.error(`Error processing organization ${org.typeDetail}:`, orgError)
      }
    })

    // Generate file
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `organisations_${scope}_${Date.now()}.xlsx`
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error generating Excel file:', error)
    throw error
  }
}

/**
 * Generate generic Excel file (for teams, contestants, coaches)
 */
export const generateGenericExcelFile = async (
  data: any[],
  exportType: string,
  options: { fields: Array<{ id: string; label: string; key: string }>; selectedFields: Set<string> },
  scope: string
) => {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Data')

  // Get selected fields for display
  const selectedFieldDefs = options.fields.filter((f: any) => options.selectedFields.has(f.id))
  const headers = selectedFieldDefs.map((f: any) => f.label)
  const keys = selectedFieldDefs.map((f: any) => f.key)

  // Add headers
  const headerRow = sheet.addRow(headers)
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' },
  }

  // Add data rows
  data.forEach(item => {
    const row: any[] = []
    keys.forEach((key: string) => {
      row.push(formatCellValue(getValueByPath(item, key)))
    })
    sheet.addRow(row)
  })

  // Auto-fit columns
  sheet.columns.forEach((column, index) => {
    let maxLength = headers[index]?.length || 0
    sheet.getColumn(index + 1).values.forEach((cell: any) => {
      const cellLength = String(cell || '').length
      if (cellLength > maxLength) {
        maxLength = cellLength
      }
    })
    column.width = Math.min(maxLength + 2, 50)
  })

  // Generate file
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${exportType}_${scope}_${Date.now()}.xlsx`
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Helper function to extract nested values
const getValueByPath = (obj: any, path: string): any => {
  return path.split('.').reduce((current, prop) => current?.[prop], obj)
}

// Helper function to format cell values
const formatCellValue = (value: any): string => {
  if (Array.isArray(value)) {
    return value.join('; ')
  }
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value)
  }
  return String(value || '')
}

// Helper function to truncate sheet names (Excel limit: 31 characters)
const truncateSheetName = (name: string): string => {
  return name.substring(0, 31)
}
