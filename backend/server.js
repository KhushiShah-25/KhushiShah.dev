require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const projectsRouter = require('./routes/projects')
const contactRouter = require('./routes/contact')
const testimonialsRouter = require('./routes/testimonials')

const app = express()
const PORT = process.env.PORT || 5000

/* ── Postgres pool ── */
let pool = null
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
    // Connection pool tuning
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  })

  pool.on('error', (err) => {
    console.error('Postgres pool error:', err.message)
  })
} else {
  console.warn('⚠️  DATABASE_URL not set — DB routes will return 503')
}

app.locals.db = pool

/* ── CORS ── */
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://khushishah.dev',
  'https://www.khushishah.dev',
  /\.vercel\.app$/,
]

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return cb(null, true)
    const allowed = allowedOrigins.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    )
    cb(allowed ? null : new Error('Not allowed by CORS'), allowed)
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

/* ── DB availability middleware ── */
app.use('/api/projects', (req, res, next) => {
  if (!pool) return res.status(503).json({ error: 'Database not configured' })
  next()
})
app.use('/api/contact', (req, res, next) => {
  if (!pool) return res.status(503).json({ error: 'Database not configured' })
  next()
})
app.use('/api/testimonials', (req, res, next) => {
  if (!pool) return res.status(503).json({ error: 'Database not configured' })
  next()
})

/* ── Routes ── */
app.use('/api/projects', projectsRouter)
app.use('/api/contact', contactRouter)
app.use('/api/testimonials', testimonialsRouter)

/* ── Health check ── */
app.get('/api/health', async (_req, res) => {
  const dbStatus = pool
    ? await pool.query('SELECT 1').then(() => 'ok').catch(() => 'error')
    : 'not_configured'
  res.json({ status: 'ok', db: dbStatus, ts: new Date().toISOString() })
})

/* ── 404 handler ── */
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'API endpoint not found' })
})

/* ── Global error handler ── */
app.use((err, _req, res, _next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS policy violation' })
  }
  console.error('Unhandled error:', err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`   DB: ${pool ? '✅ connected' : '⚠️  not configured'}`)
})