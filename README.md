# ☕ coffee-portfolio

An interactive 3D coffee bar — my portfolio, told as a barista workflow.

Grind, tamp, pull, steam and pour your way through it. Each step of making
a coffee reveals a little more about who I am and what I build; when the cup
is served, the lights flicker and the bar resets for another round.

## Stack

- [Three.js](https://threejs.org/) — the room, the machines, the coffee
- [GSAP](https://gsap.com/) — camera rail + prop animation
- Vite + vanilla TypeScript — no framework, just a render loop

Everything in the scene is procedural: geometry from primitives, textures
drawn on `<canvas>` at startup. No model files, no asset pipeline.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build to dist/
```

## How it's put together

```
src/
├── main.ts               # scene assembly + the barista workflow steps
├── interactions/
│   ├── workflow.ts       # step engine: holds, autos, camera, hints, loop
│   └── raycaster.ts      # hover/hold picking + drag-to-look-around
├── scene/                # room shell, lighting rig, camera rail, textures
├── objects/              # machine, grinder, portafilter, pitcher, decor…
└── ui/                   # title card, prompts, hints, text reveals
```
