import { useCursor } from '../hooks/useCursor'

export default function Cursor() {
  const { dotRef, ringRef, isMobile } = useCursor()

  if (isMobile) return null

  return (
    <>
      <div
        ref={dotRef}
        className="custom-dot"
        style={{
          width: 8, height: 8, background: 'var(--accent)', borderRadius: '50%',
          position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 999999,
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        className="custom-ring"
        style={{
          width: 36, height: 36, border: '1.5px solid var(--accent)', borderRadius: '50%',
          position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 999998,
          willChange: 'transform',
        }}
      />
    </>
  )
}