import { useEffect, useState } from "react";

type Props = {
  score: number; // 0-100
  size?: number;
  thickness?: number;
  label?: string;
};

export function ScoreRing({ score, size = 160, thickness = 12, label }: Props) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = display;
    const end = Math.max(0, Math.min(100, Math.round(score)));
    const duration = 700;
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  const color =
    display >= 75
      ? "hsl(160 70% 55%)"
      : display >= 45
        ? "hsl(38 95% 60%)"
        : "hsl(350 85% 62%)";

  const bg = `conic-gradient(${color} ${display * 3.6}deg, hsl(270 40% 22% / 0.6) 0)`;

  return (
    <div
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label ?? "Score"}: ${display} of 100`}
    >
      <div
        className="rounded-full"
        style={{
          width: size,
          height: size,
          background: bg,
          transition: "background 200ms linear",
          boxShadow: `0 0 40px ${color}22`,
        }}
      />
      <div
        className="absolute rounded-full grid place-items-center"
        style={{
          width: size - thickness * 2,
          height: size - thickness * 2,
          background: "hsl(258 45% 8%)",
          border: "1px solid hsl(270 40% 25% / 0.6)",
        }}
      >
        <div className="text-center">
          <div className="font-mono text-4xl font-bold" style={{ color }}>
            {display}
          </div>
          {label && <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{label}</div>}
        </div>
      </div>
    </div>
  );
}
