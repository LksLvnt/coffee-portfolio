export class TextReveal {
  private el: HTMLDivElement

  constructor(root: HTMLElement) {
    this.el = document.createElement('div')
    this.el.style.cssText = [
      'position:absolute', 'left:50%', 'bottom:12%', 'transform:translateX(-50%)',
      'max-width:520px', 'text-align:center', 'color:#f3e9d2',
      "font-family:Georgia,'Times New Roman',serif", 'opacity:0',
      'transition:opacity 1.2s ease', 'pointer-events:none', 'padding:0 24px'
    ].join(';')
    root.appendChild(this.el)
  }

  show(label: string, body: string) {
    this.el.innerHTML =
      `<div style="font-size:13px;letter-spacing:4px;text-transform:uppercase;color:#c9a14a;margin-bottom:14px;">${label}</div>` +
      `<div style="font-size:19px;line-height:1.7;font-weight:300;">${body}</div>`
    this.el.style.opacity = '1'
  }

  hide() { this.el.style.opacity = '0' }
}