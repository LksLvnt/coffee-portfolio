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

  // shaker cabinet doors on the front: wood panel with a raised frame + knob
  const doorMat = new THREE.MeshStandardMaterial({
    map: woodTexture({ planks: 2, vertical: true, light: '#6e4a28', dark: '#492c15', repeat: [1, 1] }),
    roughness: 0.82,
    metalness: 0.03,
  })
  const knobMat = new THREE.MeshStandardMaterial({ color: 0x2a2724, metalness: 0.6, roughness: 0.4 })
  const fw = width * 0.42
  const fh = 0.58
  for (const x of [-width / 4, width / 4]) {
    const door = new THREE.Mesh(new THREE.BoxGeometry(fw, fh, 0.03), doorMat)
    door.position.set(x, 0.42, depth / 2 + 0.012)
    g.add(door)
    // raised frame strips around the panel
    const strips: [number, number, number, number][] = [
      [fw, 0.06, 0, fh / 2 - 0.03], [fw, 0.06, 0, -fh / 2 + 0.03],
      [0.06, fh, fw / 2 - 0.03, 0], [0.06, fh, -fw / 2 + 0.03, 0],
    ]
    for (const [w, h, ox, oy] of strips) {
      const s = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.022), doorMat)
      s.position.set(x + ox, 0.42 + oy, depth / 2 + 0.03)
      g.add(s)
    }
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 12), knobMat)
    knob.position.set(x + (x < 0 ? fw / 2 - 0.06 : -fw / 2 + 0.06), 0.42, depth / 2 + 0.05)
    g.add(knob)
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
