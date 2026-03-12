import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { healthRouter } from './routes/health.js'
import { stripeRouter } from './routes/stripe.js'
import { authRouter } from './routes/auth.js'
import { adminRouter } from './routes/admin.js'
import { clientRouter } from './routes/client.js'
import { monitoringRouter } from './routes/monitoring.js'
import { salesRouter } from './routes/sales.js'
import { contractsRouter } from './routes/contracts.js'
import { contactRouter } from './routes/contact.js'
import { startHealthCheckCron } from './lib/healthcheck.js'

const app = express()
const PORT = process.env.PORT || 3001
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:5173',
  'https://tycho-system-website.vercel.app',
]

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`))
    }
  },
  credentials: true,
}

// CORS — handle preflight OPTIONS globally first
app.options('*', cors(corsOptions))
app.use(cors(corsOptions))

// Parse JSON for all routes except Stripe webhooks (needs raw body)
app.use((req, res, next) => {
  if (req.path === '/api/webhooks/stripe') {
    next()
  } else {
    express.json()(req, res, next)
  }
})

// Routes
app.use('/api', healthRouter)
app.use('/api', stripeRouter)
app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)
app.use('/api/client', clientRouter)
app.use('/api', monitoringRouter)
app.use('/api/sales', salesRouter)
app.use('/api/contracts', contractsRouter)
app.use('/api/contact', contactRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  // Start health checks every 5 minutes
  startHealthCheckCron(5 * 60 * 1000)
})

export default app
