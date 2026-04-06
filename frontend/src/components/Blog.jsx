import { useRef, useState, useEffect } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { supabase } from '../lib/supabase'

const LESSONS = [
  'CSS custom properties are the best architecture decision for theming',
  'Build in vanilla first — abstractions make sense once you feel the pain',
  'requestAnimationFrame + lerp = buttery smooth animations every time',
  'Semantic HTML is not optional — it pays off in accessibility and SEO',
  'Design systems (even tiny ones) save hours of debugging later',
  'PostgreSQL arrays (TEXT[]) are underrated for storing tag lists',
]

const FALLBACK_POSTS = [
  {
    id: 1,
    emoji: '🎨',
    phase: '// phase_01',
    title: 'Design System First',
    body: 'Before writing a single component, I set up CSS custom properties for every colour, spacing unit, and font. This saved me countless hours later when switching between dark and light themes was just one attribute change.',
    code: `[data-theme="dark"] {\n  --bg: #080810;\n  --accent: #7c6dfa;\n  --text: #f0eeff;\n}`,
    stack: ['CSS Variables', 'Theming', 'Design Tokens'],
  },
  {
    id: 2,
    emoji: '⚛️',
    phase: '// phase_02',
    title: 'React + Vite Setup',
    body: 'Chose Vite over CRA for lightning-fast HMR. Structured the project with a clear separation — hooks, three, components, styles — so every file has exactly one job.',
    code: `// vite.config.js\nexport default defineConfig({\n  plugins: [react()],\n  server: { proxy: { '/api': 'http://localhost:5000' } },\n})`,
    stack: ['React 18', 'Vite 5', 'ESM'],
  },
  {
    id: 3,
    emoji: '✨',
    phase: '// phase_03',
    title: 'GSAP Animations',
    body: 'Used GSAP ScrollTrigger for all scroll-reveal animations. The stagger effect on the hero text creates a polished "code typing" feel. Every animation fires once, then cleans up to avoid memory leaks.',
    code: `gsap.from('[data-hero-item]', {\n  opacity: 0, y: 36,\n  stagger: 0.1,\n  ease: 'power3.out',\n})`,
    stack: ['GSAP', 'ScrollTrigger', 'Performance'],
  },
  {
    id: 4,
    emoji: '🗃️',
    phase: '// phase_04',
    title: 'PostgreSQL Backend',
    body: 'Built a Node + Express REST API backed by PostgreSQL. Used connection pooling via the `pg` library and kept all SQL inline — no ORM overhead for a project this size.',
    code: `await db.query(\n  'INSERT INTO messages (name, email, message) VALUES ($1,$2,$3)',\n  [name, email, message]\n)`,
    stack: ['Node.js', 'Express', 'PostgreSQL', 'pg'],
  },
  {
    id: 5,
    emoji: '🚀',
    phase: '// phase_05',
    title: 'Deploy to Vercel + Railway',
    body: 'Frontend deployed on Vercel with a single vercel.json rewrite rule. Backend lives on Railway with a free PostgreSQL instance. Total monthly cost: $0.',
    stack: ['Vercel', 'Railway', 'CI/CD'],
  },
]

export default function Blog() {
  const containerRef = useRef(null)
  useScrollReveal(containerRef)
  const [posts, setPosts] = useState(FALLBACK_POSTS)

  useEffect(() => {
    if (!supabase) return
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: true })
      if (!error && data && data.length > 0) setPosts(data)
    }
    fetchPosts()
  }, [])

  return (
    <section id="blog" className="Blog-blog" ref={containerRef}>
      <div data-reveal>
        <div className="section-label">// devlog.md</div>
        <h2 className="section-title">
          How I Built<br /><em>This Website</em>
        </h2>
        <div className="Blog-intro">
          <blockquote className="Blog-quote">
            "I didn't just want a portfolio — I wanted a project that would push me to learn something new at every step."
          </blockquote>
          <p className="section-desc">
            Behind-the-scenes breakdown of how I designed and built this portfolio from scratch —
            every decision, every bug, every "a-ha" moment. No templates. No page builders. Just code.
          </p>
        </div>
      </div>

      <div className="Blog-timeline">
        {posts.map((step) => (
          <div key={step.id} className="Blog-step" data-reveal>
            <div className="Blog-dot">{step.emoji}</div>
            <div className="Blog-content">
              {step.phase && <div className="Blog-phase">{step.phase}</div>}
              <h3 className="Blog-stepTitle">{step.title}</h3>
              <p className="Blog-body">{step.body}</p>
              {step.code && (
                <pre className="Blog-code"><code>{step.code}</code></pre>
              )}
              {step.stack && step.stack.length > 0 && (
                <div className="Blog-stepStack">
                  {step.stack.map(t => (
                    <span key={t} className="Blog-stepTag">{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="Blog-lessons" data-reveal>
        <div className="Blog-lessonsTitle">// lessons_learned[]</div>
        <div className="Blog-lessonsGrid">
          {LESSONS.map((l, i) => (
            <div key={i} className="Blog-lesson">
              <span className="Blog-lessonBullet">✦</span>
              {l}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}