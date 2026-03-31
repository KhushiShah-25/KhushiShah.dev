import { useRef, useState, useEffect } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const FALLBACK = [
  { id:1, initials:'RS', name:'Rahul Sharma',  role:'// Project Mentor, Bennett University', rating:5, body:'Khushi has an incredible eye for detail and a strong grasp of both frontend and backend technologies. She delivered clean, well-structured code every time.' },
  { id:2, initials:'AP', name:'Arjun Patel',   role:'// Classmate & Co-developer',           rating:5, body:"Great collaborator — quick to pick up new concepts and always brings energy to the team. Her React skills really elevated our project." },
]

export default function Testimonials() {
  const ref = useRef(null)
  useScrollReveal(ref)
  const [items, setItems] = useState(FALLBACK)

  useEffect(() => {
    fetch('/api/testimonials')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d) && d.length) setItems(d) })
      .catch(() => {})
  }, [])

  return (
    <section id="testimonials" className={"Testimonials-section"} ref={ref}>
      <div className={"Testimonials-header"} data-reveal>
        <div className="section-label">// feedback[]</div>
        <h2 className="section-title">What People<br /><em>Say</em></h2>
      </div>

      <div className={"Testimonials-layout"}>
        <div className={"Testimonials-main"}>
          {items.map(t => (
            <div key={t.id} className={"Testimonials-card"} data-reveal>
              <div className={"Testimonials-stars"}>{'★'.repeat(t.rating)}</div>
              <p className={"Testimonials-body"}>"{t.body}"</p>
              <div className={"Testimonials-author"}>
                <div className={"Testimonials-avatar"}>{t.initials}</div>
                <div>
                  <div className={"Testimonials-name"}>{t.name}</div>
                  <div className={"Testimonials-role"}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={"Testimonials-side"}>
          <div className={`${"Testimonials-statCard"} ${"Testimonials-accent"}`} data-reveal>
            <div className={"Testimonials-statNum"}>7+</div>
            <div className={"Testimonials-statText"}>Technologies mastered</div>
          </div>
          <div className={"Testimonials-statCard"} data-reveal>
            <div className={"Testimonials-statNum"}>10+</div>
            <div className={"Testimonials-statText"}>Projects built and shipped</div>
          </div>
          <div className={"Testimonials-statCard"} data-reveal>
            <div className={"Testimonials-statNum"}>∞</div>
            <div className={"Testimonials-statText"}>Lines of code written</div>
          </div>
        </div>
      </div>
    </section>
  )
}
