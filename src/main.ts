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
import { buildPortafilter } from './objects/portafilter'
import { buildTamper } from './objects/tamper'
import { buildMilkPitcher } from './objects/pitcher'
import { buildSteam, updateSteam } from './objects/steam'
import { Interactions } from './interactions/raycaster'
import { TextReveal } from './ui/textReveal'
import { Hint } from './ui/hint'
import { CameraRig, type Station } from './scene/camera'
import { buildAffordance } from './scene/affordance'
import { Workflow, type Step } from './interactions/workflow'
import { StartPrompt } from './ui/startPrompt'

// ---------- scene / camera / renderer ----------
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x2a1d12)
scene.fog = new THREE.Fog(0x2a1d12, 14, 34)

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
const stations: Station[] = [
  { pos: new THREE.Vector3(0, 1.6, 4.5), look: new THREE.Vector3(0, 1.1, -1) },
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

// ---------- static set ----------
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

// ---------- workflow props ----------
const DOCK = new THREE.Vector3(-0.32, 1.04, -0.81)        // portafilter locked on the machine
const DOCK_LIFT = new THREE.Vector3(-0.32, 1.2, -0.64)    // lifted clear of the head
const GRIND_POS = new THREE.Vector3(-1.3, 0.97, -0.82)    // held under the grinder chute
const CUP_START = new THREE.Vector3(1.2, 0.9, -0.95)
const CUP_UNDER = new THREE.Vector3(-0.32, 0.9, -0.78)    // under the group, catching the shot
const CUP_ART = new THREE.Vector3(-0.15, 0.9, -0.52)      // clear spot, out from under the group, for the pour
const CUP_SERVE = new THREE.Vector3(-0.12, 0.92, 0.32)    // slid toward the camera
const PITCHER_PARK = new THREE.Vector3(0.55, 0.9, -0.78)
const STEAM_POS = new THREE.Vector3(-0.62, 0.9, -0.82)    // pitcher under the steam wand
const ART_POS = new THREE.Vector3(-0.15, 1.12, -0.52)     // pitcher directly above the cup
const TAMP_PARK = new THREE.Vector3(-1.88, 0.92, -0.66)

const cup = buildCup()
cup.position.copy(CUP_START)
scene.add(cup)

const pour = buildPour()
pour.position.set(-0.32, 0.99, -0.78)
scene.add(pour)

const portafilter = buildPortafilter()
portafilter.position.copy(DOCK)
scene.add(portafilter)

const tamper = buildTamper()
tamper.position.copy(TAMP_PARK)
tamper.visible = false
scene.add(tamper)

const pitcher = buildMilkPitcher()
pitcher.position.copy(PITCHER_PARK)
scene.add(pitcher)

const steam = buildSteam()
steam.position.set(-0.62, 1.03, -0.82)
scene.add(steam)

// thin pour streams — grounds out of the grinder, milk into the cup
function buildStream(color: number, opacity: number): THREE.Mesh {
  const m = new THREE.Mesh(
    new THREE.CylinderGeometry(0.006, 0.004, 0.1, 8),
    new THREE.MeshStandardMaterial({ color, roughness: 0.35, transparent: true, opacity })
  )
  m.visible = false
  return m
}
const groundsStream = buildStream(0x4a2a12, 0.75)
groundsStream.position.set(-1.3, 1.02, -0.83)
groundsStream.rotation.x = 0.3
scene.add(groundsStream)
const milkStream = buildStream(0xfbf6ec, 0.9)
milkStream.position.set(-0.15, 1.02, -0.52)
scene.add(milkStream)

const affordance = buildAffordance()
scene.add(affordance)

let steamIntensity = 0

// ---------- camera framings ----------
const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)
const CAM = {
  detach: { pos: v(-0.5, 1.42, 0.75), look: v(-0.82, 1.0, -0.9), duration: 2.0 }, // wide: watch it travel
  machine: { pos: v(-0.04, 1.16, -0.12), look: v(-0.32, 1.0, -0.82) },            // the group head (lock in)
  grind: { pos: v(-1.06, 1.22, -0.42), look: v(-1.3, 0.99, -0.86) },              // angled down into the basket
  tamp: { pos: v(-1.12, 1.2, -0.4), look: v(-1.3, 0.99, -0.84) },
  pull: { pos: v(0.18, 1.04, -0.34), look: v(-0.3, 0.97, -0.82) },                // 3/4 from the right, clears the handle
  steam: { pos: v(-0.56, 1.12, -0.06), look: v(-0.62, 0.96, -0.85) },
  art: { pos: v(-0.1, 1.34, 0.02), look: v(-0.15, 0.98, -0.52) },                 // top-down on the pour
  serve: { pos: v(-0.12, 1.34, 0.5), look: v(-0.12, 0.96, -0.18) },               // top-down hero, rosetta visible
}

// ---------- helpers ----------
const grounds = () => portafilter.userData.grounds as THREE.Mesh
const coffee = () => cup.userData.coffee as THREE.Mesh
const latteArt = () => cup.userData.latteArt as THREE.Mesh

function resetScene() {
  portafilter.position.copy(DOCK)
  portafilter.rotation.set(0, 0, 0)
  grounds().visible = false
  grounds().scale.set(1, 0.001, 1)
  grounds().position.y = 0.012

  cup.position.copy(CUP_START)
  cup.rotation.set(0, 0, 0)
  const c = coffee()
  c.visible = false
  c.scale.set(1, 0.001, 1)
  c.position.y = 0.018
  ;(c.material as THREE.MeshStandardMaterial).color.setHex(0x2a1407)

  const a = latteArt()
  a.visible = false
  a.scale.set(1, 1, 1)
  ;(a.material as THREE.MeshStandardMaterial).opacity = 0

  pitcher.position.copy(PITCHER_PARK)
  pitcher.rotation.set(0, 0, 0)
  tamper.visible = false
  tamper.position.copy(TAMP_PARK)
  pour.visible = false
  steamIntensity = 0
  steam.visible = false
  groundsStream.visible = false
  milkStream.visible = false
  grinder.position.x = -1.3
}

// ---------- UI ----------
const ui = document.getElementById('ui')!
const interactions = new Interactions(camera, renderer.domElement)
interactions.onDrag = (dx, dy) => rig.addOrbit(dx, dy)
const textReveal = new TextReveal(ui)
const hint = new Hint(ui)

const fade = document.createElement('div')
fade.style.cssText =
  'position:fixed;inset:0;background:#0a0805;opacity:0;pointer-events:none;transition:none;z-index:5'
document.body.appendChild(fade)

// ---------- the barista workflow ----------
const steps: Step[] = [
  {
    id: 'detach',
    cam: CAM.detach,
    auto: 2.4,
    hint: 'taking the portafilter to the grinder',
    textHold: 0.3,
    onEnter: () => {
      gsap.timeline()
        .to(portafilter.rotation, { y: -0.5, duration: 0.5, ease: 'power1.in' })
        .to(portafilter.position, { y: DOCK_LIFT.y, z: DOCK_LIFT.z, duration: 0.5, ease: 'power2.out' })
        .to(portafilter.position, { x: GRIND_POS.x, y: GRIND_POS.y, z: GRIND_POS.z, duration: 1.0, ease: 'power2.inOut' })
        .to(portafilter.rotation, { y: 0, duration: 0.4 }, '-=0.6')
    },
  },
  {
    id: 'grind',
    cam: CAM.grind,
    target: grinder,
    ringAt: new THREE.Vector3(-1.3, 0, -0.86),
    hold: 2.2,
    hint: 'hold to grind',
    label: 'Grind · 01',
    body: "I'm Levente — a developer from Pécs who builds things in order to understand them. Skateboards, espresso, and clean code, roughly in that order.",
    onProgress: (t) => {
      const beans = grinder.userData.beans as THREE.Group
      beans.children.forEach((b, i) => {
        b.position.y = 0.48 + Math.abs(Math.sin(performance.now() * 0.02 + i)) * 0.04 * (1 - t * 0.5)
      })
      const g = grounds()
      g.visible = true
      g.scale.y = Math.max(0.001, t)
      g.position.y = 0.012 + t * 0.004
      groundsStream.visible = t < 0.96
      grinder.position.x = -1.3 + Math.sin(performance.now() * 0.05) * 0.004
    },
    onComplete: () => { groundsStream.visible = false; grinder.position.x = -1.3 },
  },
  {
    id: 'tamp',
    cam: CAM.tamp,
    target: portafilter,
    ringAt: new THREE.Vector3(-1.3, 0, -0.82),
    hold: 1.4,
    hint: 'hold to tamp',
    label: 'Tamp · 02',
    body: 'Measure, level, press. I care about the unglamorous parts — types, tests, the build staying green. The details are the work.',
    onEnter: () => {
      tamper.visible = true
      tamper.position.set(GRIND_POS.x, 1.16, GRIND_POS.z)
    },
    onProgress: (t) => {
      tamper.position.y = 1.16 - t * 0.16
      grounds().scale.y = 1 - t * 0.34
    },
    onComplete: () => {
      gsap.to(tamper.position, {
        y: 1.22, duration: 0.4, ease: 'power1.in',
        onComplete: () => { tamper.visible = false; tamper.position.copy(TAMP_PARK) },
      })
    },
  },
  {
    id: 'lock',
    cam: CAM.machine,
    auto: 1.9,
    hint: 'locking it in',
    textHold: 0.3,
    onEnter: () => {
      gsap.to(cup.position, { x: CUP_UNDER.x, y: CUP_UNDER.y, z: CUP_UNDER.z, duration: 1.0, ease: 'power2.inOut' })
      portafilter.rotation.y = -0.45
      gsap.timeline()
        .to(portafilter.position, { x: DOCK_LIFT.x, y: DOCK_LIFT.y, z: DOCK_LIFT.z, duration: 0.7, ease: 'power2.inOut' })
        .to(portafilter.position, { x: DOCK.x, y: DOCK.y, z: DOCK.z, duration: 0.45, ease: 'power2.in' })
        .to(portafilter.rotation, { y: 0, duration: 0.4, ease: 'power1.out' })
    },
  },
  {
    id: 'pull',
    cam: CAM.pull,
    target: machine,
    ringAt: CUP_UNDER,
    hold: 2.6,
    hint: 'hold to pull the shot',
    label: 'Pull · 03',
    body: 'Angular and TypeScript by day; FastAPI, Spring Boot, and Docker when a project asks for more. I learn by shipping.',
    onProgress: (t) => {
      pour.visible = t > 0.12 && t < 0.96
      const c = coffee()
      c.visible = true
      const fill = Math.min(t, 1)
      c.scale.y = Math.max(0.001, fill * 40)
      c.position.y = 0.018 + fill * 0.03
      ;(c.material as THREE.MeshStandardMaterial).color.setRGB(0.16 + fill * 0.22, 0.08 + fill * 0.12, 0.03 + fill * 0.04)
    },
    onComplete: () => { pour.visible = false },
  },
  {
    id: 'steam',
    cam: CAM.steam,
    target: pitcher,
    ringAt: new THREE.Vector3(-0.62, 0, -0.82),
    hold: 2.2,
    hint: 'hold to steam the milk',
    label: 'Steam · 04',
    body: "I like the messy middle — steaming, swirling, adjusting until it sits right. Most of what I know came from a project that fought back.",
    onEnter: () => {
      gsap.to(pitcher.position, { x: STEAM_POS.x, y: STEAM_POS.y, z: STEAM_POS.z, duration: 0.9, ease: 'power2.inOut' })
    },
    onProgress: (t) => {
      steamIntensity = t
      pitcher.position.x = STEAM_POS.x + Math.sin(performance.now() * 0.03) * 0.004 * t
    },
    onComplete: () => { steamIntensity = 0 },
  },
  {
    id: 'art',
    cam: CAM.art,
    target: pitcher,
    ringAt: new THREE.Vector3(-0.15, 0, -0.52),
    hold: 2.4,
    hint: 'pour the latte art',
    label: 'Pour · 05',
    body: "StudyMate, UniTools, a municipal platform in production — I build whole things, not demos. Each one taught me something the last couldn't.",
    onEnter: () => {
      // bring the cup out from under the group to a clear spot, pitcher above it
      gsap.to(cup.position, { x: CUP_ART.x, y: CUP_ART.y, z: CUP_ART.z, duration: 0.8, ease: 'power2.inOut' })
      gsap.timeline()
        .to(pitcher.position, { x: ART_POS.x, y: ART_POS.y, z: ART_POS.z, duration: 0.8, ease: 'power2.inOut' })
        .to(pitcher.rotation, { x: 0.9, duration: 0.45 }, '-=0.25')
    },
    onProgress: (t) => {
      milkStream.visible = t > 0.1 && t < 0.95
      const a = latteArt()
      a.visible = true
      ;(a.material as THREE.MeshStandardMaterial).opacity = Math.min(1, t * 1.15)
      a.scale.setScalar(0.5 + t * 0.5)
      ;(coffee().material as THREE.MeshStandardMaterial).color.setRGB(0.22 + t * 0.22, 0.13 + t * 0.16, 0.06 + t * 0.1)
    },
    onComplete: () => {
      milkStream.visible = false
      gsap.to(pitcher.rotation, { x: 0, duration: 0.4 })
      gsap.to(pitcher.position, { x: PITCHER_PARK.x, y: PITCHER_PARK.y, z: PITCHER_PARK.z, duration: 0.9, ease: 'power2.inOut' })
    },
  },
  {
    id: 'serve',
    cam: CAM.serve,
    auto: 2.2,
    hint: 'enjoy',
    label: 'Served · 06',
    body: "Thanks for stopping by. Let's build something.<br>lokoslevi12@gmail.com · github.com/LksLvnt",
    textHold: 4.8,
    onEnter: () => {
      gsap.to(cup.position, { x: CUP_SERVE.x, y: CUP_SERVE.y, z: CUP_SERVE.z, duration: 1.7, ease: 'power2.inOut' })
      gsap.to(cup.rotation, { y: Math.PI * 0.25, duration: 1.7 })
    },
  },
]

// ---------- loop reset ----------
let bulbAuto = true
function loopReset() {
  bulbAuto = false
  gsap.timeline({ onComplete: () => { bulbAuto = true } })
    .to(edisonBulb, { intensity: 5.5, duration: 0.07, yoyo: true, repeat: 5 }, 0)
    .to(fade, { opacity: 1, duration: 0.55, ease: 'power2.in' }, 0.1)
    .add(() => { resetScene(); rig.toIntro(0.1) }, 0.7)
    .to(fade, { opacity: 0, duration: 0.9, ease: 'power2.out' }, 0.85)
    .add(() => prompt.show('again?'), 1.7)
}

const workflow = new Workflow(steps, interactions, rig, textReveal, hint, affordance, loopReset)

const prompt = new StartPrompt(ui, () => {
  rig.setIdle(false)
  workflow.restart()
})

// ---------- loop ----------
const clock = new THREE.Clock()
function animate() {
  requestAnimationFrame(animate)
  const dt = Math.min(clock.getDelta(), 0.05)
  const time = clock.getElapsedTime()
  if (bulbAuto) edisonBulb.intensity = 2.4 + Math.sin(time * 1.3) * 0.12 + Math.sin(time * 7.7) * 0.03
  updateSteam(steam, steamIntensity, time)
  workflow.update(dt, time)
  rig.update()
  renderer.render(scene, camera)
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

prompt.show('make a coffee')
animate()
