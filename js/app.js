// TECHFEST 2026 — QUANTUM NEXUS — 3D Engine
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
const { gsap } = window;
const { ScrollTrigger } = window;
gsap.registerPlugin(ScrollTrigger);
const CONFIG = {
  colors: { background:0x050510, cyan:0x00f5ff, magenta:0xff00ff, gold:0xffd700, purple:0x8b5cf6, white:0xffffff },
  particles: { galaxy:12000, ambient:2000, wormhole:3000, portal:2000 },
  bloom: { strength:1.5, radius:0.4, threshold:0.1 },
  isMobile: window.innerWidth < 768,
};
if (CONFIG.isMobile) Object.keys(CONFIG.particles).forEach(k => { CONFIG.particles[k] = Math.floor(CONFIG.particles[k]/2); });
function lerp(a,b,t){return a+(b-a)*t;}
function smoothstep(edge0,edge1,x){const t=Math.max(0,Math.min(1,(x-edge0)/(edge1-edge0)));return t*t*(3-2*t);}
class MouseTracker {
  constructor(){
    this.raw={x:0,y:0}; this.smooth={x:0,y:0};
    this._cursor=document.getElementById('custom-cursor');
    this._dot=this._cursor?.querySelector('.cursor-dot');
    this._ring=this._cursor?.querySelector('.cursor-ring');
    this._cx=0;this._cy=0;this._rx=0;this._ry=0;
    window.addEventListener('mousemove',e=>{
      this.raw.x=(e.clientX/window.innerWidth)*2-1;
      this.raw.y=-(e.clientY/window.innerHeight)*2+1;
      this._cx=e.clientX;this._cy=e.clientY;
    });
    document.querySelectorAll('a,button,.event-card').forEach(el=>{
      el.addEventListener('mouseenter',()=>this._cursor?.classList.add('cursor-hover'));
      el.addEventListener('mouseleave',()=>this._cursor?.classList.remove('cursor-hover'));
    });
  }
  update(){
    this.smooth.x=lerp(this.smooth.x,this.raw.x,0.1);
    this.smooth.y=lerp(this.smooth.y,this.raw.y,0.1);
    if(this._cursor){
      this._rx=lerp(this._rx,this._cx,0.12);
      this._ry=lerp(this._ry,this._cy,0.12);
      this._cursor.style.transform=`translate(${this._cx}px,${this._cy}px)`;
      if(this._ring)this._ring.style.transform=`translate(${this._rx-this._cx}px,${this._ry-this._cy}px)`;
    }
  }
}
