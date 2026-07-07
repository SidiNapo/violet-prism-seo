import { useRef, type ReactNode, type MouseEvent } from "react";
import { Link } from "@tanstack/react-router";

type Props = {
  to: string;
  children: ReactNode;
  variant?: "gradient" | "ghost";
  className?: string;
};

export function MagneticButton({ to, children, variant = "gradient", className = "" }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.15}px, ${y * 0.2}px)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0,0)";
  };

  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-transform duration-300 will-change-transform";
  const gradient =
    "gradient-violet text-white shadow-[0_10px_40px_-10px_hsl(265_85%_58%/0.7)] hover:brightness-110";
  const ghost =
    "border border-border/80 bg-void/40 text-crystal-white hover:border-amethyst-glow/60 hover:text-amethyst-glow";

  return (
    <Link
      to={to}
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`${base} ${variant === "gradient" ? gradient : ghost} ${className}`}
    >
      {children}
    </Link>
  );
}
