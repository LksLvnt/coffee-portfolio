import * as THREE from 'three'

type Interactive = {
  object: THREE.Object3D
  onHover?: () => void
  onUnhover?: () => void
  onDown?: () => void
  onUp?: () => void
}

export class Interactions {
  private camera: THREE.Camera
  private dom: HTMLElement
  private raycaster = new THREE.Raycaster()
  private pointer = new THREE.Vector2()
  private items: Interactive[] = []
  private hovered: Interactive | null = null
  private active: Interactive | null = null

  constructor(camera: THREE.Camera, dom: HTMLElement) {
    this.camera = camera
    this.dom = dom
    dom.addEventListener('pointermove', this.onMove)
    dom.addEventListener('pointerdown', this.onDown)
    window.addEventListener('pointerup', this.onUp)
  }

  add(item: Interactive) { this.items.push(item) }

  private setPointer(e: PointerEvent) {
    this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1
  }

  private pick(): Interactive | null {
    this.raycaster.setFromCamera(this.pointer, this.camera)
    let nearest: Interactive | null = null
    let dist = Infinity
    for (const item of this.items) {
      const hits = this.raycaster.intersectObject(item.object, true)
      if (hits.length && hits[0].distance < dist) {
        dist = hits[0].distance
        nearest = item
      }
    }
    return nearest
  }

  private onMove = (e: PointerEvent) => {
    this.setPointer(e)
    const hit = this.pick()
    if (hit !== this.hovered) {
      this.hovered?.onUnhover?.()
      this.hovered = hit
      this.hovered?.onHover?.()
      this.dom.style.cursor = hit ? 'pointer' : 'default'
    }
  }

  private onDown = (e: PointerEvent) => {
    this.setPointer(e)
    const hit = this.pick()
    if (hit) { this.active = hit; hit.onDown?.() }
  }

  private onUp = () => {
    if (this.active) { this.active.onUp?.(); this.active = null }
  }
}