"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type Props = { width: number; height: number; depth: number; powered: boolean; unlocked: boolean; reducedMotion: boolean; onUnlock: () => void; foldSide?: "left" | "right" };
const SCREEN_TRANSITION_SECONDS = 1.1;

const apps = [
  ["FaceTime", "#31cf67", "video"], ["Календарь", "#ffffff", "calendar"],
  ["Фото", "#ffffff", "flower"], ["Камера", "#c7ccd3", "camera"],
  ["Почта", "#238cf4", "mail"], ["Часы", "#171920", "clock"],
  ["Карты", "#68c795", "map"], ["Погода", "#309be6", "sun"],
  ["Заметки", "#ffe06b", "notes"], ["Музыка", "#fa526c", "music"],
  ["App Store", "#368bf4", "store"], ["Настройки", "#939aa6", "gear"],
] as const;

function round(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath(); ctx.roundRect(x,y,w,h,r); ctx.fill();
}
function icon(ctx: CanvasRenderingContext2D, kind: string, x: number, y: number, size: number) {
  ctx.save(); ctx.translate(x,y); ctx.scale(size/64,size/64);
  ctx.strokeStyle = "white"; ctx.fillStyle = "white"; ctx.lineWidth=4; ctx.lineCap="round"; ctx.lineJoin="round";
  const paths: Record<string,string> = {
    video:"M13 21h26v23H13z M39 28l13-8v25l-13-8",
    camera:"M10 22h12l4-7h13l5 7h10v28H10z M41 35a10 10 0 1 1-20 0a10 10 0 1 1 20 0",
    mail:"M10 17h44v32H10z M10 18l22 18 22-18",
    music:"M26 43V17l23-5v26 M26 25l23-5",
    map:"M20 8v48 M43 8v48 M5 31h53 M5 47l50-30",
    notes:"M13 25h38 M13 35h38 M13 45h27",
    store:"M19 48l20-34 M26 14l19 34 M13 39h39",
    phone:"M18 12l10 12-7 8c5 8 8 10 15 13l8-7 11 10c-5 17-22 9-34-4S6 18 18 12",
    compass:"M32 8a24 24 0 1 1 0 48a24 24 0 1 1 0-48 M43 20l-7 17-16 7 7-17z",
    message:"M11 14h42v31H28L15 55V45h-4z",
  };
  if(kind==="calendar") {
    ctx.fillStyle="#e15451"; ctx.font="bold 11px Arial"; ctx.textAlign="center"; ctx.fillText("ЧЕТВЕРГ",32,19);
    ctx.fillStyle="#13151b"; ctx.font="34px Arial"; ctx.fillText("24",32,50);
  } else if(kind==="flower") {
    ["#fdca48","#fd9147","#f36b72","#e97eab","#ba8de0","#7daee9","#79caac","#bcd579"].forEach((c,i)=>{
      ctx.save();ctx.translate(32,32);ctx.rotate(i*Math.PI/4);ctx.fillStyle=c;ctx.globalAlpha=.9;
      ctx.beginPath();ctx.ellipse(0,-14,8,13,0,0,Math.PI*2);ctx.fill();ctx.restore();
    });
  } else if(kind==="clock" || kind==="gear") {
    ctx.beginPath();ctx.arc(32,32,23,0,Math.PI*2);ctx.stroke();
    if(kind==="clock") {ctx.stroke(new Path2D("M32 15v18l12 8"));ctx.strokeStyle="#ff694a";ctx.lineWidth=2;ctx.stroke(new Path2D("M32 32L22 47"));}
    else {ctx.beginPath();ctx.arc(32,32,10,0,Math.PI*2);ctx.stroke();for(let i=0;i<10;i++){ctx.save();ctx.translate(32,32);ctx.rotate(i*Math.PI/5);ctx.fillRect(-3,-29,6,10);ctx.restore();}}
  } else if(kind==="sun") {
    ctx.fillStyle="#ffdf72";ctx.beginPath();ctx.arc(25,25,13,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="white"; round(ctx,22,30,32,16,8);
  } else {
    if(kind==="camera"||kind==="notes") ctx.strokeStyle="#313640";
    ctx.stroke(new Path2D(paths[kind] ?? paths.message));
    if(kind==="music"){ctx.beginPath();ctx.ellipse(20,45,7,5,-.3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(43,40,7,5,-.3,0,Math.PI*2);ctx.fill();}
  }
  ctx.restore();
}

function prepareTexture(canvas: HTMLCanvasElement) {
  const texture=new THREE.CanvasTexture(canvas);
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.anisotropy=8;
  texture.minFilter=THREE.LinearMipmapLinearFilter;
  texture.magFilter=THREE.LinearFilter;
  return texture;
}

export function createScreenTexture(unlocked: boolean, powered = true) {
  const canvas=document.createElement("canvas"); canvas.width=1200;canvas.height=2580;
  const ctx=canvas.getContext("2d")!;
  ctx.scale(2,2);
  if(!powered){ctx.fillStyle="#010204";ctx.fillRect(0,0,600,1290);return prepareTexture(canvas);}
  const bg=ctx.createLinearGradient(0,0,600,1290);
  bg.addColorStop(0,"#07111f");bg.addColorStop(.32,"#183865");bg.addColorStop(.66,"#8d6d86");bg.addColorStop(1,"#d59a72");
  ctx.fillStyle=bg;ctx.fillRect(0,0,600,1290);
  const halo=ctx.createRadialGradient(70,780,10,170,780,550);
  halo.addColorStop(0,"#e9d6d1");halo.addColorStop(.45,"#8a9fc4");halo.addColorStop(1,"#3038bb00");
  ctx.fillStyle=halo;ctx.fillRect(0,0,600,1290);
  ctx.fillStyle="#07080c";round(ctx,206,28,188,54,27);
  ctx.fillStyle="white";ctx.textAlign="left";ctx.font="600 25px Arial";ctx.fillText("9:41",42,61);
  ctx.font="22px Arial";ctx.fillText("▴ ▴",463,60);ctx.strokeStyle="white";ctx.lineWidth=2;ctx.strokeRect(528,41,35,17);ctx.fillRect(532,45,24,9);
  if(unlocked) {
    ctx.fillStyle="#ffffff25";round(ctx,38,135,524,220,34);
    ctx.fillStyle="white";ctx.font="26px Arial";ctx.fillText("Четверг, 24 сентября",64,179);
    ctx.font="300 67px Arial";ctx.fillText("18°",65,255);
    ctx.font="23px Arial";ctx.fillText("Ясно. Время для нового.",65,314);icon(ctx,"sun",450,201,74);
    apps.forEach(([label,color,kind],i)=>{
      const x=40+(i%4)*140,y=409+Math.floor(i/4)*168;
      ctx.fillStyle=color;round(ctx,x,y,99,99,25);icon(ctx,kind,x+8,y+8,83);
      ctx.fillStyle="white";ctx.font="20px Arial";ctx.textAlign="center";ctx.fillText(label,x+49,y+128);
    });
    ctx.fillStyle="#ffffffdd";ctx.beginPath();ctx.arc(287,997,4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#ffffff66";ctx.beginPath();ctx.arc(309,997,4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#ffffff38";round(ctx,22,1070,556,154,42);
    [["#31cf67","phone"],["#fafafa","compass"],["#38cd6a","message"],["#fa526c","music"]].forEach(([color,kind],i)=>{
      const x=42+i*139;ctx.fillStyle=color;round(ctx,x,1096,99,99,25);icon(ctx,kind,x+8,1104,83);
    });
  } else {
    ctx.fillStyle="white";ctx.textAlign="center";ctx.font="28px Arial";ctx.fillText("Четверг, 24 сентября",300,198);
    ctx.font="500 137px Arial";ctx.fillText("09:41",300,348);
    ctx.font="25px Arial";ctx.fillText("Потяните экран вверх",300,1172);
    icon(ctx,"camera",458,1080,56);icon(ctx,"sun",85,1080,56);
  }
  ctx.fillStyle="white";round(ctx,201,1250,198,7,4);
  return prepareTexture(canvas);
}

function createFoldTexture(unlocked: boolean, side: "left" | "right", powered: boolean) {
  const canvas = document.createElement("canvas"); canvas.width = 2800; canvas.height = 2200;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(2,2);
  if(!powered){ctx.fillStyle="#010204";ctx.fillRect(0,0,1400,1100);const off=prepareTexture(canvas);off.repeat.set(.5,1);off.offset.set(side === "left" ? 0 : .5,0);return off;}
  const gradient = ctx.createLinearGradient(0, 0, 1400, 1100);
  gradient.addColorStop(0, "#111724"); gradient.addColorStop(.46, "#4d5264"); gradient.addColorStop(1, "#b59b81");
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1400, 1100);
  ctx.fillStyle = "#ffffff0c"; ctx.beginPath(); ctx.ellipse(950, 450, 660, 340, -.65, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#fff"; ctx.font = "24px Arial"; ctx.textAlign = "left"; ctx.fillText("9:41", 50, 47);
  ctx.textAlign = "right"; ctx.fillText("Wi-Fi   100%", 1345, 47);
  if (unlocked) {
    ctx.fillStyle = "#ffffff20"; round(ctx, 65, 155, 550, 400, 38);
    ctx.textAlign = "left"; ctx.fillStyle = "#ffffff"; ctx.font = "30px Arial"; ctx.fillText("Четверг, 24 сентября", 105, 218);
    ctx.font = "100px Arial"; ctx.fillText("09:41", 105, 350);
    ctx.font = "28px Arial"; ctx.fillText("Время для нового.", 105, 485);
    ctx.fillStyle = "#28263899"; round(ctx, 65, 590, 255, 300, 35);
    ctx.fillStyle = "#ffffff"; ctx.font = "26px Arial"; ctx.fillText("Погода", 95, 645);
    ctx.font = "68px Arial"; ctx.fillText("18°", 95, 745); icon(ctx, "sun", 220, 690, 60);
    ctx.font = "23px Arial"; ctx.fillText("Ясно", 95, 840);
    ctx.fillStyle = "#f0e8dd"; round(ctx, 345, 590, 270, 300, 35);
    ctx.fillStyle = "#ba5555"; ctx.font = "25px Arial"; ctx.fillText("ЧЕТВЕРГ", 377, 655);
    ctx.fillStyle = "#29252b"; ctx.font = "100px Arial"; ctx.fillText("24", 377, 785);
    apps.forEach(([name, color, kind], i) => {
      const x = 760 + (i % 3) * 180, y = 170 + Math.floor(i / 3) * 185;
      ctx.fillStyle = color; round(ctx, x, y, 112, 112, 27); icon(ctx, kind, x + 10, y + 10, 92);
      ctx.textAlign = "center"; ctx.fillStyle = "white"; ctx.font = "20px Arial"; ctx.fillText(name, x + 56, y + 145);
    });
  } else {
    ctx.textAlign = "center"; ctx.fillStyle = "#ffffff"; ctx.font = "140px Arial"; ctx.fillText("09:41", 700, 420);
    ctx.font = "28px Arial"; ctx.fillText("Потяните экран вверх", 700, 970);
  }
  ctx.fillStyle = "#ffffff";
  round(ctx, 590, 1060, 106, 7, 4);
  round(ctx, 704, 1060, 106, 7, 4);
  const texture = prepareTexture(canvas);
  texture.repeat.set(.5, 1); texture.offset.set(side === "left" ? 0 : .5, 0);
  return texture;
}

export function DeviceScreen({width,height,depth,powered,unlocked,reducedMotion,onUnlock,foldSide}:Props) {
  const start=useRef<number|null>(null);
  const previousMaterial=useRef<THREE.MeshBasicMaterial>(null);
  const currentMaterial=useRef<THREE.MeshBasicMaterial>(null);
  const currentMesh=useRef<THREE.Mesh>(null);
  const previousTexture=useRef<THREE.Texture|null>(null);
  const progress=useRef(1);
  const initialized=useRef(false);
  const textures=useRef(new Set<THREE.Texture>());
  const get=useThree(s=>s.get);
  function enableOrbit(enabled:boolean){
    const orbit=get().controls as unknown as {enabled:boolean}|null;
    if(orbit)orbit.enabled=enabled;
  }
  const texture=useMemo(()=>foldSide ? createFoldTexture(unlocked, foldSide, powered) : createScreenTexture(unlocked, powered),[unlocked,foldSide,powered]);
  useEffect(()=>{
    textures.current.add(texture);
    const oldTexture=previousTexture.current ?? texture;
    if(previousMaterial.current) {
      previousMaterial.current.map=oldTexture;
      previousMaterial.current.opacity=initialized.current && !reducedMotion ? 1 : 0;
      previousMaterial.current.needsUpdate=true;
    }
    if(currentMaterial.current) {
      currentMaterial.current.map=texture;
      currentMaterial.current.opacity=initialized.current && !reducedMotion ? 0 : 1;
      currentMaterial.current.needsUpdate=true;
    }
    previousTexture.current=texture;
    progress.current=initialized.current && !reducedMotion ? 0 : 1;
    initialized.current=true;
  },[texture,reducedMotion]);
  useEffect(()=>{
    const owned=textures.current;
    return ()=>owned.forEach(item=>item.dispose());
  },[]);
  const geometry=useMemo(()=>{
    const w=width*(foldSide ? .975 : .917),h=height*.966,r=foldSide ? .11 : .19;
    const shape=new THREE.Shape();
    shape.moveTo(-w/2+r,-h/2);shape.lineTo(w/2-r,-h/2);shape.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);
    shape.lineTo(w/2,h/2-r);shape.quadraticCurveTo(w/2,h/2,w/2-r,h/2);
    shape.lineTo(-w/2+r,h/2);shape.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);
    shape.lineTo(-w/2,-h/2+r);shape.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
    const geo=new THREE.ShapeGeometry(shape,24),pos=geo.attributes.position,uv=geo.attributes.uv;
    for(let i=0;i<pos.count;i++)uv.setXY(i,pos.getX(i)/w+.5,pos.getY(i)/h+.5);
    return geo;
  },[width,height,foldSide]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  useFrame((_,delta)=>{
    if(progress.current>=1)return;
    progress.current=Math.min(1,progress.current+delta/SCREEN_TRANSITION_SECONDS);
    const t=1-Math.pow(1-progress.current,3);
    if(previousMaterial.current)previousMaterial.current.opacity=1-t;
    if(currentMaterial.current)currentMaterial.current.opacity=t;
    if(currentMesh.current){
      const scale=.972+t*.028;
      currentMesh.current.scale.set(scale,scale,1);
    }
  });
  return <group
      onPointerDown={e=>{if(!powered||unlocked)return;e.stopPropagation();start.current=e.clientY;enableOrbit(false);(e.target as HTMLElement).setPointerCapture(e.pointerId);}}
      onPointerUp={e=>{if(start.current===null)return;e.stopPropagation();if(start.current-e.clientY>25)onUnlock();start.current=null;enableOrbit(true);(e.target as HTMLElement).releasePointerCapture(e.pointerId);}}
      onClick={e=>{if(!powered)return;e.stopPropagation();onUnlock();}}
    onPointerCancel={()=>{start.current=null;enableOrbit(true);}}>
    <mesh geometry={geometry} position={[0,0,depth/2+.003]} renderOrder={1}>
      <meshBasicMaterial ref={previousMaterial} map={texture} transparent depthWrite={false} toneMapped={false}/>
    </mesh>
    <mesh ref={currentMesh} geometry={geometry} position={[0,0,depth/2+.0035]} renderOrder={2}>
      <meshBasicMaterial ref={currentMaterial} map={texture} transparent depthWrite={false} toneMapped={false}/>
    </mesh>
  </group>;
}
