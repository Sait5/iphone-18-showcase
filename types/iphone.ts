export type ModelId = "iphone-18" | "iphone-18-air" | "iphone-18-pro" | "iphone-18-pro-max" | "iphone-fold";
export type ColorId = "midnight" | "silver" | "aurora" | "sand" | "crimson" | "copper" | "violet" | "rose" | "lavender" | "navy" | "star" | "cloud" | "gold" | "sky";
export type FeatureId = "camera" | "display" | "body" | "button" | "speakers";

export interface IphoneModel {
  id: ModelId;
  shortName: string;
  name: string;
  eyebrow: string;
  dimensions: { width: number; height: number; depth: number };
  display: string;
  cameras: 1 | 2 | 3;
  cameraSize: number;
  chip: string;
  weight: string;
  size: string;
  foldedSize?: string;
  thickness: string;
  foldedThickness?: string;
  material: string;
  official: boolean;
  foldable?: boolean;
}

export interface IphoneColor {
  id: ColorId;
  name: string;
  hex: string;
  metalness: number;
  roughness: number;
}

export interface Feature {
  id: FeatureId;
  index: string;
  title: string;
  kicker: string;
  description: string;
  specs: { label: string; value: string }[];
  rotation: [number, number, number];
}
