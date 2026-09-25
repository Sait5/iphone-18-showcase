"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { IphoneColor } from "@/types/iphone";

export function RoundedPlate({ width, height, depth, radius = .22, bevel = .012, position = [0, 0, 0], children }: {
  width: number; height: number; depth: number; radius?: number;
  bevel?: number;
  position?: [number, number, number]; children: React.ReactNode;
}) {
  const geometry = useMemo(() => {
    const x = -width / 2, y = -height / 2, r = Math.min(radius, width / 2, height / 2);
    const shape = new THREE.Shape();
    shape.moveTo(x + r, y); shape.lineTo(x + width - r, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + r);
    shape.lineTo(x + width, y + height - r);
    shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    shape.lineTo(x + r, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - r);
    shape.lineTo(x, y + r); shape.quadraticCurveTo(x, y, x + r, y);
    const edge = Math.min(bevel, depth * .28, r * .16);
    const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: edge > 0,
      bevelSize: edge, bevelThickness: edge * .72, bevelSegments: 6, steps: 1, curveSegments: 48 });
    geometry.translate(0, 0, -depth / 2);
    return geometry;
  }, [width, height, depth, radius, bevel]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} position={position}>{children}</mesh>;
}

export function Finish({ color, reducedMotion = false, glass = false }: {
  color: IphoneColor; reducedMotion?: boolean; glass?: boolean;
}) {
  const ref = useRef<THREE.MeshPhysicalMaterial>(null);
  const target = useMemo(() => new THREE.Color(), []);
  useFrame((_, dt) => {
    if (!ref.current) return;
    target.set(color.hex);
    ref.current.color.lerp(target, reducedMotion ? 1 : 1 - Math.exp(-dt * 8));
  });
  return <meshPhysicalMaterial ref={ref} color="#888888" metalness={glass ? .22 : color.metalness}
    roughness={glass ? .34 : color.roughness} clearcoat={glass ? .52 : .28} clearcoatRoughness={.24}
    sheen={glass ? .28 : .08} sheenColor="#d8e2ff" sheenRoughness={.55} envMapIntensity={glass ? 1.15 : 1.35}/>;
}

function Lens({ x, y, z, radius = .285, color }: { x: number; y: number; z: number; radius?: number; color: IphoneColor }) {
  return <group position={[x, y, z]} rotation={[0, Math.PI, 0]}>
    <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[radius, radius + .008, .024, 64]}/><meshStandardMaterial color={color.hex} metalness={.84} roughness={.2}/></mesh>
    <mesh position={[0, 0, .014]}><torusGeometry args={[radius - .025, .009, 10, 64]}/><meshStandardMaterial color="#858b96" metalness={.92} roughness={.16}/></mesh>
    <mesh position={[0, 0, .016]}><circleGeometry args={[radius - .04, 64]}/><meshBasicMaterial color="#05070b"/></mesh>
    <mesh position={[0, 0, .018]}><ringGeometry args={[radius * .33, radius * .45, 64]}/><meshBasicMaterial color="#1a2635"/></mesh>
    <mesh position={[0, 0, .02]}><circleGeometry args={[radius * .29, 48]}/><meshBasicMaterial color="#080e21"/></mesh>
    <mesh position={[-.035, .045, .022]}><circleGeometry args={[.022, 24]}/><meshBasicMaterial color="#9eb5d4" transparent opacity={.62}/></mesh>
  </group>;
}

function Logo({ z, color }: { z: number; color: IphoneColor }) {
  const { nodes } = useGLTF("/models/iphone-pro.glb", "/draco/");
  const mesh = nodes.IykfmVvLplTsTEW as THREE.Mesh | undefined;
  const geometry = useMemo(() => mesh?.geometry.clone(), [mesh]);
  useEffect(() => () => geometry?.dispose(), [geometry]);
  if (!geometry) return null;
  return <group position={[0, -.18, z + .063]} rotation={[0, Math.PI, 0]} scale={.3}>
    <mesh geometry={geometry}><meshStandardMaterial color={color.hex} metalness={.95} roughness={.16}/></mesh>
  </group>;
}

export function DeviceHardware({ width: w, height: h, depth: d, color, cameras, wide = false, reducedMotion = false, logo = true, showPort = true, onPowerToggle }: {
  width: number; height: number; depth: number; color: IphoneColor; cameras: number;
  wide?: boolean; reducedMotion?: boolean; logo?: boolean; showPort?: boolean; onPowerToggle?: () => void;
}) {
  const pro = cameras === 3;
  const islandHeight = pro ? 1.22 : wide ? .65 : cameras === 2 ? 1.22 : .69;
  const islandWidth = pro || wide ? w - .17 : .66;
  const islandX = pro || wide ? 0 : w / 2 - .46;
  const islandY = h / 2 - islandHeight / 2 - .12;
  const backZ = -d / 2 - .014;
  const lensZ = backZ - .043;
  const lensPoints = pro ? [[w / 2 - .5, h / 2 - .46], [w / 2 - .5, h / 2 - 1.02], [w / 2 - 1.08, h / 2 - .75]] :
    wide ? [[w / 2 - .45, islandY], [w / 2 - 1.06, islandY]] :
    Array.from({ length: cameras }, (_, i) => [islandX, h / 2 - .47 - i * .56]);
  return <group>
    <RoundedPlate width={w} height={h} depth={d} radius={.25}><Finish color={color} reducedMotion={reducedMotion}/></RoundedPlate>
    <RoundedPlate width={w - .07} height={h - .07} depth={.019} radius={.23} position={[0, 0, backZ]}>
      <Finish color={color} glass reducedMotion={reducedMotion}/>
    </RoundedPlate>
    {pro && <RoundedPlate width={w - .17} height={h - 1.56} depth={.009} radius={.26} position={[0, -.68, backZ - .012]}>
      <Finish color={color} glass reducedMotion={reducedMotion}/>
    </RoundedPlate>}
    {cameras > 0 && <RoundedPlate width={islandWidth} height={islandHeight} depth={.026} radius={pro ? .2 : .3} position={[islandX, islandY, backZ - .017]}>
      <Finish color={color} reducedMotion={reducedMotion}/>
    </RoundedPlate>}
    {lensPoints.map(([x, y], i) => <Lens key={i} x={x} y={y} z={lensZ} radius={wide ? .235 : .26} color={color}/>)}
    {cameras > 0 && <group position={[pro || wide ? -w / 2 + .32 : islandX - .55, pro ? h / 2 - .4 : islandY, lensZ]} rotation={[0, Math.PI, 0]}>
      <mesh><circleGeometry args={[.078, 32]}/><meshBasicMaterial color="#eee8d6"/></mesh>
      <mesh position={[0, -.57, 0]}><circleGeometry args={[.073, 32]}/><meshBasicMaterial color="#15161a"/></mesh>
    </group>}
    {logo && <Logo z={backZ - .022} color={color}/>}
    <RoundedPlate width={w - .045} height={h - .045} depth={.01} radius={.245} position={[0, 0, d / 2 + .006]}>
      <meshStandardMaterial color="#07080b" metalness={.15} roughness={.2}/>
    </RoundedPlate>
    {[.8, .36, -.02].map((y, i) => <RoundedPlate key={i} width={.025} height={i === 0 ? .125 : .225} depth={Math.max(.042, d * .42)} radius={.012} bevel={.0035} position={[-w / 2 - .012, y, 0]}><Finish color={color} reducedMotion={reducedMotion}/></RoundedPlate>)}
    <group onPointerDown={event => { event.stopPropagation(); onPowerToggle?.(); }}
      onPointerOver={() => { if(onPowerToggle) document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = ""; }}>
      <RoundedPlate width={.027} height={.31} depth={Math.max(.046, d * .44)} radius={.013} bevel={.0035} position={[w / 2 + .013, .48, 0]}><Finish color={color} reducedMotion={reducedMotion}/></RoundedPlate>
      {onPowerToggle && <mesh position={[w / 2 + .045, .48, 0]}>
        <boxGeometry args={[.095, .44, Math.max(.1, d * .85)]}/>
        <meshBasicMaterial transparent opacity={0} depthWrite={false}/>
      </mesh>}
    </group>
    {onPowerToggle && <Html center position={[w / 2 + .075, .48, d / 2 + .055]}>
      <button
        type="button"
        aria-label="Нажать боковую кнопку питания"
        onPointerDown={event => event.stopPropagation()}
        onClick={onPowerToggle}
        style={{ width: 30, height: 74, border: 0, padding: 0, background: "transparent", cursor: "pointer" }}
      />
    </Html>}
    {[-1, 1].flatMap(side => [0, 1, 2, 3, 4].map(i => <mesh key={side + ":" + i} position={[side * (.38 + i * .088), -h / 2 - .011, 0]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[.023, 16]}/><meshBasicMaterial color="#101114" side={THREE.DoubleSide}/></mesh>))}
    {showPort && <group position={[0, -h / 2 - .015, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <RoundedPlate width={.25} height={.058} depth={.006} radius={.028} bevel={.002}><meshBasicMaterial color="#090a0c"/></RoundedPlate>
    </group>}
    {[-1, 1].flatMap(side => [-1, 1].map(end => <mesh key={side + ":" + end} position={[side * (w / 2 + .013), end * (h / 2 - .5), 0]}><boxGeometry args={[.015, .032, d * .96]}/><meshStandardMaterial color="#a3a4a8" roughness={.8}/></mesh>))}
  </group>;
}
