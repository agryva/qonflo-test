import type { Status } from './types'

export const USERS = ['john.doe', 'jane.smith', 'bob.wilson', 'alice.chen'] as const

export const STATUS_ORDER: Status[] = ['to_do', 'pending', 'in_progress', 'done']

export const STATUS_META: Record<Status, { label: string; bg: string; text: string; dot: string }> = {
  to_do:       { label: 'To Do',       bg: '#F4F4F2', text: '#52525A', dot: '#A0A09A' },
  pending:     { label: 'Pending',     bg: '#FFFBEB', text: '#92400E', dot: '#F59E0B' },
  in_progress: { label: 'In Progress', bg: '#EFF6FF', text: '#1E3A8A', dot: '#3B82F6' },
  done:        { label: 'Done',        bg: '#F0FDF4', text: '#14532D', dot: '#22C55E' },
}

