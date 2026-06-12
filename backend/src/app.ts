import express from 'express'
import cors from 'cors'
import { tasksRouter, allLogsHandler } from './routes/tasks.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/tasks', tasksRouter)
app.get('/api/audit-logs', allLogsHandler)

export default app
