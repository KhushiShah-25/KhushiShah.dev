require('dotenv').config()
const express    = require('express')
const cors       = require('cors')
const { Pool }   = require('pg')

const projectsRouter = require('./routes/projects')
const contactRouter  = require('./routes/contact')
const testimonialsRouter = require('./routes/testimonials')

const app  = express()
const PORT = process.env.PORT || 5000

/* ── Postgres pool (shared across routes) ── */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
})
app.locals.db = pool

/* ── Middleware ── */
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

/* ── Routes ── */
app.use('/api/projects',     projectsRouter)
app.use('/api/contact',      contactRouter)
app.use('/api/testimonials', testimonialsRouter)

/* ── Health check ── */
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

/* ── Global error handler ── */
app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
