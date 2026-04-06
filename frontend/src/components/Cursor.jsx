import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

// All elements that trigger the grow effect
const HOVER_TARGETS = [
  'a', 'button',
  '.dest-card', '.test-card', '.why-card',
  '.g-tag', '.ThemeToggle-btn',
  '.travel-card', '.g-img-v',
  '.Skills-card', '.About-imgCol',
  '.Projects-card', '.Testimonials-card',
  '.FAQ-item', '.Blog-step',
  '.Contact-social', '.Navbar-cta',
  '.PhotoCarousel-card', '.PhotoCarousel-arrowBtn',
].join(', ')

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 768
  )

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)

    // ── Skip everything on mobile / touch devices ──────────────────
    if (isMobile) {
      window.removeEventListener('resize', handleResize)
      return
    }

    // Also skip if device doesn't support fine pointer (touch screens)
    const isPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!isPointer) {
      window.removeEventListener('resize', handleResize)
      return
    }

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // ── State ──────────────────────────────────────────────────────
    let mX = -200, mY = -200
    let rX = -200, rY = -200
    let rafId
    let visible = false

    gsap.set([dot, ring], { autoAlpha: 0 })

    // ── Snappy follow for dot ──────────────────────────────────────
    const onMove = ({ clientX, clientY }) => {
      mX = clientX
      mY = clientY
      if (!visible) {
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.25 })
        visible = true
      }
      gsap.to(dot, { x: mX, y: mY, duration: 0.08, ease: 'power2.out' })
    }

    // ── Smooth lag for ring ────────────────────────────────────────
    const tickRing = () => {
      rX += (mX - rX) * 0.1
      rY += (mY - rY) * 0.1
      if (ring) ring.style.transform = `translate(${rX - 18}px, ${rY - 18}px)`
      rafId = requestAnimationFrame(tickRing)
    }
    rafId = requestAnimationFrame(tickRing)

    const hide = () => visible && gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2 })
    const show = () => visible && gsap.to([dot, ring], { autoAlpha: 1, duration: 0.2 })

    // ── Grow / shrink on hover ─────────────────────────────────────
    const grow = () => {
      gsap.to(ring, { width: 54, height: 54, duration: 0.28, ease: 'power2.out' })
      gsap.to(dot, { scale: 0.35, duration: 0.28, ease: 'power2.out' })
    }
    const shrink = () => {
      gsap.to(ring, { width: 36, height: 36, duration: 0.28, ease: 'power2.out' })
      gsap.to(dot, { scale: 1, duration: 0.28, ease: 'power2.out' })
    }

    // Attach hover listeners lazily as new elements appear in DOM
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
      cancelAnimationFrame(rafId)
      observer.disconnect()
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', hide)
      document.removeEventListener('mouseenter', show)
    }
  }, [isMobile])

  // Render nothing at all on mobile — no DOM nodes, no overhead
  if (isMobile) return null

  return (
    <>
      <div
        ref={dotRef}
        className="Cursor-dot"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 10,
          height: 10,
          background: 'var(--accent)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 999999,
          marginLeft: -5,
          marginTop: -5,
          mixBlendMode: 'screen',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        className="Cursor-ring"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          border: '1.5px solid rgba(124, 109, 250, 0.55)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 999998,
          willChange: 'transform',
        }}
      />
    </>
  )
}