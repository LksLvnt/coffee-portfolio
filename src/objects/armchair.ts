import * as THREE from 'three'

// A worn leather armchair with a draped knit blanket. Faces +z; base at y = 0.
export function buildArmchair(): THREE.Group {
  const g = new THREE.Group()
  const leather = new THREE.MeshStandardMaterial({ color: 0x7a4a28, roughness: 0.55, metalness: 0.05 })

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.22, 0.72), leather)
  seat.position.set(0, 0.45, 0)
  seat.castShadow = true
  g.add(seat)

  const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.16, 0.64), leather)
  cushion.position.set(0, 0.6, 0.02)
  cushion.castShadow = true
  g.add(cushion)

  const back = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.7, 0.2), leather)
  back.position.set(0, 0.72, -0.34)
  back.castShadow = true
  g.add(back)

  for (const x of [-0.4, 0.4]) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.34, 0.74), leather)
    arm.position.set(x, 0.56, 0)
    arm.castShadow = true
    g.add(arm)
  }

  const baseLip = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.16, 0.76), leather)
  baseLip.position.set(0, 0.28, 0)
  g.add(baseLip)

  for (const [x, z] of [[-0.34, 0.32], [0.34, 0.32], [-0.34, -0.32], [0.34, -0.32]]) {
    const leg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.03, 0.2, 10),
      new THREE.MeshStandardMaterial({ color: 0x2e2114, roughness: 0.6 })
    )
    leg.position.set(x, 0.1, z)
    g.add(leg)
  }

  // draped knit blanket over one arm
  const blanketMat = new THREE.MeshStandardMaterial({ color: 0xb9a079, roughness: 0.95, metalness: 0 })
  const blanket = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.5, 0.5), blanketMat)
  blanket.position.set(0.32, 0.6, 0.1)
  blanket.rotation.z = 0.12
  blanket.castShadow = true
  g.add(blanket)

  return g
}

// Small round side table with a cup of coffee. Base at y = 0.
export function buildSideTable(): THREE.Group {
  const g = new THREE.Group()
  const wood = new THREE.MeshStandardMaterial({ color: 0x5a3a1e, roughness: 0.7 })
  const top = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.04, 20), wood)
  top.position.y = 0.5
  top.castShadow = true
  g.add(top)
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.5, 12), wood)
  stem.position.y = 0.25
  g.add(stem)
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.03, 16), wood)
  foot.position.y = 0.015
  g.add(foot)

  const cupMat = new THREE.MeshStandardMaterial({ color: 0xefe7d6, roughness: 0.5 })
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.032, 0.07, 18), cupMat)
  cup.position.set(0, 0.555, 0)
  cup.castShadow = true
  g.add(cup)
  const coffee = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.01, 18),
    new THREE.MeshStandardMaterial({ color: 0x2a1407, roughness: 0.3 })
  )
  coffee.position.set(0, 0.588, 0)
  g.add(coffee)

  return g
}
