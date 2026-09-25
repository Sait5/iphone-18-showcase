"use client";

import type { Feature } from "@/types/iphone";

export function FeatureCard({ feature, onClose }: { feature: Feature; onClose: () => void }) {
  return (
    <aside className="feature-card" aria-live="polite" aria-label={`Информация: ${feature.title}`}>
      <div className="feature-card-head">
        <span>{feature.index} / 05</span>
        <button type="button" onClick={onClose} aria-label="Закрыть карточку"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg></button>
      </div>
      <p className="feature-kicker">{feature.kicker}</p>
      <h2>{feature.title}</h2>
      <p className="feature-description">{feature.description}</p>
      <dl>
        {feature.specs.map((spec) => (
          <div key={spec.label}>
            <dt>{spec.label}</dt>
            <dd>{spec.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
