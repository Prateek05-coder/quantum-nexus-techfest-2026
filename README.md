# 🚀 QUANTUM NEXUS — TECHFEST 2026

<div align="center">

![TECHFEST 2026](https://img.shields.io/badge/TECHFEST-2026-00f5ff?style=for-the-badge&labelColor=050510&color=00f5ff)
![Three.js](https://img.shields.io/badge/Three.js-r164-ff00ff?style=for-the-badge&logo=threedotjs&logoColor=white&labelColor=050510)
![GSAP](https://img.shields.io/badge/GSAP-3.12.7-ffd700?style=for-the-badge&labelColor=050510)
![WebGL](https://img.shields.io/badge/WebGL-2.0-8b5cf6?style=for-the-badge&labelColor=050510)
![License](https://img.shields.io/badge/License-MIT-00f5ff?style=for-the-badge&labelColor=050510)

**Where Dimensions Converge**

*An immersive 3D scroll-driven experience for Asia's largest science & technology festival*

[🎓 IIT Bombay](https://www.iitbombay.org) · [🎪 Techfest](https://www.techfest.org)

</div>

---

## ✨ Overview

**Quantum Nexus** is a cinematic, scroll-driven 3D website built for **IIT Bombay's TECHFEST 2026** — Asia's largest science and technology festival. As you scroll, the camera journeys through six breathtaking scenes rendered entirely in WebGL:

1. 🌌 **Cosmic Gateway** — A 5-arm spiral galaxy of 12,000 twinkling particles
2. 🌀 **The Wormhole** — 80 neon torus rings with 3,000 streaming data particles
3. ⚛️ **Innovation Nexus** — 8 geometric objects orbiting a pulsing energy core
4. 🏆 **Event Showcase** — Glassmorphism cards with 3D perspective tilt
5. 📅 **Timeline** — Alternating milestone nodes (2003 → 2026)
6. 🔮 **Registration Portal** — Toroidal particle vortex CTA

---

## 🎯 Key Features

| Feature | Details |
|---------|---------|
| **3D Engine** | Three.js r164 with WebGL 2.0 |
| **Scroll Animation** | GSAP ScrollTrigger — scroll is a pure function of progress (0→1) |
| **Particles** | 19,000+ across galaxy, wormhole, portal & ambient systems |
| **Custom Shaders** | Hand-written GLSL vertex & fragment shaders for particles |
| **Post-Processing** | UnrealBloom pass for neon glow (strength 1.5, radius 0.4) |
| **Camera Path** | CatmullRomCurve3 spline with mouse-driven parallax |
| **Typography** | Orbitron (headings) + Rajdhani (body) via Google Fonts |
| **Glassmorphism** | `backdrop-filter: blur(20px)` with gradient border reveals |
| **Custom Cursor** | Smooth lerped dot + ring with hover state transitions |
| **Responsive** | Mobile-adaptive particle counts, touch-scroll support |
| **Accessibility** | `prefers-reduced-motion` media query |
| **No Build Tools** | Pure HTML/CSS/JS, CDN dependencies only |

---

## 🏗️ Architecture

```
quantum-nexus-techfest-2026/
├── index.html              # Entry point — DOM structure, import map, CDN scripts
├── css/
│   └── styles.css          # Design system — tokens, glassmorphism, animations, responsive
├── js/
│   └── app.js              # 3D engine — 9 classes, 1154 lines
│       ├── CONFIG           # Color palette, particle counts, bloom settings
│       ├── MouseTracker     # Smooth lerped cursor + parallax
│       ├── GalaxyParticles  # 5-arm spiral galaxy with custom GLSL
│       ├── WormholeTunnel   # 80 torus rings + streaming particles
│       ├── FloatingObjects  # 8 orbiting geometries around energy core
│       ├── PortalEffect     # Toroidal vortex at journey's end
│       ├── AmbientParticles # Subtle depth throughout all sections
│       ├── CameraController # CatmullRom spline scroll-driven camera
│       └── TechfestApp      # Orchestrator — Three.js, bloom, GSAP, nav
└── README.md
```

---

## 🚀 Tech Stack

- **[Three.js](https://threejs.org/)** r164 — 3D rendering engine (via ES module import map)
- **[GSAP](https://greensock.com/gsap/)** 3.12.7 + ScrollTrigger — Scroll-driven animation orchestration
- **[Google Fonts](https://fonts.google.com/)** — Orbitron + Rajdhani typography
- **Vanilla HTML/CSS/JS** — No framework, no bundler, zero build step

---

## 🖥️ Running Locally

Since this uses ES modules and an import map, you need a local server (not `file://`):

```bash
# Python (built-in)
python -m http.server 8080

# Node.js
npx serve .

# VS Code
# Install "Live Server" extension → right-click index.html → Open with Live Server
```

Then open **http://localhost:8080** in Chrome, Firefox, or Edge.

> **Requirements:** Modern browser with WebGL 2.0 support (Chrome 90+, Firefox 90+, Edge 90+)

---

## 🎨 Design System

```css
:root {
  --bg-primary:  #050510;   /* Deep space black    */
  --cyan:        #00f5ff;   /* Electric cyan        */
  --magenta:     #ff00ff;   /* Neon magenta         */
  --gold:        #ffd700;   /* Techfest gold        */
  --purple:      #8b5cf6;   /* Quantum purple       */
}
```

---

## 📱 Responsive Behaviour

| Breakpoint | Changes |
|------------|---------|
| **Desktop** (`>768px`) | Full particle counts, custom cursor, desktop timeline |
| **Tablet** (`≤768px`) | Particle counts halved, stacked timeline, hidden cursor |
| **Mobile** (`≤480px`) | Further reduced typography, scroll indicator hidden |

---

## 🔗 Social Links

| Platform | Link |
|----------|------|
| 🎬 YouTube | [@techfestiitbombay_youtube](https://www.youtube.com/@techfestiitbombay_youtube) |
| 📘 Facebook | [iitbombaytechfest](https://facebook.com/iitbombaytechfest) |
| 🐦 Twitter/X | [@Techfest_IITB](https://twitter.com/Techfest_IITB) |
| 📝 Blog | [blog.techfest.org](https://blog.techfest.org) |
| 📸 Instagram | [@techfest_iitbombay](https://instagram.com/techfest_iitbombay) |
| 💼 LinkedIn | [techfest](https://www.linkedin.com/company/techfest) |

---

## 📄 License

MIT © 2026 [G. Meher Prateek](https://github.com/Prateek05-coder) · Built for [Techfest, IIT Bombay](https://www.techfest.org)

---

<div align="center">

Made with ❤️, Three.js, and way too many particles

**[⭐ Star this repo](https://github.com/Prateek05-coder/quantum-nexus-techfest-2026)** if it inspired you!

</div>
