"use client";

import type { ModelId } from "@/types/iphone";
import { iphoneModels } from "@/data/models";

export function ModelSelector({ value, onChange }: { value: ModelId; onChange: (value: ModelId) => void }) {
  return (
    <div className="model-selector" role="group" aria-label="Выбор модели iPhone 18">
      {iphoneModels.map((model) => (
        <button key={model.id} type="button" className={value === model.id ? "active" : ""} onClick={() => onChange(model.id)} aria-pressed={value === model.id}>
          <span>{model.name}</span>
          <small>{model.display} · {model.official ? (model.foldable ? "Складной" : model.cameras === 1 ? "Ультратонкий" : model.cameras === 3 ? "Pro-камера" : "Официальные данные") : "Концепт · 2027"}</small>
        </button>
      ))}
    </div>
  );
}
