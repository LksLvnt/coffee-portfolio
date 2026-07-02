import * as THREE from 'three'
import { buildShelf } from './shelf'
import { buildPottedPlant, buildHangingPlant, buildFloorPlant, type PlantStyle } from './plant'
import { buildMenu } from './menu'
import { buildJar } from './jar'
import { buildArmchair, buildSideTable } from './armchair'
import { posterTexture } from '../scene/textures'

const rand = (a: number, b: number) => a + Math.random() * (b - a)

// Unlit pendant bulb (emissive only — the real light source is the main Edison bulb).
function pendant(cordLen: number): THREE.Group {
  const g = new THREE.Group()
  const cord = new THREE.Mesh(
    new THREE.CylinderGeometry(0.007, 0.007, cordLen, 8),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8 })
  )
  cord.position.y = -cordLen / 2
  g.add(cord)
  const socket = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.04, 0.08, 14),
    new THREE.MeshStandardMaterial({ color: 0x2a2520, metalness: 0.5, roughness: 0.5 })
  )
  socket.position.y = -cordLen - 0.03
  g.add(socket)
  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 18, 18),
    new THREE.MeshStandardMaterial({
      color: 0xffcc55, emissive: 0xffaa33, emissiveIntensity: 2.4,
      transparent: true, opacity: 0.92, roughness: 0.1,
    })
  )
  bulb.position.y = -cordLen - 0.11
  g.add(bulb)
  return g
}

// Framed wall poster; faces +z, hang by its centre.
function framedPoster(word: string, accent?: string): THREE.Group {
  const g = new THREE.Group()
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(0.46, 0.6, 0.035),
    new THREE.MeshStandardMaterial({ color: 0x3c2814, roughness: 0.7 })
  )
  frame.castShadow = true
  g.add(frame)
  const print = new THREE.Mesh(
    new THREE.PlaneGeometry(0.4, 0.53),
    new THREE.MeshStandardMaterial({ map: posterTexture(word, accent), roughness: 0.9 })
  )
  print.position.z = 0.019
  g.add(print)
  return g
}

// Simple café wall clock; faces +z.
function wallClock(): THREE.Group {
  const g = new THREE.Group()
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(0.15, 0.018, 12, 36),
    new THREE.MeshStandardMaterial({ color: 0x2c2724, metalness: 0.4, roughness: 0.5 })
  )
  g.add(rim)
  const face = new THREE.Mesh(
    new THREE.CircleGeometry(0.145, 32),
    new THREE.MeshStandardMaterial({ color: 0xf0e8d6, roughness: 0.8 })
  )
  face.position.z = -0.005
  g.add(face)
  const handMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a })
  const hour = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.075, 0.006), handMat)
  hour.position.set(0.02, 0.028, 0.004)
  hour.rotation.z = -0.6
  g.add(hour)
  const minute = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.115, 0.006), handMat)
  minute.position.set(-0.015, 0.05, 0.006)
  minute.rotation.z = 0.3
  g.add(minute)
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.01, 12), handMat)
  hub.rotation.x = Math.PI / 2
  hub.position.z = 0.008
  g.add(hub)
  return g
}

// Wooden console table against the left wall (as in the reference), base at y = 0.
function consoleTable(): THREE.Group {
  const g = new THREE.Group()
  const wood = new THREE.MeshStandardMaterial({ color: 0x5a3a1e, roughness: 0.75 })
  const top = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.05, 1.1), wood)
  top.position.y = 0.72
  top.castShadow = true
  top.receiveShadow = true
  g.add(top)
  const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.04, 1.02), wood)
  shelf.position.y = 0.3
  g.add(shelf)
  for (const [x, z] of [[-0.17, 0.5], [0.17, 0.5], [-0.17, -0.5], [0.17, -0.5]]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.72, 0.05), wood)
    leg.position.set(x, 0.36, z)
    g.add(leg)
  }
  return g
}

// Cake stand with a glass dome and a few pastries; base at y = 0.
function cakeStand(): THREE.Group {
  const g = new THREE.Group()
  const porcelain = new THREE.MeshStandardMaterial({ color: 0xf0e8d8, roughness: 0.5 })
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.035, 0.07, 14), porcelain)
  stem.position.y = 0.035
  g.add(stem)
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.115, 0.014, 26), porcelain)
  plate.position.y = 0.077
  plate.castShadow = true
  g.add(plate)
  const pastryMat = new THREE.MeshStandardMaterial({ color: 0xc98f4e, roughness: 0.8 })
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 8), pastryMat)
    p.scale.set(1.3, 0.75, 0.9)
    p.position.set(Math.cos(a) * 0.055, 0.105, Math.sin(a) * 0.055)
    p.rotation.y = a
    g.add(p)
  }
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.115, 22, 14, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0xd7e6e0, transparent: true, opacity: 0.22, roughness: 0.05 })
  )
  dome.position.y = 0.085
  g.add(dome)
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 10), porcelain)
  knob.position.y = 0.208
  g.add(knob)
  return g
}

// Distribute potted plants along a shelf board, with trailing ones near the front edge.
function dressShelf(group: THREE.Group, shelfY: number, count: number, spanX: number) {
  const styles: PlantStyle[] = ['bushy', 'spiky', 'fern', 'trailing', 'bushy', 'trailing']
  for (let i = 0; i < count; i++) {
    const style = styles[i % styles.length]
    const trailing = style === 'trailing'
    const plant = buildPottedPlant({ style, scale: rand(0.85, 1.15) })
    const x = -spanX + (2 * spanX) * (i / (count - 1)) + rand(-0.08, 0.08)
    plant.position.set(x, shelfY + 0.025, trailing ? -2.62 : -2.76)
    plant.rotation.y = rand(0, Math.PI * 2)
    group.add(plant)
  }
}

// All set-dressing: shelves + greenery, menu board, jars, floor plants, the reading nook.
export function buildDecor(): THREE.Group {
  const decor = new THREE.Group()

  // two floating shelves on the back wall, above the bar
  const shelfA = buildShelf(4.4)
  shelfA.position.set(0, 2.15, -2.94)
  decor.add(shelfA)
  const shelfB = buildShelf(3.6)
  shelfB.position.set(0, 2.92, -2.94)
  decor.add(shelfB)

  dressShelf(decor, 2.15, 7, 1.9)
  dressShelf(decor, 2.92, 6, 1.5)

  // hanging baskets framing the top of the frame
  const hangers: [number, number, number, number][] = [
    [-2.6, -0.5, 1.0, 1.0],
    [2.5, -1.4, 1.2, 1.05],
    [-1.4, -2.4, 0.8, 0.85],
    [1.9, 0.7, 1.5, 1.1],
  ]
  for (const [x, z, len, s] of hangers) {
    const h = buildHangingPlant(len, s)
    h.position.set(x, 4.2, z)
    decor.add(h)
  }

  // chalkboard menu, mounted on the back wall to the right of the machine
  const menu = buildMenu()
  menu.position.set(1.75, 1.6, -2.93)
  decor.add(menu)

  // coffee jars along the counter
  const jarSpecs: [string, number, number, number][] = [
    ['COFFEE', 0.22, 1.55, -1.22],
    ['HOUSE', 0.19, 1.8, -1.12],
    ['BEANS', 0.2, -1.9, -1.1],
  ]
  for (const [label, h, x, z] of jarSpecs) {
    const jar = buildJar(label, h)
    jar.position.set(x, 0.9, z)
    decor.add(jar)
  }

  // statement floor plants
  const leftPlant = buildFloorPlant()
  leftPlant.position.set(-3.0, 0, 0.4)
  decor.add(leftPlant)
  const rightPlant = buildFloorPlant()
  rightPlant.position.set(3.1, 0, -0.2)
  rightPlant.scale.setScalar(0.9)
  decor.add(rightPlant)

  // reading nook on the right
  const chair = buildArmchair()
  chair.position.set(2.6, 0, 1.5)
  chair.rotation.y = -Math.PI / 2 - 0.45
  decor.add(chair)

  const table = buildSideTable()
  table.position.set(3.05, 0, 0.9)
  decor.add(table)

  // extra pendant bulbs over the bar (emissive only; the centre one is the real light)
  for (const [x, len] of [[-1.5, 1.05], [1.5, 1.2]]) {
    const p = pendant(len)
    p.position.set(x, 4.2, -0.7)
    decor.add(p)
  }

  // framed posters — back wall flanks and the left wall
  const posterA = framedPoster('COFFEE')
  posterA.position.set(-2.75, 1.85, -2.95)
  decor.add(posterA)
  const posterB = framedPoster('FRESH', '#4c6b3a')
  posterB.position.set(2.9, 1.7, -2.95)
  decor.add(posterB)
  const posterC = framedPoster('BREW', '#31536b')
  posterC.position.set(-3.56, 2.0, 0.1)
  posterC.rotation.y = Math.PI / 2
  decor.add(posterC)
  const posterD = framedPoster('ROAST')
  posterD.position.set(-3.56, 1.8, 1.5)
  posterD.rotation.y = Math.PI / 2
  decor.add(posterD)

  // café clock high on the back wall
  const clock = wallClock()
  clock.position.set(2.75, 3.15, -2.95)
  decor.add(clock)

  // console table with plants against the left wall (as in the reference)
  const console_ = consoleTable()
  console_.position.set(-3.3, 0, 0.7)
  decor.add(console_)
  for (const [z, style, s] of [[0.35, 'bushy', 1.05], [0.95, 'trailing', 0.9]] as [number, PlantStyle, number][]) {
    const plant = buildPottedPlant({ style, scale: s })
    plant.position.set(-3.3, 0.745, z)
    decor.add(plant)
  }
  const lowPlant = buildPottedPlant({ style: 'fern', scale: 1.1 })
  lowPlant.position.set(-3.3, 0.32, 0.7)
  decor.add(lowPlant)

  // counter dressing: cake stand + sugar bowl on the back row
  const cake = cakeStand()
  cake.position.set(0.95, 0.9, -1.2)
  decor.add(cake)
  const sugarMat = new THREE.MeshStandardMaterial({ color: 0xf0e8d8, roughness: 0.5 })
  const sugar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.07, 18), sugarMat)
  sugar.position.set(-1.72, 0.935, -1.25)
  sugar.castShadow = true
  decor.add(sugar)
  const sugarLid = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), sugarMat)
  sugarLid.position.set(-1.72, 0.968, -1.25)
  decor.add(sugarLid)

  return decor
}
