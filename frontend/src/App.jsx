import { useEffect } from 'react'
import { useTheme }    from './hooks/useTheme'
import { useCursor }   from './hooks/useCursor'

import Loader       from './components/Loader/Loader'
import Navbar       from './components/Navbar/Navbar'
import Cursor       from './components/Cursor/Cursor'
import ThemeToggle  from './components/ThemeToggle/ThemeToggle'
import Hero         from './components/Hero/Hero'
import Gallery      from './components/Gallery/Gallery'
import Skills       from './components/Skills/Skills'
import About        from './components/About/About'
import Projects     from './components/Projects/Projects'
import Testimonials from './components/Testimonials/Testimonials'
import FAQ          from './components/FAQ/FAQ'
import Blog         from './components/Blog/Blog'
import Contact      from './components/Contact/Contact'
import Footer       from './components/Footer/Footer'

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
