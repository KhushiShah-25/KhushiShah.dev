import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const LETTER_IDS = ['l0','l1','l2','l3','l4','l5','l6','l7','l8','l9']

export default function Loader() {
  const [hidden, setHidden] = useState(false)
  const [progress, setProgress] = useState(0)
  const svgRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current) return
    const paths = LETTER_IDS.map(id => svgRef.current.querySelector(`#${id}`)).filter(Boolean)

    // Initialise dash offsets
    paths.forEach(p => {
      let len = 180
      try { len = p.getTotalLength() } catch {}
      p.style.strokeDasharray  = len
      p.style.strokeDashoffset = len
    })

    // Stagger animate each letter
    const tl = gsap.timeline({
      delay: 0.4,
      onComplete: () => setTimeout(() => setHidden(true), 500),
    })

    paths.forEach((p, i) => {
      let len = 180
      try { len = p.getTotalLength() } catch {}

      tl.to(p, {
        strokeDashoffset: 0,
        duration: 0.28,
        ease: 'power3.out',
        onComplete: () => {
          gsap.to(p, { fill: 'var(--accent)', duration: 0.3 })
          setProgress(Math.round(((i + 1) / paths.length) * 100))
        },
      }, i * 0.06)
    })

    return () => tl.kill()
  }, [])

  if (hidden) return null

  return (
    <div className={`${"Loader-loader"} ${hidden ? "Loader-hidden" : ''}`}>
      <p className={"Loader-eyebrow"}>// initialising portfolio ...</p>

      {/* SVG perfectly centred */}
      <div className={"Loader-svgWrap"}>
        <svg
          ref={svgRef}
          className={"Loader-svg"}
          viewBox="0 0 620 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* K */}
          <path className={"Loader-ltr"} id="l0" d="M 65 12 L 65 88  M 65 50 L 97 12  M 65 50 L 99 88"/>
          {/* H */}
          <path className={"Loader-ltr"} id="l1" d="M 113 12 L 113 88  M 113 50 L 149 50  M 149 12 L 149 88"/>
          {/* U */}
          <path className={"Loader-ltr"} id="l2" d="M 164 12 L 164 65 Q 164 90 184 90 Q 204 90 204 65 L 204 12"/>
          {/* S */}
          <path className={"Loader-ltr"} id="l3" d="M 248 22 Q 231 10 214 19 Q 196 31 216 50 Q 248 63 244 78 Q 240 94 220 94 Q 206 94 198 83"/>
          {/* H */}
          <path className={"Loader-ltr"} id="l4" d="M 262 12 L 262 88  M 262 50 L 298 50  M 298 12 L 298 88"/>
          {/* I */}
          <path className={"Loader-ltr"} id="l5" d="M 318 12 L 318 88  M 308 12 L 328 12  M 308 88 L 328 88"/>
          {/* S */}
          <path className={"Loader-ltr"} id="l6" d="M 392 22 Q 375 10 358 19 Q 340 31 360 50 Q 392 63 388 78 Q 384 94 364 94 Q 350 94 342 83"/>
          {/* H */}
          <path className={"Loader-ltr"} id="l7" d="M 406 12 L 406 88  M 406 50 L 442 50  M 442 12 L 442 88"/>
          {/* A */}
          <path className={"Loader-ltr"} id="l8" d="M 458 88 L 480 12 L 502 88  M 467 63 L 493 63"/>
          {/* H */}
          <path className={"Loader-ltr"} id="l9" d="M 516 12 L 516 88  M 516 50 L 552 50  M 552 12 L 552 88"/>
        </svg>
      </div>

      <div className={"Loader-bottom"}>
        <div className={"Loader-bar"}>
          <div className={"Loader-fill"} style={{ width: `${progress}%` }} />
        </div>
        <span className={"Loader-pct"}>{progress}%</span>
      </div>
    </div>
  )
}
