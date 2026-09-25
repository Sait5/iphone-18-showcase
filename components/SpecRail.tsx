"use client";

import type { IphoneModel } from "@/types/iphone";

export function SpecRail({ model }: { model: IphoneModel }) {
  return (
    <dl className="spec-rail" aria-label={`Ключевые характеристики ${model.name}`}>
      <div><dt>Дисплей</dt><dd>{model.display}</dd></div>
      <div><dt>Процессор</dt><dd>{model.chip}</dd></div>
      <div><dt>Камеры</dt><dd>{model.cameras}× Fusion</dd></div>
      <div><dt>Вес</dt><dd>{model.weight}</dd></div>
      <div className="spec-wide"><dt>{model.foldable ? "Раскрыт" : "Размеры"}</dt><dd>{model.size}</dd></div>
      <div className="spec-wide"><dt>{model.foldable ? "Сложен" : "Корпус"}</dt><dd>{model.foldable ? model.foldedSize : model.material}</dd></div>
    </dl>
  );
}
