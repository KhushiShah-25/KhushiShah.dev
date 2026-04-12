import { useRef, useState, useEffect } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { supabase } from '../lib/supabase'

const CATEGORIES = ['All', 'Full Stack', 'AI / ML', 'Cyber Security', 'Blockchain', 'Frontend', 'Backend', 'Algorithm']

const FALLBACK = [
  { id: 1, title: 'E-Commerce Platform', description: 'Full-stack e-commerce app with product listings, cart, authentication, and PostgreSQL backend.', category: 'Full Stack', stack: ['React', 'Node.js', 'Express', 'PostgreSQL'], emoji: '🛒', featured: true, live_url: null, repo_url: null },
  { id: 2, title: 'Task Management App', description: 'Kanban-style productivity app with drag-and-drop, built in React with local storage persistence.', category: 'Frontend', stack: ['React.js', 'CSS', 'JavaScript'], emoji: '📋', featured: true, live_url: null, repo_url: null },
  { id: 3, title: 'Auth REST API', description: 'Secure auth system using Node.js + Express with JWT tokens and PostgreSQL user management.', category: 'Backend', stack: ['Node.js', 'Express.js', 'JWT', 'PostgreSQL'], emoji: '🔐', featured: true, live_url: null, repo_url: null },
  { id: 4, title: 'DSA Visualizer', description: 'Interactive visualizer for data structures and sorting algorithms built while learning C++ DSA.', category: 'Algorithm', stack: ['JavaScript', 'HTML', 'CSS', 'C++'], emoji: '📊', featured: true, live_url: null, repo_url: null },
]

async function fetchProjectsFromAPI() {
  // 1. Try Supabase
  if (supabase) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data && data.length) return data
    if (error) console.warn('Supabase projects error:', error.message)
  }
  // 2. Try Express backend (local dev)
  try {
    const res = await fetch('/api/projects', { signal: AbortSignal.timeout(3000) })
    if (res.ok) {
      const data = await res.json()
      if (data && data.length) return data
    }
  } catch { /* silent */ }
  return null
}

export default function Projects() {
  const ref = useRef(null)
  useScrollReveal(ref)
  const [allProjects, setAllProjects] = useState(FALLBACK)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    fetchProjectsFromAPI().then(data => {
      if (data) setAllProjects(data)
    })

    // Real-time updates via Supabase subscription
    if (!supabase) return
    const channel = supabase
      .channel('projects-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        // Re-fetch when any row changes
        fetchProjectsFromAPI().then(data => { if (data) setAllProjects(data) })
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
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
        {displayed.map((p, i) => {
          const hasLink = p.live_url && p.live_url.trim() !== ''
          const CardEl = hasLink ? 'a' : 'div'
          const cardProps = hasLink
            ? { href: p.live_url, target: '_blank', rel: 'noopener noreferrer' }
            : {}

          return (
            <CardEl
              key={p.id}
              className="Projects-card"
              data-reveal
              {...cardProps}
            >
              <div className={`Projects-img Projects-bg${(i % 4) + 1}`}>
                {p.photo_src
                  ? <img src={p.photo_src} alt={p.title} loading="lazy"
                    width="440" height="220"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span className="Projects-imgIcon" aria-hidden="true">{p.emoji}</span>
                }
                {hasLink && (
                  <div className="Projects-overlay">
                    <span className="Projects-viewBtn">View Project</span>
                  </div>
                )}
              </div>

              <div className="Projects-body">
                <div className="Projects-tag">{p.category}</div>
                <div className="Projects-title">{p.title}</div>
                <div className="Projects-desc">{p.description}</div>
                <div className="Projects-tags">
                  {(p.stack || []).map(t => (
                    <span key={t} className="Projects-ptag">{t}</span>
                  ))}
                </div>
                <div className="Projects-links">
                  {p.repo_url && p.repo_url.trim() && (
                    <a href={p.repo_url} onClick={e => e.stopPropagation()}
                      target="_blank" rel="noopener noreferrer"
                      className="Projects-repoLink">
                      ⌥ Source Code
                    </a>
                  )}
                  {hasLink && (
                    <a href={p.live_url} onClick={e => e.stopPropagation()}
                      target="_blank" rel="noopener noreferrer"
                      className="Projects-liveLink">
                      ↗ Live Demo
                    </a>
                  )}
                </div>
              </div>
            </CardEl>
          )
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: 44 }} data-reveal>
        <a href="#contact" className="btn-outline">Got a project? Let's talk →</a>
      </div>
    </section>
  )
}