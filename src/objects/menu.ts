import * as THREE from 'three'
import { menuTexture } from '../scene/textures'

// Framed chalkboard menu. Faces +z; origin at the centre of the back frame.
export function buildMenu(width = 0.78, height = 1.0): THREE.Group {
  const g = new THREE.Group()

  const frameMat = new THREE.MeshStandardMaterial({ color: 0x4a3119, roughness: 0.7, metalness: 0.05 })
  const frame = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.04), frameMat)
  frame.castShadow = true
  g.add(frame)

  const board = new THREE.Mesh(
    new THREE.PlaneGeometry(width * 0.88, height * 0.9),
    new THREE.MeshStandardMaterial({ map: menuTexture(), roughness: 0.95, metalness: 0 })
  )
  board.position.z = 0.021
  g.add(board)

  return g
}
