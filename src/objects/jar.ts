import * as THREE from 'three'
import { labelTexture } from '../scene/textures'

// A glass storage jar of coffee beans with a wooden lid and kraft label.
export function buildJar(label: string, height = 0.2): THREE.Group {
  const g = new THREE.Group()
  const r = height * 0.45

  const glass = new THREE.Mesh(
    new THREE.CylinderGeometry(r, r, height, 22),
    new THREE.MeshStandardMaterial({
      color: 0xd7e6e0, transparent: true, opacity: 0.28, roughness: 0.05, metalness: 0,
    })
  )
  glass.position.y = height / 2
  g.add(glass)

  const beans = new THREE.Mesh(
    new THREE.CylinderGeometry(r * 0.92, r * 0.92, height * 0.62, 20),
    new THREE.MeshStandardMaterial({ color: 0x3a1d0c, roughness: 0.85 })
  )
  beans.position.y = height * 0.32
  g.add(beans)

  const lid = new THREE.Mesh(
    new THREE.CylinderGeometry(r * 1.04, r * 1.04, height * 0.12, 22),
    new THREE.MeshStandardMaterial({ color: 0x4a3119, roughness: 0.7 })
  )
  lid.position.y = height * 1.02
  lid.castShadow = true
  g.add(lid)
  const knob = new THREE.Mesh(
    new THREE.SphereGeometry(height * 0.05, 12, 10),
    new THREE.MeshStandardMaterial({ color: 0x4a3119, roughness: 0.7 })
  )
  knob.position.y = height * 1.1
  g.add(knob)

  const labelMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(r * 1.5, r * 0.95),
    new THREE.MeshStandardMaterial({ map: labelTexture(label), roughness: 0.9, transparent: true })
  )
  labelMesh.position.set(0, height * 0.42, r + 0.001)
  g.add(labelMesh)

  return g
}
