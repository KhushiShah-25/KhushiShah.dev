const router = require('express').Router()

router.get('/', async (req, res) => {
  const db = req.app.locals.db
  try {
    const { rows } = await db.query('SELECT * FROM testimonials ORDER BY created_at DESC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch testimonials' })
  }
})

module.exports = router
