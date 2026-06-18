import * as THREE from 'three'
import { woodTexture } from '../scene/textures'

// A floating wooden shelf board with two iron brackets.
// Origin is at the board's horizontal centre, back face at local z = 0.
export function buildShelf(width: number, depth = 0.34): THREE.Group {
  const g = new THREE.Group()
  const woodMat = new THREE.MeshStandardMaterial({
    map: woodTexture({ planks: 3, vertical: false, repeat: [Math.max(1, width), 1] }),
    roughness: 0.8,
    metalness: 0.02,
  })
  const board = new THREE.Mesh(new THREE.BoxGeometry(width, 0.05, depth), woodMat)
  board.position.z = depth / 2
  board.castShadow = true
  board.receiveShadow = true
  g.add(board)

  const ironMat = new THREE.MeshStandardMaterial({ color: 0x2c2724, roughness: 0.6, metalness: 0.5 })
  for (const x of [-width / 2 + 0.18, width / 2 - 0.18]) {
    const vert = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.16, 0.02), ironMat)
    vert.position.set(x, -0.08, 0.03)
    g.add(vert)
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, depth * 0.7), ironMat)
    arm.position.set(x, -0.025, depth * 0.32)
    g.add(arm)
    const brace = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.02, 0.14), ironMat)
    brace.position.set(x, -0.1, 0.08)
    brace.rotation.x = -Math.PI / 4
    g.add(brace)
  }
  return g
}
