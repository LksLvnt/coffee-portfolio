// Name + tagline over the opening wide shot. Hidden while the workflow runs,
// shown again after each loop reset.
export class Title {
  private el: HTMLDivElement

  constructor(root: HTMLElement) {
    this.el = document.createElement('div')
    this.el.innerHTML =
      '<div style="font-size:clamp(26px,4.4vw,44px);letter-spacing:10px;text-transform:uppercase;">Levente Lokos</div>' +
      '<div style="width:52px;height:1px;background:#c9a14a;margin:16px auto;"></div>' +
      '<div style="font-size:clamp(11px,1.4vw,14px);letter-spacing:5px;text-transform:uppercase;color:#c8b492;">full-stack developer · a coffee-shaped portfolio</div>'
    this.el.style.cssText = [
      'position:absolute', 'left:50%', 'top:11%', 'transform:translateX(-50%)',
      'text-align:center', 'color:#f3e9d2', "font-family:Georgia,'Times New Roman',serif",
      'opacity:0', 'transition:opacity 1.6s ease', 'pointer-events:none',
      'user-select:none', 'white-space:nowrap',
      'text-shadow:0 2px 14px rgba(0,0,0,0.7)',
    ].join(';')
    root.appendChild(this.el)
  }

  show() { requestAnimationFrame(() => { this.el.style.opacity = '1' }) }
  hide() { this.el.style.opacity = '0' }
}
