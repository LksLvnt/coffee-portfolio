import * as THREE from 'three'

export function buildAffordance(): THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial> {
  const geo = new THREE.RingGeometry(0.14, 0.22, 32)
  const mat = new THREE.MeshBasicMaterial({
    color: 0xc9a14a,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide
  })
  const ring = new THREE.Mesh(geo, mat)
  ring.rotation.x = -Math.PI / 2
  ring.visible = false
  return ring
}