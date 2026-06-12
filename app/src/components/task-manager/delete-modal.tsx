'use client'

import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import type { Task } from './types'

interface Props {
  open: boolean
  task: Task | null
  onClose: () => void
  onConfirm: () => void
}

export function DeleteModal({ open, task, onClose, onConfirm }: Props) {
  if (!task) return null
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-[400px] p-7 gap-0 rounded-xl" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
        <DialogHeader className="mb-2">
          <DialogTitle className="text-[15px] font-semibold text-[#1A1A18]">Delete Task</DialogTitle>
        </DialogHeader>
        <p className="text-[13px] text-[#6B6B65] leading-relaxed mb-2">
          Delete <strong>"{task.title}"</strong>?
        </p>
        <p className="text-[12px] text-[#A0A09A] leading-relaxed mb-6">
          The task will be removed. Audit logs for this task will be preserved and remain accessible.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#E2E2DA] bg-transparent px-3 py-1.5 text-[12px] font-medium text-[#6B6B65] transition-colors hover:bg-[#F4F4F0] cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#DC2626] px-3 py-1.5 text-[12px] font-medium text-white hover:opacity-80 transition-opacity cursor-pointer"
          >
            Delete Task
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
