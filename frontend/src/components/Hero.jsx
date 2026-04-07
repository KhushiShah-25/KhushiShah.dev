import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import HeroScene from '../three/HeroScene'

const STACK_CORE = ['HTML', 'CSS', 'JavaScript', 'React.js', 'Node.js', 'Express.js', 'PostgreSQL']
const STACK_SEC  = ['Python', 'C++ / DSA', 'Java']

export default function Hero() {
  const leftRef  = useRef(null)
  const photoRef = useRef(null)
  const zoneRef  = useRef(null)

  /* ── GSAP stagger entrance ── */
  useEffect(() => {
    if (!leftRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('[data-hero-item]', {
        opacity: 0,
        y: 36,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.3,
      })
    }, leftRef)
    return () => ctx.revert()
  }, [])

  /* ── 3D cursor tilt ── */
  useEffect(() => {
    const wrap = photoRef.current
    const zone = zoneRef.current
    if (!wrap || !zone) return
    const MAX = 26
    let cx = 0, cy = 0, tx = 0, ty = 0, raf

    const onMove = (e) => {
      const r = zone.getBoundingClientRect()
      tx = ((e.clientX - r.left) / r.width  * 2 - 1) * MAX
      ty = -((e.clientY - r.top)  / r.height * 2 - 1) * MAX
    }
    const onLeave = () => { tx = 0; ty = 0 }

    const loop = () => {
      cx += (tx - cx) * 0.07
      cy += (ty - cy) * 0.07
      wrap.style.transform = `rotateY(${cx}deg) rotateX(${cy}deg)`
      raf = requestAnimationFrame(loop)
    }

    zone.addEventListener('mousemove', onMove)
    zone.addEventListener('mouseleave', onLeave)
    loop()

    return () => {
      zone.removeEventListener('mousemove', onMove)
      zone.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section id="home" className={"Hero-hero"}>
      {/* R3F particle background */}
      <HeroScene />

      {/* Left content */}
      <div className={"Hero-left"} ref={leftRef}>
        <div className={"Hero-badge"} data-hero-item>
          // available for opportunities
        </div>
        <p className={"Hero-greeting"} data-hero-item>const dev = () =&gt; {'{'}</p>
        <h1 className={"Hero-name"} data-hero-item>
          Khushi<br /><em>Shah</em>
        </h1>
        <p className={"Hero-tagline"} data-hero-item>
          &ldquo;Making my place in the Future&rdquo;
        </p>
        <p className={"Hero-sub"} data-hero-item>
          Undergrad at <strong>Bennett University</strong> · Full Stack Developer
          building scalable web apps and solving complex problems with elegant code.
        </p>

        {/* Stack pills */}
        <div className={"Hero-stack"} data-hero-item>
          {STACK_CORE.map(s => <span key={s} className={"Hero-pill"}>{s}</span>)}
          {STACK_SEC.map(s  => <span key={s} className={`${"Hero-pill"} ${"Hero-secondary"}`}>{s}</span>)}
        </div>

        <div className={"Hero-actions"} data-hero-item>
          <a href="#projects" className="btn-primary">View Projects</a>
          <a href="#contact"  className="btn-outline">Get In Touch</a>
        </div>
      </div>

      {/* Right — 3D tilt photo */}
      <div className={"Hero-right"} ref={zoneRef}>
        <div className={"Hero-deco"} />
        <div className={"Hero-tiltWrap"} ref={photoRef} style={{ transformStyle:'preserve-3d' }}>
          <div className={"Hero-frame"}>
            <span className={"Hero-initials"}>KS</span>
            <span className={"Hero-photoLabel"}>[ add your photo here ]</span>
          </div>
          <div className={"Hero-chip"} style={{ top:64, right:-44 }}>React.js ⚛</div>
          <div className={"Hero-chip"} style={{ bottom:100, left:-52 }}>Node.js 🟢</div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="Hero-scroll">
        <span className="Hero-scrollText">Scroll to discover</span>
        <div className="Hero-scrollLine" />
      </div>

      {/* Stats */}
      <div className={"Hero-stats"}>
        {[['7+','Tech Skills'],['10+','Projects'],['3','Languages']].map(([n,l]) => (
          <div key={l} className={"Hero-stat"}>
            <div className={"Hero-statNum"}>{n}</div>
            <div className={"Hero-statLabel"}>{l}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
