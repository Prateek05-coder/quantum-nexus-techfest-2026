// ============================================================================
// TECHFEST 2026 â€” QUANTUM NEXUS â€” 3D Interactive Engine
// ============================================================================
// ES Module entry point. Three.js via import map; GSAP & ScrollTrigger as globals.
// ============================================================================

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// â”€â”€ Globals from HTML â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const { gsap } = window;
const { ScrollTrigger } = window;
gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// 1. CONFIG
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
  particles: {
    galaxy: 12000,
    ambient: 2000,
    wormhole: 3000,
    portal: 2000,
  },
  bloom: {
    strength: 1.5,
    radius: 0.4,
    threshold: 0.1,
  },
  isMobile: window.innerWidth < 768,
};

// Halve all particle counts on mobile for performance
if (CONFIG.isMobile) {
  Object.keys(CONFIG.particles).forEach((k) => {
    CONFIG.particles[k] = Math.floor(CONFIG.particles[k] / 2);
  });
}

// â”€â”€ Utility helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/** GLSL-style smoothstep */
function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** Linear interpolation */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/** Convert a hex int to a THREE.Color */
function hexColor(hex) {
  return new THREE.Color(hex);
}

// ============================================================================
// 2. MouseTracker
// ============================================================================

class MouseTracker {
  constructor() {
    /** Target (raw) normalised coordinates â€“1 â€¦ 1 */
    this.x = 0;
    this.y = 0;
    /** Smoothed (lerped) coordinates */
    this.smoothX = 0;
    this.smoothY = 0;

    // Raw pixel positions for the custom cursor
    this._clientX = window.innerWidth / 2;
    this._clientY = window.innerHeight / 2;

    // DOM handles
    this._cursorDot = document.querySelector('.cursor-dot');
    this._cursorRing = document.querySelector('.cursor-ring');

    // Internal lerped cursor positions
    this._dotX = this._clientX;
    this._dotY = this._clientY;
    this._ringX = this._clientX;
    this._ringY = this._clientY;

    window.addEventListener('mousemove', this._onMouseMove.bind(this));
    window.addEventListener('touchmove', this._onTouchMove.bind(this), { passive: true });
  }

  // â”€â”€ Private event handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  _onMouseMove(e) {
    this._clientX = e.clientX;
    this._clientY = e.clientY;
    this.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  _onTouchMove(e) {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      this._clientX = touch.clientX;
      this._clientY = touch.clientY;
      this.x = (touch.clientX / window.innerWidth) * 2 - 1;
      this.y = -(touch.clientY / window.innerHeight) * 2 + 1;
    }
  }

  // â”€â”€ Public â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  update() {
    // Smooth normalised values
    this.smoothX = lerp(this.smoothX, this.x, 0.08);
    this.smoothY = lerp(this.smoothY, this.y, 0.08);

    // Move custom cursor elements
    this._dotX = lerp(this._dotX, this._clientX, 0.25);
    this._dotY = lerp(this._dotY, this._clientY, 0.25);
    this._ringX = lerp(this._ringX, this._clientX, 0.12);
    this._ringY = lerp(this._ringY, this._clientY, 0.12);

    if (this._cursorDot) {
      this._cursorDot.style.transform = `translate(${this._dotX}px, ${this._dotY}px)`;
    }
    if (this._cursorRing) {
      this._cursorRing.style.transform = `translate(${this._ringX}px, ${this._ringY}px)`;
    }
  }
}

// ============================================================================
// 3. GalaxyParticles â€” Section 1: Cosmic Gateway
// ============================================================================

class GalaxyParticles {
  /**
   * @param {THREE.Scene} scene
   */
  constructor(scene) {
    const count = CONFIG.particles.galaxy;
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const cyanCol = hexColor(CONFIG.colors.cyan);
    const magentaCol = hexColor(CONFIG.colors.magenta);

    const ARMS = 5;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const branch = i % ARMS;
      const radius = Math.random() * 14.5 + 0.5; // 0.5 â€“ 15
      const branchAngle = (branch / ARMS) * Math.PI * 2;
      const spinAngle = radius * 0.5;
      const angle = branchAngle + spinAngle;

      // Spread decreases with radius â†’ tighter centre
      const spread = (1 - radius / 15) * 1.5 + 0.1;
      const rx = (Math.random() - 0.5) * spread;
      const ry = (Math.random() - 0.5) * 0.5;
      const rz = (Math.random() - 0.5) * spread;

      positions[i3] = Math.cos(angle) * radius + rx;
      positions[i3 + 1] = ry;
      positions[i3 + 2] = Math.sin(angle) * radius + rz;

      // Colour: inner â†’ cyan, outer â†’ magenta
      const t = radius / 15;
      const col = new THREE.Color().copy(cyanCol).lerp(magentaCol, t);
      colors[i3] = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;

      sizes[i] = Math.random() * 0.06 + 0.02;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

    // â”€â”€ Shader material â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uOpacity: { value: 1.0 },
      },
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uPixelRatio;
        attribute float aSize;
        attribute vec3 aColor;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          vec4 viewPosition  = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
          gl_Position = projectedPosition;

          float twinkle = sin(uTime * 2.0 + position.x * 10.0 + position.z * 10.0) * 0.5 + 0.5;
          gl_PointSize = aSize * uPixelRatio * 150.0 * twinkle;
          gl_PointSize *= (1.0 / -viewPosition.z);

          vColor = aColor;
          vAlpha = twinkle;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uOpacity;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;

          float strength = 1.0 - (dist * 2.0);
          strength = pow(strength, 2.0);

          gl_FragColor = vec4(vColor, strength * vAlpha * 0.8 * uOpacity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.mesh = new THREE.Points(geometry, this.material);
    scene.add(this.mesh);
  }

  /**
   * @param {number} time  elapsed seconds
   * @param {number} scrollProgress  0 â€“ 1
   */
  update(time, scrollProgress) {
    this.mesh.rotation.y = time * 0.05;
    this.material.uniforms.uTime.value = time;

    // Fade out as user scrolls past the hero section (roughly first 1/6)
    const sectionProgress = Math.min(1, scrollProgress * 6); // 0-1 within section 1
    const opacity = 1.0 - smoothstep(0.5, 1.0, sectionProgress);
    this.material.uniforms.uOpacity.value = opacity;
    this.mesh.visible = opacity > 0.01;
  }
}

// ============================================================================
// 4. WormholeTunnel â€” Section 2
// ============================================================================

class WormholeTunnel {
  /**
   * @param {THREE.Scene} scene
   */
  constructor(scene) {
    this.group = new THREE.Group();
    scene.add(this.group);

    // â”€â”€ Rings â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const RING_COUNT = 80;
    const TUNNEL_LENGTH = 200;
    const SPACING = TUNNEL_LENGTH / RING_COUNT;

    this.rings = [];
    const cyanCol = hexColor(CONFIG.colors.cyan);
    const magentaCol = hexColor(CONFIG.colors.magenta);

    for (let i = 0; i < RING_COUNT; i++) {
      const t = i / RING_COUNT;
      const radius = 3 + Math.sin(t * Math.PI * 4) * 1; // undulating radius
      const geometry = new THREE.TorusGeometry(radius, 0.02, 32, 64);

      const color = new THREE.Color().copy(cyanCol).lerp(magentaCol, t);
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.z = -i * SPACING;
      mesh.rotation.x = (Math.random() - 0.5) * 0.3;
      mesh.rotation.y = (Math.random() - 0.5) * 0.3;
      this.group.add(mesh);
      this.rings.push(mesh);
    }

    // â”€â”€ Streaming particles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const pCount = CONFIG.particles.wormhole;
    const pGeometry = new THREE.BufferGeometry();
    const pPositions = new Float32Array(pCount * 3);
    const pVelocities = new Float32Array(pCount);
    const pColors = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 2.5;
      pPositions[i3] = Math.cos(angle) * r;
      pPositions[i3 + 1] = Math.sin(angle) * r;
      pPositions[i3 + 2] = -Math.random() * TUNNEL_LENGTH;
      pVelocities[i] = Math.random() * 0.4 + 0.1;

      // Cyan-white colour
      const mix = Math.random();
      pColors[i3] = lerp(0, 1, mix);
      pColors[i3 + 1] = lerp(0.96, 1, mix);
      pColors[i3 + 2] = 1.0;
    }

    pGeometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    pGeometry.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    this._pVelocities = pVelocities;
    this._tunnelLength = TUNNEL_LENGTH;

    const pMaterial = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    this.particles = new THREE.Points(pGeometry, pMaterial);
    this.group.add(this.particles);

    // Start hidden
    this.group.visible = false;
  }

  /**
   * @param {number} time
   * @param {number} scrollProgress
   */
  update(time, scrollProgress) {
    // Visible roughly during section 2 (scroll ~0.1 â€“ 0.4)
    const fadeIn = smoothstep(0.08, 0.15, scrollProgress);
    const fadeOut = 1 - smoothstep(0.38, 0.45, scrollProgress);
    const visibility = Math.min(fadeIn, fadeOut);
    this.group.visible = visibility > 0.01;
    if (!this.group.visible) return;

    // Animate ring rotations
    for (let i = 0; i < this.rings.length; i++) {
      const ring = this.rings[i];
      ring.rotation.z = time * 0.5 + i * 0.1;
      ring.rotation.x += Math.sin(time + i) * 0.002;
      ring.material.opacity = visibility * 0.6;
    }

    // Stream particles along z
    const posArr = this.particles.geometry.attributes.position.array;
    for (let i = 0; i < posArr.length / 3; i++) {
      const i3 = i * 3;
      posArr[i3 + 2] += this._pVelocities[i];
      if (posArr[i3 + 2] > 0) {
        posArr[i3 + 2] = -this._tunnelLength;
      }
    }
    this.particles.geometry.attributes.position.needsUpdate = true;
    this.particles.material.opacity = visibility * 0.7;
  }
}

// ============================================================================
// 5. FloatingObjects â€” Section 3: Innovation Nexus
// ============================================================================

class FloatingObjects {
  /**
   * @param {THREE.Scene} scene
   */
  constructor(scene) {
    this.group = new THREE.Group();
    scene.add(this.group);

    const CENTER = new THREE.Vector3(0, 0, -50);
    this._center = CENTER;

    // â”€â”€ Central energy core â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    this.coreLight = new THREE.PointLight(CONFIG.colors.cyan, 3, 20);
    this.coreLight.position.copy(CENTER);
    this.group.add(this.coreLight);

    // Small glowing sphere at centre
    const coreSphereGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const coreSphereMat = new THREE.MeshBasicMaterial({
      color: CONFIG.colors.cyan,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const coreSphere = new THREE.Mesh(coreSphereGeo, coreSphereMat);
    coreSphere.position.copy(CENTER);
    this.group.add(coreSphere);

    // â”€â”€ Ambient light for nexus â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const ambientLight = new THREE.AmbientLight(0x222233, 0.5);
    this.group.add(ambientLight);

    // â”€â”€ Geometric objects â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const shapes = [
      new THREE.IcosahedronGeometry(0.6, 0),
      new THREE.TorusKnotGeometry(0.5, 0.15, 64, 8),
      new THREE.OctahedronGeometry(0.5, 0),
      new THREE.TetrahedronGeometry(0.6, 0),
      new THREE.DodecahedronGeometry(0.4, 0),
      new THREE.TorusGeometry(0.5, 0.15, 16, 32),
      new THREE.ConeGeometry(0.4, 0.8, 6),
      new THREE.BoxGeometry(0.6, 0.6, 0.6),
    ];

    const palette = [
      CONFIG.colors.cyan,
      CONFIG.colors.magenta,
      CONFIG.colors.gold,
      CONFIG.colors.purple,
    ];

    this.objects = [];

    for (let i = 0; i < shapes.length; i++) {
      const colorHex = palette[i % palette.length];
      const useWireframe = Math.random() > 0.5;

      const material = new THREE.MeshStandardMaterial({
        color: colorHex,
        metalness: 0.7,
        roughness: 0.2,
        emissive: colorHex,
        emissiveIntensity: 0.2,
        wireframe: useWireframe,
      });

      const mesh = new THREE.Mesh(shapes[i], material);

      const orbitParams = {
        radius: Math.random() * 4 + 2,
        speed: Math.random() * 0.6 + 0.2,
        phase: Math.random() * Math.PI * 2,
        yOffset: (Math.random() - 0.5) * 2,
      };

      // Initial position
      mesh.position.set(
        CENTER.x + Math.cos(orbitParams.phase) * orbitParams.radius,
        CENTER.y + orbitParams.yOffset,
        CENTER.z + Math.sin(orbitParams.phase) * orbitParams.radius * 0.5,
      );

      this.group.add(mesh);
      this.objects.push({ mesh, ...orbitParams });
    }

    // Start hidden
    this.group.visible = false;
  }

  /**
   * @param {number} time
   * @param {number} scrollProgress
   */
  update(time, scrollProgress) {
    // Visible around section 3 (scroll ~0.3 â€“ 0.55)
    const fadeIn = smoothstep(0.28, 0.35, scrollProgress);
    const fadeOut = 1 - smoothstep(0.50, 0.58, scrollProgress);
    const visibility = Math.min(fadeIn, fadeOut);
    this.group.visible = visibility > 0.01;
    if (!this.group.visible) return;

    const cx = this._center.x;
    const cy = this._center.y;
    const cz = this._center.z;

    for (const obj of this.objects) {
      const { mesh, radius, speed, phase, yOffset } = obj;
      mesh.position.x = cx + Math.cos(time * speed + phase) * radius;
      mesh.position.y = cy + Math.sin(time * speed * 0.7 + phase) * yOffset;
      mesh.position.z = cz + Math.sin(time * speed + phase) * radius * 0.5;
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.015;
    }

    // Pulse core light
    this.coreLight.intensity = 2 + Math.sin(time * 2) * 1;
  }
}

// ============================================================================
// 6. PortalEffect â€” Section 6: Registration Portal
// ============================================================================

class PortalEffect {
  /**
   * @param {THREE.Scene} scene
   */
  constructor(scene) {
    const count = CONFIG.particles.portal;
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    // Store originals for animation
    this._originals = new Float32Array(count * 3);
    this._velocities = new Float32Array(count);

    const MAJOR_R = 3;
    const MINOR_R = 0.5;
    const PORTAL_Z = -100;

    const cyanCol = hexColor(CONFIG.colors.cyan);
    const magentaCol = hexColor(CONFIG.colors.magenta);
    const goldCol = hexColor(CONFIG.colors.gold);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;
      const r = MINOR_R + (Math.random() - 0.5) * 0.4;

      const x = (MAJOR_R + r * Math.cos(phi)) * Math.cos(angle);
      const y = (MAJOR_R + r * Math.cos(phi)) * Math.sin(angle);
      const z = r * Math.sin(phi) + PORTAL_Z;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      this._originals[i3] = x;
      this._originals[i3 + 1] = y;
      this._originals[i3 + 2] = z;

      this._velocities[i] = Math.random() * 0.5 + 0.5;

      // Gradient: cyan â†’ magenta â†’ gold
      const t = i / count;
      let col;
      if (t < 0.5) {
        col = new THREE.Color().copy(cyanCol).lerp(magentaCol, t * 2);
      } else {
        col = new THREE.Color().copy(magentaCol).lerp(goldCol, (t - 0.5) * 2);
      }
      colors[i3] = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;

      sizes[i] = Math.random() * 0.05 + 0.02;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uOpacity: { value: 1.0 },
      },
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uPixelRatio;
        attribute float aSize;
        attribute vec3 aColor;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          vec4 viewPosition  = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
          gl_Position = projectedPosition;

          float pulse = sin(uTime * 3.0 + position.x * 5.0 + position.y * 5.0) * 0.5 + 0.5;
          gl_PointSize = aSize * uPixelRatio * 120.0 * (0.5 + pulse * 0.5);
          gl_PointSize *= (1.0 / -viewPosition.z);

          vColor = aColor;
          vAlpha = pulse;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uOpacity;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;

          float strength = 1.0 - (dist * 2.0);
          strength = pow(strength, 1.5);

          gl_FragColor = vec4(vColor, strength * vAlpha * 0.9 * uOpacity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.mesh = new THREE.Points(geometry, this.material);
    scene.add(this.mesh);
    this.mesh.visible = false;
  }

  /**
   * @param {number} time
   * @param {number} scrollProgress
   */
  update(time, scrollProgress) {
    // Visible in final section (~0.8 â€“ 1.0)
    const fadeIn = smoothstep(0.78, 0.85, scrollProgress);
    this.mesh.visible = fadeIn > 0.01;
    if (!this.mesh.visible) return;

    this.material.uniforms.uTime.value = time;
    this.material.uniforms.uOpacity.value = fadeIn;

    // Rotate vortex
    this.mesh.rotation.z = time * 0.3;
    // Pulse scale
    const s = 1 + Math.sin(time) * 0.05;
    this.mesh.scale.setScalar(s);

    // Swirl individual particles around their original positions
    const posArr = this.mesh.geometry.attributes.position.array;
    for (let i = 0; i < posArr.length / 3; i++) {
      const i3 = i * 3;
      const vel = this._velocities[i];
      const ox = this._originals[i3];
      const oy = this._originals[i3 + 1];

      // Small orbit around original position
      const swirl = time * vel;
      posArr[i3] = ox + Math.cos(swirl) * 0.15;
      posArr[i3 + 1] = oy + Math.sin(swirl) * 0.15;
    }
    this.mesh.geometry.attributes.position.needsUpdate = true;
  }
}

// ============================================================================
// 7. AmbientParticles â€” Visible throughout
// ============================================================================

class AmbientParticles {
  /**
   * @param {THREE.Scene} scene
   */
  constructor(scene) {
    const count = CONFIG.particles.ambient;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 60;
      positions[i3 + 1] = (Math.random() - 0.5) * 40;
      positions[i3 + 2] = -Math.random() * 120; // spread across full depth
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.03,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0x8888ff,
      sizeAttenuation: true,
    });

    this.mesh = new THREE.Points(geometry, material);
    scene.add(this.mesh);
  }

  /**
   * @param {number} time
   */
  update(time) {
    this.mesh.rotation.y = time * 0.02;
    this.mesh.rotation.x = time * 0.01;
  }
}

// ============================================================================
// 8. CameraController â€” Scroll-driven spline movement
// ============================================================================

class CameraController {
  /**
   * @param {THREE.PerspectiveCamera} camera
   */
  constructor(camera) {
    this.camera = camera;

    // Camera position path
    this.path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 20),    // Section 1: Hero â€” pulled back
      new THREE.Vector3(0, 0, 10),    // Start moving in
      new THREE.Vector3(0, 0, 0),     // Entering wormhole
      new THREE.Vector3(0, 2, -15),   // Inside wormhole
      new THREE.Vector3(2, 0, -30),   // Wormhole mid
      new THREE.Vector3(-1, 1, -45),  // Exiting wormhole
      new THREE.Vector3(0, 0, -50),   // Section 3: Nexus
      new THREE.Vector3(0, 0, -60),   // Section 4: Events
      new THREE.Vector3(0, 0, -75),   // Section 5: Timeline
      new THREE.Vector3(0, 0, -95),   // Approaching portal
      new THREE.Vector3(0, 0, -100),  // Section 6: Portal
    ]);

    // LookAt target path (same number of control points)
    this.lookAtPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -10),
      new THREE.Vector3(0, 0, -20),
      new THREE.Vector3(0, 1, -25),
      new THREE.Vector3(1, 0, -40),
      new THREE.Vector3(0, 0, -50),
      new THREE.Vector3(0, 0, -55),
      new THREE.Vector3(0, 0, -65),
      new THREE.Vector3(0, 0, -80),
      new THREE.Vector3(0, 0, -100),
      new THREE.Vector3(0, 0, -105),
    ]);

    // Temporary vectors to avoid per-frame allocations
    this._posTarget = new THREE.Vector3();
    this._lookTarget = new THREE.Vector3();
  }

  /**
   * @param {number} scrollProgress  0 â€“ 1
   * @param {MouseTracker} mouseTracker
   */
  update(scrollProgress, mouseTracker) {
    const t = Math.max(0, Math.min(1, scrollProgress));

    this.path.getPointAt(t, this._posTarget);
    this.lookAtPath.getPointAt(t, this._lookTarget);

    // Add subtle mouse-driven parallax
    this._posTarget.x += mouseTracker.smoothX * 0.5;
    this._posTarget.y += mouseTracker.smoothY * 0.3;

    // Smooth camera transition
    this.camera.position.lerp(this._posTarget, 0.1);
    this.camera.lookAt(this._lookTarget);
  }
}

// ============================================================================
// 9. TechfestApp â€” Main Application Orchestrator
// ============================================================================

class TechfestApp {
  constructor() {
    /** @type {number} 0 â€“ 1 normalised scroll */
    this.scrollProgress = 0;
    /** @type {number} current active section index 0 â€“ 5 */
    this.currentSection = 0;
    this.clock = new THREE.Clock();

    // Initialise subsystems
    this.initThree();
    this.initPostProcessing();
    this.initSceneModules();
    this.initScrollTrigger();
    this.initNavigation();
    this.initSectionAnimations();
    this.hideLoadingScreen();
    this.animate();

    // Resize handler
    window.addEventListener('resize', this._onResize.bind(this));
  }

  // â”€â”€ Three.js core setup â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  initThree() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(CONFIG.colors.background);
    this.scene.fog = new THREE.FogExp2(CONFIG.colors.background, 0.015);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      200,
    );
    this.camera.position.set(0, 0, 20);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    const container = document.getElementById('canvas-container');
    if (container) {
      container.appendChild(this.renderer.domElement);
    }
  }

  // â”€â”€ Post-processing â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  initPostProcessing() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      CONFIG.bloom.strength,
      CONFIG.bloom.radius,
      CONFIG.bloom.threshold,
    );
    this.composer.addPass(bloomPass);
    this.bloomPass = bloomPass;
  }

  // â”€â”€ Scene modules â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  initSceneModules() {
    this.mouseTracker = new MouseTracker();
    this.cameraController = new CameraController(this.camera);
    this.galaxy = new GalaxyParticles(this.scene);
    this.wormhole = new WormholeTunnel(this.scene);
    this.floatingObjects = new FloatingObjects(this.scene);
    this.portal = new PortalEffect(this.scene);
    this.ambientParticles = new AmbientParticles(this.scene);
  }

  // â”€â”€ Scroll â†’ progress mapping â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  initScrollTrigger() {
    ScrollTrigger.create({
      trigger: '#scroll-content',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        this.scrollProgress = self.progress;
        this._updateCurrentSection(self.progress);
      },
    });
  }

  /**
   * Determine which section is active and update the nav dots.
   * @param {number} progress  0 â€“ 1
   */
  _updateCurrentSection(progress) {
    const newSection = Math.min(5, Math.floor(progress * 6));
    if (newSection !== this.currentSection) {
      this.currentSection = newSection;
      document.querySelectorAll('.nav-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === newSection);
      });
    }
  }

  // â”€â”€ Navigation dot clicks â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  initNavigation() {
    document.querySelectorAll('.nav-dot').forEach((dot) => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.dataset.index, 10);
        const sections = document.querySelectorAll('.scroll-section');
        if (sections[index]) {
          sections[index].scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // â”€â”€ Section-specific GSAP animations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  initSectionAnimations() {
    // â”€â”€â”€ Hero entrance â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    gsap.from('.hero-pre-title', { opacity: 0, y: 30, duration: 1, delay: 0.5 });
    gsap.from('.hero-title', { opacity: 0, y: 50, scale: 0.9, duration: 1.2, delay: 0.8 });
    gsap.from('.hero-year', { opacity: 0, y: 30, duration: 1, delay: 1.1 });
    gsap.from('.hero-subtitle', { opacity: 0, y: 20, duration: 1, delay: 1.3 });
    gsap.from('.hero-tagline', { opacity: 0, duration: 1, delay: 1.5 });
    gsap.from('.hero-date', { opacity: 0, y: 20, duration: 1, delay: 1.7 });
    gsap.from('.scroll-indicator', { opacity: 0, duration: 1, delay: 2 });

    // Hero fade-out on scroll
    gsap.to('.hero-content', {
      opacity: 0,
      y: -50,
      scrollTrigger: {
        trigger: '#section-hero',
        start: 'top top',
        end: '50% top',
        scrub: true,
      },
    });

    // â”€â”€â”€ Wormhole text â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    gsap.fromTo(
      '.wormhole-text',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: '#section-wormhole',
          start: 'top center',
          end: '40% center',
          scrub: true,
        },
      },
    );
    gsap.to('.wormhole-text', {
      opacity: 0,
      y: -30,
      scrollTrigger: {
        trigger: '#section-wormhole',
        start: '60% center',
        end: 'bottom center',
        scrub: true,
      },
    });

    // â”€â”€â”€ Nexus text â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    gsap.fromTo(
      '.nexus-text',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: '#section-nexus',
          start: 'top center',
          end: '40% center',
          scrub: true,
        },
      },
    );
    gsap.to('.nexus-text', {
      opacity: 0,
      y: -30,
      scrollTrigger: {
        trigger: '#section-nexus',
        start: '60% center',
        end: 'bottom center',
        scrub: true,
      },
    });

    // â”€â”€â”€ Events section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    gsap.from('.events-title', {
      opacity: 0,
      y: 40,
      scrollTrigger: {
        trigger: '#section-events',
        start: 'top 70%',
        end: 'top 30%',
        scrub: true,
      },
    });

    // Staggered card entrance (graceful fallback if no .events-grid)
    const eventsGridTrigger = document.querySelector('.events-grid') ? '.events-grid' : '#section-events';
    gsap.from('.event-card', {
      opacity: 0,
      y: 60,
      scale: 0.9,
      stagger: 0.1,
      scrollTrigger: {
        trigger: eventsGridTrigger,
        start: 'top 80%',
        end: 'top 30%',
        scrub: true,
      },
    });

    // 3D tilt effect on event cards
    document.querySelectorAll('.event-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
          `perspective(1000px) rotateY(${x * 15}deg) rotateX(${-y * 15}deg) translateY(-8px) scale(1.02)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });

    // â”€â”€â”€ Timeline section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    gsap.from('.timeline-title', {
      opacity: 0,
      y: 40,
      scrollTrigger: {
        trigger: '#section-timeline',
        start: 'top 70%',
        end: 'top 40%',
        scrub: true,
      },
    });

    document.querySelectorAll('.timeline-item').forEach((item) => {
      gsap.fromTo(
        item,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            end: 'top 55%',
            scrub: true,
          },
        },
      );
    });

    // â”€â”€â”€ Portal / Registration section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    gsap.from('.portal-content', {
      opacity: 0,
      y: 60,
      scale: 0.95,
      scrollTrigger: {
        trigger: '#section-portal',
        start: 'top 70%',
        end: 'top 30%',
        scrub: true,
      },
    });

    // Register button magnetic hover effect
    const regBtn = document.getElementById('register-btn');
    if (regBtn) {
      regBtn.addEventListener('mousemove', (e) => {
        const rect = regBtn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        regBtn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
      });
      regBtn.addEventListener('mouseleave', () => {
        regBtn.style.transform = '';
      });
    }
  }

  // â”€â”€ Loading screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  hideLoadingScreen() {
    const bar = document.getElementById('loading-bar');
    const text = document.getElementById('loading-text');
    const screen = document.getElementById('loading-screen');

    if (!bar || !text || !screen) return;

    let progress = 0;

    const loadInterval = setInterval(() => {
      progress += Math.random() * 15 + 5;

      if (progress >= 100) {
        progress = 100;
        clearInterval(loadInterval);
        bar.style.width = '100%';
        text.textContent = 'QUANTUM NEXUS ACTIVATED';

        setTimeout(() => {
          screen.classList.add('loaded');
        }, 500);
        return;
      }

      bar.style.width = progress + '%';
      text.textContent = `LOADING... ${Math.floor(progress)}%`;
    }, 200);
  }

  // â”€â”€ Render loop â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const time = this.clock.getElapsedTime();

    // Update subsystems
    this.mouseTracker.update();
    this.cameraController.update(this.scrollProgress, this.mouseTracker);

    this.galaxy.update(time, this.scrollProgress);
    this.wormhole.update(time, this.scrollProgress);
    this.floatingObjects.update(time, this.scrollProgress);
    this.portal.update(time, this.scrollProgress);
    this.ambientParticles.update(time);

    // Render with bloom post-processing
    this.composer.render();
  }

  // â”€â”€ Resize handler â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  _onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(w, h);
    this.composer.setSize(w, h);
  }
}

// ============================================================================
// 10. Bootstrap
// ============================================================================

// Wait for DOM before starting
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new TechfestApp());
} else {
  new TechfestApp();
}

