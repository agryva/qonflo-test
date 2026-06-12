export type Status = 'to_do' | 'pending' | 'in_progress' | 'done'

export const STATUS_ORDER: Status[] = ['to_do', 'pending', 'in_progress', 'done']

export interface Task {
  id: string
  title: string
  description: string
  status: Status
  createdAt: string
}

export interface AuditLog {
  id: string
  taskId: string
  taskTitle: string
  actor: string
  fromStatus: Status | null
  toStatus: Status
  timestamp: string
}
