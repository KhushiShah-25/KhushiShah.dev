import { Suspense, useRef } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import PhotoCarousel from '../three/PhotoCarousel'

export default function Gallery() {
  const ref = useRef(null)
  useScrollReveal(ref)

  return (
    <section id="gallery" className={"Gallery-gallery"} ref={ref}>
      <div className={"Gallery-header"} data-reveal>
        <div className="section-label">// my.photos[]</div>
        <h2 className="section-title">
          Photo<br /><em>Gallery</em>
        </h2>
        <p className="section-desc">
          10 moments revolving in 3D space — powered by React Three Fiber.
          Replace each slot with your real photos.
        </p>
      </div>

      <div data-reveal>
        <Suspense fallback={
          <div style={{ height:520, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--muted)', fontFamily:"'Fira Code',monospace", fontSize:12 }}>
            // loading 3D carousel...
          </div>
        }>
          <PhotoCarousel />
        </Suspense>
      </div>
    </section>
  )
}
