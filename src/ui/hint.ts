// Small instruction line shown during each workflow step ("hold to grind", …).
export class Hint {
  private el: HTMLDivElement

  constructor(root: HTMLElement) {
    this.el = document.createElement('div')
    this.el.style.cssText = [
      'position:absolute', 'left:50%', 'bottom:8%', 'transform:translateX(-50%)',
      'color:#f1dca6', "font-family:Georgia,'Times New Roman',serif",
      'font-size:13px', 'letter-spacing:4px', 'text-transform:uppercase',
      'opacity:0', 'transition:opacity 0.5s ease', 'pointer-events:none',
      'user-select:none', 'white-space:nowrap',
      'text-shadow:0 2px 8px rgba(0,0,0,0.85)',
    ].join(';')
    root.appendChild(this.el)
  }

  show(text: string) {
    this.el.textContent = text
    this.el.style.opacity = '1'
  }

  hide() {
    this.el.style.opacity = '0'
  }
}
