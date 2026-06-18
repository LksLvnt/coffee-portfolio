import * as THREE from 'three'
import gsap from 'gsap'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { buildRoom } from './scene/room'
import { setupLighting } from './scene/lighting'
import { buildCounter } from './objects/counter'
import { buildDecor } from './objects/decor'
import { buildMachine } from './objects/machine'
import { buildGrinder } from './objects/grinder'
import { buildCup } from './objects/cup'
import { buildPour } from './objects/pour'
import { Interactions } from './interactions/raycaster'
import { TextReveal } from './ui/textReveal'
import { CameraRig, type Station } from './scene/camera'
import { buildAffordance } from './scene/affordance'
import { Sequence, type StationDef } from './interactions/sequence'
import { StartPrompt } from './ui/startPrompt'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x2a1d12)
scene.fog = new THREE.Fog(0x2a1d12, 14, 34)

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
const stations: Station[] = [
  { pos: new THREE.Vector3(0, 1.6, 4.5), look: new THREE.Vector3(0, 1.1, -1) },
  { pos: new THREE.Vector3(-1.3, 1.25, -0.1), look: new THREE.Vector3(-1.3, 1.0, -1.05) },
  { pos: new THREE.Vector3(0, 1.3, 0.2), look: new THREE.Vector3(0, 1.15, -1.15) },
  { pos: new THREE.Vector3(1.2, 1.25, 0.0), look: new THREE.Vector3(1.2, 1.0, -0.95) },
]
const rig = new CameraRig(camera, stations)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.1
document.body.appendChild(renderer.domElement)

const pmrem = new THREE.PMREMGenerator(renderer)
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture

const { edisonBulb } = setupLighting(scene)

scene.add(buildRoom())
scene.add(buildDecor())

const counter = buildCounter()
counter.position.set(0, 0, -1)
scene.add(counter)

const machine = buildMachine()
machine.position.set(0, 0.9, -1.15)
scene.add(machine)

const grinder = buildGrinder()
grinder.position.set(-1.3, 0.9, -1.05)
scene.add(grinder)

const cup = buildCup()
cup.position.set(1.2, 0.9, -0.95)
scene.add(cup)

const pour = buildPour()
pour.position.set(-0.32, 1.02, -0.85)
scene.add(pour)

const affordance = buildAffordance()
scene.add(affordance)

let time = 0
function animate() {
  requestAnimationFrame(animate)
  time += 0.01
  // warm Edison flicker — slow breathe plus a faint high-frequency shimmer
  edisonBulb.intensity = 2.4 + Math.sin(time * 1.3) * 0.12 + Math.sin(time * 7.7) * 0.03
  sequence.update()
  rig.update()
  renderer.render(scene, camera)
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

const interactions = new Interactions(camera, renderer.domElement)
const textReveal = new TextReveal(document.getElementById('ui')!)

const stationDefs: StationDef[] = [
  {
    object: grinder,
    label: 'Grind · 01',
    body: "I'm Levente — a developer from Pécs who builds things in order to understand them. Skateboards, espresso, and clean code, roughly in that order.",
    hold: 2,
    onProgress: (t) => {
      const beans = grinder.userData.beans as THREE.Group
      beans.children.forEach((b, i) => {
        b.position.y = 0.48 + Math.abs(Math.sin(performance.now() * 0.02 + i)) * 0.04 * (1 - t * 0.5)
      })
    },
  },
  {
    object: machine,
    label: 'Pull · 02',
    body: 'I work in Angular and TypeScript by day, and reach for FastAPI, Spring Boot, and Docker when a project demands more. I learn by shipping.',
    hold: 2.5,
    onArrive: (ready) => {
      gsap.to(cup.position, {
        x: -0.32, z: -0.85, duration: 0.9, ease: 'power2.inOut',
        onComplete: ready
      })
    },
    onProgress: (t) => {
      pour.visible = t > 0.15 && t < 0.95
      const coffee = cup.userData.coffee as THREE.Mesh
      coffee.visible = true
      const fill = Math.min(t, 1)
      coffee.scale.y = fill * 40
      coffee.position.y = 0.018 + fill * 0.03
      const mat = coffee.material as THREE.MeshStandardMaterial
      mat.color.setRGB(0.16 + fill * 0.25, 0.08 + fill * 0.14, 0.03 + fill * 0.04)
    },
    onComplete: () => {
      pour.visible = false
      gsap.to(cup.position, { x: 1.2, z: -0.95, duration: 1.0, ease: 'power2.inOut' })
    },
  },
  {
    object: cup,
    label: 'Pour · 03',
    body: 'StudyMate, UniTools, a municipal platform in production — I build full things, not demos. Each one taught me something the last one couldn\'t.',
    hold: 2,
  },
]

const sequence = new Sequence(stationDefs, interactions, rig, textReveal, affordance)

new StartPrompt(document.getElementById('ui')!, () => {
  rig.setIdle(false)
  sequence.start()
})

animate()
