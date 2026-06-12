'use client'

import { useState, useEffect, useCallback } from 'react'
import { TaskCard } from './task-card'
import { CreateModal } from './create-modal'
import { StatusModal } from './status-modal'
import { DeleteModal } from './delete-modal'
import { LogsModal } from './logs-modal'
import { toast } from 'sonner'
import { STATUS_ORDER, STATUS_META } from './constants'
import { TaskService } from '@/services/task.service'
import { AuditService } from '@/services/audit.service'
import type { Task, AuditLog, ModalState } from './types'

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [logs, setLogs] = useState<AuditLog[]>([])
  const actor = 'john.doe'
  const [filter, setFilter] = useState<string>('all')
  const [modal, setModal] = useState<ModalState>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const [t, l] = await Promise.all([TaskService.list(), AuditService.getAll()])
      setTasks(t)
      setLogs(l)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load data')
    }
  }, [])

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [refresh])

  async function createTask(title: string, description: string) {
    try {
      await TaskService.create(title, description, actor)
      await refresh()
      setModal(null)
      toast.success('Task created')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to create task')
    }
  }

  async function advanceStatus(taskId: string) {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return
    const nextIdx = STATUS_ORDER.indexOf(task.status) + 1
    const nextStatus = STATUS_ORDER[nextIdx]
    if (!nextStatus) return
    try {
      await TaskService.updateStatus(taskId, nextStatus, actor)
      await refresh()
      setModal(null)
      setFilter(nextStatus)
      toast.success(`Status updated to ${STATUS_META[nextStatus].label}`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to update status')
    }
  }

  async function revertStatus(taskId: string) {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return
    const prevIdx = STATUS_ORDER.indexOf(task.status) - 1
    const prevStatus = STATUS_ORDER[prevIdx]
    if (!prevStatus) return
    try {
      await TaskService.updateStatus(taskId, prevStatus, actor)
      await refresh()
      setModal(null)
      setFilter(prevStatus)
      toast.success(`Status reverted to ${STATUS_META[prevStatus].label}`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to revert status')
    }
  }

  async function deleteTask(taskId: string) {
    try {
      await TaskService.remove(taskId)
      await refresh()
      setModal(null)
      toast.success('Task deleted')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete task')
    }
  }

  const counts = STATUS_ORDER.reduce<Record<string, number>>(
    (acc, s) => ({ ...acc, [s]: tasks.filter(t => t.status === s).length }),
    { all: tasks.length }
  )
  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter)
  const modalTask = modal && 'taskId' in modal ? tasks.find(t => t.id === modal.taskId) ?? null : null

  return (
    <div className="min-h-screen bg-[#F6F6F3]" style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>
      <header className="sticky top-0 z-50 h-[52px] bg-[#18181B] text-[#F6F6F3] px-7 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-[13px] font-semibold tracking-[-0.01em]">Task Manager</span>
          <span className="w-px h-3.5 bg-[#3F3F46]" />
          <span className="text-[11px] text-[#71717A] tracking-[0.05em] uppercase">Internal</span>
          <span className="bg-[#2D2D30] text-[#A0A09A] text-[11px] font-medium px-[7px] py-px rounded ml-1">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setModal({ type: 'create' })}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#F6F6F3] text-[#18181B] px-3 py-1.5 text-[12px] font-medium hover:opacity-80 transition-opacity cursor-pointer"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 2v9M2 6.5h9" stroke="#18181B" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            New Task
          </button>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-7">
        <div className="flex gap-1.5 flex-wrap mb-5">
          {[['all', 'All'] as const, ...STATUS_ORDER.map(s => [s, STATUS_META[s].label] as const)].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`inline-flex items-center gap-1.5 px-3 py-[5px] rounded-md text-[12px] font-medium transition-all cursor-pointer border ${filter === key
                ? 'bg-[#1A1A18] text-[#F6F6F3] border-[#1A1A18]'
                : 'bg-white text-[#6B6B65] border-[#E2E2DA] hover:bg-[#F4F4F0]'
                }`}
            >
              {label}
              <span
                className="inline-flex items-center justify-center min-w-[18px] h-4 rounded px-1 text-[10px] font-semibold"
                style={{
                  background: filter === key ? '#3F3F46' : '#EEEEEA',
                  color: filter === key ? '#D4D4D0' : '#8B8B85',
                }}
              >
                {counts[key] ?? 0}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center px-[18px] mb-2 gap-3.5">
          <div className="w-[90px] flex-shrink-0" />
          <div className="flex-1 text-[10px] font-semibold text-[#B0B0AA] tracking-[0.07em] uppercase">Task</div>
          <div className="w-[100px] text-right text-[10px] font-semibold text-[#B0B0AA] tracking-[0.07em] uppercase flex-shrink-0">Created</div>
          <div className="w-[180px] flex-shrink-0" />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-[72px] gap-3 text-[#A0A09A]">
            <span className="text-[13px]">Loading tasks…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[72px] gap-3 text-[#A0A09A]">
            <span className="text-3xl opacity-40">📭</span>
            <span className="text-[13px]">
              {filter === 'all' ? 'No tasks yet. Create your first one.' : `No tasks with status "${STATUS_META[filter as keyof typeof STATUS_META]?.label}".`}
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {filtered.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                logCount={logs.filter(l => l.taskId === task.id).length}
                onAdvance={() => setModal({ type: 'status', taskId: task.id })}
                onRevert={() => setModal({ type: 'revert', taskId: task.id })}
                onDelete={() => setModal({ type: 'delete', taskId: task.id })}
                onLogs={() => setModal({ type: 'logs', taskId: task.id })}
              />
            ))}
          </div>
        )}
      </main>

      <CreateModal
        open={modal?.type === 'create'}
        onClose={() => setModal(null)}
        onCreate={createTask}
      />
      <StatusModal
        open={modal?.type === 'status'}
        task={modalTask}
        actor={actor}
        onClose={() => setModal(null)}
        onConfirm={() => modalTask && advanceStatus(modalTask.id)}
      />
      <StatusModal
        open={modal?.type === 'revert'}
        task={modalTask}
        actor={actor}
        direction="revert"
        onClose={() => setModal(null)}
        onConfirm={() => modalTask && revertStatus(modalTask.id)}
      />
      <DeleteModal
        open={modal?.type === 'delete'}
        task={modalTask}
        onClose={() => setModal(null)}
        onConfirm={() => modalTask && deleteTask(modalTask.id)}
      />
      <LogsModal
        open={modal?.type === 'logs'}
        taskId={modal && 'taskId' in modal ? modal.taskId : null}
        tasks={tasks}
        logs={logs}
        onClose={() => setModal(null)}
      />
    </div>
  )
}
