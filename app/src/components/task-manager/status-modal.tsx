'use client'

import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { StatusBadge } from './status-badge'
import { STATUS_ORDER } from './constants'
import type { Task } from './types'

interface Props {
  open: boolean
  task: Task | null
  actor: string
  direction?: 'advance' | 'revert'
  onClose: () => void
  onConfirm: () => void
}

export function StatusModal({ open, task, actor, direction = 'advance', onClose, onConfirm }: Props) {
  if (!task) return null
  const idx = STATUS_ORDER.indexOf(task.status)
  const toStatus = direction === 'revert' ? STATUS_ORDER[idx - 1] : STATUS_ORDER[idx + 1]
  if (!toStatus) return null

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-[420px] p-7 gap-0 rounded-xl" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
        <DialogHeader className="mb-5">
          <DialogTitle className="text-[15px] font-semibold mb-1">Update Status</DialogTitle>
          <p className="text-[12px] text-[#9B9B95] truncate">"{task.title}"</p>
        </DialogHeader>

        <div className="flex items-center gap-3.5 bg-[#F6F6F3] rounded-lg px-5 py-4 mb-5">
          <StatusBadge status={task.status} />
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {direction === 'revert'
              ? <path d="M14 10H6M9 7L6 10l3 3" stroke="#C0C0B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              : <path d="M6 10h8M11 7l3 3-3 3" stroke="#C0C0B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            }
          </svg>
          <StatusBadge status={toStatus} />
        </div>

        <div className="flex items-center gap-1.5 text-[12px] text-[#9B9B95] mb-5">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="6.5" cy="6.5" r="5.5" stroke="#C0C0B8" strokeWidth="1.2"/>
            <path d="M6.5 4v3l1.5 1.5" stroke="#C0C0B8" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          Acting as <strong className="text-[#1A1A18] ml-0.5">{actor}</strong>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#E2E2DA] bg-transparent px-3 py-1.5 text-[12px] font-medium text-[#6B6B65] transition-colors hover:bg-[#F4F4F0] cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#1A1A18] px-3 py-1.5 text-[12px] font-medium text-[#F6F6F3] hover:opacity-80 transition-opacity cursor-pointer"
          >
            Confirm Update
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
