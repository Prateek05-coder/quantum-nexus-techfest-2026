# Changelog

All notable changes to **Quantum Nexus — TECHFEST 2026** are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.0.0] — 2026-07-13

### 🎉 Initial Release — Full Launch

#### Added
- Complete 6-section scroll-driven 3D experience
- `GalaxyParticles` — 12,000-particle 5-arm spiral galaxy with custom GLSL twinkling shader
- `WormholeTunnel` — 80 neon torus rings + 3,000 streaming particles
- `FloatingObjects` — 8 orbiting geometries (icosahedron, torus knot, octahedron, tetrahedron, dodecahedron, torus, cone, cube)
- `PortalEffect` — 2,000-particle toroidal vortex at the registration section
- `AmbientParticles` — 2,000 subtle ambient particles spanning full scene depth
- `CameraController` — CatmullRomCurve3 scroll-driven spline with mouse parallax
- `MouseTracker` — Smooth lerped custom cursor (dot + ring) with hover state
- UnrealBloom post-processing pass (strength 1.5, radius 0.4, threshold 0.1)
- GSAP ScrollTrigger orchestration — hero entrance, section fade in/out, card stagger
- 3D perspective tilt on event cards via mousemove
- Magnetic hover effect on registration button
- Glassmorphism event cards with gradient border reveal
- CSS glitch text effect using `clip-path` animations
- Alternating timeline layout (2003 → 2026)
- Toroidal portal vortex with swirl animation
- Loading screen with simulated progress bar
- Navigation dots with active glow state and hover labels
- Real social media links (Twitter, Instagram, LinkedIn, YouTube, Facebook, Blog)
- Mobile-responsive design with adaptive particle counts
- `prefers-reduced-motion` accessibility support
- MIT License, README, CONTRIBUTING, CHANGELOG

#### Technical
- Three.js r164 via ES module import map (no bundler required)
- GSAP 3.12.7 + ScrollTrigger via CDN globals
- Orbitron + Rajdhani Google Fonts
- ACESFilmic tone mapping on renderer
- Exponential fog for depth cueing
- AdditiveBlending on all particle systems
- Zero build tools — pure HTML/CSS/JS

---

## [0.5.0] — 2026-07-12 (Pre-release)

### Added
- Registration portal section with social links
- Techfest Journey timeline (2003–2026)
- Event Showcase with glassmorphism cards

---

## [0.4.0] — 2026-07-11 (Pre-release)

### Added
- Innovation Nexus section with FloatingObjects
- GSAP section text fade animations

---

## [0.3.0] — 2026-07-10 (Pre-release)

### Added
- WormholeTunnel with ring + particle system
- Scroll-driven camera path (CatmullRom spline)

---

## [0.2.0] — 2026-07-09 (Pre-release)

### Added
- GalaxyParticles with custom GLSL shader
- MouseTracker with smooth lerp
- UnrealBloom post-processing

---

## [0.1.0] — 2026-07-08 (Pre-release)

### Added
- Project scaffold (HTML, CSS, JS structure)
- Three.js scene, camera, renderer setup
- Design system CSS tokens
- Loading screen
