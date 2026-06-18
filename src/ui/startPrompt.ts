export class StartPrompt {
  private el: HTMLDivElement

  constructor(root: HTMLElement, onStart: () => void) {
    this.el = document.createElement('div')
    this.el.textContent = 'make a coffee'
    this.el.style.cssText = [
      'position:absolute', 'left:50%', 'bottom:14%', 'transform:translateX(-50%)',
      'color:#c9a14a', "font-family:Georgia,'Times New Roman',serif",
      'font-size:18px', 'letter-spacing:5px', 'text-transform:uppercase',
      'cursor:pointer', 'pointer-events:auto', 'opacity:0',
      'transition:opacity 1.5s ease', 'user-select:none'
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