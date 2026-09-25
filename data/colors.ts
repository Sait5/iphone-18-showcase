import type { ColorId, IphoneColor, IphoneModel } from "@/types/iphone";

export const iphoneColors: IphoneColor[] = [
  { id: "midnight", name: "Чёрный", hex: "#464950", metalness: .72, roughness: .28 },
  { id: "silver", name: "Серебро", hex: "#e4e5e7", metalness: .72, roughness: .26 },
  { id: "aurora", name: "Ледниковый", hex: "#a7bde0", metalness: .58, roughness: .29 },
  { id: "crimson", name: "Бургундия", hex: "#7b3850", metalness: .58, roughness: .29 },
  { id: "sand", name: "Натуральный титан", hex: "#b9afa1", metalness: .74, roughness: .32 },
  { id: "copper", name: "Медь", hex: "#c4865e", metalness: .66, roughness: .31 },
  { id: "violet", name: "Аметист", hex: "#9553df", metalness: .55, roughness: .29 },
  { id: "rose", name: "Розовый", hex: "#ecd0d4", metalness: .4, roughness: .36 },
  { id: "lavender", name: "Лаванда", hex: "#bcacd9", metalness: .45, roughness: .35 },
  { id: "navy", name: "Тёмно-синий", hex: "#34435d", metalness: .68, roughness: .27 },
  { id: "star", name: "Звёздный белый", hex: "#e8e7e3", metalness: .62, roughness: .25 },
  { id: "cloud", name: "Облачный белый", hex: "#e9e8e4", metalness: .48, roughness: .3 },
  { id: "gold", name: "Светлое золото", hex: "#d8c7a5", metalness: .62, roughness: .3 },
  { id: "sky", name: "Небесно-голубой", hex: "#a9c6dc", metalness: .56, roughness: .29 },
];
export function colorsForModel(model: IphoneModel): IphoneColor[] {
  const ids: ColorId[] = model.foldable ? ["navy", "star"] :
    model.cameras === 3 ? ["midnight", "silver", "aurora", "crimson"] :
    model.id === "iphone-18-air" ? ["midnight", "cloud", "gold", "sky"] :
    ["midnight", "silver", "aurora", "rose", "lavender"];
  return ids.map(id => iphoneColors.find(color => color.id === id)!);
}
