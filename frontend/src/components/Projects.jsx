import { useRef, useState, useEffect } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { supabase } from '../lib/supabase'

const CATEGORIES = ['All', 'Full Stack', 'Frontend', 'Backend', 'Algorithm']

const FALLBACK = [
  { id: 1, title: 'E-Commerce Platform', description: 'Full-stack e-commerce app with product listings, cart, authentication, and PostgreSQL backend.', category: 'Full Stack', stack: ['React', 'Node.js', 'Express', 'PostgreSQL'], emoji: '🛒', featured: true },
  { id: 2, title: 'Task Management App', description: 'Kanban-style productivity app with drag-and-drop, built in React with local storage persistence.', category: 'Frontend', stack: ['React.js', 'CSS', 'JavaScript'], emoji: '📋', featured: true },
  { id: 3, title: 'Auth REST API', description: 'Secure auth system using Node.js + Express with JWT tokens and PostgreSQL user management.', category: 'Backend', stack: ['Node.js', 'Express.js', 'JWT', 'PostgreSQL'], emoji: '🔐', featured: true },
  { id: 4, title: 'DSA Visualizer', description: 'Interactive visualizer for data structures and sorting algorithms built while learning C++ DSA.', category: 'Algorithm', stack: ['JavaScript', 'HTML', 'CSS', 'C++'], emoji: '📊', featured: true },
]

export default function Projects() {
  const ref = useRef(null)
  useScrollReveal(ref)
  const [allProjects, setAllProjects] = useState(FALLBACK)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data && data.length) setAllProjects(data)
    }
    fetchProjects()
  }, [])

  const displayed = filter === 'All'
    ? allProjects
    : allProjects.filter(p => p.category === filter)

  return (
    <section id="projects" className="Projects-section" ref={ref}>
      <div className="Projects-header" data-reveal>
        <div>
          <div className="section-label">// projects.filter(category)</div>
          <h2 className="section-title">Featured<br /><em>Projects</em></h2>
        </div>
        <p className="section-desc" style={{ maxWidth: 340 }}>
          Builds that showcase full-stack skills, problem solving, and design sensibility.
        </p>
      </div>

      {/* ── Category filter tabs ── */}
      <div className="Projects-filters" data-reveal>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`Projects-filterBtn ${filter === cat ? 'Projects-filterActive' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {displayed.length === 0 && (
        <p style={{ fontFamily: "'Fira Code',monospace", fontSize: 12, color: 'var(--muted)', textAlign: 'center', padding: '40px 0' }}>
          // no projects in this category yet
        </p>
      )}

      <div className="Projects-grid">
        {displayed.map((p, i) => (
          <a
            key={p.id}
            href={p.live_url || '#'}
            className="Projects-card"
            data-reveal
            target={p.live_url ? '_blank' : '_self'}
            rel="noopener noreferrer"
          >
            {/* ── Project image / emoji ── */}
            <div className={`Projects-img Projects-bg${(i % 4) + 1}`}>
              {p.photo_src
                ? <img src={p.photo_src} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span className="Projects-imgIcon">{p.emoji}</span>
              }
              <div className="Projects-overlay">
                <span className="Projects-viewBtn">
                  {p.live_url ? 'View Project' : 'Coming Soon'}
                </span>
              </div>
            </div>

            {/* ── Card body ── */}
            <div className="Projects-body">
              <div className="Projects-tag">{p.category}</div>
              <div className="Projects-title">{p.title}</div>
              <div className="Projects-desc">{p.description}</div>
              <div className="Projects-tags">
                {(p.stack || []).map(t => (
                  <span key={t} className="Projects-ptag">{t}</span>
                ))}
              </div>
              {p.repo_url && (
                <a
                  href={p.repo_url}
                  onClick={e => e.stopPropagation()}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: "'Fira Code',monospace", fontSize: 10, color: 'var(--muted)', marginTop: 8, display: 'inline-block' }}
                >
                  // view source →
                </a>
              )}
            </div>
          </a>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 44 }} data-reveal>
        <a href="#contact" className="btn-outline">Got a project? Let's talk →</a>
      </div>
    </section>
  )
}