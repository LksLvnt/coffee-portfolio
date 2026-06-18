import * as THREE from 'three'
import { woodTexture } from '../scene/textures'

// The bar counter. Built so the caller positions it at floor level (base at y = 0);
// the worktop sits at y = 0.9 to match the espresso machine / grinder placement.
export function buildCounter(width = 4, depth = 0.8): THREE.Group {
  const g = new THREE.Group()

  const frontMat = new THREE.MeshStandardMaterial({
    map: woodTexture({ planks: 8, vertical: true, light: '#7a5230', dark: '#43280f', repeat: [3, 1] }),
    roughness: 0.82,
    metalness: 0.04,
  })
  const body = new THREE.Mesh(new THREE.BoxGeometry(width, 0.82, depth), frontMat)
  body.position.y = 0.41
  body.castShadow = true
  body.receiveShadow = true
  g.add(body)

  // panel reveals on the front face for a built cabinetry feel
  const grooveMat = new THREE.MeshStandardMaterial({ color: 0x2e1a0a, roughness: 0.9 })
  for (const x of [-width / 4, width / 4]) {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(width * 0.38, 0.5, 0.02), grooveMat)
    panel.position.set(x, 0.42, depth / 2 + 0.001)
    g.add(panel)
  }

  // darker solid worktop with a slight overhang
  const topMat = new THREE.MeshStandardMaterial({
    map: woodTexture({ planks: 5, vertical: false, light: '#5e3b1c', dark: '#33200d', repeat: [4, 1] }),
    roughness: 0.6,
    metalness: 0.06,
  })
  const top = new THREE.Mesh(new THREE.BoxGeometry(width + 0.12, 0.1, depth + 0.12), topMat)
  top.position.y = 0.86
  top.castShadow = true
  top.receiveShadow = true
  g.add(top)

  return g
}
