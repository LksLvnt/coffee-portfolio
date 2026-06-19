import * as THREE from 'three'
import gsap from 'gsap'

export type Station = {
  pos: THREE.Vector3
  look: THREE.Vector3
}

// Camera on a rail. gsap tweens a base framing (basePos + lookTarget); on top of
// that the viewer can drag to orbit a little around the focused piece, clamped so
// they can peek past things (e.g. the portafilter handle) without losing the shot.
export class CameraRig {
  private camera: THREE.PerspectiveCamera
  private stations: Station[]
  private basePos: THREE.Vector3
  private lookTarget: THREE.Vector3
  private idle = true
  current = 0

  // viewer look-around offsets (radians), clamped
  orbitYaw = 0
  orbitPitch = 0

  private tmp = new THREE.Vector3()
  private offset = new THREE.Vector3()
  private sph = new THREE.Spherical()

  constructor(camera: THREE.PerspectiveCamera, stations: Station[]) {
    this.camera = camera
    this.stations = stations
    this.basePos = stations[0].pos.clone()
    this.lookTarget = stations[0].look.clone()
    this.update()
  }

  // Fly to an arbitrary framing (used by the workflow steps).
  flyTo(pos: THREE.Vector3, look: THREE.Vector3, duration = 1.6) {
    this.idle = false
    this.current = -1
    gsap.to(this.basePos, { x: pos.x, y: pos.y, z: pos.z, duration, ease: 'power2.inOut' })
    gsap.to(this.lookTarget, { x: look.x, y: look.y, z: look.z, duration, ease: 'power2.inOut' })
    gsap.to(this, { orbitYaw: 0, orbitPitch: 0, duration: duration * 0.6, ease: 'power2.out' })
  }

  // Return to the opening wide shot and resume the idle drift (for the loop reset).
  toIntro(duration = 1.4) {
    const s = this.stations[0]
    gsap.to(this.basePos, { x: s.pos.x, y: s.pos.y, z: s.pos.z, duration, ease: 'power2.inOut' })
    gsap.to(this.lookTarget, { x: s.look.x, y: s.look.y, z: s.look.z, duration, ease: 'power2.inOut' })
    gsap.to(this, { orbitYaw: 0, orbitPitch: 0, duration, ease: 'power2.out' })
    gsap.delayedCall(duration, () => { this.current = 0; this.idle = true })
  }

  // Viewer drag → small orbit around the current look target.
  addOrbit(dx: number, dy: number) {
    this.orbitYaw = THREE.MathUtils.clamp(this.orbitYaw - dx * 0.004, -0.6, 0.6)
    this.orbitPitch = THREE.MathUtils.clamp(this.orbitPitch - dy * 0.003, -0.3, 0.45)
  }

  setIdle(v: boolean) {
    this.idle = v
  }

  update() {
    const bp = this.tmp.copy(this.basePos)
    if (this.idle && this.current === 0) {
      const t = performance.now() * 0.0002
      bp.x += Math.sin(t) * 0.35
      bp.y += Math.sin(t * 0.7) * 0.12
    }
    // apply the look-around orbit as a rotation of the eye around the target
    this.offset.copy(bp).sub(this.lookTarget)
    this.sph.setFromVector3(this.offset)
    this.sph.theta += this.orbitYaw
    this.sph.phi = THREE.MathUtils.clamp(this.sph.phi + this.orbitPitch, 0.15, Math.PI * 0.85)
    this.offset.setFromSpherical(this.sph)
    this.camera.position.copy(this.lookTarget).add(this.offset)
    this.camera.lookAt(this.lookTarget)
  }
}
