import { useState, useRef } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { supabase } from '../lib/supabase'

export default function Contact() {
  const ref = useRef(null)
  useScrollReveal(ref)

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('loading')

    try {
      if (supabase) {
        // ── Supabase path (preferred) ──────────────────────────────
        const { error } = await supabase.from('messages').insert([{
          name: form.name,
          email: form.email,
          subject: form.subject || 'General enquiry',
          message: form.message,
        }])
        if (error) throw error
      } else {
        // ── Last-resort: mailto link (no backend needed) ───────────
        // Open the user's mail client so the message is never lost.
        const subject = encodeURIComponent(`[Portfolio] ${form.subject || 'New message'} — from ${form.name}`)
        const body = encodeURIComponent(
          `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
        )
        window.open(`mailto:khushishah@example.com?subject=${subject}&body=${body}`)
        // Still treat this as success so the form clears
      }

      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setStatus('idle'), 4000)
    } catch (err) {
      console.error('Contact form error:', err)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <section id="contact" className="Contact-section" ref={ref}>
      {/* ── Left — form ── */}
      <div data-reveal>
        <div className="section-label">// contact.init()</div>
        <h2 className="section-title">Let's Build<br /><em>Together</em></h2>
        <p className="section-desc" style={{ marginBottom: 36 }}>
          Whether it's an internship, a project, or just a conversation about tech — I'm all ears.
        </p>

        {/* Warn if Supabase isn't configured */}
        {!supabase && (
          <div style={{
            background: 'rgba(201,169,110,0.10)',
            border: '1px solid rgba(201,169,110,0.30)',
            borderRadius: 10,
            padding: '10px 16px',
            marginBottom: 18,
            fontFamily: "'Fira Code', monospace",
            fontSize: 11,
            color: 'var(--gold)',
          }}>
            // Supabase not configured — form will open your mail client instead
          </div>
        )}

        <form className="Contact-form" onSubmit={handleSubmit} noValidate>
          <div className="Contact-row">
            <div className="Contact-group">
              <label htmlFor="contact-name" className="Contact-label">name</label>
              <input
                id="contact-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Your name"
                required
                autoComplete="name"
              />
            </div>
            <div className="Contact-group">
              <label htmlFor="contact-email" className="Contact-label">email</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="form-input"
                placeholder="your@email.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="Contact-group">
            <label htmlFor="contact-subject" className="Contact-label">subject</label>
            <select
              id="contact-subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Select a topic…</option>
              <option>Internship Opportunity</option>
              <option>Freelance Project</option>
              <option>Collaboration</option>
              <option>Just Say Hi</option>
            </select>
          </div>

          <div className="Contact-group">
            <label htmlFor="contact-message" className="Contact-label">message</label>
            <textarea
              id="contact-message"
              name="message"
              value={form.message}
              onChange={handleChange}
              className="form-input"
              style={{ minHeight: 120, resize: 'vertical' }}
              placeholder="Tell me more…"
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className={`btn-primary Contact-submit ${status === 'success' ? 'Contact-success' : ''}`}
          >
            {status === 'loading' ? 'Sending…'
              : status === 'success' ? '✓ Message Sent!'
                : status === 'error' ? '✗ Try again'
                  : 'Send Message →'}
          </button>
        </form>
      </div>

      {/* ── Right — info ── */}
      <div data-reveal>
        <div className="section-label" style={{ marginBottom: 24 }}>// contact.info</div>

        {[
          { icon: '📧', label: 'email', val: <span style={{ color: 'var(--muted2)', fontSize: 13 }}>Fill the form to reach me!</span> },
          { icon: '📍', label: 'location', val: 'Greater Noida, Noida, UP' },
          { icon: '🎓', label: 'university', val: 'Bennett University' },
          { icon: '💼', label: 'status', val: <span style={{ color: 'var(--green)', fontSize: 13 }}>// Open to Internships &amp; Projects</span> },
        ].map(({ icon, label, val }) => (
          <div key={label} className="Contact-detail">
            <div className="Contact-detailIcon" aria-hidden="true">{icon}</div>
            <div>
              <div className="Contact-detailLabel">{label}</div>
              <div className="Contact-detailVal">{val}</div>
            </div>
          </div>
        ))}

        <div className="Contact-socials">
          {[
            { icon: '⌥', label: 'GitHub', href: 'https://github.com/KhushiShah-25' },
            { icon: 'in', label: 'LinkedIn', href: '#' },
            { icon: 'ig', label: 'Instagram', href: 'https://www.instagram.com/khushiii_shah_25' },
            { icon: '🧩', label: 'LeetCode', href: 'https://leetcode.com/u/Khushi_Shah_25' },
          ].map(s => (
            <a
              key={s.label}
              href={s.href}
              className="Contact-social"
              aria-label={s.label}
              target="_blank"
              rel="noopener noreferrer"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}