import { useRef } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const BUILD_STEPS = [
  {
    emoji: '🎨',
    phase: 'Phase 01 — Design',
    title: 'Starting with a vision, not a template',
    body: `I spent the first two days on paper — sketching layouts, picking a colour palette (deep indigo + violet on near-black), and defining typography. I studied reference sites to understand what made them feel premium, then deliberately built something different. The developer-aesthetic (code comments, monospace labels, syntax colours) came from wanting my personality to show through the design.`,
    code: null,
    stack: ['Figma', 'Colour Theory', 'Typography'],
  },
  {
    emoji: '🏗️',
    phase: 'Phase 02 — Structure',
    title: 'HTML first — structure before style',
    body: `I wrote all the semantic HTML before touching a single CSS rule. Every section was laid out structurally first. This discipline made the CSS phase much faster and the accessibility story much better.`,
    code: `<!-- Semantic structure wins -->
<nav>, <main>, <section id="hero">
<article> for each project card
<footer> with proper landmark roles`,
    stack: ['HTML5', 'Semantic Markup', 'Accessibility'],
  },
  {
    emoji: '💅',
    phase: 'Phase 03 — Styling',
    title: 'CSS variables, themes & the dark/light toggle',
    body: `The entire design system runs on CSS custom properties under [data-theme] selectors. This made the dark/light theme toggle trivial — just toggling an attribute on <html>. I spent a full day on the 3D carousel math — calculating translateZ and rotateY for each card based on its position in a virtual cylinder.`,
    code: `/* CSS custom properties = scalable theming */
[data-theme="dark"]  { --bg: #080810; }
[data-theme="light"] { --bg: #faf9ff; }
/* One toggle. Everything updates. */`,
    stack: ['CSS3', 'Custom Properties', '3D Transforms', 'Animations'],
  },
  {
    emoji: '⚡',
    phase: 'Phase 04 — Interactivity',
    title: 'Vanilla JS first — then migrating to React',
    body: `The SVG loader, 3D cursor tilt, carousel physics, and scroll reveals were all built in vanilla JS first. This forced me to truly understand what each animation was doing before abstracting it into a React hook. The cursor tilt uses a lerp loop on requestAnimationFrame for silky smooth tracking.`,
    code: `// lerp — the secret to smooth animations
function lerp(a, b, t) {
  return a + (b - a) * t;
}
// called 60x/sec via rAF`,
    stack: ['JavaScript', 'rAF', 'Math / Lerp', 'IntersectionObserver'],
  },
  {
    emoji: '⚛️',
    phase: 'Phase 05 — React Migration',
    title: 'Componentising everything with React + GSAP + R3F',
    body: `The production version uses React (Vite) with GSAP for orchestrated scroll animations, React Three Fiber for the 3D carousel and hero particle field, and custom hooks (useTheme, useCursor, useScrollReveal) to keep components clean. Each section is its own component with lazy loading.`,
    code: null,
    stack: ['React.js', 'React Three Fiber', 'GSAP / ScrollTrigger', 'Vite', 'Custom Hooks'],
  },
  {
    emoji: '🗄️',
    phase: 'Phase 06 — Backend',
    title: 'Node.js + Express + PostgreSQL backend',
    body: `The backend powers the contact form, stores projects in PostgreSQL, and exposes REST endpoints consumed by the React frontend. I designed the schema to be extensible — projects, testimonials, and blog posts all live in the DB so I can update them without touching code.`,
    code: `-- PostgreSQL schema (simplified)
CREATE TABLE projects (
  id       SERIAL PRIMARY KEY,
  title    VARCHAR(120),
  stack    TEXT[],
  live_url TEXT
);`,
    stack: ['Node.js', 'Express.js', 'PostgreSQL', 'REST API', 'pg (node-postgres)'],
  },
  {
    emoji: '🚀',
    phase: 'Phase 07 — Deploy & Iterate',
    title: 'Shipping, getting feedback, and improving',
    body: `Deployed the frontend on Vercel and the backend on Railway with a managed PostgreSQL instance. After going live I iterated on performance — added lazy loading, deferred non-critical JS, and compressed all assets. Lighthouse score went from 74 → 96.`,
    code: null,
    stack: ['Vercel', 'Railway', 'Lighthouse', 'Performance'],
  },
]

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

  return (
    <section id="blog" className={"Blog-blog"} ref={containerRef}>
      <div data-reveal>
        <div className="section-label">// devlog.md</div>
        <h2 className="section-title">
          How I Built<br /><em>This Website</em>
        </h2>
        <div className={"Blog-intro"}>
          <blockquote className={"Blog-quote"}>
            "I didn't just want a portfolio — I wanted a project that would push me to learn something new at every step."
          </blockquote>
          <p className="section-desc">
            Behind-the-scenes breakdown of how I designed and built this portfolio from scratch — every decision, every bug, every "a-ha" moment. No templates. No page builders. Just code.
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className={"Blog-timeline"}>
        {BUILD_STEPS.map((step, i) => (
          <div key={i} className={"Blog-step"} data-reveal>
            <div className={"Blog-dot"}>{step.emoji}</div>
            <div className={"Blog-content"}>
              <div className={"Blog-phase"}>{step.phase}</div>
              <h3 className={"Blog-stepTitle"}>{step.title}</h3>
              <p className={"Blog-body"}>{step.body}</p>

              {step.code && (
                <pre className={"Blog-code"}><code>{step.code}</code></pre>
              )}

              <div className={"Blog-stepStack"}>
                {step.stack.map(t => (
                  <span key={t} className={"Blog-stepTag"}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lessons */}
      <div className={"Blog-lessons"} data-reveal>
        <div className={"Blog-lessonsTitle"}>// lessons_learned[]</div>
        <div className={"Blog-lessonsGrid"}>
          {LESSONS.map((l, i) => (
            <div key={i} className={"Blog-lesson"}>
              <span className={"Blog-lessonBullet"}>✦</span>
              {l}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
