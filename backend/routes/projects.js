const router = require('express').Router()

/* GET /api/projects — returns all or featured only */
router.get('/', async (req, res) => {
  const db = req.app.locals.db
  try {
    const featured = req.query.featured === 'true'
    const query = featured
      ? 'SELECT * FROM projects WHERE featured = true ORDER BY created_at DESC'
      : 'SELECT * FROM projects ORDER BY created_at DESC'
    const { rows } = await db.query(query)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
})

/* GET /api/projects/:id */
router.get('/:id', async (req, res) => {
  const db = req.app.locals.db
  try {
    const { rows } = await db.query('SELECT * FROM projects WHERE id = $1', [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'Not found' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch project' })
  }
})

/* POST /api/projects — add new project */
router.post('/', async (req, res) => {
  const db = req.app.locals.db
  const { title, description, category, stack, live_url, repo_url, emoji, featured } = req.body
  try {
    const { rows } = await db.query(
      `INSERT INTO projects (title, description, category, stack, live_url, repo_url, emoji, featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [title, description, category, stack, live_url, repo_url, emoji, featured]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project' })
  }
})

module.exports = router
