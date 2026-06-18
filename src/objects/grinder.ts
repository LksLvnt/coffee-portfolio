import * as THREE from 'three'

export function buildGrinder(): THREE.Group {
  const g = new THREE.Group()
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1c1c1c, metalness: 0.6, roughness: 0.4 })
  const metalMat = new THREE.MeshStandardMaterial({ color: 0xb0b0b0, metalness: 0.9, roughness: 0.25 })
  const beanMat = new THREE.MeshStandardMaterial({ color: 0x3a1e0a, roughness: 0.7 })

  const base = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, 0.3), metalMat)
  base.position.y = 0.03
  base.castShadow = true
  g.add(base)

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.4, 0.22), bodyMat)
  body.position.y = 0.25
  body.castShadow = true
  g.add(body)

  const hopperMat = new THREE.MeshStandardMaterial({ color: 0xaaffdd, transparent: true, opacity: 0.22, roughness: 0.1, metalness: 0 })
  const hopper = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.08, 0.22, 20), hopperMat)
  hopper.position.y = 0.56
  g.add(hopper)

  const beans = new THREE.Group()
  for (let i = 0; i < 22; i++) {
    const bean = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), beanMat)
    bean.position.set((Math.random() - 0.5) * 0.16, 0.48 + Math.random() * 0.08, (Math.random() - 0.5) * 0.16)
    bean.scale.z = 0.6
    beans.add(bean)
  }
  g.add(beans)
  g.userData.beans = beans

  const chute = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.06), metalMat)
  chute.position.set(0, 0.16, 0.14)
  g.add(chute)

  return g
}