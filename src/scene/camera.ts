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
  private idle = true
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

  // Fly to an arbitrary framing (used by the workflow steps).
  flyTo(pos: THREE.Vector3, look: THREE.Vector3, duration = 1.6) {
    this.idle = false
    this.current = -1
    gsap.to(this.camera.position, { x: pos.x, y: pos.y, z: pos.z, duration, ease: 'power2.inOut' })
    gsap.to(this.lookTarget, { x: look.x, y: look.y, z: look.z, duration, ease: 'power2.inOut' })
  }

  // Return to the opening wide shot and resume the idle drift (for the loop reset).
  toIntro(duration = 1.4) {
    const s = this.stations[0]
    gsap.to(this.camera.position, { x: s.pos.x, y: s.pos.y, z: s.pos.z, duration, ease: 'power2.inOut' })
    gsap.to(this.lookTarget, { x: s.look.x, y: s.look.y, z: s.look.z, duration, ease: 'power2.inOut' })
    gsap.delayedCall(duration, () => { this.current = 0; this.idle = true })
  }

  setIdle(v: boolean) {
    this.idle = v
  }

  update() {
      if (this.idle && this.current === 0) {
        const t = performance.now() * 0.0002
        this.camera.position.x = this.stations[0].pos.x + Math.sin(t) * 0.35
        this.camera.position.y = this.stations[0].pos.y + Math.sin(t * 0.7) * 0.12
      }
      this.camera.lookAt(this.lookTarget)
    }
}