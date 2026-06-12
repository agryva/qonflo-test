'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { STATUS_META } from './constants'
import { fmtDate } from './utils'
import type { Task, AuditLog } from './types'

interface Props {
  open: boolean
  taskId: string | null
  tasks: Task[]
  logs: AuditLog[]
  onClose: () => void
}

export function LogsModal({ open, taskId, tasks, logs, onClose }: Props) {
  if (!taskId) return null

  const task = tasks.find(t => t.id === taskId)
  const taskTitle = task?.title ?? logs.find(l => l.taskId === taskId)?.taskTitle ?? 'Deleted Task'
  const taskLogs = logs
    .filter(l => l.taskId === taskId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent
        className="max-w-[680px] sm:max-w-[680px] w-full p-0 gap-0 rounded-xl overflow-hidden"
        style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
      >
        <div className="px-6 pt-6 pb-4 border-b border-[#F0F0EA]">
          <h2 className="text-[14px] font-semibold text-[#1A1A18]">Audit Log</h2>
          <p className="text-[12px] text-[#A0A09A] mt-0.5" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {taskTitle}
          </p>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {taskLogs.length === 0 ? (
            <p className="text-[13px] text-[#A0A09A] py-10 text-center">No logs found.</p>
          ) : (
            taskLogs.map((log, i) => (
              <div
                key={log.id}
                className="flex items-center justify-between gap-4 px-6 py-3.5"
                style={{ borderBottom: i < taskLogs.length - 1 ? '1px solid #F0F0EA' : 'none' }}
              >
                <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                  <span className="text-[13px] font-semibold text-[#1A1A18] whitespace-nowrap">{log.actor}</span>
                  {log.fromStatus ? (
                    <>
                      <span className="text-[12px] text-[#B0B0AA]">changed</span>
                      <span
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md whitespace-nowrap"
                        style={{ background: STATUS_META[log.fromStatus].bg, color: STATUS_META[log.fromStatus].text }}
                      >
                        {STATUS_META[log.fromStatus].label}
                      </span>
                      <span className="text-[12px] text-[#C8C8C0]">→</span>
                      <span
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md whitespace-nowrap"
                        style={{ background: STATUS_META[log.toStatus].bg, color: STATUS_META[log.toStatus].text }}
                      >
                        {STATUS_META[log.toStatus].label}
                      </span>
                    </>
                  ) : (
                    <span className="text-[12px] text-[#B0B0AA]">created task</span>
                  )}
                </div>

                <span
                  className="text-[11px] text-[#C0C0B8] whitespace-nowrap flex-shrink-0"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  {fmtDate(log.timestamp)}
                </span>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
