"use client";
import {useEffect,useState} from "react";
export function useDeviceCapability(){
  const [capability,setCapability]=useState<boolean|null>(null);
  useEffect(()=>{
    let result=false;
    try {
      const canvas=document.createElement("canvas"),gl=canvas.getContext("webgl2");
      const memory=(navigator as Navigator&{deviceMemory?:number}).deviceMemory;
      result=Boolean(gl)&&(memory===undefined||memory>=4);
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {}
    const timer=window.setTimeout(()=>setCapability(result),0);
    return ()=>window.clearTimeout(timer);
  },[]);
  return capability;
}
