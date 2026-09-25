"use client";

import { Html } from "@react-three/drei";
import type { FeatureId } from "@/types/iphone";

export function Hotspot({ id, label, position, onSelect }: {
  id: FeatureId; label: string; position: [number, number, number];
  onSelect: (id: FeatureId) => void;
}) {
  // HTML markers are never cut by geometry. Raycast occlusion hides the far side entirely.
  return <Html position={position} center occlude zIndexRange={[20, 10]}>
    <button className="hotspot" aria-label={label} title={label}
      onPointerDown={event => event.stopPropagation()}
      onClick={event => { event.stopPropagation(); onSelect(id); }}>
      <span aria-hidden="true">+</span>
    </button>
  </Html>;
}
