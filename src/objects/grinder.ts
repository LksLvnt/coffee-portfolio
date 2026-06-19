import * as THREE from 'three'

export function buildGrinder(): THREE.Group {
  const g = new THREE.Group()
  const dark = new THREE.MeshStandardMaterial({ color: 0x1c1c1c, metalness: 0.6, roughness: 0.4 })
  const metal = new THREE.MeshStandardMaterial({ color: 0xb6b6b8, metalness: 0.9, roughness: 0.25 })
  const chrome = new THREE.MeshStandardMaterial({ color: 0xd8d8da, metalness: 0.95, roughness: 0.2 })
  const beanMat = new THREE.MeshStandardMaterial({ color: 0x3a1e0a, roughness: 0.7 })

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.17, 0.06, 24), metal)
  base.position.y = 0.03
  base.castShadow = true
  g.add(base)

  // sleek cylindrical body
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.14, 0.32, 28), dark)
  body.position.y = 0.22
  body.castShadow = true
  g.add(body)

  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.142, 0.142, 0.04, 28), chrome)
  collar.position.y = 0.39
  g.add(collar)

  const taper = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, 0.1, 24), dark)
  taper.position.y = 0.45
  g.add(taper)

  // glass hopper of beans
  const hopperMat = new THREE.MeshStandardMaterial({ color: 0xaaffdd, transparent: true, opacity: 0.22, roughness: 0.1, metalness: 0 })
  const hopper = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.085, 0.22, 24), hopperMat)
  hopper.position.y = 0.6
  g.add(hopper)
  const hopperLid = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.14, 0.02, 24), dark)
  hopperLid.position.y = 0.71
  g.add(hopperLid)

  const beans = new THREE.Group()
  for (let i = 0; i < 24; i++) {
    const bean = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), beanMat)
    bean.position.set((Math.random() - 0.5) * 0.16, 0.5 + Math.random() * 0.08, (Math.random() - 0.5) * 0.16)
    bean.scale.z = 0.6
    beans.add(bean)
  }
  g.add(beans)
  g.userData.beans = beans

  // front control panel: dial + power switch + brand plate
  const panel = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.2, 0.02), new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.5, roughness: 0.5 }))
  panel.position.set(0, 0.26, 0.135)
  g.add(panel)
  const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.02, 20), chrome)
  dial.rotation.x = Math.PI / 2
  dial.position.set(0, 0.31, 0.15)
  g.add(dial)
  const sw = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.016, 12), new THREE.MeshStandardMaterial({ color: 0xcc3322, emissive: 0x551108, emissiveIntensity: 0.5, roughness: 0.4 }))
  sw.rotation.x = Math.PI / 2
  sw.position.set(0, 0.21, 0.15)
  g.add(sw)
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.025), chrome)
  plate.position.set(0, 0.16, 0.146)
  g.add(plate)

  // dosing throat + spout — grounds pour out here, over the portafilter fork
  const throat = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.1, 16), dark)
  throat.position.set(0, 0.13, 0.13)
  g.add(throat)
  const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.022, 0.1, 14), metal)
  spout.position.set(0, 0.17, 0.2)
  spout.rotation.x = 0.6
  spout.castShadow = true
  g.add(spout)
  const mouth = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.026, 0.02, 14), dark)
  mouth.position.set(0, 0.135, 0.235)
  mouth.rotation.x = 0.6
  g.add(mouth)

  // fork that cradles the portafilter under the spout
  for (const x of [-0.05, 0.05]) {
    const prong = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.012, 0.16), metal)
    prong.position.set(x, 0.045, 0.2)
    g.add(prong)
  }
  const forkBar = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.012, 0.012), metal)
  forkBar.position.set(0, 0.045, 0.12)
  g.add(forkBar)

  return g
}
