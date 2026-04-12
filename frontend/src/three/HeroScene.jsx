import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Fewer particles on mobile = much better mobile perf
function getParticleCount() {
  if (typeof window === 'undefined') return 300
  if (window.innerWidth <= 600) return 0    // skip on small phones
  if (window.innerWidth <= 900) return 150  // tablet
  return 400                                 // desktop (was 600)
}

function Particles({ count }) {
  const ref = useRef()

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const purple = new THREE.Color('#7c6dfa')
    const blue = new THREE.Color('#4433cc')

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
      const c = Math.random() > 0.5 ? purple : blue
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return [pos, col]
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.02
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.05
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} vertexColors transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

export default function HeroScene() {
  const [count, setCount] = useState(0) // start 0, measure after mount

  useEffect(() => {
    setCount(getParticleCount())
  }, [])

  // Don't render canvas on mobile where count = 0
  if (count === 0) return null

  return (
    <div
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        // Lower DPR ceiling saves a ton of GPU on high-dpi screens
        dpr={[1, 1.2]}
        // frameloop="demand" would be ideal but particles need continuous
        frameloop="always"
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      >
        <Particles count={count} />
      </Canvas>
    </div>
  )
}