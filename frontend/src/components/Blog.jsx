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

export default function Blog() {
  const containerRef = useRef(null)
  useScrollReveal(containerRef)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: true })
      if (!error && data) setPosts(data)
      setLoading(false)
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

      {/* ── Timeline ── */}
      {loading && (
        <p style={{ fontFamily: "'Fira Code',monospace", fontSize: 12, color: 'var(--muted)', padding: '40px 0' }}>
          // loading devlog...
        </p>
      )}

      {!loading && (
        <div className="Blog-timeline">
          {posts.map((step, i) => (
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
      )}

      {/* ── Lessons ── */}
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