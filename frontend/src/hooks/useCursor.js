import { useEffect, useRef } from 'react'

export function useCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // Only activate on real pointer devices (not touch screens)
    const isPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!isPointer) return

    let mouseX = -200
    let mouseY = -200
    let ringX = -200
    let ringY = -200
    let raf
    let revealed = false

    // Move dot instantly to cursor position — no lag at all
    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      // Use transform: translate so element stays at top:0 left:0 in CSS
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`

      if (!revealed) {
        revealed = true
        dot.style.opacity = '1'
        ring.style.opacity = '1'
      }
    }

    // Ring chases at a fixed lerp speed every frame
    const LERP = 0.12  // lower = slower/lazier chase

    const animate = () => {
      ringX += (mouseX - ringX) * LERP
      ringY += (mouseY - ringY) * LERP
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`
      raf = requestAnimationFrame(animate)
    }

    // Start invisible until mouse enters
    dot.style.opacity = '0'
    ring.style.opacity = '0'

    document.addEventListener('mousemove', onMouseMove, { passive: true })
    raf = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return { dotRef, ringRef }
}