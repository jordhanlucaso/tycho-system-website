import express from 'express'
import cors from 'cors'
import { healthRouter } from './routes/health.js'
import { stripeRouter } from './routes/stripe.js'
import { authRouter } from './routes/auth.js'
import { adminRouter } from './routes/admin.js'
import { clientRouter } from './routes/client.js'
import { monitoringRouter } from './routes/monitoring.js'
import { startHealthCheckCron } from './lib/healthcheck.js'

const app = express()
const PORT = process.env.PORT || 3001
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

// CORS
app.use(cors({ origin: CLIENT_URL, credentials: true }))

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  // Start health checks every 5 minutes
  startHealthCheckCron(5 * 60 * 1000)
})

export default app
