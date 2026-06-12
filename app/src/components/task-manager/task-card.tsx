import { StatusBadge } from './status-badge'
import { STATUS_ORDER, STATUS_META } from './constants'
import { fmtDate } from './utils'
import type { Task } from './types'

interface Props {
  task: Task
  logCount: number
  onAdvance: () => void
  onRevert: () => void
  onDelete: () => void
  onLogs: () => void
}

export function TaskCard({ task, logCount, onAdvance, onRevert, onDelete, onLogs }: Props) {
  const curIdx = STATUS_ORDER.indexOf(task.status)
  const prevStat = STATUS_ORDER[curIdx - 1]
  const nextStat = STATUS_ORDER[curIdx + 1]
  const isDone = task.status === 'done'

  return (
    <div
      className="bg-white border border-[#E6E6E0] rounded-lg px-[18px] py-[14px] flex items-center gap-3.5 transition-[box-shadow,border-color] duration-150 hover:shadow-[0_2px_10px_rgba(0,0,0,0.07)] hover:border-[#D8D8D0]"
      style={{ opacity: isDone ? 0.65 : 1, fontFamily: "'IBM Plex Sans', sans-serif" }}
    >
      <div className="flex items-center w-[90px] flex-shrink-0">
        <StatusBadge status={task.status} />
      </div>

      <div className="flex-1 min-w-0">
        <div
          className="text-[13px] font-medium text-[#1A1A18] mb-0.5 truncate"
          style={{ textDecoration: isDone ? 'line-through #C0C0B8' : 'none' }}
        >
          {task.title}
        </div>
        {task.description && (
          <div className="text-[12px] text-[#9B9B95] truncate">{task.description}</div>
        )}
      </div>

      <div
        className="text-[11px] text-[#C0C0B8] flex-shrink-0 w-[100px] text-right"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        {fmtDate(task.createdAt)}
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0 justify-end">
        <button
          onClick={onLogs}
          className="inline-flex items-center justify-center gap-1 rounded-md border border-[#E2E2DA] bg-transparent px-2.5 py-1.5 text-[11px] font-medium text-[#6B6B65] transition-colors hover:bg-[#F4F4F0] cursor-pointer whitespace-nowrap w-[72px]"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="1.5" y="1.5" width="9" height="9" rx="1.5" stroke="#9B9B95" strokeWidth="1.2" />
            <path d="M3.5 4h5M3.5 6h5M3.5 8h3" stroke="#9B9B95" strokeWidth="1.1" strokeLinecap="round" />
          </svg>
          {logCount} log{logCount !== 1 ? 's' : ''}
        </button>

        {prevStat ? (
          <button
            onClick={onRevert}
            className="inline-flex items-center justify-center gap-1 rounded-md border border-[#E2E2DA] bg-transparent px-2.5 py-1.5 text-[11px] font-medium text-[#6B6B65] hover:bg-[#F4F4F0] transition-colors cursor-pointer whitespace-nowrap w-[120px]"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M8.5 5.5h-6M5 3L2.5 5.5 5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {STATUS_META[prevStat].label}
          </button>
        ) : (
          <span className="w-[120px]" />
        )}

        {nextStat ? (
          <button
            onClick={onAdvance}
            className="inline-flex items-center justify-center gap-1 rounded-md bg-[#1A1A18] px-2.5 py-1.5 text-[11px] font-medium text-[#F6F6F3] hover:opacity-80 transition-opacity cursor-pointer whitespace-nowrap w-[120px]"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M2.5 5.5h6M6 3l2.5 2.5L6 8" stroke="#F6F6F3" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {STATUS_META[nextStat].label}
          </button>
        ) : (
          <span className="w-[120px]" />
        )}

        <button
          onClick={onDelete}
          title="Delete task"
          className="inline-flex items-center justify-center rounded-md border border-[#E2E2DA] bg-transparent p-1.5 text-[#9B9B95] transition-all hover:bg-[#FEE2E2] hover:border-[#FECACA] hover:text-[#DC2626] cursor-pointer"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1.5 3h9M4.5 3V2h3v1M5 5.5v3M7 5.5v3M2.5 3l.5 7h6l.5-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
