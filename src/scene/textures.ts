import * as THREE from 'three'

function canvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return { c, ctx: c.getContext('2d')! }
}

function toTex(c: HTMLCanvasElement, repeat: [number, number] = [1, 1]) {
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.colorSpace = THREE.SRGBColorSpace
  tex.repeat.set(repeat[0], repeat[1])
  tex.anisotropy = 4
  return tex
}

function lerpHex(a: string, b: string, t: number) {
  const ai = parseInt(a.slice(1), 16)
  const bi = parseInt(b.slice(1), 16)
  const ar = (ai >> 16) & 255, ag = (ai >> 8) & 255, ab = ai & 255
  const br = (bi >> 16) & 255, bg = (bi >> 8) & 255, bb = bi & 255
  const r = Math.round(ar + (br - ar) * t)
  const g = Math.round(ag + (bg - ag) * t)
  const bl = Math.round(ab + (bb - ab) * t)
  return `rgb(${r},${g},${bl})`
}

// Vertical (wall) or horizontal (floor) wooden planks with grain + seams.
export function woodTexture(opts: {
  planks?: number
  vertical?: boolean
  light?: string
  dark?: string
  repeat?: [number, number]
} = {}) {
  const { c, ctx } = canvas(512, 512)
  const planks = opts.planks ?? 6
  const vertical = opts.vertical ?? true
  const light = opts.light ?? '#b98a55'
  const dark = opts.dark ?? '#7c5430'
  const step = 512 / planks

  for (let i = 0; i < planks; i++) {
    ctx.fillStyle = lerpHex(dark, light, 0.25 + Math.random() * 0.6)
    if (vertical) ctx.fillRect(i * step, 0, step + 1, 512)
    else ctx.fillRect(0, i * step, 512, step + 1)

    // grain streaks
    for (let g = 0; g < 46; g++) {
      ctx.strokeStyle = `rgba(50,32,16,${0.03 + Math.random() * 0.07})`
      ctx.lineWidth = 1
      ctx.beginPath()
      if (vertical) {
        const x = i * step + Math.random() * step
        ctx.moveTo(x, 0)
        ctx.bezierCurveTo(x + (Math.random() - 0.5) * 6, 170, x + (Math.random() - 0.5) * 6, 340, x + (Math.random() - 0.5) * 6, 512)
      } else {
        const y = i * step + Math.random() * step
        ctx.moveTo(0, y)
        ctx.bezierCurveTo(170, y + (Math.random() - 0.5) * 6, 340, y + (Math.random() - 0.5) * 6, 512, y + (Math.random() - 0.5) * 6)
      }
      ctx.stroke()
    }

    // dark seam between planks
    ctx.strokeStyle = 'rgba(28,16,6,0.7)'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    if (vertical) { ctx.moveTo(i * step, 0); ctx.lineTo(i * step, 512) }
    else { ctx.moveTo(0, i * step); ctx.lineTo(512, i * step) }
    ctx.stroke()
  }
  return toTex(c, opts.repeat ?? [1, 1])
}

// Chalkboard menu: dark slate with hand-written "Menu" + faint item lines.
export function menuTexture() {
  const { c, ctx } = canvas(420, 540)
  ctx.fillStyle = '#15110d'
  ctx.fillRect(0, 0, 420, 540)
  // chalk dust
  for (let i = 0; i < 600; i++) {
    ctx.fillStyle = `rgba(220,220,210,${Math.random() * 0.03})`
    ctx.fillRect(Math.random() * 420, Math.random() * 540, 2, 2)
  }
  ctx.fillStyle = '#efe7d2'
  ctx.font = 'italic 64px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.fillText('Menu', 210, 90)
  ctx.strokeStyle = 'rgba(230,225,210,0.7)'
  ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(120, 110); ctx.lineTo(300, 110); ctx.stroke()

  const items = [
    ['Espresso', '3.0'], ['Cortado', '3.5'], ['Flat White', '4.0'],
    ['Cappuccino', '4.0'], ['Pour Over', '4.5'], ['Cold Brew', '4.5'],
    ['House Blend', '3.5'],
  ]
  ctx.font = '30px Georgia, serif'
  items.forEach((it, i) => {
    const y = 180 + i * 48
    ctx.textAlign = 'left'
    ctx.fillStyle = '#e8e0cc'
    ctx.fillText(it[0], 56, y)
    ctx.textAlign = 'right'
    ctx.fillStyle = '#c9a14a'
    ctx.fillText(it[1], 364, y)
  })
  return toTex(c)
}

// Small kraft-paper label for the coffee jars.
export function labelTexture(text: string) {
  const { c, ctx } = canvas(256, 160)
  ctx.fillStyle = '#d8c39a'
  ctx.fillRect(0, 0, 256, 160)
  ctx.strokeStyle = '#5b3d1c'
  ctx.lineWidth = 6
  ctx.strokeRect(12, 12, 232, 136)
  ctx.fillStyle = '#3a2410'
  ctx.font = 'bold 40px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.fillText(text, 128, 92)
  ctx.font = '18px Georgia, serif'
  ctx.fillText('· roasted daily ·', 128, 122)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// Warm patterned floor rug.
export function rugTexture() {
  const { c, ctx } = canvas(512, 360)
  ctx.fillStyle = '#8a3120'
  ctx.fillRect(0, 0, 512, 360)
  // border bands
  const bands = ['#c98a3a', '#5e2415', '#d9b06a']
  bands.forEach((col, i) => {
    ctx.strokeStyle = col
    ctx.lineWidth = 10
    const m = 16 + i * 16
    ctx.strokeRect(m, m, 512 - m * 2, 360 - m * 2)
  })
  // central diamond motif
  ctx.fillStyle = '#d9b06a'
  for (let x = 96; x < 512; x += 80) {
    for (let y = 90; y < 360; y += 70) {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(Math.PI / 4)
      ctx.fillRect(-12, -12, 24, 24)
      ctx.restore()
    }
  }
  ctx.fillStyle = '#5e2415'
  for (let x = 56; x < 512; x += 80) {
    for (let y = 55; y < 360; y += 70) {
      ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill()
    }
  }
  return toTex(c)
}

// Vintage café wall poster: cream card, line-art cup, big word underneath.
export function posterTexture(word: string, accent = '#8a4b22') {
  const { c, ctx } = canvas(256, 340)
  ctx.fillStyle = '#efe4cd'
  ctx.fillRect(0, 0, 256, 340)
  ctx.strokeStyle = accent
  ctx.lineWidth = 5
  ctx.strokeRect(14, 14, 228, 312)

  ctx.strokeStyle = '#3a2410'
  ctx.lineWidth = 6
  ctx.lineCap = 'round'
  // cup body
  ctx.beginPath()
  ctx.moveTo(88, 130)
  ctx.bezierCurveTo(88, 190, 168, 190, 168, 130)
  ctx.closePath()
  ctx.stroke()
  // handle
  ctx.beginPath()
  ctx.arc(174, 145, 16, -Math.PI / 2, Math.PI / 2)
  ctx.stroke()
  // saucer
  ctx.beginPath()
  ctx.moveTo(70, 196); ctx.lineTo(186, 196)
  ctx.stroke()
  // steam curls
  ctx.lineWidth = 4
  for (const x of [110, 130, 150]) {
    ctx.beginPath()
    ctx.moveTo(x, 108)
    ctx.bezierCurveTo(x - 8, 92, x + 8, 78, x, 62)
    ctx.stroke()
  }

  ctx.fillStyle = '#3a2410'
  ctx.font = 'bold 34px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.fillText(word, 128, 262)
  ctx.font = '15px Georgia, serif'
  ctx.fillStyle = accent
  ctx.fillText('· est. Pécs ·', 128, 292)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// Latte-art rosetta sitting on a milk-crema surface (overlaid on the espresso).
export function latteArtTexture() {
  const { c, ctx } = canvas(256, 256)
  // milk crema base
  const grad = ctx.createRadialGradient(128, 110, 16, 128, 128, 128)
  grad.addColorStop(0, '#dcc098')
  grad.addColorStop(0.7, '#c0a073')
  grad.addColorStop(1, '#a37f54')
  ctx.beginPath(); ctx.arc(128, 128, 126, 0, Math.PI * 2)
  ctx.fillStyle = grad; ctx.fill()

  // rosetta — white milk foam
  ctx.fillStyle = '#fbf4e6'
  ctx.strokeStyle = '#fbf4e6'
  ctx.lineCap = 'round'
  ctx.lineWidth = 7
  ctx.beginPath(); ctx.moveTo(128, 52); ctx.lineTo(128, 214); ctx.stroke()

  const rows = 7
  for (let i = 0; i < rows; i++) {
    const y = 78 + i * 19
    const w = 54 - i * 5.5
    for (const s of [-1, 1]) {
      ctx.beginPath()
      ctx.moveTo(128, y - 12)
      ctx.quadraticCurveTo(128 + s * w, y - 8, 128 + s * w * 0.55, y + 16)
      ctx.quadraticCurveTo(128 + s * w * 0.2, y + 6, 128, y + 13)
      ctx.closePath()
      ctx.fill()
    }
  }
  // rounded top of the pour
  ctx.beginPath(); ctx.arc(128, 64, 18, 0, Math.PI * 2); ctx.fill()

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}
