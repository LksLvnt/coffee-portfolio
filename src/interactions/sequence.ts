import * as THREE from 'three'
import type { Interactions } from './raycaster'
import type { CameraRig } from '../scene/camera'
import type { TextReveal } from '../ui/textReveal'

export type StationDef = {
  object: THREE.Object3D
  label: string
  body: string
  hold: number
  onProgress?: (t: number) => void
  onComplete?: () => void
}

export class Sequence {
  private defs: StationDef[]
  private interactions: Interactions
  private rig: CameraRig
  private text: TextReveal
  private affordance: THREE.Mesh
  private index = -1
  private holding = false
  private progress = 0
  private done = false

  constructor(
    defs: StationDef[],
    interactions: Interactions,
    rig: CameraRig,
    text: TextReveal,
    affordance: THREE.Mesh
  ) {
    this.defs = defs
    this.interactions = interactions
    this.rig = rig
    this.text = text
    this.affordance = affordance
    defs.forEach((def) => {
      interactions.add({
        object: def.object,
        onHover: () => { if (this.isCurrent(def)) def.object.scale.setScalar(1.04) },
        onUnhover: () => def.object.scale.setScalar(1.0),
        onDown: () => { if (this.isCurrent(def)) this.holding = true },
        onUp: () => { this.holding = false },
      })
    })
  }

  start() {
    if (this.index === -1) this.advance()
  }

  private isCurrent(def: StationDef) {
    return this.index >= 0 && this.defs[this.index] === def && !this.done
  }

  private advance() {
    this.index++
    this.progress = 0
    this.done = false
    if (this.index >= this.defs.length) {
      this.affordance.visible = false
      return
    }
    const def = this.defs[this.index]
    this.rig.goTo(this.index + 1)
    this.point(def.object)
  }

  private point(obj: THREE.Object3D) {
    this.affordance.position.set(obj.position.x, 0.915, obj.position.z)
    this.affordance.visible = true
  }

  update(time: number) {
    if (this.done || this.index < 0 || this.index >= this.defs.length) return
    const def = this.defs[this.index]
    if (this.holding && this.progress < 1) {
      this.progress += 1 / (def.hold * 60)
      def.onProgress?.(this.progress)
      if (this.progress >= 1) {
        this.done = true
        this.holding = false
        this.affordance.visible = false
        this.text.show(def.label, def.body)
        def.onComplete?.()
        setTimeout(() => { this.text.hide(); this.advance() }, 3500)
      }
    }
  }
}