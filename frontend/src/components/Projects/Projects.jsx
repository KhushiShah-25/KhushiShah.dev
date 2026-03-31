import { useRef, useState, useEffect } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const FALLBACK = [
  { id:1, title:'E-Commerce Platform',   description:'Full-stack e-commerce app with product listings, cart, authentication, and PostgreSQL backend.', category:'Full Stack', stack:['React','Node.js','Express','PostgreSQL'], emoji:'🛒' },
  { id:2, title:'Task Management App',    description:'Kanban-style productivity app with drag-and-drop, built in React with local storage persistence.', category:'Frontend',    stack:['React.js','CSS','JavaScript'], emoji:'📋' },
  { id:3, title:'Auth REST API',          description:'Secure auth system using Node.js + Express with JWT tokens and PostgreSQL user management.', category:'Backend',     stack:['Node.js','Express.js','JWT','PostgreSQL'], emoji:'🔐' },
  { id:4, title:'DSA Visualizer',         description:'Interactive visualizer for data structures and sorting algorithms built while learning C++ DSA.', category:'Algorithm',   stack:['JavaScript','HTML','CSS','C++'], emoji:'📊' },
]

export default function Projects() {
  const ref = useRef(null)
  useScrollReveal(ref)
  const [projects, setProjects] = useState(FALLBACK)

  useEffect(() => {
    fetch('/api/projects?featured=true')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length) setProjects(data) })
      .catch(() => {/* use fallback */})
  }, [])

  return (
    <section id="projects" className={"Projects-section"} ref={ref}>
      <div className={"Projects-header"} data-reveal>
        <div>
          <div className="section-label">// projects.filter(featured)</div>
          <h2 className="section-title">Featured<br /><em>Projects</em></h2>
        </div>
        <p className="section-desc" style={{ maxWidth:340 }}>
          Builds that showcase full-stack skills, problem solving, and design sensibility.
        </p>
      </div>

      <div className={"Projects-grid"}>
        {projects.map((p, i) => (
          <a key={p.id} href={p.live_url || '#'} className={"Projects-card"} data-reveal>
            <div className={`${"Projects-img"} ${styles[`bg${(i%4)+1}`]}`}>
              <span className={"Projects-imgIcon"}>{p.emoji}</span>
              <div className={"Projects-overlay"}>
                <span className={"Projects-viewBtn"}>View Project</span>
              </div>
            </div>
            <div className={"Projects-body"}>
              <div className={"Projects-tag"}>{p.category}</div>
              <div className={"Projects-title"}>{p.title}</div>
              <div className={"Projects-desc"}>{p.description}</div>
              <div className={"Projects-tags"}>
                {(p.stack || []).map(t => <span key={t} className={"Projects-ptag"}>{t}</span>)}
              </div>
            </div>
          </a>
        ))}
      </div>

      <div style={{ textAlign:'center', marginTop:44 }} data-reveal>
        <a href="#" className="btn-outline">Browse All Projects →</a>
      </div>
    </section>
  )
}
