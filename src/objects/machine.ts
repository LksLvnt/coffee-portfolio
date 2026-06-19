import * as THREE from 'three'

const steel = new THREE.MeshStandardMaterial({ color: 0xb8babd, metalness: 0.8, roughness: 0.34 })
const darkSteel = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.6, roughness: 0.45 })
const chrome = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 1, roughness: 0.12 })
const woodHandle = new THREE.MeshStandardMaterial({ color: 0x3a2412, metalness: 0, roughness: 0.7 })
const porcelain = new THREE.MeshStandardMaterial({ color: 0xf0ede5, roughness: 0.5 })

export function buildMachine(): THREE.Group {
  const g = new THREE.Group()

  const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.55, 0.55), steel)
  body.position.y = 0.275
  body.castShadow = true
  g.add(body)

  const topPlate = new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.06, 0.59), steel)
  topPlate.position.y = 0.55
  g.add(topPlate)

  const backPanel = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.22, 0.1), steel)
  backPanel.position.set(0, 0.66, -0.22)
  g.add(backPanel)

  for (const x of [-0.32, 0.32]) {
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.085, 0.18, 24), chrome)
    head.position.set(x, 0.22, 0.3)
    g.add(head)

    // The left head is the working socket — the detachable portafilter locks
    // in there during the workflow. The right head keeps a static portafilter.
    if (x === 0.32) {
      const pf = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.05, 24), chrome)
      pf.position.set(x, 0.14, 0.34)
      g.add(pf)

      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.22, 16), woodHandle)
      handle.rotation.x = Math.PI / 2
      handle.position.set(x, 0.14, 0.5)
      g.add(handle)
    }
  }

  for (const x of [-0.62, 0.62]) {
    const wand = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.32, 12), chrome)
    wand.position.set(x, 0.18, 0.18)
    wand.rotation.x = Math.PI / 6
    g.add(wand)
  }

  const gauge = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.03, 24), darkSteel)
  gauge.rotation.x = Math.PI / 2
  gauge.position.set(0, 0.36, 0.28)
  g.add(gauge)
  const gaugeFace = new THREE.Mesh(new THREE.CircleGeometry(0.05, 24), porcelain)
  gaugeFace.position.set(0, 0.36, 0.296)
  g.add(gaugeFace)

  for (let i = 0; i < 4; i++) {
    const lit = i === 1
    const btn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, 0.02, 16),
      lit ? new THREE.MeshStandardMaterial({ color: 0x2266aa, emissive: 0x113355, metalness: 0.3, roughness: 0.4 }) : darkSteel
    )
    btn.rotation.x = Math.PI / 2
    btn.position.set(-0.5 + i * 0.1, 0.42, 0.28)
    g.add(btn)
  }

  for (const x of [-0.3, 0, 0.3]) {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.05, 16), porcelain)
    cup.position.set(x, 0.61, 0)
    g.add(cup)
  }

  return g
}