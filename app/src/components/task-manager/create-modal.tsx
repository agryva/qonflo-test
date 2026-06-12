'use client'

import { useRef, useEffect, useState } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { StatusBadge } from './status-badge'

interface Props {
  open: boolean
  onClose: () => void
  onCreate: (title: string, description: string) => void
}

export function CreateModal({ open, onClose, onCreate }: Props) {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) { setTitle(''); setDesc(''); setTimeout(() => ref.current?.focus(), 50) }
  }, [open])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onCreate(title.trim(), desc.trim())
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-[480px] p-7 gap-0 rounded-xl" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
        <DialogHeader className="mb-5">
          <DialogTitle className="text-[15px] font-semibold text-[#1A1A18]">New Task</DialogTitle>
          <p className="text-[12px] text-[#9B9B95] mt-1 flex items-center gap-1.5">
            Task will be created as <StatusBadge status="to_do" />
          </p>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-0">
          <div className="mb-3.5">
            <Label className="block text-[11px] font-semibold text-[#6B6B65] mb-1.5 tracking-[0.06em] uppercase">
              Title <span className="text-[#DC2626] normal-case text-[13px]">*</span>
            </Label>
            <Input
              ref={ref}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="text-[13px] border-[#E2E2DA] focus-visible:border-[#1A1A18] focus-visible:ring-0 h-9"
            />
          </div>
          <div className="mb-6">
            <Label className="block text-[11px] font-semibold text-[#6B6B65] mb-1.5 tracking-[0.06em] uppercase">
              Description
            </Label>
            <Textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Optional details..."
              rows={3}
              className="text-[13px] border-[#E2E2DA] focus-visible:border-[#1A1A18] focus-visible:ring-0 resize-y"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#E2E2DA] bg-transparent px-3 py-1.5 text-[12px] font-medium text-[#6B6B65] transition-colors hover:bg-[#F4F4F0] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#1A1A18] px-3 py-1.5 text-[12px] font-medium text-[#F6F6F3] transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Create Task
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
