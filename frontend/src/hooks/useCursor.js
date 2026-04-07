import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

// Selectors that trigger the grow effect
const HOVER_TARGETS = [
  'a', 'button',
  '.dest-card', '.test-card', '.why-card',
  '.g-tag', '.ThemeToggle-btn', '.theme-toggle-btn',
  '.travel-card', '.g-img-v',
  '.service-card', '.about-preview-card',
  '.deck-card', '.w-card',
  '.g-masonry-img', '.gp-card', '.gp-tab',
  '.Skills-card', '.About-imgCol',
  '.Projects-card', '.Testimonials-card',
  '.FAQ-item', '.Blog-step',
  '.Contact-social', '.Navbar-cta',
  '.PhotoCarousel-card', '.PhotoCarousel-arrowBtn'
].join(', ')

export function useCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    
    // ── Skip everything on mobile ───────────────────────────────────────────
    if (isMobile) {
      window.removeEventListener('resize', handleResize)
      return
    }

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let visible = false

    // Initialize position and perfectly center anchor
    gsap.set([dot, ring], { autoAlpha: 0, xPercent: -50, yPercent: -50, x: -200, y: -200 })

    // Using gsap.quickTo guarantees performance without requestAnimationFrame race conditions
    const xDot = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" })
    const yDot = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" })
    
    const xRing = gsap.quickTo(ring, "x", { duration: 0.3, ease: "power2.out" })
    const yRing = gsap.quickTo(ring, "y", { duration: 0.3, ease: "power2.out" })

    const onMove = ({ clientX, clientY }) => {
      if (!visible) {
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.25 })
        visible = true
      }
      xDot(clientX)
      yDot(clientY)
      xRing(clientX)
      yRing(clientY)
    }

    const hide = () => visible && gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2 })
    const show = () => visible && gsap.to([dot, ring], { autoAlpha: 1, duration: 0.2 })

    const grow = () => {
      gsap.to(ring, { width: 54, height: 54, duration: 0.28, ease: 'power2.out' })
      gsap.to(dot, { scale: 0.35, duration: 0.28, ease: 'power2.out' })
    }
    const shrink = () => {
      gsap.to(ring, { width: 36, height: 36, duration: 0.28, ease: 'power2.out' })
      gsap.to(dot, { scale: 1, duration: 0.28, ease: 'power2.out' })
    }

    const attached = new WeakSet()
    const attachHovers = () => {
      document.querySelectorAll(HOVER_TARGETS).forEach(el => {
        if (attached.has(el)) return
        el.addEventListener('mouseenter', grow)
        el.addEventListener('mouseleave', shrink)
        attached.add(el)
      })
    }
    attachHovers()

    const observer = new MutationObserver(attachHovers)
    observer.observe(document.body, { childList: true, subtree: true })

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', hide)
    document.addEventListener('mouseenter', show)

    return () => {
      window.removeEventListener('resize', handleResize)
      observer.disconnect()
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', hide)
      document.removeEventListener('mouseenter', show)
    }
  }, [isMobile])

  return { dotRef, ringRef, isMobile }
}