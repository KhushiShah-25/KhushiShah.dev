import { useState, useRef, useEffect, useCallback } from 'react'

// Paste your Cloudinary image links into the "src" properties below!
const PHOTOS = [
  { id: 0, label: "Moment 01", tag: "// photo_01.jpg", src: "https://res.cloudinary.com/dm2jsrej1/image/upload/q_auto/f_auto/v1775600964/5d6a09b0-524b-4b50-99e7-fe3ee6f1e61a_efc8y3.jpg", gradient: 'linear-gradient(135deg, #1a1230 0%, #2d1f5e 100%)' },
  { id: 1, label: "Moment 02", tag: "// photo_02.jpg", src: "https://res.cloudinary.com/dm2jsrej1/image/upload/q_auto/f_auto/v1775600963/3ac77b49-d87f-4596-a647-1bd9d8cc6e03_gf965b.jpg", gradient: 'linear-gradient(135deg, #120a1a 0%, #3d1254 100%)' },
  { id: 2, label: "Moment 03", tag: "// photo_03.jpg", src: "https://res.cloudinary.com/dm2jsrej1/image/upload/q_auto/f_auto/v1775600964/5d8404d5-a939-4990-bdc5-01288ce35c84_gngtm1.jpg", gradient: 'linear-gradient(135deg, #0a1420 0%, #1a3a6e 100%)' },
  { id: 3, label: "Moment 04", tag: "// photo_04.jpg", src: "https://res.cloudinary.com/dm2jsrej1/image/upload/q_auto/f_auto/v1775600964/7c1b88a6-dcbe-4fcc-9033-f4fc72429a84_p4uaek.jpg", gradient: 'linear-gradient(135deg, #1a120a 0%, #4a2e0a 100%)' },
  { id: 4, label: "Moment 05", tag: "// photo_05.jpg", src: "https://res.cloudinary.com/dm2jsrej1/image/upload/q_auto/f_auto/v1775600965/641bd7bb-d0cb-4597-a427-ebfb00965999_jpszo8.jpg", gradient: 'linear-gradient(135deg, #0a1a14 0%, #0a3d2a 100%)' },
  { id: 5, label: "Moment 06", tag: "// photo_06.jpg", src: "https://res.cloudinary.com/dm2jsrej1/image/upload/q_auto/f_auto/v1775600965/2728e168-6300-478a-8c09-70f3daceee5f_yb9xja.jpg", gradient: 'linear-gradient(135deg, #1a0a14 0%, #4a0a2a 100%)' },
  { id: 6, label: "Moment 07", tag: "// photo_07.jpg", src: "https://res.cloudinary.com/dm2jsrej1/image/upload/q_auto/f_auto/v1775600965/5535f7f4-c559-4e62-aa4a-616b3bbc13fa_qjoohp.jpg", gradient: 'linear-gradient(135deg, #101420 0%, #203060 100%)' },
  { id: 7, label: "Moment 08", tag: "// photo_08.jpg", src: "https://res.cloudinary.com/dm2jsrej1/image/upload/q_auto/f_auto/v1775600965/29786677-25a0-4c5a-85c3-71ee72e69d26_lxqfqn.jpg", gradient: 'linear-gradient(135deg, #1a1608 0%, #3a3010 100%)' },
  { id: 8, label: "Moment 09", tag: "// photo_09.jpg", src: "https://res.cloudinary.com/dm2jsrej1/image/upload/q_auto/f_auto/v1775600966/acbbb412-1e42-472c-b910-7dcd7b76c630_o1d9yg.jpg", gradient: 'linear-gradient(135deg, #081a10 0%, #0a4020 100%)' },
  { id: 9, label: "Moment 10", tag: "// photo_10.jpg", src: "https://res.cloudinary.com/dm2jsrej1/image/upload/q_auto/f_auto/v1775600966/d56a202d-0a69-4383-965d-8936af1f6fa5_fjan3p.jpg", gradient: 'linear-gradient(135deg, #180812 0%, #400820 100%)' },
]

const N = PHOTOS.length
const CARD_W = 220
const CARD_H = 320
const RADIUS = 360

export default function PhotoCarousel() {
  const [angle, setAngle] = useState(0)
  const [active, setActive] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [fullscreen, setFullscreen] = useState(null)
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef(null)
  const dragAngle = useRef(0)
  const rafRef = useRef(null)
  const lastTime = useRef(null)
  const containerRef = useRef(null)

  // Auto-rotate
  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }
    const tick = (time) => {
      if (!lastTime.current) lastTime.current = time
      const dt = time - lastTime.current
      lastTime.current = time
      setAngle(a => {
        const next = a + dt * 0.03
        const step = 360 / N
        setActive(Math.round(next / step) % N)
        return next
      })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      lastTime.current = null
    }
  }, [isPlaying])

  const snapTo = useCallback((idx) => {
    const step = 360 / N
    const target = idx * step
    setAngle(a => {
      let cur = ((a % 360) + 360) % 360
      let delta = target - cur
      if (delta > 180) delta -= 360
      if (delta < -180) delta += 360
      return a + delta
    })
    setActive(idx)
  }, [])

  const prev = () => {
    const next = (active - 1 + N) % N
    snapTo(next)
  }
  const next = () => {
    const next = (active + 1) % N
    snapTo(next)
  }

  // Touch / drag handlers
  const onPointerDown = (e) => {
    setDragging(true)
    dragStart.current = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX
    dragAngle.current = angle
    setIsPlaying(false)
  }
  const onPointerMove = useCallback((e) => {
    if (!dragging) return
    const x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX
    const diff = (dragStart.current - x) * 0.3
    setAngle(dragAngle.current + diff)
  }, [dragging])
  const onPointerUp = useCallback(() => {
    if (!dragging) return
    setDragging(false)
    const step = 360 / N
    const snapped = Math.round(angle / step)
    setActive(((snapped % N) + N) % N)
    setAngle(snapped * step)
  }, [dragging, angle])

  useEffect(() => {
    window.addEventListener('mousemove', onPointerMove)
    window.addEventListener('mouseup', onPointerUp)
    window.addEventListener('touchmove', onPointerMove)
    window.addEventListener('touchend', onPointerUp)
    return () => {
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('mouseup', onPointerUp)
      window.removeEventListener('touchmove', onPointerMove)
      window.removeEventListener('touchend', onPointerUp)
    }
  }, [onPointerMove, onPointerUp])

  const openFullscreen = (idx, e) => {
    e.stopPropagation()
    setFullscreen(idx)
    setIsPlaying(false)
  }

  const closeFullscreen = (e) => {
    e.stopPropagation()
    setFullscreen(null)
  }

  return (
    <>
      {/* ── Carousel ── */}
      <div className="PhotoCarousel-root">
        <div
          ref={containerRef}
          className="PhotoCarousel-stage"
          onMouseDown={onPointerDown}
          onTouchStart={onPointerDown}
          style={{ cursor: dragging ? 'grabbing' : 'grab' }}
        >
          <div className="PhotoCarousel-scene">
            {PHOTOS.map((photo, i) => {
              const step = 360 / N
              const cardAngle = i * step - angle
              const rad = (cardAngle * Math.PI) / 180
              const x = Math.sin(rad) * RADIUS
              const z = Math.cos(rad) * RADIUS
              const scale = Math.max(0.4, (z + RADIUS) / (2 * RADIUS))
              const opacity = 0.2 + scale * 0.8
              const isActive = i === (((Math.round(angle / step)) % N) + N) % N

              return (
                <div
                  key={photo.id}
                  className={`PhotoCarousel-card${isActive ? ' PhotoCarousel-cardActive' : ''}`}
                  style={{
                    transform: `translateX(${x}px) translateZ(${z - RADIUS}px) scale(${scale})`,
                    opacity,
                    zIndex: Math.round(scale * 100),
                    background: photo.gradient,
                  }}
                  onClick={(e) => !dragging && openFullscreen(i, e)}
                >
                  {/* Photo or Placeholder */}
                  {photo.src ? (
                    <div style={{ flex: 1, position: 'relative' }}>
                      <img
                        src={photo.src}
                        alt={photo.label}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
                      />
                    </div>
                  ) : (
                    <div className="PhotoCarousel-placeholder">
                      <span className="PhotoCarousel-initials">KS</span>
                      <span className="PhotoCarousel-imgHint">[ your photo ]</span>
                    </div>
                  )}
                  <div className="PhotoCarousel-cardBottom">
                    <div className="PhotoCarousel-cardTag">{photo.tag}</div>
                    <div className="PhotoCarousel-cardLabel">{photo.label}</div>
                  </div>
                  {isActive && (
                    <div className="PhotoCarousel-expandHint">
                      <span>↗ Click to expand</span>
                    </div>
                  )}
                  <div className="PhotoCarousel-shine" />
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Controls ── */}
        <div className="PhotoCarousel-controls">
          <button className="PhotoCarousel-arrowBtn" onClick={prev} aria-label="Previous">←</button>

          <div className="PhotoCarousel-dots">
            {PHOTOS.map((_, i) => (
              <button
                key={i}
                className={`PhotoCarousel-dot${i === active ? ' PhotoCarousel-dotActive' : ''}`}
                onClick={() => snapTo(i)}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>

          <div className="PhotoCarousel-counter">
            <span>{String(active + 1).padStart(2, '0')}</span>
            <span className="PhotoCarousel-counterDiv">/</span>
            <span>{String(N).padStart(2, '0')}</span>
          </div>

          <button
            className={`PhotoCarousel-playBtn${isPlaying ? ' PhotoCarousel-playing' : ''}`}
            onClick={() => setIsPlaying(p => !p)}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          <button className="PhotoCarousel-arrowBtn" onClick={next} aria-label="Next">→</button>
        </div>
      </div>

      {/* ── Fullscreen Modal ── */}
      {fullscreen !== null && (
        <div
          className="PhotoCarousel-modal"
          onClick={closeFullscreen}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="PhotoCarousel-modalInner"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="PhotoCarousel-closeBtn"
              onClick={closeFullscreen}
              aria-label="Close"
            >
              ✕
            </button>

            {/* Nav inside modal */}
            <button
              className="PhotoCarousel-modalNav PhotoCarousel-modalNavPrev"
              onClick={(e) => {
                e.stopPropagation()
                setFullscreen(f => (f - 1 + N) % N)
              }}
              aria-label="Previous photo"
            >←</button>

            <div
              className="PhotoCarousel-modalPhoto"
              style={{ background: PHOTOS[fullscreen].gradient }}
            >
              {PHOTOS[fullscreen].src ? (
                <div style={{ flex: 1, position: 'relative' }}>
                  <img
                    src={PHOTOS[fullscreen].src}
                    alt={PHOTOS[fullscreen].label}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
                  />
                </div>
              ) : (
                <div className="PhotoCarousel-placeholder PhotoCarousel-placeholderLarge">
                  <span className="PhotoCarousel-initialsLarge">KS</span>
                  <span className="PhotoCarousel-imgHint">[ replace with your photo ]</span>
                </div>
              )}
              <div className="PhotoCarousel-modalMeta">
                <div className="PhotoCarousel-modalTag">{PHOTOS[fullscreen].tag}</div>
                <div className="PhotoCarousel-modalLabel">{PHOTOS[fullscreen].label}</div>
              </div>
            </div>

            <button
              className="PhotoCarousel-modalNav PhotoCarousel-modalNavNext"
              onClick={(e) => {
                e.stopPropagation()
                setFullscreen(f => (f + 1) % N)
              }}
              aria-label="Next photo"
            >→</button>

            {/* Dot nav in modal */}
            <div className="PhotoCarousel-modalDots">
              {PHOTOS.map((_, i) => (
                <button
                  key={i}
                  className={`PhotoCarousel-dot${i === fullscreen ? ' PhotoCarousel-dotActive' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setFullscreen(i) }}
                  aria-label={`Photo ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* ── ROOT ── */
        .PhotoCarousel-root {
          width: 100%;
          user-select: none;
          -webkit-user-select: none;
        }

        /* ── STAGE ── */
        .PhotoCarousel-stage {
          width: 100%;
          height: 420px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .PhotoCarousel-scene {
          position: relative;
          width: ${CARD_W}px;
          height: ${CARD_H}px;
          transform-style: preserve-3d;
          perspective: 900px;
        }

        /* ── CARD ── */
        .PhotoCarousel-card {
          position: absolute;
          width: ${CARD_W}px;
          height: ${CARD_H}px;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(124,109,250,0.18);
          transition: border-color 0.3s, box-shadow 0.3s;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          will-change: transform, opacity;
          backface-visibility: hidden;
          top: 0;
          left: 0;
        }

        .PhotoCarousel-cardActive {
          border-color: rgba(124,109,250,0.5) !important;
          box-shadow: 0 0 40px rgba(124,109,250,0.2);
          cursor: pointer;
        }

        .PhotoCarousel-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%);
          pointer-events: none;
          border-radius: 20px;
        }

        /* ── PLACEHOLDER ── */
        .PhotoCarousel-placeholder {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 20px;
        }

        .PhotoCarousel-initials {
          font-family: 'Playfair Display', serif;
          font-size: 52px;
          font-weight: 900;
          color: rgba(124,109,250,0.2);
        }

        .PhotoCarousel-imgHint {
          font-family: 'Fira Code', monospace;
          font-size: 9px;
          color: rgba(124,109,250,0.35);
          letter-spacing: 0.1em;
          text-align: center;
        }

        /* ── CARD BOTTOM ── */
        .PhotoCarousel-cardBottom {
          padding: 16px 18px;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(124,109,250,0.12);
        }

        .PhotoCarousel-cardTag {
          font-family: 'Fira Code', monospace;
          font-size: 9px;
          color: rgba(124,109,250,0.7);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 3px;
        }

        .PhotoCarousel-cardLabel {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: rgba(240,238,255,0.9);
        }

        .PhotoCarousel-expandHint {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(124,109,250,0.2);
          border: 1px solid rgba(124,109,250,0.35);
          border-radius: 8px;
          padding: 4px 10px;
          font-family: 'Fira Code', monospace;
          font-size: 9px;
          color: rgba(124,109,250,0.9);
          letter-spacing: 0.08em;
          backdrop-filter: blur(8px);
          animation: fadeInHint 0.3s ease;
        }

        @keyframes fadeInHint {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── CONTROLS ── */
        .PhotoCarousel-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 28px;
          flex-wrap: wrap;
          padding: 0 16px;
        }

        .PhotoCarousel-arrowBtn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--bg3);
          border: 1px solid var(--border);
          color: var(--text);
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s;
          flex-shrink: 0;
        }
        .PhotoCarousel-arrowBtn:hover {
          border-color: var(--accent);
          color: var(--accent);
          transform: scale(1.08);
        }

        .PhotoCarousel-dots {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
          max-width: 240px;
          justify-content: center;
        }

        .PhotoCarousel-dot {
          border: none;
          padding: 0;
          width: 5px;
          height: 5px;
          border-radius: 3px;
          background: var(--muted2);
          cursor: pointer;
          transition: all 0.3s;
        }

        .PhotoCarousel-dotActive {
          width: 20px !important;
          background: var(--accent) !important;
        }

        .PhotoCarousel-counter {
          font-family: 'Fira Code', monospace;
          font-size: 11px;
          color: var(--muted);
          display: flex;
          gap: 4px;
          align-items: center;
          min-width: 50px;
          justify-content: center;
        }

        .PhotoCarousel-counterDiv {
          color: var(--muted2);
        }

        .PhotoCarousel-playBtn {
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 8px 16px;
          font-size: 13px;
          color: var(--muted);
          cursor: pointer;
          transition: all 0.25s;
        }

        .PhotoCarousel-playing {
          color: var(--accent);
          border-color: rgba(124,109,250,0.3);
        }

        .PhotoCarousel-playBtn:hover {
          border-color: var(--accent);
        }

        /* ── MODAL ── */
        .PhotoCarousel-modal {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(8,8,16,0.92);
          backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: modalIn 0.3s ease;
        }

        @keyframes modalIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .PhotoCarousel-modalInner {
          position: relative;
          width: min(500px, 90vw);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          animation: modalSlideIn 0.3s ease;
        }

        @keyframes modalSlideIn {
          from { opacity: 0; transform: scale(0.92) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .PhotoCarousel-closeBtn {
          position: absolute;
          top: -14px;
          right: -14px;
          z-index: 10;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: var(--bg3);
          border: 1px solid rgba(124,109,250,0.4);
          color: var(--text);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.25s;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }

        .PhotoCarousel-closeBtn:hover {
          background: var(--accent);
          color: #fff;
          transform: rotate(90deg) scale(1.1);
          border-color: var(--accent);
        }

        .PhotoCarousel-modalNav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(20,20,40,0.85);
          border: 1px solid rgba(124,109,250,0.35);
          color: #fff;
          font-size: 16px;
          cursor: pointer;
          z-index: 10;
          transition: all 0.25s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .PhotoCarousel-modalNavPrev {
          left: -60px;
        }

        .PhotoCarousel-modalNavNext {
          right: -60px;
        }

        .PhotoCarousel-modalNav:hover {
          background: var(--accent);
          border-color: var(--accent);
          transform: translateY(-50%) scale(1.08);
        }

        .PhotoCarousel-modalPhoto {
          width: 100%;
          aspect-ratio: 3/4;
          border-radius: 24px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          border: 1px solid rgba(124,109,250,0.25);
          box-shadow: 0 40px 100px rgba(0,0,0,0.7);
          position: relative;
          max-height: 70vh;
        }

        .PhotoCarousel-placeholderLarge {
          position: absolute;
          inset: 0;
          flex: none;
        }

        .PhotoCarousel-initialsLarge {
          font-family: 'Playfair Display', serif;
          font-size: 100px;
          font-weight: 900;
          color: rgba(124,109,250,0.15);
        }

        .PhotoCarousel-modalMeta {
          position: relative;
          z-index: 2;
          padding: 20px 24px;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(12px);
          border-top: 1px solid rgba(124,109,250,0.15);
        }

        .PhotoCarousel-modalTag {
          font-family: 'Fira Code', monospace;
          font-size: 10px;
          color: rgba(124,109,250,0.8);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .PhotoCarousel-modalLabel {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #f0eeff;
        }

        .PhotoCarousel-modalDots {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          justify-content: center;
          max-width: 280px;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 700px) {
          .PhotoCarousel-stage { height: 340px; }
          .PhotoCarousel-scene {
            width: 160px;
            height: 240px;
          }
          .PhotoCarousel-card {
            width: 160px;
            height: 240px;
            border-radius: 16px;
          }
          .PhotoCarousel-initials { font-size: 36px; }
          .PhotoCarousel-cardBottom { padding: 12px 14px; }
          .PhotoCarousel-cardLabel { font-size: 12px; }
          .PhotoCarousel-controls { gap: 10px; }
          .PhotoCarousel-arrowBtn { width: 38px; height: 38px; font-size: 14px; }
          .PhotoCarousel-modalNavPrev { left: -12px; }
          .PhotoCarousel-modalNavNext { right: -12px; }
          .PhotoCarousel-modalNav { width: 36px; height: 36px; font-size: 13px; }
          .PhotoCarousel-closeBtn { top: -10px; right: -10px; width: 36px; height: 36px; font-size: 12px; }
        }

        @media (max-width: 900px) {
          .PhotoCarousel-expandHint { display: none; }
        }
      `}</style>
    </>
  )
}