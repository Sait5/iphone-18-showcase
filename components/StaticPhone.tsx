"use client";

import type { IphoneColor, IphoneModel } from "@/types/iphone";

export function StaticPhone({ model, color }: { model: IphoneModel; color: IphoneColor }) {
  return (
    <div className="static-phone-wrap" role="img" aria-label={`Статичное изображение ${model.name}, цвет ${color.name}`}>
      <div className={"static-phone" + (model.foldable ? " fold" : "")} style={{ borderColor: color.hex, boxShadow: `0 34px 80px ${color.hex}35, inset 0 0 0 2px ${color.hex}` }}>
        <div className="static-island" />
        <div className="static-time">09:41</div>
        <div className="static-date">Среда, 24 сентября</div>
        <div className="static-swipe">Статичный режим<br /><span>3D отключено для этого устройства</span></div>
      </div>
    </div>
  );
}
