import { useState, useRef, useEffect } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { supabase } from '../lib/supabase'

export default function Contact() {
  const ref = useRef(null)
  useScrollReveal(ref)

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle')
  const [debugInfo, setDebugInfo] = useState(null)

  // On mount: test connection and log useful info to console
  useEffect(() => {
    if (!supabase) {
      console.warn('[Contact] supabase client is null — check VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in .env')
      return
    }
    supabase.from('messages').select('id', { count: 'exact', head: true })
      .then(({ count, error }) => {
        if (error) {
          console.error('[Contact] Supabase connection test FAILED:', error)
        } else {
          console.info('[Contact] Supabase connected ✓  messages table row count:', count)
        }
      })
  }, [])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('loading')
    setDebugInfo(null)

    if (!supabase) {
      setDebugInfo('Supabase client not initialised. Check env vars.')
      setStatus('error')
      return
    }

    try {
      const payload = {
        name: form.name,
        email: form.email,
        subject: form.subject || 'General enquiry',
        message: form.message,
      }
      console.log('[Contact] Inserting:', payload)

      // .select() after insert surfaces RLS errors that plain insert silently swallows
      const { data, error } = await supabase
        .from('messages')
        .insert([payload])
        .select()

      if (error) {
        console.error('[Contact] Insert failed:', { code: error.code, message: error.message, hint: error.hint, details: error.details })

        const known = {
          '42501': 'RLS blocked the insert — run the SQL fix below.',
          'PGRST116': 'RLS may be blocking the read-back after insert.',
          '23502': 'A required column is null or missing.',
          '42P01': 'Table "messages" not found — run database_setup.sql.',
        }
        setDebugInfo(`Error ${error.code}: ${known[error.code] || error.message}`)
        setStatus('error')
        return
      }

      console.log('[Contact] Insert ok:', data)
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setStatus('idle'), 4000)
    } catch (err) {
      console.error('[Contact] Unexpected:', err)
      setDebugInfo(err.message || String(err))
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="Contact-section" ref={ref}>
      <div data-reveal>
        <div className="section-label">// contact.init()</div>
        <h2 className="section-title">Let's Build<br /><em>Together</em></h2>
        <p className="section-desc" style={{ marginBottom: 36 }}>
          Whether it's an internship, a project, or just a conversation about tech — I'm all ears.
        </p>

        <form className="Contact-form" onSubmit={handleSubmit} noValidate>
          <div className="Contact-row">
            <div className="Contact-group">
              <label htmlFor="contact-name" className="Contact-label">name</label>
              <input id="contact-name" name="name" value={form.name} onChange={handleChange}
                className="form-input" placeholder="Your name" required autoComplete="name" />
            </div>
            <div className="Contact-group">
              <label htmlFor="contact-email" className="Contact-label">email</label>
              <input id="contact-email" name="email" type="email" value={form.email}
                onChange={handleChange} className="form-input" placeholder="your@email.com"
                required autoComplete="email" />
            </div>
          </div>

          <div className="Contact-group">
            <label htmlFor="contact-subject" className="Contact-label">subject</label>
            <select id="contact-subject" name="subject" value={form.subject}
              onChange={handleChange} className="form-select">
              <option value="">Select a topic…</option>
              <option>Internship Opportunity</option>
              <option>Freelance Project</option>
              <option>Collaboration</option>
              <option>Just Say Hi</option>
            </select>
          </div>

          <div className="Contact-group">
            <label htmlFor="contact-message" className="Contact-label">message</label>
            <textarea id="contact-message" name="message" value={form.message}
              onChange={handleChange} className="form-input"
              style={{ minHeight: 120, resize: 'vertical' }}
              placeholder="Tell me more…" required />
          </div>

          {/* Show the real error so it's diagnosable */}
          {status === 'error' && debugInfo && (
            <div style={{
              background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)',
              borderRadius: 10, padding: '12px 14px',
            }}>
              <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 10, color: '#f87171', marginBottom: 4 }}>
                // error — open DevTools console for full details
              </div>
              <div style={{ fontSize: 13, color: '#fca5a5', lineHeight: 1.5 }}>
                {debugInfo}
              </div>
            </div>
          )}

          <button type="submit" disabled={status === 'loading'}
            className={`btn-primary Contact-submit ${status === 'success' ? 'Contact-success' : ''}`}>
            {status === 'loading' ? 'Sending…'
              : status === 'success' ? '✓ Message Sent!'
                : status === 'error' ? '✗ Failed — see error above'
                  : 'Send Message →'}
          </button>
        </form>
      </div>

      <div data-reveal>
        <div className="section-label" style={{ marginBottom: 24 }}>// contact.info</div>
        {[
          { icon: '📧', label: 'email', val: <span style={{ color: 'var(--muted2)', fontSize: 13 }}>Fill the form to reach me!</span> },
          { icon: '📍', label: 'location', val: 'Greater Noida, Uttar Pradesh' },
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
            <a key={s.label} href={s.href} className="Contact-social" aria-label={s.label}
              target="_blank" rel="noopener noreferrer">{s.icon}</a>
          ))}
        </div>
      </div>
    </section>
  )
}