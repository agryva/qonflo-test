import type { Status } from './types'
import { STATUS_META } from './constants'

export function StatusBadge({ status }: { status: Status }) {
  const m = STATUS_META[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-[5px] px-2 py-0.5 text-[11px] font-medium tracking-[0.01em] whitespace-nowrap"
      style={{ background: m.bg, color: m.text }}
    >
      <span className="size-1.5 rounded-full flex-shrink-0" style={{ background: m.dot }} />
      {m.label}
    </span>
  )
}
