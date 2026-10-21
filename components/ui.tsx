"use client";

import type { ReactNode } from "react";

/** Marcas de registro "+" nos 4 cantos de um elemento `.blueprint`. */
export function Corners() {
  return (
    <>
      <i className="corner tl" />
      <i className="corner tr" />
      <i className="corner bl" />
      <i className="corner br" />
    </>
  );
}

/** Placeholder de imagem; quando houver print (`src`), mostra a imagem. */
export function ImageSlot({ label, src, video }: { label: string; src?: string; video?: boolean }) {
  return (
    <div className="image-slot" style={src ? { padding: 0 } : undefined}>
      {src ? video ? <video src={src} controls /> : <img src={src} alt={label} /> : label}
    </div>
  );
}

export function SectionHead({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="section-head">
      <span className="kicker">{children}</span>
      {aside}
    </div>
  );
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
}: {
  tabs: [T, string][];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {tabs.map(([id, text]) => (
        <button key={id} type="button" role="tab" className="tab" aria-selected={value === id} onClick={() => onChange(id)}>
          {text}
        </button>
      ))}
    </div>
  );
}

/** Controle segmentado (classes .seg / .seg-opt do Industry). */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  name,
  label,
  style,
}: {
  options: [T, string][];
  value: T;
  onChange: (v: T) => void;
  name: string;
  label: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className="seg" role="radiogroup" aria-label={label} style={style}>
      {options.map(([id, text]) => (
        <label key={id} className="seg-opt">
          <input type="radio" name={name} checked={value === id} onChange={() => onChange(id)} />
          {text}
        </label>
      ))}
    </div>
  );
}

export function FaqList({ items, max }: { items: { id: string; q: string; a: string }[]; max?: number }) {
  return (
    <div className="stack" style={{ gap: 24, maxWidth: max }}>
      {items.map((q) => (
        <div key={q.id} className="stack faq-item" style={{ gap: 6 }}>
          <h3>{q.q}</h3>
          <p>{q.a}</p>
        </div>
      ))}
    </div>
  );
}
