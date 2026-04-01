import { useState, useRef } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const FAQS = [
  {
    q: 'What stack do you specialise in?',
    a: "My primary stack is PERN — PostgreSQL, Express.js, React.js, and Node.js — plus strong command of HTML/CSS and working knowledge of Python, C++, and Java."
  },
  {
    q: 'Are you open to internships?',
    a: "Absolutely! Actively looking for internship opportunities in full-stack or frontend development. Based in Greater Noida and open to remote too."
  },
  {
    q: 'What are you currently learning?',
    a: "Currently deep-diving into Data Structures and Algorithms with C++, plus exploring advanced React patterns and PostgreSQL query optimisation."
  },
  {
    q: 'Can you take on freelance projects?',
    a: "Yes — open to freelance web development projects, especially full-stack apps and portfolio sites. Let's discuss via the contact form!"
  },
  {
    q: 'How do I contact you?',
    a: "Fill out the contact form below — I aim to respond within 24 hours. You can also connect with me on LinkedIn or GitHub."
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(0)
  const ref = useRef(null)
  useScrollReveal(ref)

  return (
    <section id="faq" className="FAQ-section" ref={ref}>
      <div className="FAQ-layout">
        <div>
          <div className="section-label" data-reveal>// faq.js</div>
          <h2 className="section-title" data-reveal>Common<br /><em>Questions</em></h2>
          <p className="section-desc" style={{ marginBottom: 36 }} data-reveal>
            Have more? Reach out directly.
          </p>

          <div data-reveal>
            {FAQS.map((f, i) => (
              <div key={i} className={`FAQ-item ${open === i ? 'FAQ-open' : ''}`}>
                <div className="FAQ-q" onClick={() => setOpen(open === i ? -1 : i)}>
                  <span className="FAQ-qText">{f.q}</span>
                  <div className="FAQ-icon">+</div>
                </div>
                <div className="FAQ-a">{f.a}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="FAQ-ctaBox" data-reveal>
            <div className="section-label">// still curious?</div>
            <h3 className="FAQ-ctaTitle">Got a <em>different</em> question?</h3>
            <p className="FAQ-ctaSub">
              Whether it's about a project, an internship, or just tech in general — I'd love to chat.
            </p>
            <a href="#contact" className="btn-primary">Send a Message →</a>
          </div>
        </div>
      </div>
    </section>
  )
}