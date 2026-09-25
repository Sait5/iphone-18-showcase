"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { colorsForModel } from "@/data/colors";
import { features, tourOrder, getModelFeature } from "@/data/features";
import { iphoneModels } from "@/data/models";
import { useDeviceCapability } from "@/hooks/use-device-capability";
import type { ColorId, FeatureId, ModelId } from "@/types/iphone";
import { ColorSelector } from "./ColorSelector";
import { FeatureCard } from "./FeatureCard";
import { FirstVisitHints } from "./FirstVisitHints";
import { ModelSelector } from "./ModelSelector";
import { SpecRail } from "./SpecRail";
import { StaticPhone } from "./StaticPhone";
import { SceneBoundary } from "./SceneBoundary";

const PhoneScene = dynamic(() => import("./PhoneScene"), {
  ssr: false, loading: () => <div className="scene-loading">Загружаем устройство…</div>,
});

export function Showcase() {
  const [modelId, setModelId] = useState<ModelId>("iphone-18-pro");
  const [colorId, setColorId] = useState<ColorId>("crimson");
  const [selectedFeature, setSelectedFeature] = useState<FeatureId | null>(null);
  const [powered, setPowered] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [touring, setTouring] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);
  const [failed, setFailed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [folded, setFolded] = useState(false);
  const [rearView, setRearView] = useState(false);
  const [showHotspots, setShowHotspots] = useState(true);
  const canRender3D = useDeviceCapability();
  const model = iphoneModels.find(m => m.id === modelId)!;
  const colors = colorsForModel(model);
  const color = colors.find(c => c.id === colorId) ?? colors[0];
  const feature = getModelFeature(selectedFeature, model);
  const profile = model.foldable && folded ? model.foldedThickness! : model.thickness;
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    const timer = window.setTimeout(sync, 0);
    media.addEventListener("change", sync);
    return () => { window.clearTimeout(timer); media.removeEventListener("change", sync); };
  }, []);
  useEffect(() => {
    if (!touring || reducedMotion) return;
    const timer = window.setTimeout(() => {
      if (tourStep === tourOrder.length - 1) setTouring(false);
      else { setTourStep(tourStep + 1); setSelectedFeature(tourOrder[tourStep + 1]); }
    }, 4500);
    return () => window.clearTimeout(timer);
  }, [touring, tourStep, reducedMotion]);
  useEffect(() => {
    function close(event: KeyboardEvent) { if (event.key === "Escape") { setSelectedFeature(null); setTouring(false); } }
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  function reset(back = false) {
    setTouring(false); setTourStep(0); setSelectedFeature(null);
    setRearView(back); setResetSignal(s => s + 1);
  }
  function select(id: FeatureId) {
    setTouring(false); setSelectedFeature(id); setResetSignal(s => s + 1);
    if (model.foldable) setFolded(false);
  }
  function chooseModel(id: ModelId) {
    const next = iphoneModels.find(m => m.id === id)!;
    setModelId(id); setFolded(false); setPowered(true); setUnlocked(false);
    const palette = colorsForModel(next);
    if (!palette.some(c => c.id === colorId)) setColorId(palette[0].id);
    reset(false);
  }
  function start() {
    setFolded(false); setTourStep(0); setSelectedFeature("camera");
    setResetSignal(s => s + 1); setTouring(true);
  }
  const fallback = <StaticPhone model={model} color={color}/>;
  return <main className="showcase-shell">
    <header className="topbar">
      <a className="brand" href="#device" aria-label="iPhone Lab — начало"><span className="brand-mark">18</span>iPhone Lab</a>
      <nav aria-label="Разделы"><a href="#device">Устройство</a><a href="#architecture">Архитектура</a></nav>
      <span className="concept-label">Независимый концепт · 2026</span>
    </header>
    <section className="experience" id="device">
      <div className="experience-heading">
        <div><p className="eyebrow">DESIGN EXPLORER / 01</p><h1>Ближе к iPhone.</h1></div>
        <p>Поверните. Приблизьтесь к деталям.<br/>Найдите свой цвет.</p>
      </div>
      <ModelSelector value={modelId} onChange={chooseModel}/>
      <div className="studio">
        <div className="device-viewport">
          <div className="studio-caption"><span className="eyebrow">{model.foldable ? "FOLDABLE CONCEPT" : "DESIGNED TO EXPLORE"}</span><h2>{model.name}</h2><p>{color.name}</p></div>
          <div className="stage" aria-label="Вращайте телефон перетаскиванием">
            {canRender3D === null ? <div className="scene-loading">Подготавливаем студию…</div> :
              canRender3D === false || failed ? fallback :
              <SceneBoundary fallback={fallback}><PhoneScene model={model} color={color} selectedFeature={selectedFeature}
                powered={powered} unlocked={unlocked} reducedMotion={reducedMotion} resetSignal={resetSignal}
                folded={folded} rearView={rearView} showHotspots={showHotspots}
                onUnlock={() => setUnlocked(true)} onSelectFeature={select}
                onPowerToggle={() => { setPowered(value => !value); setUnlocked(false); }}
                onInteract={() => setTouring(false)} onFailure={() => setFailed(true)}/></SceneBoundary>}
            <FirstVisitHints/>
          </div>
          <div className="viewport-meta">
            <button className="marker-toggle" aria-pressed={showHotspots} onClick={() => setShowHotspots(v => !v)}>{showHotspots ? "Скрыть точки" : "Показать точки"}</button></div>
        </div>
        <aside className="inspector" aria-label="Управление устройством">
          <div className="inspector-heading"><span className="eyebrow">ВАШ IPHONE</span><span className="concept-pill">{model.official ? "Данные Apple" : "Концепт"}</span></div>
          <h2>{model.name}</h2><p className="model-subtitle">{model.eyebrow}</p>
          <ColorSelector value={color.id} onChange={setColorId} colors={colors}/>
          <SpecRail model={model}/>
          {model.foldable && <button className="fold-button" aria-pressed={folded} onClick={() => { setFolded(v => !v); reset(false); }}>{folded ? "Раскрыть Duo" : "Сложить Duo"}<span aria-hidden="true">↔</span></button>}
          <div className="inspector-divider"/>
          {feature ? <FeatureCard feature={feature} onClose={() => { setTouring(false); setSelectedFeature(null); }}/> :
            <div className="inspector-help"><span className="eyebrow">ИССЛЕДУЙТЕ ДЕТАЛИ</span><p>Нажмите на точку у нужной детали или начните последовательный обзор.</p><button className="primary-button" onClick={start}>Обзор устройства <span aria-hidden="true">↗</span></button></div>}
          {touring && <div className="tour-status" role="status"><span>{tourStep + 1} / 5</span>
            {reducedMotion && <button onClick={() => { if (tourStep === 4) setTouring(false); else { setTourStep(s => s + 1); setSelectedFeature(tourOrder[tourStep + 1]); } }}>Далее</button>}
            <button onClick={() => reset(true)}>Сбросить обзор</button></div>}
        </aside>
      </div>
      <div className="feature-navigation" role="group" aria-label="Выберите деталь устройства">
        {features.map(f => <button key={f.id} onClick={() => select(f.id)} aria-pressed={selectedFeature === f.id}><span>{f.index}</span>{f.kicker}<span aria-hidden="true">↗</span></button>)}
      </div>
      <p className="concept-note">{model.official ? "Размеры, масса и базовые характеристики приведены по данным Apple. 3D-визуализация — независимая интерпретация." : "Для базового iPhone 18 официальные размеры и характеристики ещё не объявлены. Показанная модель — дизайн-концепт."}</p>
    </section>
    <section className="architecture-section" id="architecture">
      <div className="section-heading"><div><p className="eyebrow">ТОЧНОСТЬ В ПРОФИЛЕ</p><h2>Тоньше. Спокойнее.<br/>Точнее.</h2></div><p>Пропорции {model.name}.<br/>Без лишнего объёма по краям.</p></div>
      <div className="architecture-grid">
        <article className="architecture-card profile-card"><span className="architecture-index">01 / ПРОФИЛЬ</span><strong>{profile}</strong><h3>{model.foldable ? (folded ? "Две половины и тонкий технологический шов." : "Тонкий в раскрытом виде.") : "Тонкая цельная рамка."}</h3><p>Толщина приведена как ориентир дизайн-концепта и подчёркивает обновлённые пропорции модели.</p></article>
        <article className="architecture-card controls-card"><span className="architecture-index">02 / УПРАВЛЕНИЕ</span><div className="button-profile" aria-hidden="true"><i/><i/><i/></div><h3>Клавиши почти заподлицо.</h3><p>Узкие боковые кнопки повторяют линию металлической рамки и выступают ровно настолько, чтобы их найти на ощупь.</p></article>
        <article className="architecture-card engineering-card"><span className="architecture-index">03 / {model.foldable ? "ШАРНИР" : "КАМЕРЫ"}</span><strong>{model.foldable ? "180°" : "−35%"}</strong><h3>{model.foldable ? "Закрывается до конца." : "Меньше выступ оптики."}</h3><p>{model.foldable ? "Ось шарнира сводит половины параллельно, оставляя тонкий видимый шов между рамками." : "Камера-платформа и кольца линз стали тоньше, сохранив выразительный силуэт."}</p></article>
      </div>
      <a className="back-to-device" href="#device">Вернуться к устройству ↑</a>
    </section>
    <footer className="site-footer"><a className="brand" href="#device"><span className="brand-mark">18</span>iPhone Lab</a><p>Независимое исследование дизайна.<br/>Не связано с Apple.</p><a href="/models/ATTRIBUTION.md">Источники 3D и лицензия ↗</a></footer>
  </main>;
}
