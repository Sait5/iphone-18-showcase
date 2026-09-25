"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { FeatureId, IphoneColor, IphoneModel } from "@/types/iphone";
import { features } from "@/data/features";
import { DeviceScreen } from "./DeviceScreen";
import { DeviceHardware } from "./DeviceHardware";
import { Hotspot } from "./Hotspot";

export type PhoneModelProps = {
  model: IphoneModel; color: IphoneColor; selectedFeature: FeatureId | null;
  powered: boolean; unlocked: boolean; reducedMotion: boolean; resetSignal: number;
  folded: boolean; rearView: boolean; showHotspots: boolean;
  onUnlock: () => void; onPowerToggle: () => void; onSelectFeature: (id: FeatureId) => void;
};

export function PhoneModel(props: PhoneModelProps) {
  const { model, color, selectedFeature, powered, unlocked, reducedMotion, resetSignal, onUnlock, onPowerToggle, onSelectFeature, folded, rearView, showHotspots } = props;
  const group = useRef<THREE.Group>(null);
  const hinge = useRef<THREE.Group>(null);
  const target = useMemo(() => new THREE.Quaternion(), []);
  useEffect(() => {
    const angles = selectedFeature ? features.find(f => f.id === selectedFeature)!.rotation :
      rearView ? [.045, Math.PI - .2, -.02] : [.015, -.18, 0];
    target.setFromEuler(new THREE.Euler(...angles as [number, number, number]));
  }, [selectedFeature, resetSignal, rearView, target]);
  useFrame((state, dt) => {
    const speed = reducedMotion ? 1 : 1 - Math.exp(-dt * 18);
    if (group.current) {
      group.current.quaternion.slerp(target, speed);
      group.current.position.y = selectedFeature || reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * .5) * .007;
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, model.foldable && folded ? model.dimensions.width / 4 : 0, speed);
    }
    if (hinge.current) hinge.current.rotation.y = THREE.MathUtils.lerp(hinge.current.rotation.y, folded ? -Math.PI : 0, speed);
  });
  const { width: w, height: h, depth: d } = model.dimensions;
  const foldGap = .022;
  const screen = (width: number, foldSide?: "left" | "right") => <DeviceScreen width={width} height={h} depth={d + .05} foldSide={foldSide} powered={powered} unlocked={unlocked} reducedMotion={reducedMotion} onUnlock={onUnlock}/>;
  const hotspot = (id: FeatureId, label: string, position: [number, number, number]) =>
    showHotspots ? <Hotspot id={id} label={label} position={position} onSelect={featureId => {
      if (featureId === "button") onPowerToggle();
      onSelectFeature(featureId);
    }}/> : null;
  return <group ref={group}>
    {model.foldable ? <>
      <group position={[-w / 4 - .015, 0, 0]}>
        <DeviceHardware width={w / 2} height={h} depth={d} color={color} cameras={2} wide reducedMotion={reducedMotion}/>
        {screen(w / 2, "left")}
        {hotspot("camera", "Система камер", [w / 4 - .36, h / 2 - .47, -d / 2 - .29])}
        {hotspot("body", "Корпус и шарнир", [-.5, -.5, -d / 2 - .11])}
      </group>
      <group ref={hinge} position={[0, 0, d / 2]}>
        <group position={[w / 4 + .015, 0, -d / 2 - foldGap]}>
          <DeviceHardware width={w / 2} height={h} depth={d} color={color} cameras={0} logo={false} reducedMotion={reducedMotion} showPort={false} onPowerToggle={onPowerToggle}/>
          {screen(w / 2, "right")}
          <group position={[0, 0, -.065]} rotation={[0, Math.PI, 0]}>{screen(w / 2)}</group>
          {hotspot("display", "Складной дисплей", [.55, -.7, d / 2 + .12])}
          {hotspot("button", "Боковая кнопка", [w / 4 + .12, .5, 0])}
          {hotspot("speakers", "Динамики", [.4, -h / 2 - .12, 0])}
        </group>
      </group>
      <mesh rotation={[0, 0, 0]}><cylinderGeometry args={[.032, .032, h - .3, 32]}/><meshStandardMaterial color={color.hex} metalness={.88} roughness={.18}/></mesh>
    </> : <>
      <DeviceHardware width={w} height={h} depth={d} color={color} cameras={model.cameras} reducedMotion={reducedMotion} onPowerToggle={onPowerToggle}/>
      {screen(w)}
      {hotspot("camera", "Система камер", [w * .23, h / 2 - .47, -d / 2 - .15])}
      {hotspot("display", "Дисплей", [-w * .29, -h * .22, d / 2 + .075])}
      {hotspot("body", "Материалы корпуса", [-w * .27, -h * .18, -d / 2 - .075])}
      {hotspot("button", "Боковая кнопка", [w / 2 + .07, .48, 0])}
      {hotspot("speakers", "Динамики", [.45, -h / 2 - .07, 0])}
    </>}
  </group>;
}
