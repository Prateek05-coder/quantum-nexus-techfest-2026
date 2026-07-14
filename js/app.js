// TECHFEST 2026 — QUANTUM NEXUS — 3D Engine
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
const { gsap } = window;
const { ScrollTrigger } = window;
gsap.registerPlugin(ScrollTrigger);
