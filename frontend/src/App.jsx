import { lazy, Suspense } from 'react'
import { useTheme } from './hooks/useTheme'

import Loader from './components/Loader'
import Navbar from './components/Navbar'
import Cursor from './components/Cursor'
import ThemeToggle from './components/ThemeToggle'
import Hero from './components/Hero'

// ── Lazy-load heavy sections ──────────────────────────────────
// These are below the fold and don't affect LCP/FCP
const Gallery = lazy(() => import('./components/Gallery'))
const Skills = lazy(() => import('./components/Skills'))
const About = lazy(() => import('./components/About'))
const Projects = lazy(() => import('./components/Projects'))
const Testimonials = lazy(() => import('./components/Testimonials'))
const FAQ = lazy(() => import('./components/FAQ'))
const Blog = lazy(() => import('./components/Blog'))
const Contact = lazy(() => import('./components/Contact'))
const Footer = lazy(() => import('./components/Footer'))

// Simple section fallback — preserves layout height so no CLS
function SectionFallback() {
  return (
    <div
      style={{
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--muted)',
        fontFamily: "'Fira Code', monospace",
        fontSize: 11,
        letterSpacing: '0.1em',
      }}
    >
      // loading...
    </div>
  )
}

export default function App() {
  const { theme, toggle } = useTheme()

  return (
    <>
      <Cursor />
      <Loader />
      <ThemeToggle theme={theme} toggle={toggle} />
      <Navbar />

      {/* id="main-content" goes here so skip-link actually lands */}
      <main id="main-content">
        {/* Hero is NOT lazy — it's the LCP element */}
        <Hero />

        <Suspense fallback={<SectionFallback />}>
          <Gallery />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <Skills />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <About />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <Projects />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <Testimonials />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <FAQ />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <Blog />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <Contact />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  )
}