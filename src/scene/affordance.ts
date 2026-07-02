import * as THREE from 'three'

// Interaction affordance: a soft pulsing ring plus a bright arc that fills
// clockwise with hold progress. Drive it via userData.update(time) and
// userData.setProgress(t) — the workflow calls both each frame.
export function buildAffordance(): THREE.Group {
  const g = new THREE.Group()

  const base = new THREE.Mesh(
    new THREE.RingGeometry(0.15, 0.21, 48),
    new THREE.MeshBasicMaterial({ color: 0xc9a14a, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
  )
  base.rotation.x = -Math.PI / 2
  g.add(base)

  const SEGS = 64
  const arcGeo = new THREE.RingGeometry(0.145, 0.215, SEGS, 1, Math.PI / 2, Math.PI * 2)
  const arc = new THREE.Mesh(
    arcGeo,
    new THREE.MeshBasicMaterial({ color: 0xf3cf7a, transparent: true, opacity: 0.95, side: THREE.DoubleSide })
  )
  arc.rotation.x = -Math.PI / 2
  arc.position.y = 0.002
  arcGeo.setDrawRange(0, 0)
  g.add(arc)

  g.visible = false
  g.userData.update = (time: number) => {
    const m = base.material as THREE.MeshBasicMaterial
    m.opacity = 0.28 + Math.sin(time * 3) * 0.14
  }
  g.userData.setProgress = (t: number) => {
    arcGeo.setDrawRange(0, Math.floor(THREE.MathUtils.clamp(t, 0, 1) * SEGS) * 6)
  }
  return g
}
