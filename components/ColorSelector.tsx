"use client";
import type { ColorId, IphoneColor } from "@/types/iphone";

export function ColorSelector({ value, onChange, colors }: {
  value: ColorId; onChange: (value: ColorId) => void; colors: IphoneColor[];
}) {
  const selected = colors.find(color => color.id === value) ?? colors[0];
  return <div className="color-control">
    <div className="color-label"><span>Отделка корпуса</span><strong>{selected.name}</strong></div>
    <div className="color-selector" role="group" aria-label="Выбор цвета корпуса">
      {colors.map(color => <button key={color.id} type="button" title={color.name}
        aria-label={`Цвет: ${color.name}`} aria-pressed={value === color.id}
        className={value === color.id ? "active" : ""} onClick={() => onChange(color.id)}>
        <span style={{ background: color.hex }}/></button>)}
    </div>
  </div>;
}
