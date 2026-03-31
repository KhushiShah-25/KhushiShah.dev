import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, Text, Html } from '@react-three/drei'
import * as THREE from 'three'

/* ── Colour palette for each slide ── */
const SLIDE_COLORS = [
  '#1a1230', '#120a1a', '#0a1420', '#1a120a', '#0a1a14',
  '#1a0a14', '#101420', '#1a1608', '#081a10', '#180812',
]

const SLIDE_LABELS = [
  { tag: 'Photo 01', name: 'Add your photo' },
  { tag: 'Photo 02', name: 'Add your photo' },
  { tag: 'Photo 03', name: 'Add your photo' },
  { tag: 'Photo 04', name: 'Add your photo' },
  { tag: 'Photo 05', name: 'Add your photo' },
  { tag: 'Photo 06', name: 'Add your photo' },
  { tag: 'Photo 07', name: 'Add your photo' },
  { tag: 'Photo 08', name: 'Add your photo' },
  { tag: 'Photo 09', name: 'Add your photo' },
  { tag: 'Photo 10', name: 'Add your photo' },
]

const N = 10
const RADIUS = 4.8
const STEP = (2 * Math.PI) / N

/* ── Individual slide ── */
function Slide({ index, globalAngle, color, label }) {
  const meshRef = useRef()
  const baseAngle = index * STEP

  useFrame(() => {
    if (!meshRef.current) return
    const angle = baseAngle - globalAngle.current
    meshRef.current.position.x = Math.sin(angle) * RADIUS
    meshRef.current.position.z = Math.cos(angle) * RADIUS - RADIUS

    const cosVal = Math.cos(angle)
    const targetScale = 0.58 + cosVal * 0.42
    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.08)
    )
    meshRef.current.rotation.y = angle
    meshRef.current.material.opacity = THREE.MathUtils.lerp(
      meshRef.current.material.opacity,
      0.15 + ((cosVal + 1) / 2) * 0.85,
      0.08
    )
  })

  return (
    <group ref={meshRef}>
      <RoundedBox args={[2.2, 3.2, 0.05]} radius={0.18} smoothness={4}>
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.8}
          roughness={0.8}
          metalness={0.1}
        />
      </RoundedBox>

      {/* Initials placeholder */}
      <Text
        position={[0, 0.2, 0.08]}
        fontSize={0.55}
        color="#7c6dfa"
        fillOpacity={0.3}
        font="https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvUDQ.woff2"
        anchorX="center"
        anchorY="middle"
      >
        KS
      </Text>

      {/* Tag */}
      <Text
        position={[0, -1.1, 0.08]}
        fontSize={0.11}
        color="#7c6dfa"
        letterSpacing={0.15}
        font="https://fonts.gstatic.com/s/firacoderetina/v21/uU9eCBsR6Z2vfE9aq3bL0fxyUs4tcw4W_D1sJVD7MOzlojwUKQ.woff2"
        anchorX="center"
      >
        {label.tag.toUpperCase()}
      </Text>

      {/* Name */}
      <Text
        position={[0, -1.3, 0.08]}
        fontSize={0.14}
        color="#f0eeff"
        font="https://fonts.gstatic.com/s/syne/v22/8vIS7w4qzmVxsWxjBZRjr0FKM_04uQ.woff2"
        anchorX="center"
      >
        {label.name}
      </Text>
    </group>
  )
}

/* ── Camera setup ── */
function CameraSetup() {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(0, 0, 8)
    camera.fov = 50
    camera.updateProjectionMatrix()
  }, [camera])
  return null
}

/* ── Main scene ── */
function Scene({ globalAngle, running }) {
  useFrame(() => {
    if (running) globalAngle.current += 0.003
  })

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 4, 6]} intensity={1.2} color="#7c6dfa" />
      <pointLight position={[0, -4, -2]} intensity={0.4} color="#4433cc" />

      {Array.from({ length: N }).map((_, i) => (
        <Slide
          key={i}
          index={i}
          globalAngle={globalAngle}
          color={SLIDE_COLORS[i]}
          label={SLIDE_LABELS[i]}
        />
      ))}

      <CameraSetup />
    </>
  )
}

/* ── Exported component ── */
export default function PhotoCarousel() {
  const globalAngle = useRef(0)
  const [running, setRunning] = useState(true)
  const [current, setCurrent] = useState(0)

  // Update current index from angle
  useEffect(() => {
    const id = setInterval(() => {
      const norm = ((globalAngle.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
      const idx = Math.round(norm / STEP) % N
      setCurrent(idx)
    }, 100)
    return () => clearInterval(id)
  }, [])

  const snapTo = (i) => {
    const dest = i * STEP
    let cur = ((globalAngle.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
    let delta = dest - cur
    if (delta >  Math.PI) delta -= 2 * Math.PI
    if (delta < -Math.PI) delta += 2 * Math.PI
    globalAngle.current += delta
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: '520px', width: '100%' }}>
        <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
          <Scene globalAngle={globalAngle} running={running} />
        </Canvas>
      </div>

      {/* Controls */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'20px', marginTop:'32px' }}>
        <button
          onClick={() => snapTo((current - 1 + N) % N)}
          style={{ width:46,height:46,borderRadius:'50%',background:'var(--bg3)',border:'1px solid var(--border)',color:'var(--text)',fontSize:17,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer' }}
        >←</button>

        <span style={{ fontFamily:"'Fira Code',monospace",fontSize:11,color:'var(--muted)',minWidth:44,textAlign:'center' }}>
          {String(current + 1).padStart(2,'0')} / {String(N).padStart(2,'0')}
        </span>

        <div style={{ display:'flex', gap:6 }}>
          {Array.from({ length: N }).map((_, i) => (
            <div
              key={i}
              onClick={() => snapTo(i)}
              style={{
                width: i === current ? 20 : 5,
                height: 5,
                borderRadius: 3,
                background: i === current ? 'var(--accent)' : 'var(--muted2)',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>

        <button
          onClick={() => { setRunning(r => !r) }}
          style={{ fontFamily:"'Fira Code',monospace",fontSize:9,letterSpacing:'.12em',textTransform:'uppercase',color:running?'var(--muted)':'var(--accent)',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'100px',padding:'7px 14px',cursor:'pointer' }}
        >
          {running ? '⏸ Pause' : '▶ Play'}
        </button>

        <button
          onClick={() => snapTo((current + 1) % N)}
          style={{ width:46,height:46,borderRadius:'50%',background:'var(--bg3)',border:'1px solid var(--border)',color:'var(--text)',fontSize:17,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer' }}
        >→</button>
      </div>
    </div>
  )
}
