import * as THREE from 'three'

const GREENS = [0x3f6b32, 0x4f7d3a, 0x5c8a3f, 0x35602c, 0x6b9a44, 0x2f5526]
const TERRACOTTA = [0xb5612f, 0xa9542b, 0xc06a38, 0x9c4a26]

const rand = (a: number, b: number) => a + Math.random() * (b - a)
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]

function leafMat(color: number) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0, flatShading: true })
}

function terracottaPot(radius: number, height: number) {
  const g = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: pick(TERRACOTTA), roughness: 0.9, metalness: 0 })
  const body = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 0.72, height, 18), mat)
  body.position.y = height / 2
  body.castShadow = true
  g.add(body)
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.08, radius * 1.02, height * 0.16, 18), mat)
  rim.position.y = height * 0.92
  g.add(rim)
  // soil
  const soil = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.96, radius * 0.96, height * 0.1, 16),
    new THREE.MeshStandardMaterial({ color: 0x2b1d10, roughness: 1 })
  )
  soil.position.y = height * 0.9
  g.add(soil)
  return g
}

function blob(radius: number, color: number) {
  const m = new THREE.Mesh(new THREE.IcosahedronGeometry(radius, 0), leafMat(color))
  m.castShadow = true
  return m
}

// A bushy foliage cluster of faceted blobs.
function bushy(scale: number, top: number) {
  const g = new THREE.Group()
  const n = 6 + Math.floor(Math.random() * 5)
  for (let i = 0; i < n; i++) {
    const r = rand(0.05, 0.1) * scale
    const b = blob(r, pick(GREENS))
    b.position.set(rand(-0.12, 0.12) * scale, top + rand(0, 0.18) * scale, rand(-0.12, 0.12) * scale)
    b.scale.y = rand(0.7, 1.1)
    g.add(b)
  }
  return g
}

// Upright spiky leaves (snake-plant / aloe).
function spiky(scale: number, top: number) {
  const g = new THREE.Group()
  const n = 7 + Math.floor(Math.random() * 5)
  for (let i = 0; i < n; i++) {
    const h = rand(0.18, 0.34) * scale
    const blade = new THREE.Mesh(new THREE.ConeGeometry(0.018 * scale, h, 5), leafMat(pick(GREENS)))
    blade.castShadow = true
    const a = (i / n) * Math.PI * 2
    blade.position.set(Math.cos(a) * 0.04 * scale, top + h / 2, Math.sin(a) * 0.04 * scale)
    blade.rotation.z = Math.cos(a) * rand(0.1, 0.35)
    blade.rotation.x = -Math.sin(a) * rand(0.1, 0.35)
    g.add(blade)
  }
  return g
}

// Arching fern blades.
function fern(scale: number, top: number) {
  const g = new THREE.Group()
  const n = 9 + Math.floor(Math.random() * 5)
  for (let i = 0; i < n; i++) {
    const len = rand(0.22, 0.36) * scale
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.02 * scale, len, 0.006), leafMat(pick(GREENS)))
    const a = (i / n) * Math.PI * 2
    blade.position.set(Math.cos(a) * 0.05 * scale, top + len * 0.32, Math.sin(a) * 0.05 * scale)
    blade.rotation.z = Math.cos(a) * 0.9
    blade.rotation.x = -Math.sin(a) * 0.9
    blade.castShadow = true
    g.add(blade)
  }
  return g
}

// Vines trailing downward over a pot/shelf edge.
function trailing(scale: number, top: number) {
  const g = new THREE.Group()
  g.add(bushy(scale * 0.8, top))
  const n = 4 + Math.floor(Math.random() * 3)
  for (let i = 0; i < n; i++) {
    const len = rand(0.25, 0.6) * scale
    const a = Math.random() * Math.PI * 2
    const x = Math.cos(a) * 0.1 * scale
    const z = Math.sin(a) * 0.1 * scale
    const segs = 4 + Math.floor(len * 8)
    for (let s = 0; s < segs; s++) {
      const leaf = blob(rand(0.018, 0.032) * scale, pick(GREENS))
      const drop = (s / segs) * len
      leaf.position.set(x + Math.sin(s * 0.9) * 0.03 * scale, top - drop, z + Math.cos(s * 0.9) * 0.03 * scale)
      leaf.scale.set(1, 0.6, 1)
      g.add(leaf)
    }
  }
  return g
}

export type PlantStyle = 'bushy' | 'spiky' | 'fern' | 'trailing'

export function buildPottedPlant(opts: { style?: PlantStyle; scale?: number } = {}): THREE.Group {
  const scale = opts.scale ?? 1
  const style = opts.style ?? pick<PlantStyle>(['bushy', 'spiky', 'fern', 'trailing'])
  const g = new THREE.Group()
  const potR = rand(0.07, 0.1) * scale
  const potH = rand(0.1, 0.14) * scale
  g.add(terracottaPot(potR, potH))
  const foliage =
    style === 'spiky' ? spiky(scale, potH * 0.9) :
    style === 'fern' ? fern(scale, potH * 0.9) :
    style === 'trailing' ? trailing(scale, potH * 0.95) :
    bushy(scale, potH * 0.9)
  g.add(foliage)
  g.userData.style = style
  return g
}

// Hanging basket: origin sits at the ceiling anchor, foliage drapes below.
export function buildHangingPlant(cordLen = 0.9, scale = 1): THREE.Group {
  const g = new THREE.Group()
  const cordMat = new THREE.MeshStandardMaterial({ color: 0x6b5436, roughness: 1 })
  const basketY = -cordLen
  // three macramé cords
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, cordLen, 5), cordMat)
    cord.position.set(Math.cos(a) * 0.07 * scale, basketY + cordLen / 2, Math.sin(a) * 0.07 * scale)
    cord.rotation.z = -Math.cos(a) * 0.13
    cord.rotation.x = Math.sin(a) * 0.13
    g.add(cord)
  }
  const basket = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13 * scale, 0.09 * scale, 0.12 * scale, 16),
    new THREE.MeshStandardMaterial({ color: 0x9c7b4a, roughness: 0.95 })
  )
  basket.position.y = basketY
  basket.castShadow = true
  g.add(basket)
  g.add(trailing(scale, basketY + 0.05 * scale))
  return g
}

// Large statement plant (fiddle-leaf style) in a woven basket on the floor.
export function buildFloorPlant(): THREE.Group {
  const g = new THREE.Group()
  const basket = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.26, 0.5, 20),
    new THREE.MeshStandardMaterial({ color: 0x9c7b4a, roughness: 0.95 })
  )
  basket.position.y = 0.25
  basket.castShadow = true
  g.add(basket)

  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a4326, roughness: 0.9 })
  for (let s = 0; s < 3; s++) {
    const h = rand(1.1, 1.7)
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, h, 8), trunkMat)
    const lean = rand(-0.15, 0.15)
    trunk.position.set(rand(-0.08, 0.08), 0.4 + h / 2, rand(-0.08, 0.08))
    trunk.rotation.z = lean
    trunk.castShadow = true
    g.add(trunk)
    const leaves = 5 + Math.floor(Math.random() * 4)
    for (let i = 0; i < leaves; i++) {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(rand(0.1, 0.16), 8, 6), leafMat(pick(GREENS)))
      leaf.scale.set(1, 1.5, 0.18)
      leaf.position.set(
        lean * h * 0.5 + rand(-0.18, 0.18),
        0.4 + h * rand(0.45, 1.0),
        rand(-0.18, 0.18)
      )
      leaf.rotation.set(rand(-0.6, 0.6), rand(0, Math.PI), rand(-0.5, 0.5))
      leaf.castShadow = true
      g.add(leaf)
    }
  }
  return g
}
