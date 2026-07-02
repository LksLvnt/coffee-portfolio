import * as THREE from 'three'

const UP = new THREE.Vector3(0, 1, 0)

// A cylinder spanning two points — used for wands/spouts so they actually point
// at their target instead of guessing rotation signs.
export function pipe(from: THREE.Vector3, to: THREE.Vector3, radius: number, mat: THREE.Material): THREE.Mesh {
  const dir = new THREE.Vector3().subVectors(to, from)
  const len = dir.length()
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, len, 14), mat)
  mesh.position.copy(from).lerp(to, 0.5)
  mesh.quaternion.setFromUnitVectors(UP, dir.normalize())
  mesh.castShadow = true
  return mesh
}

export const vec = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)
