import { useRef } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const SKILLS = [
  {
    num: '01', icon: '🎨', name: 'Frontend',
    items: ['HTML5 & CSS3', 'JavaScript (ES6+)', 'React.js', 'Responsive Design'],
  },
  {
    num: '02', icon: '⚙️', name: 'Backend',
    items: ['Node.js', 'Express.js', 'REST API Design', 'PostgreSQL'],
  },
  {
    num: '03', icon: '🧠', name: 'CS Fundamentals',
    items: ['Data Structures (C++)', 'Algorithms', 'OOP Concepts', 'Problem Solving'],
  },
  {
    num: '04', icon: '💻', name: 'Languages',
    items: ['C++ (Primary)', 'Python', 'Java', 'JavaScript'],
  },
]

export default function Skills() {
  const ref = useRef(null)
  useScrollReveal(ref)

  return (
    <section id="services" className={"Skills-section"} ref={ref}>
      <div className={"Skills-header"} data-reveal>
        <div>
          <div className="section-label">// skills.map()</div>
          <h2 className="section-title">What I<br /><em>Work With</em></h2>
        </div>
        <p className="section-desc" style={{ maxWidth: 360 }}>
          Full stack capabilities with a strong frontend foundation and growing backend expertise.
        </p>
      </div>

      <div className={"Skills-grid"} data-reveal>
        {SKILLS.map((s, i) => (
          <div key={i} className={"Skills-card"}>
            <div className={"Skills-num"}>{s.num}</div>
            <div className={"Skills-icon"}>{s.icon}</div>
            <div className={"Skills-name"}>{s.name}</div>
            <ul className={"Skills-items"}>
              {s.items.map(item => <li key={item}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
