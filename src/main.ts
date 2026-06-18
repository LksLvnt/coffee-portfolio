import * as THREE from 'three'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x0a0805)
scene.fog = new THREE.Fog(0x0a0805, 8, 20)

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 1.6, 5)
camera.lookAt(0, 1.2, 0)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.2
document.body.appendChild(renderer.domElement)

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
  renderer.render(scene, camera)
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

animate()