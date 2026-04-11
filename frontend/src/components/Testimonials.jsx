import { useRef, useState, useEffect } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { supabase } from '../lib/supabase'

const FALLBACK = [
  { id: 1, initials: 'RS', name: 'Rahul Sharma', role: '// Project Mentor, Bennett University', rating: 5, body: 'Khushi has an incredible eye for detail and a strong grasp of both frontend and backend technologies. She delivered clean, well-structured code every time.' },
  { id: 2, initials: 'AP', name: 'Arjun Patel', role: '// Classmate & Co-developer', rating: 5, body: 'Great collaborator — quick to pick up new concepts and always brings energy to the team. Her React skills really elevated our project.' },
]

export default function Testimonials() {
  const ref = useRef(null)
  useScrollReveal(ref)
  const [items, setItems] = useState(FALLBACK)

  useEffect(() => {
    async function fetchTestimonials() {
      // Try Supabase first
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .order('created_at', { ascending: false })
          if (!error && data && data.length) {
            setItems(data)
            return
          }
        } catch (err) {
          console.warn('Supabase testimonials fetch failed')
        }
      }
      // Fallback to Express backend
      try {
        const res = await fetch('/api/testimonials')
        if (res.ok) {
          const data = await res.json()
          if (data && data.length) setItems(data)
        }
      } catch (err) {
        console.warn('Express backend unavailable, using fallback data')
      }
    }
    fetchTestimonials()
  }, [])

  return (
    <section id="testimonials" className="Testimonials-section" ref={ref}>
      <div className="Testimonials-header" data-reveal>
        <div className="section-label">// feedback[]</div>
        <h2 className="section-title">What People<br /><em>Say</em></h2>
      </div>

      <div className="Testimonials-layout">
        <div className="Testimonials-main">
          {items.map(t => (
            <div key={t.id} className="Testimonials-card" data-reveal>
              <div className="Testimonials-stars" aria-label={`${t.rating} out of 5 stars`}>
                {'★'.repeat(t.rating)}
              </div>
              <p className="Testimonials-body">"{t.body}"</p>
              <div className="Testimonials-author">
                <div className="Testimonials-avatar" aria-hidden="true">{t.initials}</div>
                <div>
                  <div className="Testimonials-name">{t.name}</div>
                  <div className="Testimonials-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="Testimonials-side">
          <div className="Testimonials-statCard Testimonials-accent" data-reveal>
            <div className="Testimonials-statNum">7+</div>
            <div className="Testimonials-statText">Technologies mastered</div>
          </div>
          <div className="Testimonials-statCard" data-reveal>
            <div className="Testimonials-statNum">10+</div>
            <div className="Testimonials-statText">Projects built and shipped</div>
          </div>
          <div className="Testimonials-statCard" data-reveal>
            <div className="Testimonials-statNum">∞</div>
            <div className="Testimonials-statText">Lines of code written</div>
          </div>
        </div>
      </div>
    </section>
  )
}