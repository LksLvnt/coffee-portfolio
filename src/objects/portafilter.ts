import * as THREE from 'three'

const chrome = new THREE.MeshStandardMaterial({ color: 0xe6e6e8, metalness: 1, roughness: 0.18 })
const wood = new THREE.MeshStandardMaterial({ color: 0x3a2412, roughness: 0.7 })

// Detachable portafilter. Origin at the basket centre; wooden handle points +z.
// userData.grounds is the coffee bed (hidden until grinding fills it).
export function buildPortafilter(): THREE.Group {
  const g = new THREE.Group()

  const basket = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.046, 0.05, 24), chrome)
  basket.castShadow = true
  g.add(basket)

  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.058, 0.016, 24), chrome)
  collar.position.y = 0.03
  g.add(collar)

  for (const x of [-0.018, 0.018]) {
    const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.006, 0.05, 12), chrome)
    spout.position.set(x, -0.04, 0)
    g.add(spout)
  }

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.07, 16), chrome)
  neck.rotation.x = Math.PI / 2
  neck.position.set(0, 0.005, 0.07)
  g.add(neck)

  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.024, 0.16, 16), wood)
  handle.rotation.x = Math.PI / 2
  handle.position.set(0, 0.005, 0.185)
  handle.castShadow = true
  g.add(handle)

  const grounds = new THREE.Mesh(
    new THREE.CylinderGeometry(0.046, 0.044, 0.03, 20),
    new THREE.MeshStandardMaterial({ color: 0x4a2a12, roughness: 0.96 })
  )
  grounds.position.y = 0.012
  grounds.scale.y = 0.001
  grounds.visible = false
  g.add(grounds)
  g.userData.grounds = grounds

  return g
}
