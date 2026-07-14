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

class GalaxyParticles {
  constructor(scene){
    this.scene=scene; this.mesh=null;
    this._build();
  }
  _build(){
    const count=CONFIG.particles.galaxy;
    const pos=new Float32Array(count*3);
    const col=new Float32Array(count*3);
    const sz=new Float32Array(count);
    const arms=5; const spread=0.4; const radius=40;
    const c1=new THREE.Color(CONFIG.colors.cyan);
    const c2=new THREE.Color(CONFIG.colors.magenta);
    for(let i=0;i<count;i++){
      const arm=i%arms; const t=Math.random();
      const r=Math.pow(Math.random(),0.5)*radius;
      const angle=(arm/arms)*Math.PI*2+r*0.3+Math.random()*spread;
      pos[i*3]=Math.cos(angle)*r+(Math.random()-0.5)*spread*r;
      pos[i*3+1]=(Math.random()-0.5)*r*0.1;
      pos[i*3+2]=Math.sin(angle)*r+(Math.random()-0.5)*spread*r;
      const c=c1.clone().lerp(c2,r/radius);
      col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b;
      sz[i]=Math.random()*2+0.5;
    }
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    geo.setAttribute('color',new THREE.BufferAttribute(col,3));
    geo.setAttribute('aSize',new THREE.BufferAttribute(sz,1));
        const mat=new THREE.ShaderMaterial({
      uniforms:{uTime:{value:0},uOpacity:{value:1}},
      vertexShader:`
        attribute float aSize;
        varying vec3 vColor;
        uniform float uTime;
        void main(){
          vColor=color;
          float twinkle=sin(uTime*2.0+position.x*0.5+position.z*0.3)*0.3+0.7;
          vec4 mv=modelViewMatrix*vec4(position,1.0);
          gl_PointSize=aSize*twinkle*(300.0/-mv.z);
          gl_Position=projectionMatrix*mv;
        }
      `,
      fragmentShader:`
        varying vec3 vColor;
        uniform float uOpacity;
        void main(){
          vec2 c=gl_PointCoord-0.5;
          float d=length(c);
          if(d>0.5)discard;
          float alpha=1.0-smoothstep(0.2,0.5,d);
          gl_FragColor=vec4(vColor,alpha*uOpacity);
        }
      `,
      vertexColors:true,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true
    });
    this.mesh=new THREE.Points(geo,mat);
    this.scene.add(this.mesh);
  }
  update(time,progress){
    if(this.mesh){
      this.mesh.rotation.y=time*0.02;
      this.mesh.material.opacity=1-smoothstep(0.1,0.2,progress);
    }
  }
}

