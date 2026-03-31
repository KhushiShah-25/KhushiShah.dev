import { useState, useEffect, useCallback } from 'react'

const NAV_ITEMS = [
  { label: 'Home',       href: '#home' },
  { label: 'Gallery',    href: '#gallery' },
  { label: 'Skills',     href: '#services' },
  { label: 'Projects',   href: '#projects' },
  { label: 'Build Blog', href: '#blog' },
  { label: 'Contact',    href: '#contact' },
]

export default function Navbar() {
  const [active,    setActive]  = useState('home')
  const [drawerOpen, setDrawer] = useState(false)
  const [scrolled,   setScrolled] = useState(false)

  /* ── Smooth scroll helper ── */
  const scrollTo = useCallback((href, e) => {
    if (e) e.preventDefault()
    const target = document.querySelector(href)
    if (!target) return
    const navH = document.getElementById('mainNav')?.offsetHeight ?? 68
    const top = target.getBoundingClientRect().top + window.scrollY - navH - 8
    window.scrollTo({ top, behavior: 'smooth' })
    setDrawer(false)
  }, [])

  /* ── Active section on scroll ── */
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('section[id]'))
    const navH = document.getElementById('mainNav')?.offsetHeight ?? 68

    const onScroll = () => {
      setScrolled(window.scrollY > 50)
      const scrollY = window.scrollY + navH + 20
      let cur = 'home'
      sections.forEach(s => { if (scrollY >= s.offsetTop) cur = s.id })
      setActive(cur)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── Close drawer on outside click ── */
  useEffect(() => {
    if (!drawerOpen) return
    const handler = (e) => {
      if (!e.target.closest(`#mainNav`) && !e.target.closest(`.${"Navbar-drawer"}`)) {
        setDrawer(false)
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [drawerOpen])

  return (
    <>
      <nav
        id="mainNav"
        className={`${"Navbar-nav"} ${scrolled ? "Navbar-scrolled" : ''}`}
      >
        {/* Logo */}
        <a href="#home" className={"Navbar-logo"} onClick={e => scrollTo('#home', e)}>
          <div className={"Navbar-avatar"}>KS</div>
          <span className={"Navbar-name"}>Khushi Shah</span>
          <span className={"Navbar-role"}>// Full Stack Dev</span>
        </a>

        {/* Desktop links */}
        <ul className={"Navbar-links"}>
          {NAV_ITEMS.map(item => (
            <li key={item.href}>
              <a
                href={item.href}
                className={`${"Navbar-link"} ${active === item.href.slice(1) ? "Navbar-active" : ''}`}
                onClick={e => scrollTo(item.href, e)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#contact"
          className={"Navbar-cta"}
          onClick={e => scrollTo('#contact', e)}
        >
          Hire Me
        </a>

        {/* Hamburger */}
        <button
          className={`${"Navbar-hamburger"} ${drawerOpen ? "Navbar-open" : ''}`}
          onClick={() => setDrawer(v => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`${"Navbar-drawer"} ${drawerOpen ? "Navbar-drawerOpen" : ''}`}>
        <ul>
          {NAV_ITEMS.map(item => (
            <li key={item.href}>
              <a
                href={item.href}
                className={"Navbar-drawerLink"}
                onClick={e => scrollTo(item.href, e)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          className={"Navbar-drawerCta"}
          onClick={e => scrollTo('#contact', e)}
        >
          Hire Me
        </a>
      </div>
    </>
  )
}
