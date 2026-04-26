import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { createServer } from 'http'
import { setupSocket } from './socket/liveActivity.js'
import { statsRouter } from './routes/stats.js'
import { activityRouter } from './routes/activity.js'
import { contactRouter } from './routes/contact.js'
import { newsletterRouter } from './routes/newsletter.js'
import { changelogRouter } from './routes/changelog.js'
import { statusRouter } from './routes/status.js'
import { limitsRouter } from './routes/limits.js'
import { xpStoreRouter } from './routes/xpStore.js'

const app = express()
const server = createServer(app)
const PORT = parseInt(process.env.PORT || '4000', 10)

// Middleware
app.use(helmet())
app.use(cors({
  origin: (process.env.CORS_ORIGIN || '').split(','),
  credentials: true,
}))
app.use(cookieParser())
app.use(express.json({ limit: '1mb' }))

// Health check
app.get('/api/v2/portal/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/v2/portal', statsRouter)
app.use('/api/v2/portal', activityRouter)
app.use('/api/v2/portal', contactRouter)
app.use('/api/v2/portal', newsletterRouter)
app.use('/api/v2/portal', changelogRouter)
app.use('/api/v2/portal', statusRouter)
app.use('/api/v2/portal', limitsRouter)
app.use('/api/v2/portal', xpStoreRouter)

// Socket.io
const io = setupSocket(server)
app.set('io', io)

// Start
server.listen(PORT, () => {
  console.log(`VeVit Portal API running on port ${PORT}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close()
})