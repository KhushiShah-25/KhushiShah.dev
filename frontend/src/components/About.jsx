import { useRef } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function About() {
  const ref = useRef(null)
  useScrollReveal(ref)

  return (
    <section id="about" className="About-section" ref={ref}>
      <div className="About-imgCol" data-reveal>
        <div className="About-initials">KS</div>
        <div className="About-tag">
          <div className="About-dot" />
          <div>
            <div className="About-tagText">Open to Opportunities</div>
            <div className="About-tagSub">// Internships &amp; Projects</div>
          </div>
        </div>
      </div>

      <div data-reveal>
        <div className="section-label">// about.me</div>
        <h2 className="section-title">Hi, I'm <em>Khushi</em></h2>
        <p className="section-desc">
          Undergrad at Bennett University, Greater Noida. Building my skillset one commit at a time —
          currently deep-diving into DSA with C++ while shipping full-stack web applications.
        </p>

        <pre className="About-code">
          {`// khushi.json
university: "Bennett University",
location:   "Greater Noida, UP",
role:       "Full Stack Developer",
currently:  "DSA in C++",
stack:      ["HTML","CSS","JS","React","Node","Express","PostgreSQL"]`}
        </pre>

        <div className="About-stats">
          {[['7+', 'Tech Skills'], ['10+', 'Projects'], ['3', 'Languages']].map(([n, l]) => (
            <div key={l} className="About-stat">
              <div className="About-statNum">{n}</div>
              <div className="About-statLabel">{l}</div>
            </div>
          ))}
        </div>

        <div className="About-info">
          <div className="About-row"><strong>email</strong><span style={{ color: 'var(--muted2)' }}>use the contact form below</span></div>
          <div className="About-row"><strong>loc</strong><span>Greater Noida, Noida, UP</span></div>
          <div className="About-row"><strong>status</strong><span style={{ color: 'var(--green)' }}>// available for opportunities</span></div>
        </div>

        <a href="#contact" className="btn-primary">Let's Connect →</a>
      </div>
    </section>
  )
}