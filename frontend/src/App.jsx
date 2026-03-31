import { useEffect } from 'react'
import { useTheme }    from './hooks/useTheme'
import { useCursor }   from './hooks/useCursor'

import Loader       from './components/Loader'
import Navbar       from './components/Navbar'
import Cursor       from './components/Cursor'
import ThemeToggle  from './components/ThemeToggle'
import Hero         from './components/Hero'
import Gallery      from './components/Gallery'
import Skills       from './components/Skills'
import About        from './components/About'
import Projects     from './components/Projects'
import Testimonials from './components/Testimonials'
import FAQ          from './components/FAQ'
import Blog         from './components/Blog'
import Contact      from './components/Contact'
import Footer       from './components/Footer'

import './styles/global.css'

export default function App() {
  const { theme, toggle } = useTheme()
  const { dotRef, ringRef } = useCursor()

  return (
    <>
      {/* Custom cursor */}
      <Cursor dotRef={dotRef} ringRef={ringRef} />

      {/* Intro loader */}
      <Loader />

      {/* Theme toggle button */}
      <ThemeToggle theme={theme} toggle={toggle} />

      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <main>
        <Hero />
        <Gallery />
        <Skills />
        <About />
        <Projects />
        <Testimonials />
        <FAQ />
        <Blog />
        <Contact />
      </main>

      <Footer />
    </>
  )
}
