"use client";

import { ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { PhoneModel, type PhoneModelProps } from "./PhoneModel";

function Controls({resetSignal,selectedFeature,onInteract}:{resetSignal:number;selectedFeature:string|null;onInteract:()=>void}) {
  const ref=useRef<OrbitControlsImpl>(null);
  useEffect(()=>{ref.current?.reset();},[resetSignal,selectedFeature]);
  return <OrbitControls ref={ref} makeDefault enablePan={false} enableZoom={false}
    minPolarAngle={.68} maxPolarAngle={2.46} minAzimuthAngle={-Infinity} maxAzimuthAngle={Infinity}
    enableDamping dampingFactor={.08} rotateSpeed={.52} onStart={onInteract}/>;
}
export default function PhoneScene(props:PhoneModelProps & {onInteract:()=>void;onFailure:()=>void}) {
  return <Canvas className="device-canvas" camera={{position:[0,0,8.5],fov:38}}
    dpr={[1.5,2.5]} gl={{antialias:true,alpha:true,powerPreference:"high-performance"}}
    onCreated={({gl})=>{gl.domElement.addEventListener("webglcontextlost",props.onFailure,{once:true});}}>
    <ambientLight intensity={.58}/>
    <directionalLight position={[3,4,5]} intensity={2}/>
    <directionalLight position={[-4,2,-3]} intensity={1.35}/>
    <directionalLight position={[0,5,-4]} intensity={1.1}/>
    <Suspense fallback={null}>
      <Environment resolution={512}>
        <Lightformer position={[0,4,3]} scale={[6,2,1]} intensity={4}/>
        <Lightformer position={[-4,0,2]} rotation={[0,Math.PI/2,0]} scale={[4,8,1]} intensity={3}/>
        <Lightformer position={[4,0,-2]} rotation={[0,-Math.PI/2,0]} scale={[3,7,1]} intensity={4}/>
      </Environment>
      <PhoneModel {...props}/>
    </Suspense>
    <ContactShadows position={[0,-2.65,0]} opacity={.38} scale={7} blur={2.4} far={5} frames={60} resolution={512}/>
    <Controls resetSignal={props.resetSignal} selectedFeature={props.selectedFeature} onInteract={props.onInteract}/>
  </Canvas>;
}
