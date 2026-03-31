const router   = require('express').Router()
const nodemailer = require('nodemailer')

/* POST /api/contact */
router.post('/', async (req, res) => {
  const db = req.app.locals.db
  const { name, email, subject, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email and message are required' })
  }

  try {
    /* 1. Persist to database */
    await db.query(
      `INSERT INTO messages (name, email, subject, message) VALUES ($1,$2,$3,$4)`,
      [name, email, subject || 'General enquiry', message]
    )

    /* 2. Optional — send email notification
       Set SMTP_* vars in .env to enable.
    */
    if (process.env.SMTP_HOST) {
      const transporter = nodemailer.createTransport({
        host:   process.env.SMTP_HOST,
        port:   Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      await transporter.sendMail({
        from:    `"Portfolio Contact" <${process.env.SMTP_USER}>`,
        to:      process.env.CONTACT_EMAIL || process.env.SMTP_USER,
        subject: `[Portfolio] ${subject || 'New message'} — from ${name}`,
        html: `
          <h3>New portfolio message</h3>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Subject:</b> ${subject}</p>
          <p><b>Message:</b><br/>${message.replace(/\n/g,'<br/>')}</p>
        `,
      })
    }

    res.json({ success: true, message: 'Message received!' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

/* GET /api/contact — list messages (no auth for now, add middleware later) */
router.get('/', async (req, res) => {
  const db = req.app.locals.db
  try {
    const { rows } = await db.query('SELECT * FROM messages ORDER BY created_at DESC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

module.exports = router
