import * as THREE from 'three'
import { latteArtTexture } from '../scene/textures'

export function buildCup(): THREE.Group {
  const g = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: 0xf2ece0, roughness: 0.45, metalness: 0 })

  const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.085, 0.012, 24), mat)
  saucer.position.y = 0.006
  saucer.castShadow = true
  g.add(saucer)

  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.035, 0.08, 24), mat)
  cup.position.y = 0.05
  cup.castShadow = true
  g.add(cup)

  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.008, 12, 24), mat)
  handle.position.set(0.055, 0.05, 0)
  handle.rotation.y = Math.PI / 2
  g.add(handle)

  // gold rim line just under the lip
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(0.0495, 0.0016, 8, 40),
    new THREE.MeshStandardMaterial({ color: 0xc9a14a, metalness: 0.85, roughness: 0.3 })
  )
  rim.rotation.x = Math.PI / 2
  rim.position.y = 0.082
  g.add(rim)

  const coffeeMat = new THREE.MeshStandardMaterial({ color: 0x2a1407, roughness: 0.25, metalness: 0 })
  const coffee = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.032, 0.001, 24), coffeeMat)
  coffee.position.y = 0.018
  coffee.visible = false
  g.add(coffee)
  g.userData.coffee = coffee

  // latte-art surface — fades in on top of the crema during the milk pour
  const latteArt = new THREE.Mesh(
    new THREE.CircleGeometry(0.045, 32),
    new THREE.MeshStandardMaterial({
      map: latteArtTexture(), roughness: 0.6, transparent: true, opacity: 0,
    })
  )
  latteArt.rotation.x = -Math.PI / 2
  latteArt.position.y = 0.051
  latteArt.visible = false
  g.add(latteArt)
  g.userData.latteArt = latteArt

  return g
}