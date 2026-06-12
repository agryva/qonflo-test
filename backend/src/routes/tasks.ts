import { Router, type Request, type Response } from 'express'
import { randomUUID } from 'crypto'
import { db } from '../db.js'
import { STATUS_ORDER } from '../types.js'
import type { Task, AuditLog, Status } from '../types.js'

const router = Router()

type TaskRow = { id: string; title: string; description: string; status: string; created_at: string }
type LogRow = { id: string; task_id: string; task_title: string; actor: string; from_status: string | null; to_status: string; timestamp: string }

const toTask = (r: TaskRow): Task => ({ id: r.id, title: r.title, description: r.description, status: r.status as Status, createdAt: r.created_at })
const toLog  = (r: LogRow): AuditLog => ({ id: r.id, taskId: r.task_id, taskTitle: r.task_title, actor: r.actor, fromStatus: r.from_status as Status | null, toStatus: r.to_status as Status, timestamp: r.timestamp })

const q = {
  listTasks:    db.prepare('SELECT * FROM tasks ORDER BY created_at DESC'),
  getTask:      db.prepare('SELECT * FROM tasks WHERE id = ?'),
  insertTask:   db.prepare('INSERT INTO tasks (id, title, description, status, created_at) VALUES (?, ?, ?, ?, ?)'),
  updateStatus: db.prepare('UPDATE tasks SET status = ? WHERE id = ?'),
  deleteTask:   db.prepare('DELETE FROM tasks WHERE id = ?'),
  insertLog:    db.prepare('INSERT INTO audit_logs (id, task_id, task_title, actor, from_status, to_status, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)'),
  logsByTask:   db.prepare('SELECT * FROM audit_logs WHERE task_id = ? ORDER BY timestamp ASC'),
  allLogs:      db.prepare('SELECT * FROM audit_logs ORDER BY timestamp ASC'),
}

router.get('/', (_req, res) => {
  res.json({ tasks: (q.listTasks.all() as TaskRow[]).map(toTask) })
})

router.post('/', (req, res) => {
  const { title, description, actor } = req.body as Record<string, string>
  if (!title?.trim()) { res.status(400).json({ error: 'title is required' }); return }
  if (!actor?.trim()) { res.status(400).json({ error: 'actor is required' }); return }

  const id  = randomUUID()
  const now = new Date().toISOString()

  db.transaction(() => {
    q.insertTask.run(id, title.trim(), (description ?? '').trim(), 'to_do', now)
    q.insertLog.run(randomUUID(), id, title.trim(), actor.trim(), null, 'to_do', now)
  })()

  res.status(201).json({ task: { id, title: title.trim(), description: (description ?? '').trim(), status: 'to_do', createdAt: now } })
})

router.put('/:id/status', (req: Request<{ id: string }>, res) => {
  const { id } = req.params
  const { actor, status } = req.body as Record<string, string>
  if (!actor?.trim()) { res.status(400).json({ error: 'actor is required' }); return }
  if (!status?.trim()) { res.status(400).json({ error: 'status is required' }); return }

  const row = q.getTask.get(id) as TaskRow | undefined
  if (!row) { res.status(404).json({ error: 'Task not found' }); return }

  const currentIdx = STATUS_ORDER.indexOf(row.status as Status)
  const targetIdx  = STATUS_ORDER.indexOf(status as Status)

  if (currentIdx === -1) { res.status(422).json({ error: 'Task has an invalid status' }); return }
  if (targetIdx === -1)  { res.status(422).json({ error: 'Invalid target status' }); return }
  if (Math.abs(targetIdx - currentIdx) !== 1) {
    res.status(422).json({ error: 'Status can only move one step at a time' }); return
  }

  const logId = randomUUID()
  const now   = new Date().toISOString()

  db.transaction(() => {
    q.updateStatus.run(status, id)
    q.insertLog.run(logId, id, row.title, actor.trim(), row.status, status, now)
  })()

  const task: Task    = { id, title: row.title, description: row.description, status: status as Status, createdAt: row.created_at }
  const log: AuditLog = { id: logId, taskId: id, taskTitle: row.title, actor: actor.trim(), fromStatus: row.status as Status, toStatus: status as Status, timestamp: now }

  res.json({ task, log })
})

router.delete('/:id', (req: Request<{ id: string }>, res) => {
  const deleted = q.deleteTask.run(req.params.id).changes > 0
  if (!deleted) { res.status(404).json({ error: 'Task not found' }); return }
  res.status(204).end()
})

router.get('/:id/audit-logs', (req: Request<{ id: string }>, res) => {
  res.json({ logs: (q.logsByTask.all(req.params.id) as LogRow[]).map(toLog) })
})

export { router as tasksRouter }

export function allLogsHandler(_req: Request, res: Response) {
  res.json({ logs: (q.allLogs.all() as LogRow[]).map(toLog) })
}
