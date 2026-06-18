import * as THREE from 'three'
import { woodTexture, rugTexture } from './textures'

const WALL_X = 3.6      // side walls at +/- this
const BACK_Z = -3       // back wall
const WALL_H = 5        // wall height (top hidden by ceiling)
const CEIL_Y = 4.2      // cozy ceiling height
const BACK_W = 2 * WALL_X + 0.4
const SIDE_LEN = 9      // side wall depth (z -3 .. +6)

function plankMat(repeat: [number, number], light: string, dark: string, vertical = true) {
  return new THREE.MeshStandardMaterial({
    map: woodTexture({ planks: 7, vertical, light, dark, repeat }),
    roughness: 0.9,
    metalness: 0,
  })
}

function windowUnit(): THREE.Group {
  const g = new THREE.Group()
  const w = 1.5, h = 1.7
  const frameMat = new THREE.MeshStandardMaterial({ color: 0xe9ddc4, roughness: 0.7 })

  // bright warm daylight pane (emissive so it reads as light pouring in)
  const pane = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({ color: 0xfff4dc, emissive: 0xffe9c2, emissiveIntensity: 1.6, roughness: 1 })
  )
  pane.position.z = -0.02
  g.add(pane)

  // outer frame
  const t = 0.07
  const bars: [number, number, number, number][] = [
    [0, h / 2, w + t * 2, t], [0, -h / 2, w + t * 2, t],
    [-w / 2, 0, t, h], [w / 2, 0, t, h],
    [0, 0, t * 0.7, h], [0, 0, w, t * 0.7], // central mullions
    [-w / 4, 0, t * 0.6, h], [w / 4, 0, t * 0.6, h],
  ]
  for (const [x, y, bw, bh] of bars) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, 0.05), frameMat)
    bar.position.set(x, y, 0)
    g.add(bar)
  }
  // sill
  const sill = new THREE.Mesh(new THREE.BoxGeometry(w + 0.3, 0.08, 0.18), frameMat)
  sill.position.set(0, -h / 2 - 0.06, 0.06)
  g.add(sill)
  return g
}

export function buildRoom(): THREE.Group {
  const room = new THREE.Group()

  // floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 12),
    new THREE.MeshStandardMaterial({
      map: woodTexture({ planks: 9, vertical: false, light: '#7a5230', dark: '#3f2810', repeat: [1, 6] }),
      roughness: 0.85,
      metalness: 0.02,
    })
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.z = 1.5
  floor.receiveShadow = true
  room.add(floor)

  // back wall
  const back = new THREE.Mesh(new THREE.PlaneGeometry(BACK_W, WALL_H), plankMat([7, 3], '#b68a55', '#7c5430'))
  back.position.set(0, WALL_H / 2, BACK_Z)
  back.receiveShadow = true
  room.add(back)

  // left wall
  const left = new THREE.Mesh(new THREE.PlaneGeometry(SIDE_LEN, WALL_H), plankMat([6, 3], '#ad8150', '#71492a'))
  left.position.set(-WALL_X, WALL_H / 2, BACK_Z + SIDE_LEN / 2)
  left.rotation.y = Math.PI / 2
  left.receiveShadow = true
  room.add(left)

  // right wall (with window)
  const right = new THREE.Mesh(new THREE.PlaneGeometry(SIDE_LEN, WALL_H), plankMat([6, 3], '#ad8150', '#71492a'))
  right.position.set(WALL_X, WALL_H / 2, BACK_Z + SIDE_LEN / 2)
  right.rotation.y = -Math.PI / 2
  right.receiveShadow = true
  room.add(right)

  const win = windowUnit()
  win.position.set(WALL_X - 0.03, 1.9, 1.2)
  win.rotation.y = -Math.PI / 2
  room.add(win)

  // ceiling
  const ceil = new THREE.Mesh(
    new THREE.PlaneGeometry(BACK_W, SIDE_LEN),
    plankMat([6, 5], '#9c7242', '#5f3c1d', false)
  )
  ceil.position.set(0, CEIL_Y, BACK_Z + SIDE_LEN / 2)
  ceil.rotation.x = Math.PI / 2
  room.add(ceil)

  // ceiling beams running front-to-back
  const beamMat = new THREE.MeshStandardMaterial({
    map: woodTexture({ planks: 2, vertical: false, light: '#6e4522', dark: '#3a2410', repeat: [1, 4] }),
    roughness: 0.85,
  })
  for (const x of [-2.2, 0, 2.2]) {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.16, SIDE_LEN), beamMat)
    beam.position.set(x, CEIL_Y - 0.1, BACK_Z + SIDE_LEN / 2)
    beam.castShadow = true
    room.add(beam)
  }

  // rug
  const rug = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 2.2),
    new THREE.MeshStandardMaterial({ map: rugTexture(), roughness: 0.95, metalness: 0 })
  )
  rug.rotation.x = -Math.PI / 2
  rug.position.set(0.3, 0.012, 1.7)
  rug.receiveShadow = true
  room.add(rug)

  return room
}
