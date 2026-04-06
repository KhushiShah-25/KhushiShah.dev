import { useEffect, useRef } from 'react'

export function useCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // Only run on pointer-capable devices
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!mq.matches) return

    let mx = -100, my = -100
    let rx = -100, ry = -100
    let raf
    let visible = false

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      // Position dot immediately (no lag)
      dot.style.left = mx + 'px'
      dot.style.top = my + 'px'

      if (!visible) {
        visible = true
        dot.style.opacity = '1'
        ring.style.opacity = '1'
      }
    }

    const loop = () => {
      // Lerp ring toward cursor
      rx += (mx - rx) * 0.14
      ry += (my - ry) * 0.14
      ring.style.left = rx + 'px'
      ring.style.top = ry + 'px'
      raf = requestAnimationFrame(loop)
    }

    // Start hidden until first move
    dot.style.opacity = '0'
    ring.style.opacity = '0'

    document.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return { dotRef, ringRef }
}