import * as THREE from 'three'

export type Lighting = { edisonBulb: THREE.PointLight }

// Warm, cozy lighting rig: soft daylight fill + a hanging Edison bulb over the bar.
export function setupLighting(scene: THREE.Scene): Lighting {
  // even, warm ambient fill (sky warm / floor warm) — the daytime coffee-shop glow
  const hemi = new THREE.HemisphereLight(0xfff2dd, 0x6b4a2a, 0.6)
  scene.add(hemi)

  const ambient = new THREE.AmbientLight(0xfff0db, 0.28)
  scene.add(ambient)

  // daylight pouring through the right-hand window
  const windowLight = new THREE.DirectionalLight(0xfff0d0, 1.15)
  windowLight.position.set(5, 3.2, 2)
  windowLight.target.position.set(-0.3, 1, -1)
  windowLight.castShadow = true
  windowLight.shadow.mapSize.set(2048, 2048)
  windowLight.shadow.camera.near = 0.5
  windowLight.shadow.camera.far = 18
  windowLight.shadow.camera.left = -6
  windowLight.shadow.camera.right = 6
  windowLight.shadow.camera.top = 6
  windowLight.shadow.camera.bottom = -4
  windowLight.shadow.bias = -0.0004
  scene.add(windowLight)
  scene.add(windowLight.target)

  // local warm glow at the window
  const windowGlow = new THREE.PointLight(0xffe6b0, 0.6, 6, 2)
  windowGlow.position.set(3.1, 2.0, 1.2)
  scene.add(windowGlow)

  // hanging Edison bulb over the counter
  const edisonBulb = new THREE.PointLight(0xffaa44, 2.4, 9, 1.8)
  edisonBulb.position.set(0, 3.05, -0.7)
  edisonBulb.castShadow = true
  edisonBulb.shadow.mapSize.set(1024, 1024)
  edisonBulb.shadow.bias = -0.0005
  scene.add(edisonBulb)

  // visible fixture: cord + socket + glass bulb + warm filament
  const cordMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8 })
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.0, 8), cordMat)
  cord.position.set(0, 3.6, -0.7)
  scene.add(cord)

  const socket = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.045, 0.09, 16),
    new THREE.MeshStandardMaterial({ color: 0x2a2520, metalness: 0.5, roughness: 0.5 })
  )
  socket.position.set(0, 3.13, -0.7)
  scene.add(socket)

  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 20, 20),
    new THREE.MeshStandardMaterial({
      color: 0xffcc55, emissive: 0xffaa33, emissiveIntensity: 3.5,
      transparent: true, opacity: 0.92, roughness: 0.1,
    })
  )
  bulb.position.copy(edisonBulb.position)
  scene.add(bulb)

  const filament = new THREE.Mesh(
    new THREE.TorusGeometry(0.018, 0.004, 6, 12),
    new THREE.MeshBasicMaterial({ color: 0xffdd88 })
  )
  filament.position.copy(edisonBulb.position)
  scene.add(filament)

  return { edisonBulb }
}
