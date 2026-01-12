// Audit log entry type
export interface AuditLogEntry {
  id: string
  timestamp: string
  adminUsername: string
  registrationId: string
  registrationNumber: string
  teamName: string
  action: 'edit' | 'approve' | 'reject'
  changes: string[]
  reason?: string
}

// In-memory audit log (in production, this would be in a database)
let auditLog: AuditLogEntry[] = []

export const addAuditLogEntry = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
  const newEntry: AuditLogEntry = {
    ...entry,
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  }
  auditLog.unshift(newEntry)
  
  // Also store in localStorage for persistence across page reloads
  if (typeof window !== 'undefined') {
    localStorage.setItem('auditLog', JSON.stringify(auditLog))
  }
  
  return newEntry
}

export const getAuditLog = (): AuditLogEntry[] => {
  // Load from localStorage if available
  if (typeof window !== 'undefined' && auditLog.length === 0) {
    const stored = localStorage.getItem('auditLog')
    if (stored) {
      auditLog = JSON.parse(stored)
    }
  }
  return auditLog
}

export const clearAuditLog = () => {
  auditLog = []
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auditLog')
  }
}
