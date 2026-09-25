"use client";

import { useEffect, useState } from "react";

const hints = ["Нажмите боковую кнопку, чтобы включить экран", "Нажмите на точки, чтобы узнать детали", "Потяните экран вверх"];

export function FirstVisitHints() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (localStorage.getItem("iphone-18-hints-seen")) return;
    const show = window.setTimeout(() => setVisible(true), 0);
    const interval = window.setInterval(() => setStep((current) => Math.min(current + 1, hints.length - 1)), 2300);
    const timeout = window.setTimeout(() => {
      setVisible(false);
      localStorage.setItem("iphone-18-hints-seen", "true");
    }, 7200);
    return () => { window.clearTimeout(show); window.clearInterval(interval); window.clearTimeout(timeout); };
  }, []);

  if (!visible) return null;
  return <div className="first-hint" role="status"><span>{step + 1}</span>{hints[step]}</div>;
}
