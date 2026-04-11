import { useRef } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function About() {
  const ref = useRef(null)
  useScrollReveal(ref)

  return (
    <section id="about" className="About-section" ref={ref}>

      {/* ── Left: Image column ── */}
      <div className="About-imgCol" data-reveal>
        {/* Decorative ring */}
        <div className="About-ringDeco" aria-hidden="true" />

        {/* Main photo */}
        <div className="About-photoWrap">
          <img
            src="https://res.cloudinary.com/dm2jsrej1/image/upload/q_auto/f_auto/v1775600966/e96e9ba2-bc89-4a78-b667-cc75727b771c_npgrkb.jpg"
            alt="Khushi Shah — Full Stack Developer at Bennett University"
            className="About-photo"
            loading="lazy"
            width="400"
            height="480"
          />
          {/* Gradient overlay at bottom */}
          <div className="About-photoGrad" aria-hidden="true" />
        </div>

        {/* Floating name tag */}
        <div className="About-nameTag" aria-label="Khushi Shah, Full Stack Developer">
          <div className="About-nameTagDot" aria-hidden="true" />
          <div>
            <div className="About-nameTagTitle">Khushi Shah</div>
            <div className="About-nameTagSub">// Full Stack Developer</div>
          </div>
        </div>

        {/* Floating skills badge */}
        <div className="About-skillBadge" aria-hidden="true">
          <span className="About-skillBadgeText">React · Node · PostgreSQL</span>
        </div>

        {/* Corner accent */}
        <div className="About-cornerAccent" aria-hidden="true" />
      </div>

      {/* ── Right: Content ── */}
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
          <div className="About-row">
            <strong>loc</strong>
            <span>Greater Noida, Uttar Pradesh</span>
          </div>
          <div className="About-row">
            <strong>uni</strong>
            <span>Bennett University</span>
          </div>
          <div className="About-row">
            <strong>status</strong>
            <span className="About-statusGreen">// available for opportunities</span>
          </div>
        </div>
        <a href="#contact" className="btn-primary">Let's Connect →</a>
      </div>
    </section>
  )
}