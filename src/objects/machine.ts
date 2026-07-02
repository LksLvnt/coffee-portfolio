import * as THREE from 'three'
import { pipe, vec } from './pipe'

const steel = new THREE.MeshStandardMaterial({ color: 0xb8babd, metalness: 0.8, roughness: 0.34 })
const darkSteel = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.6, roughness: 0.45 })
const chrome = new THREE.MeshStandardMaterial({ color: 0xdadce0, metalness: 0.95, roughness: 0.2 })
const woodHandle = new THREE.MeshStandardMaterial({ color: 0x3a2412, metalness: 0, roughness: 0.7 })
const porcelain = new THREE.MeshStandardMaterial({ color: 0xf0ede5, roughness: 0.5 })

// One chrome group head, raised so there's room for a cup beneath. The portafilter
// locks into the collar at local (x, 0.22, 0.345); world dock is machinePos + that.
function groupHead(x: number, working: boolean): THREE.Group {
  const h = new THREE.Group()

  const mount = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.24, 0.16), steel)
  mount.position.set(x, 0.38, 0.18)
  h.add(mount)

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.076, 0.26, 24), chrome)
  body.position.set(x, 0.37, 0.33)
  body.castShadow = true
  h.add(body)

  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.086, 0.07, 0.05, 24), chrome)
  cap.position.set(x, 0.51, 0.33)
  h.add(cap)
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.026, 14, 12), darkSteel)
  knob.position.set(x, 0.55, 0.33)
  h.add(knob)

  // portafilter lock collar + dispersion block
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.084, 0.09, 0.06, 24), chrome)
  collar.position.set(x, 0.25, 0.345)
  h.add(collar)
  const disp = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.07, 0.025, 24), darkSteel)
  disp.position.set(x, 0.215, 0.345)
  h.add(disp)

  if (!working) {
    const pf = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.05, 24), chrome)
    pf.position.set(x, 0.22, 0.345)
    h.add(pf)
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.22, 16), woodHandle)
    handle.rotation.x = Math.PI / 2
    handle.position.set(x, 0.22, 0.5)
    handle.castShadow = true
    h.add(handle)
  }
  return h
}

// A steam wand built from two pipes so it clearly angles down toward `tip`.
function steamWand(x: number, tip: THREE.Vector3): THREE.Group {
  const w = new THREE.Group()
  const a = vec(x, 0.42, 0.04)
  const b = vec(x, 0.32, 0.18)
  const pivot = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 12), darkSteel)
  pivot.position.copy(a)
  w.add(pivot)
  w.add(pipe(a, b, 0.014, chrome))
  w.add(pipe(b, tip, 0.012, chrome))
  w.add(pipe(tip.clone().setY(tip.y + 0.03), tip.clone().setY(tip.y - 0.02), 0.016, darkSteel))
  return w
}

export function buildMachine(): THREE.Group {
  const g = new THREE.Group()

  const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.55, 0.55), steel)
  body.position.y = 0.275
  body.castShadow = true
  g.add(body)

  // rounded chrome lip along the front-top edge for the classic silhouette
  const lip = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.32, 24), chrome)
  lip.rotation.z = Math.PI / 2
  lip.position.set(0, 0.55, 0.26)
  g.add(lip)

  const topPlate = new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.06, 0.5), steel)
  topPlate.position.set(0, 0.55, -0.04)
  g.add(topPlate)

  for (const z of [-0.26, 0.18]) {
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.3, 12), chrome)
    rail.rotation.z = Math.PI / 2
    rail.position.set(0, 0.62, z)
    g.add(rail)
  }

  const backPanel = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.22, 0.1), steel)
  backPanel.position.set(0, 0.66, -0.22)
  g.add(backPanel)

  g.add(groupHead(-0.32, true))
  g.add(groupHead(0.32, false))

  // drip tray + chrome grate where the cups sit (grate top ~world 0.93)
  const tray = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.025, 0.26), darkSteel)
  tray.position.set(0, 0.0125, 0.33)
  tray.receiveShadow = true
  g.add(tray)
  for (let i = 0; i < 8; i++) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.008, 0.016), chrome)
    slat.position.set(0, 0.027, 0.24 + i * 0.025)
    g.add(slat)
  }

  // steam wands: left reaches into the pitcher at STEAM_POS, right is decorative
  g.add(steamWand(-0.62, vec(-0.62, 0.12, 0.32)))
  g.add(steamWand(0.62, vec(0.62, 0.16, 0.26)))

  // pressure gauge with a needle
  const gauge = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.03, 24), chrome)
  gauge.rotation.x = Math.PI / 2
  gauge.position.set(0, 0.42, 0.28)
  g.add(gauge)
  const gaugeFace = new THREE.Mesh(new THREE.CircleGeometry(0.05, 24), porcelain)
  gaugeFace.position.set(0, 0.42, 0.296)
  g.add(gaugeFace)
  const needle = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.04, 0.002), new THREE.MeshStandardMaterial({ color: 0xcc2222 }))
  needle.position.set(0.012, 0.43, 0.298)
  needle.rotation.z = -0.6
  g.add(needle)

  for (let i = 0; i < 4; i++) {
    const lit = i === 1
    const btn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.022, 16),
      lit ? new THREE.MeshStandardMaterial({ color: 0x2a78c2, emissive: 0x1a4f87, emissiveIntensity: 0.6, metalness: 0.3, roughness: 0.4 }) : darkSteel
    )
    btn.rotation.x = Math.PI / 2
    btn.position.set(-0.52 + i * 0.1, 0.48, 0.28)
    g.add(btn)
  }

  for (const x of [-0.32, -0.06, 0.2, 0.42]) {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.05, 16), porcelain)
    cup.position.set(x, 0.61, -0.04)
    cup.castShadow = true
    g.add(cup)
  }

  return g
}
