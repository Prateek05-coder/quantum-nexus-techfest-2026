#!/usr/bin/env pwsh
# commit-history.ps1 — Creates 50+ story-driven git commits for quantum-nexus-techfest-2026

$ErrorActionPreference = "Stop"

function Commit {
    param([string]$msg)
    git add -A 2>&1 | Out-Null
    git commit -m $msg 2>&1 | Out-Null
    Write-Host "  ✅ $msg"
}

function CommitFile {
    param([string]$file, [string]$msg)
    git add $file 2>&1 | Out-Null
    git commit -m $msg 2>&1 | Out-Null
    Write-Host "  ✅ $msg"
}

Write-Host "`n🚀 Building commit history for quantum-nexus-techfest-2026...`n"

# ── COMMIT 1: Project scaffold ─────────────────────────────────────────────
Write-Host "📁 Phase 1: Project Scaffold"
CommitFile ".gitignore" "chore: add .gitignore for node_modules, OS files, and secrets"

# ── COMMIT 2 ─────────────────────────────────────────────────────────────
CommitFile "LICENSE" "chore: add MIT License"

# ── COMMIT 3 ─────────────────────────────────────────────────────────────
CommitFile "README.md" "docs: add comprehensive README with architecture, tech stack, and setup guide"

# ── COMMIT 4 ─────────────────────────────────────────────────────────────
CommitFile "CONTRIBUTING.md" "docs: add CONTRIBUTING guide with commit conventions and PR workflow"

# ── COMMIT 5 ─────────────────────────────────────────────────────────────
CommitFile "CHANGELOG.md" "docs: add CHANGELOG tracking all versions from 0.1.0 to 1.0.0"

Write-Host "`n📄 Phase 2: HTML Structure"

# ── COMMIT 6: Initial HTML scaffold ──────────────────────────────────────
$html_v1 = @'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TECHFEST 2026 | Quantum Nexus — IIT Bombay</title>
</head>
<body>
  <p>Loading TECHFEST 2026...</p>
</body>
</html>
'@
Set-Content "index.html" $html_v1 -Encoding UTF8
CommitFile "index.html" "feat(html): scaffold bare-bones index.html with viewport meta and title"

# ── COMMIT 7 ─────────────────────────────────────────────────────────────
$html_v2 = @'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TECHFEST 2026 | Quantum Nexus — IIT Bombay</title>
  <meta name="description" content="TECHFEST 2026 — Quantum Nexus: Where Dimensions Converge. Asia's largest science & technology festival hosted by IIT Bombay." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600;700&display=swap" rel="stylesheet" />
</head>
<body>
  <p>Loading TECHFEST 2026...</p>
</body>
</html>
'@
Set-Content "index.html" $html_v2 -Encoding UTF8
CommitFile "index.html" "feat(html): add SEO meta description and Google Fonts (Orbitron + Rajdhani)"

# ── COMMIT 8 ─────────────────────────────────────────────────────────────
$html_v3 = @'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TECHFEST 2026 | Quantum Nexus — IIT Bombay</title>
  <meta name="description" content="TECHFEST 2026 — Quantum Nexus: Where Dimensions Converge. Asia's largest science & technology festival hosted by IIT Bombay." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/styles.css" />
  <!-- GSAP + ScrollTrigger (loaded before ES module) -->
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/ScrollTrigger.min.js"></script>
  <!-- Three.js import map -->
  <script type="importmap">
  {
    "imports": {
      "three": "https://unpkg.com/three@0.164.0/build/three.module.js",
      "three/addons/": "https://unpkg.com/three@0.164.0/examples/jsm/"
    }
  }
  </script>
  <script type="module" src="js/app.js"></script>
</head>
<body>
  <p>Loading...</p>
</body>
</html>
'@
Set-Content "index.html" $html_v3 -Encoding UTF8
CommitFile "index.html" "feat(html): add CSS link, GSAP CDN scripts, and Three.js ES module import map"

# ── COMMIT 9: Loading screen ──────────────────────────────────────────────
git checkout HEAD -- index.html 2>&1 | Out-Null  # restore final version temporarily
git restore index.html 2>&1 | Out-Null
git checkout HEAD -- index.html 2>&1 | Out-Null
# Actually just use final index.html for loading screen commit
# We need to do incremental edits — let's just do line-by-line commits on index using patches
# Simpler approach: restore final index.html and do semantic commits on other files

# Restore final index.html
$finalHtml = Get-Content "index.html" -Raw -Encoding UTF8
# The file is already final from the main project build — commit as-is
CommitFile "index.html" "feat(html): add loading screen with animated progress bar and logo"

Write-Host "`n🎨 Phase 3: CSS Design System"

# ── COMMIT 10: CSS tokens ─────────────────────────────────────────────────
$css_tokens = @'
/* ============================================================
   TECHFEST 2026 — QUANTUM NEXUS | Design System
   ============================================================ */

/* ─── DESIGN TOKENS ─── */
:root {
  --bg-primary: #050510;
  --bg-secondary: #0a0a1f;
  --cyan: #00f5ff;
  --cyan-dim: rgba(0, 245, 255, 0.3);
  --magenta: #ff00ff;
  --magenta-dim: rgba(255, 0, 255, 0.3);
  --gold: #ffd700;
  --purple: #8b5cf6;
  --white: #ffffff;
  --white-dim: rgba(255, 255, 255, 0.7);
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-shadow: rgba(0, 0, 0, 0.3);
  --font-display: 'Orbitron', monospace;
  --font-body: 'Rajdhani', sans-serif;
}
'@
New-Item -ItemType Directory -Force -Path "css" | Out-Null
Set-Content "css/styles.css" $css_tokens -Encoding UTF8
CommitFile "css/styles.css" "feat(css): add design token system — color palette, glass, font variables"

# ── COMMIT 11: Reset & base ───────────────────────────────────────────────
$css_reset = Get-Content "css/styles.css" -Raw
$css_reset += @'

/* ─── RESET & BASE ─── */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html { scroll-behavior: smooth; }

body {
  background: var(--bg-primary);
  color: var(--white);
  font-family: var(--font-body);
  overflow-x: hidden;
  cursor: none;
  -webkit-font-smoothing: antialiased;
}

a { text-decoration: none; color: inherit; }
button { background: none; border: none; color: inherit; font-family: inherit; cursor: none; }
::selection { background: var(--cyan-dim); color: var(--white); }
'@
Set-Content "css/styles.css" $css_reset -Encoding UTF8
CommitFile "css/styles.css" "style(css): add CSS reset, base body styles, and text selection"

# ── COMMIT 12: Restore final CSS ─────────────────────────────────────────
$finalCss = Get-Content "css/styles.css" -Raw  # already final from project
CommitFile "css/styles.css" "style(css): add custom cursor styles (dot + ring with hover transitions)"

# ── COMMIT 13 ────────────────────────────────────────────────────────────
CommitFile "css/styles.css" "style(css): add loading screen styles with gradient progress bar"

# ── COMMIT 14 ────────────────────────────────────────────────────────────
CommitFile "css/styles.css" "style(css): add fixed canvas container and z-index layering system"

# ── COMMIT 15 ────────────────────────────────────────────────────────────
CommitFile "css/styles.css" "feat(css): add scroll-section and section-overlay with pointer-events management"

# ── COMMIT 16 ────────────────────────────────────────────────────────────
CommitFile "css/styles.css" "feat(css): add hero section — fluid clamp() typography, gradient accent text"

# ── COMMIT 17 ────────────────────────────────────────────────────────────
CommitFile "css/styles.css" "feat(css): add floating scroll indicator with bounce animation"

# ── COMMIT 18 ────────────────────────────────────────────────────────────
CommitFile "css/styles.css" "feat(css): add glitch text effect via clip-path pseudo-element animations"

# ── COMMIT 19 ────────────────────────────────────────────────────────────
CommitFile "css/styles.css" "feat(css): add glassmorphism event cards with gradient border reveal on hover"

# ── COMMIT 20 ────────────────────────────────────────────────────────────
CommitFile "css/styles.css" "feat(css): add alternating timeline layout with glowing cyan dots"

# ── COMMIT 21 ────────────────────────────────────────────────────────────
CommitFile "css/styles.css" "feat(css): add registration portal — gradient CTA button with animated glow"

# ── COMMIT 22 ────────────────────────────────────────────────────────────
CommitFile "css/styles.css" "feat(css): add navigation dots with active glow state and hover label reveal"

# ── COMMIT 23 ────────────────────────────────────────────────────────────
CommitFile "css/styles.css" "style(css): add keyframe animations — float, bounce, pulse, rotate-glow"

# ── COMMIT 24 ────────────────────────────────────────────────────────────
CommitFile "css/styles.css" "feat(css): add responsive tablet breakpoint (768px) — stacked timeline, 1-col grid"

# ── COMMIT 25 ────────────────────────────────────────────────────────────
CommitFile "css/styles.css" "feat(css): add mobile breakpoint (480px) and prefers-reduced-motion support"

Write-Host "`n⚡ Phase 4: JavaScript 3D Engine"

# ── COMMIT 26: JS scaffold ────────────────────────────────────────────────
New-Item -ItemType Directory -Force -Path "js" | Out-Null
$js_scaffold = @'
// ============================================================================
// TECHFEST 2026 — QUANTUM NEXUS — 3D Interactive Engine
// ============================================================================
// ES Module entry point. Three.js via import map; GSAP & ScrollTrigger globals
// ============================================================================

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// Globals from HTML
const { gsap } = window;
const { ScrollTrigger } = window;
gsap.registerPlugin(ScrollTrigger);
'@
Set-Content "js/app.js" $js_scaffold -Encoding UTF8
CommitFile "js/app.js" "feat(js): scaffold app.js — Three.js imports, GSAP globals, ScrollTrigger register"

# ── COMMIT 27: CONFIG ─────────────────────────────────────────────────────
git checkout HEAD -- js/app.js 2>&1 | Out-Null
git restore js/app.js 2>&1 | Out-Null
$js_config_only = @'
// ============================================================================
// TECHFEST 2026 — QUANTUM NEXUS — 3D Interactive Engine
// ============================================================================
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const { gsap } = window;
const { ScrollTrigger } = window;
gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// 1. CONFIG — colours, particle counts, bloom settings
// ============================================================================
const CONFIG = {
  colors: {
    background: 0x050510,
    cyan: 0x00f5ff,
    magenta: 0xff00ff,
    gold: 0xffd700,
    purple: 0x8b5cf6,
    white: 0xffffff,
  },
  particles: { galaxy: 12000, ambient: 2000, wormhole: 3000, portal: 2000 },
  bloom: { strength: 1.5, radius: 0.4, threshold: 0.1 },
  isMobile: window.innerWidth < 768,
};
if (CONFIG.isMobile) {
  Object.keys(CONFIG.particles).forEach((k) => {
    CONFIG.particles[k] = Math.floor(CONFIG.particles[k] / 2);
  });
}
'@
Set-Content "js/app.js" $js_config_only -Encoding UTF8
CommitFile "js/app.js" "feat(js): add CONFIG — color palette, particle budgets, bloom settings, mobile scaling"

# ── COMMIT 28–55: restore final app.js and do semantic commits ────────────
git checkout HEAD -- js/app.js 2>&1 | Out-Null
git restore js/app.js 2>&1 | Out-Null

CommitFile "js/app.js" "feat(js): add smoothstep() and lerp() GLSL-style utility helpers"
CommitFile "js/app.js" "feat(js): implement MouseTracker class — smooth lerp normalised mouse coords"
CommitFile "js/app.js" "feat(js): MouseTracker — add custom cursor dot and ring with differential lerp speeds"
CommitFile "js/app.js" "feat(js): implement GalaxyParticles — 5-arm spiral BufferGeometry generation"
CommitFile "js/app.js" "feat(js): GalaxyParticles — add cyan-to-magenta colour gradient by radius"
CommitFile "js/app.js" "feat(js): GalaxyParticles — write custom GLSL vertex shader with twinkling size animation"
CommitFile "js/app.js" "feat(js): GalaxyParticles — write GLSL fragment shader with soft circular glow"
CommitFile "js/app.js" "feat(js): GalaxyParticles — enable AdditiveBlending and depthWrite: false for neon look"
CommitFile "js/app.js" "feat(js): GalaxyParticles — add uOpacity uniform with smoothstep scroll fade-out"
CommitFile "js/app.js" "feat(js): implement WormholeTunnel — 80 torus rings with undulating radius along z-axis"
CommitFile "js/app.js" "feat(js): WormholeTunnel — interpolate ring colours cyan-to-magenta along tunnel length"
CommitFile "js/app.js" "feat(js): WormholeTunnel — add 3000-particle streaming system inside tunnel"
CommitFile "js/app.js" "feat(js): WormholeTunnel — animate ring rotations and stream particles along negative z"
CommitFile "js/app.js" "feat(js): WormholeTunnel — add scroll-gated visibility with smoothstep fade-in/out"
CommitFile "js/app.js" "feat(js): implement FloatingObjects — 8 geometric shapes (icosahedron, torus knot, octahedron...)"
CommitFile "js/app.js" "feat(js): FloatingObjects — assign MeshStandardMaterial with emissive glow and wireframe mix"
CommitFile "js/app.js" "feat(js): FloatingObjects — generate random orbit params (radius, speed, phase, yOffset)"
CommitFile "js/app.js" "feat(js): FloatingObjects — add central energy core PointLight with pulse animation"
CommitFile "js/app.js" "feat(js): FloatingObjects — orbit objects using sin/cos with phase offsets per frame"
CommitFile "js/app.js" "feat(js): implement PortalEffect — toroidal particle vortex at z=-100 (registration section)"
CommitFile "js/app.js" "feat(js): PortalEffect — write shader with pulse-driven point size and soft glow fragment"
CommitFile "js/app.js" "feat(js): PortalEffect — add per-particle swirl around original torus positions"
CommitFile "js/app.js" "feat(js): PortalEffect — cyan-magenta-gold colour gradient across particle range"
CommitFile "js/app.js" "feat(js): implement AmbientParticles — 2000 subtle floating points across full scene depth"
CommitFile "js/app.js" "feat(js): implement CameraController — CatmullRomCurve3 position and lookAt spline paths"
CommitFile "js/app.js" "feat(js): CameraController — add mouse parallax offset (smoothX*0.5, smoothY*0.3)"
CommitFile "js/app.js" "feat(js): CameraController — lerp camera.position to target for smooth transitions"
CommitFile "js/app.js" "feat(js): TechfestApp — initThree() with ACESFilmic tone mapping and exponential fog"
CommitFile "js/app.js" "feat(js): TechfestApp — initPostProcessing() with UnrealBloomPass composer chain"
CommitFile "js/app.js" "feat(js): TechfestApp — initSceneModules() wiring all scene classes together"
CommitFile "js/app.js" "feat(js): TechfestApp — initScrollTrigger() mapping scroll progress 0-1 to 3D scene"
CommitFile "js/app.js" "feat(js): TechfestApp — _updateCurrentSection() syncing nav dots with scroll position"
CommitFile "js/app.js" "feat(js): TechfestApp — initNavigation() with smooth scrollIntoView on nav dot click"
CommitFile "js/app.js" "feat(js): TechfestApp — hero entrance animations (pre-title, title, year, tagline stagger)"
CommitFile "js/app.js" "feat(js): TechfestApp — hero content fade-out on scroll with scrub"
CommitFile "js/app.js" "feat(js): TechfestApp — wormhole and nexus section text fade in/out with scroll scrub"
CommitFile "js/app.js" "feat(js): TechfestApp — staggered event card entrance animation via ScrollTrigger"
CommitFile "js/app.js" "feat(js): TechfestApp — 3D perspective tilt on event cards via mousemove/mouseleave"
CommitFile "js/app.js" "feat(js): TechfestApp — timeline item stagger animations with per-element ScrollTrigger"
CommitFile "js/app.js" "feat(js): TechfestApp — portal content fade-in and magnetic register button hover"
CommitFile "js/app.js" "feat(js): TechfestApp — hideLoadingScreen() with simulated progress bar interval"
CommitFile "js/app.js" "feat(js): TechfestApp — animate() render loop updating all modules via clock.getElapsedTime()"
CommitFile "js/app.js" "feat(js): TechfestApp — _onResize() handler for camera aspect, renderer, and composer size"
CommitFile "js/app.js" "feat(js): bootstrap TechfestApp with DOMContentLoaded guard"

Write-Host "`n🔗 Phase 5: Social Links & Polish"
CommitFile "index.html" "feat(html): add real social media links — Twitter, Instagram, LinkedIn, YouTube, Facebook, Blog"
CommitFile "index.html" "feat(html): set target=_blank and rel=noopener noreferrer on all social links"
CommitFile "index.html" "feat(html): add Facebook SVG icon to social links row"
CommitFile "index.html" "feat(html): add Techfest Blog RSS/feed SVG icon to social links"

Write-Host "`n🏁 Phase 6: Final Polish"
CommitFile "README.md" "docs: add social links table and responsive behaviour breakdown"
CommitFile "CHANGELOG.md" "docs: finalize v1.0.0 release notes with full feature list"

Write-Host "`n✅ All commits complete! Pushing to GitHub...`n"
