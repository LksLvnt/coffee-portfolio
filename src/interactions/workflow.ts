import * as THREE from 'three'
import type { Interactions } from './raycaster'
import type { CameraRig } from '../scene/camera'
import type { TextReveal } from '../ui/textReveal'
import type { Hint } from '../ui/hint'

export type Step = {
  id: string
  cam?: { pos: THREE.Vector3; look: THREE.Vector3; duration?: number }
  target?: THREE.Object3D       // interactive: hold the pointer on this object
  hold?: number                 // seconds of holding to complete (default 2)
  auto?: number                 // seconds for a non-interactive transition
  ringAt?: THREE.Vector3        // where to park the affordance ring (defaults to target)
  hint?: string                 // instruction shown during the step
  label?: string                // portfolio caption revealed on completion
  body?: string
  textHold?: number             // seconds the text stays up before advancing
  onEnter?: () => void
  onProgress?: (t: number) => void
  onComplete?: () => void
}

type Phase = 'idle' | 'running' | 'text'

export class Workflow {
  private steps: Step[]
  private rig: CameraRig
  private text: TextReveal
  private hint: Hint
  private affordance: THREE.Group
  private onFinish: () => void

  private index = -1
  private progress = 0
  private holding = false
  private phase: Phase = 'idle'
  private textTimer = 0
  private registered = new Set<THREE.Object3D>()

  constructor(
    steps: Step[],
    interactions: Interactions,
    rig: CameraRig,
    text: TextReveal,
    hint: Hint,
    affordance: THREE.Group,
    onFinish: () => void
  ) {
    this.steps = steps
    this.rig = rig
    this.text = text
    this.hint = hint
    this.affordance = affordance
    this.onFinish = onFinish

    for (const step of steps) {
      const obj = step.target
      if (!obj || this.registered.has(obj)) continue
      this.registered.add(obj)
      interactions.add({
        object: obj,
        onHover: () => { if (this.isHoldFor(obj)) obj.scale.setScalar(1.05) },
        onUnhover: () => obj.scale.setScalar(1),
        onDown: () => { if (this.isHoldFor(obj)) this.holding = true },
        onUp: () => { this.holding = false },
      })
    }
  }

  start() { if (this.index === -1) this.advance() }
  restart() { this.index = -1; this.advance() }

  private current(): Step | null {
    return this.index >= 0 && this.index < this.steps.length ? this.steps[this.index] : null
  }

  private isHoldFor(obj: THREE.Object3D) {
    const s = this.current()
    return this.phase === 'running' && !!s && s.target === obj
  }

  private advance() {
    this.index++
    this.progress = 0
    this.holding = false
    this.affordance.visible = false
    this.hint.hide()

    if (this.index >= this.steps.length) {
      this.phase = 'idle'
      this.onFinish()
      return
    }

    const step = this.steps[this.index]
    this.phase = 'running'
    if (step.cam) this.rig.flyTo(step.cam.pos, step.cam.look, step.cam.duration ?? 1.6)
    step.onEnter?.()

    if (step.target) {
      const p = step.ringAt ?? step.target.getWorldPosition(new THREE.Vector3())
      this.affordance.position.set(p.x, p.y > 0 ? p.y : 0.92, p.z)
      this.affordance.userData.setProgress?.(0)
      this.affordance.visible = true
    }
    if (step.hint) this.hint.show(step.hint)
  }

  update(dt: number, time: number) {
    const step = this.current()
    if (!step) return

    if (this.phase === 'running') {
      if (step.auto !== undefined) {
        this.progress = Math.min(1, this.progress + dt / step.auto)
        step.onProgress?.(this.progress)
        if (this.progress >= 1) this.complete(step)
      } else if (step.target) {
        this.affordance.userData.update?.(time)
        this.affordance.userData.setProgress?.(this.progress)
        if (this.holding && this.progress < 1) {
          this.progress = Math.min(1, this.progress + dt / (step.hold ?? 2))
          step.onProgress?.(this.progress)
          if (this.progress >= 1) this.complete(step)
        }
      }
    } else if (this.phase === 'text') {
      this.textTimer -= dt
      if (this.textTimer <= 0) {
        this.text.hide()
        this.advance()
      }
    }
  }

  private complete(step: Step) {
    this.holding = false
    this.affordance.visible = false
    this.hint.hide()
    if (step.target) step.target.scale.setScalar(1)
    step.onComplete?.()

    if (step.label || step.body) {
      this.text.show(step.label ?? '', step.body ?? '')
      this.textTimer = step.textHold ?? 3.4
    } else {
      this.textTimer = step.textHold ?? 0.4
    }
    this.phase = 'text'
  }
}
