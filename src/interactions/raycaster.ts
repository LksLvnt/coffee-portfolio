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

  // drag on empty space → look-around; set by the app
  onDrag: ((dx: number, dy: number) => void) | null = null
  private dragging = false
  private lastX = 0
  private lastY = 0

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
    if (this.dragging) {
      this.onDrag?.(e.clientX - this.lastX, e.clientY - this.lastY)
      this.lastX = e.clientX
      this.lastY = e.clientY
      return
    }
    this.setPointer(e)
    const hit = this.pick()
    if (hit !== this.hovered) {
      this.hovered?.onUnhover?.()
      this.hovered = hit
      this.hovered?.onHover?.()
      this.dom.style.cursor = hit ? 'pointer' : 'grab'
    }
  }

  private onDown = (e: PointerEvent) => {
    this.setPointer(e)
    const hit = this.pick()
    if (hit) {
      this.active = hit
      hit.onDown?.()
    } else {
      this.dragging = true
      this.lastX = e.clientX
      this.lastY = e.clientY
      this.dom.style.cursor = 'grabbing'
    }
  }

  private onUp = () => {
    if (this.active) { this.active.onUp?.(); this.active = null }
    if (this.dragging) { this.dragging = false; this.dom.style.cursor = 'grab' }
  }
}