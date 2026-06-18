import * as THREE from 'three'
import gsap from 'gsap'

export type Station = {
  pos: THREE.Vector3
  look: THREE.Vector3
}

export class CameraRig {
  private camera: THREE.PerspectiveCamera
  private stations: Station[]
  private lookTarget: THREE.Vector3
  current = 0

  constructor(camera: THREE.PerspectiveCamera, stations: Station[]) {
    this.camera = camera
    this.stations = stations
    this.lookTarget = stations[0].look.clone()
    camera.position.copy(stations[0].pos)
    camera.lookAt(this.lookTarget)
  }

  goTo(index: number, duration = 2.2) {
    if (index < 0 || index >= this.stations.length) return
    this.current = index
    const s = this.stations[index]
    gsap.to(this.camera.position, {
      x: s.pos.x, y: s.pos.y, z: s.pos.z,
      duration, ease: 'power2.inOut'
    })
    gsap.to(this.lookTarget, {
      x: s.look.x, y: s.look.y, z: s.look.z,
      duration, ease: 'power2.inOut'
    })
  }

  update() {
    this.camera.lookAt(this.lookTarget)
  }
}