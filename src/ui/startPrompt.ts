export class StartPrompt {
  private el: HTMLDivElement

  constructor(root: HTMLElement, onStart: () => void) {
    this.el = document.createElement('div')
    this.el.textContent = 'make a coffee'
    this.el.style.cssText = [
      'position:absolute', 'left:50%', 'bottom:15%', 'transform:translateX(-50%)',
      'color:#f1dca6', "font-family:Georgia,'Times New Roman',serif",
      'font-size:21px', 'letter-spacing:6px', 'text-transform:uppercase',
      'cursor:pointer', 'pointer-events:auto', 'opacity:0',
      'transition:opacity 1.5s ease', 'user-select:none',
      'padding:18px 44px', 'white-space:nowrap',
      'text-shadow:0 2px 10px rgba(0,0,0,0.85), 0 0 26px rgba(0,0,0,0.6)',
      'background:radial-gradient(ellipse at center, rgba(8,5,2,0.55) 0%, rgba(8,5,2,0) 72%)'
    ].join(';')
    root.appendChild(this.el)

    requestAnimationFrame(() => { this.el.style.opacity = '1' })
    this.el.addEventListener('click', () => {
      this.el.style.opacity = '0'
      this.el.style.pointerEvents = 'none'
      onStart()
    })
    this.pulse()
  }

  private pulse() {
    let t = 0
    const tick = () => {
      if (this.el.style.opacity === '0' && this.el.style.pointerEvents === 'none') return
      t += 0.03
      this.el.style.opacity = String(0.55 + Math.abs(Math.sin(t)) * 0.45)
      requestAnimationFrame(tick)
    }
    setTimeout(() => tick(), 1600)
  }
}