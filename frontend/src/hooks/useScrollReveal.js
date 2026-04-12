import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Attach to a container ref — all children with data-reveal
 * animate in on scroll once, then stay visible.
 *
 * BUG FIX: The old version called ScrollTrigger.getAll().forEach(t => t.kill())
 * on cleanup, which destroyed EVERY trigger on the page when ANY section
 * unmounted. Now we track only the triggers created by this hook.
 */
export function useScrollReveal(containerRef) {
  useEffect(() => {
    if (!containerRef.current) return

    const elements = containerRef.current.querySelectorAll('[data-reveal]')
    const triggers = []

    elements.forEach((el, i) => {
      const anim = gsap.fromTo(
        el,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,          // slightly faster than before
          delay: i * 0.05,         // tighter stagger
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',       // start a touch earlier
            once: true,
          },
        }
      )
      if (anim.scrollTrigger) triggers.push(anim.scrollTrigger)
    })

    // Only kill THIS section's triggers on cleanup
    return () => triggers.forEach(t => t.kill())
  }, [containerRef])
}

/**
 * Single-element reveal — returns a ref.
 */
export function useReveal(delay = 0) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 90%',
            once: true,
          },
        }
      )
    })
    return () => ctx.revert()
  }, [delay])

  return ref
}