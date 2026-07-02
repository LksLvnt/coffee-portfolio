import * as THREE from 'three'

// Rising steam wisps. buildSteam() returns a hidden group; drive it with
// updateSteam(group, intensity, time) each frame while steaming/pouring.
export function buildSteam(count = 12): THREE.Group {
  const g = new THREE.Group()
  for (let i = 0; i < count; i++) {
    const puff = new THREE.Mesh(
      new THREE.SphereGeometry(0.016 + Math.random() * 0.018, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false })
    )
    puff.userData = {
      phase: Math.random(),
      speed: 0.4 + Math.random() * 0.5,
      x: (Math.random() - 0.5) * 0.05,
      z: (Math.random() - 0.5) * 0.05,
    }
    g.add(puff)
  }
  g.visible = false
  return g
}

export function updateSteam(g: THREE.Group, intensity: number, time: number) {
  g.visible = intensity > 0.01
  if (!g.visible) return
  for (const puff of g.children as THREE.Mesh[]) {
    const d = puff.userData
    const p = (d.phase + time * 0.18 * d.speed) % 1
    const y = p * 0.34
    puff.position.set(d.x * (1 + p), y, d.z * (1 + p))
    const fade = Math.sin(p * Math.PI) // fade in then out over the rise
    ;(puff.material as THREE.MeshBasicMaterial).opacity = fade * 0.5 * intensity
    const s = 0.6 + p * 1.4
    puff.scale.setScalar(s)
  }
}
