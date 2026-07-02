import * as THREE from 'three'

// A stainless milk pitcher. Origin at the base; pouring lip faces +z.
// userData.milk is the milk surface inside.
export function buildMilkPitcher(): THREE.Group {
  const g = new THREE.Group()
  const metal = new THREE.MeshStandardMaterial({ color: 0xd6d6d9, metalness: 0.95, roughness: 0.22 })

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.065, 0.12, 22), metal)
  body.position.y = 0.06
  body.castShadow = true
  g.add(body)

  // rim band + small pinched pouring lip at the front of the rim
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.048, 0.004, 8, 22), metal)
  rim.rotation.x = Math.PI / 2
  rim.position.y = 0.12
  g.add(rim)
  const lip = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.032, 3, 1, true), metal)
  lip.position.set(0, 0.124, 0.052)
  lip.rotation.set(1.9, 0, Math.PI)
  g.add(lip)

  // handle loop on the back
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.038, 0.008, 10, 20, Math.PI), metal)
  handle.position.set(0, 0.07, -0.055)
  handle.rotation.set(0, Math.PI / 2, Math.PI / 2)
  g.add(handle)

  const milk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.048, 0.048, 0.006, 22),
    new THREE.MeshStandardMaterial({ color: 0xfbf6ec, roughness: 0.4 })
  )
  milk.position.y = 0.112
  g.add(milk)
  g.userData.milk = milk

  return g
}
