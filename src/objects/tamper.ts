import * as THREE from 'three'

// A tamper. Origin at the flat base; presses straight down onto the grounds.
export function buildTamper(): THREE.Group {
  const g = new THREE.Group()
  const metal = new THREE.MeshStandardMaterial({ color: 0xcdcdcf, metalness: 0.92, roughness: 0.24 })
  const wood = new THREE.MeshStandardMaterial({ color: 0x4a3119, roughness: 0.7 })

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.022, 24), metal)
  base.castShadow = true
  g.add(base)

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.02, 0.05, 16), metal)
  stem.position.y = 0.035
  g.add(stem)

  const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.03, 0.07, 20), wood)
  knob.position.y = 0.095
  knob.castShadow = true
  g.add(knob)

  return g
}
