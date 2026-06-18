import * as THREE from 'three'

export function buildPour(): THREE.Group {
  const g = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({
    color: 0x1a0c04,
    roughness: 0.2,
    transparent: true,
    opacity: 0.85
  })

  for (const x of [-0.012, 0.012]) {
    const stream = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.003, 0.12, 8), mat)
    stream.position.set(x, 0, 0)
    g.add(stream)
  }

  g.visible = false
  return g
}