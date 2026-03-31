import { useState, useRef } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function Contact() {
  const ref = useRef(null)
  useScrollReveal(ref)

  const [form,    setForm]    = useState({ name:'', email:'', subject:'', message:'' })
  const [status,  setStatus]  = useState('idle') // idle | loading | success | error

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setForm({ name:'', email:'', subject:'', message:'' })
      setTimeout(() => setStatus('idle'), 4000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <section id="contact" className={"Contact-section"} ref={ref}>
      {/* Left — form */}
      <div data-reveal>
        <div className="section-label">// contact.init()</div>
        <h2 className="section-title">Let's Build<br /><em>Together</em></h2>
        <p className="section-desc" style={{ marginBottom:36 }}>
          Whether it's an internship, a project, or just a conversation about tech — I'm all ears.
        </p>

        <form className={"Contact-form"} onSubmit={handleSubmit}>
          <div className={"Contact-row"}>
            <div className={"Contact-group"}>
              <label className={"Contact-label"}>name</label>
              <input name="name" value={form.name} onChange={handleChange}
                className="form-input" placeholder="Your name" required />
            </div>
            <div className={"Contact-group"}>
              <label className={"Contact-label"}>email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                className="form-input" placeholder="your@email.com" required />
            </div>
          </div>

          <div className={"Contact-group"}>
            <label className={"Contact-label"}>subject</label>
            <select name="subject" value={form.subject} onChange={handleChange} className="form-select">
              <option value="">Select a topic…</option>
              <option>Internship Opportunity</option>
              <option>Freelance Project</option>
              <option>Collaboration</option>
              <option>Just Say Hi</option>
            </select>
          </div>

          <div className={"Contact-group"}>
            <label className={"Contact-label"}>message</label>
            <textarea name="message" value={form.message} onChange={handleChange}
              className="form-input" style={{ minHeight:120, resize:'vertical' }}
              placeholder="Tell me more…" required />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className={`btn-primary ${"Contact-submit"} ${status === 'success' ? "Contact-success" : ''}`}
          >
            {status === 'loading' ? 'Sending…'
              : status === 'success' ? '✓ Message Sent!'
              : status === 'error'   ? '✗ Try again'
              : 'Send Message →'}
          </button>
        </form>
      </div>

      {/* Right — info */}
      <div data-reveal>
        <div className="section-label" style={{ marginBottom:24 }}>// contact.info</div>

        {[
          { icon:'📞', label:'phone',      val:<a href="tel:+919266805633">+91 92668 05633</a> },
          { icon:'📧', label:'email',      val:<span style={{color:'var(--muted2)',fontSize:13}}>To be added soon</span> },
          { icon:'📍', label:'location',   val:'Greater Noida, Noida, UP' },
          { icon:'🎓', label:'university', val:'Bennett University' },
        ].map(({ icon, label, val }) => (
          <div key={label} className={"Contact-detail"}>
            <div className={"Contact-detailIcon"}>{icon}</div>
            <div>
              <div className={"Contact-detailLabel"}>{label}</div>
              <div className={"Contact-detailVal"}>{val}</div>
            </div>
          </div>
        ))}

        <div className={"Contact-socials"}>
          {['⌥ GitHub','in LinkedIn','𝕏 Twitter','🧩 LeetCode','📷 Instagram'].map(s => (
            <a key={s} href="#" className={"Contact-social"}>{s.split(' ')[0]}</a>
          ))}
        </div>
      </div>
    </section>
  )
}
