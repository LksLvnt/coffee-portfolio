import * as THREE from 'three'
import gsap from 'gsap'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { buildMachine } from './objects/machine'
import { buildGrinder } from './objects/grinder'
import { buildCup } from './objects/cup'
import { Interactions } from './interactions/raycaster'
import { TextReveal } from './ui/textReveal'
import { CameraRig, type Station } from './scene/camera'
import { buildAffordance } from './scene/affordance'
import { Sequence, type StationDef } from './interactions/sequence'
import { StartPrompt } from './ui/startPrompt'
import { buildPour } from './objects/pour'


const scene = new THREE.Scene()
scene.background = new THREE.Color(0x0a0805)
scene.fog = new THREE.Fog(0x0a0805, 8, 20)

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
renderer.toneMappingExposure = 1.2
document.body.appendChild(renderer.domElement)

const pmrem = new THREE.PMREMGenerator(renderer)
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture

const ambient = new THREE.AmbientLight(0xfff5e0, 0.3)
scene.add(ambient)

const edisonBulb = new THREE.PointLight(0xffaa44, 3, 8)
edisonBulb.position.set(0, 3.2, -1)
edisonBulb.castShadow = true
scene.add(edisonBulb)

const windowLight = new THREE.DirectionalLight(0xfff0d0, 0.8)
windowLight.position.set(4, 3, 2)
windowLight.castShadow = true
scene.add(windowLight)

const floorGeo = new THREE.PlaneGeometry(10, 10)
const floorMat = new THREE.MeshStandardMaterial({ color: 0x5c3d1e, roughness: 0.9, metalness: 0.0 })
const floor = new THREE.Mesh(floorGeo, floorMat)
floor.rotation.x = -Math.PI / 2
floor.receiveShadow = true
scene.add(floor)

const wallMat = new THREE.MeshStandardMaterial({ color: 0x6b4c2a, roughness: 0.95, metalness: 0.0 })

const backWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), wallMat)
backWall.position.set(0, 2.5, -3)
scene.add(backWall)

const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), wallMat)
leftWall.position.set(-5, 2.5, 2)
leftWall.rotation.y = Math.PI / 2
scene.add(leftWall)

const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), wallMat)
rightWall.position.set(5, 2.5, 2)
rightWall.rotation.y = -Math.PI / 2
scene.add(rightWall)

const counterMat = new THREE.MeshStandardMaterial({ color: 0x3d2008, roughness: 0.8, metalness: 0.05 })
const counter = new THREE.Mesh(new THREE.BoxGeometry(4, 0.9, 0.8), counterMat)
counter.position.set(0, 0.45, -1)
counter.castShadow = true
counter.receiveShadow = true
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

const bulbGeo = new THREE.SphereGeometry(0.06, 16, 16)
const bulbMat = new THREE.MeshStandardMaterial({ color: 0xffcc44, emissive: 0xffaa22, emissiveIntensity: 4 })
const bulb = new THREE.Mesh(bulbGeo, bulbMat)
bulb.position.copy(edisonBulb.position)
scene.add(bulb)

let time = 0
function animate() {
  requestAnimationFrame(animate)
  time += 0.01
  edisonBulb.intensity = 3 + Math.sin(time * 1.3) * 0.15
  sequence.update(time)
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