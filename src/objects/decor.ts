import * as THREE from 'three'
import { buildShelf } from './shelf'
import { buildPottedPlant, buildHangingPlant, buildFloorPlant, type PlantStyle } from './plant'
import { buildMenu } from './menu'
import { buildJar } from './jar'
import { buildArmchair, buildSideTable } from './armchair'

const rand = (a: number, b: number) => a + Math.random() * (b - a)

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

  return decor
}
