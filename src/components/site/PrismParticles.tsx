import { useEffect, useRef } from "react";

/**
 * A fixed, GPU-cheap canvas of drifting 3D cube outlines echoing the
 * exploding cubes in the E-SeoMax logo. Respects prefers-reduced-motion.
 */
export function PrismParticles({ count = 28 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth * devicePixelRatio);
    let h = (canvas.height = window.innerHeight * devicePixelRatio);

    const cubes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      s: 20 + Math.random() * 40,
      rx: Math.random() * Math.PI,
      ry: Math.random() * Math.PI,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      vr: (Math.random() - 0.5) * 0.004,
      alpha: 0.12 + Math.random() * 0.18,
    }));

    const project = (x: number, y: number, z: number, cx: number, cy: number) => {
      const d = 300 / (300 - z);
      return [cx + x * d, cy + y * d] as const;
    };

    const drawCube = (
      cx: number,
      cy: number,
      s: number,
      rx: number,
      ry: number,
      alpha: number,
    ) => {
      const v = [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
      ].map(([x, y, z]) => {
        // rotate Y
        let X = x * Math.cos(ry) - z * Math.sin(ry);
        let Z = x * Math.sin(ry) + z * Math.cos(ry);
        let Y = y;
        // rotate X
        const Y2 = Y * Math.cos(rx) - Z * Math.sin(rx);
        Z = Y * Math.sin(rx) + Z * Math.cos(rx);
        Y = Y2;
        return project(X * s, Y * s, Z * s, cx, cy);
      });
      const edges = [
        [0,1],[1,2],[2,3],[3,0],
        [4,5],[5,6],[6,7],[7,4],
        [0,4],[1,5],[2,6],[3,7],
      ];
      ctx.strokeStyle = `hsla(275, 100%, 78%, ${alpha})`;
      ctx.lineWidth = 1 * devicePixelRatio;
      ctx.beginPath();
      edges.forEach(([a, b]) => {
        ctx.moveTo(v[a][0], v[a][1]);
        ctx.lineTo(v[b][0], v[b][1]);
      });
      ctx.stroke();
    };

    let raf = 0;
    const render = () => {
      ctx.clearRect(0, 0, w, h);
      for (const c of cubes) {
        drawCube(c.x, c.y, c.s, c.rx, c.ry, c.alpha);
        if (!reduce) {
          c.x += c.vx * devicePixelRatio;
          c.y += c.vy * devicePixelRatio;
          c.rx += c.vr;
          c.ry += c.vr * 0.7;
          if (c.x < -80) c.x = w + 80;
          if (c.x > w + 80) c.x = -80;
          if (c.y < -80) c.y = h + 80;
          if (c.y > h + 80) c.y = -80;
        }
      }
      raf = requestAnimationFrame(render);
    };
    render();

    const onResize = () => {
      w = canvas.width = window.innerWidth * devicePixelRatio;
      h = canvas.height = window.innerHeight * devicePixelRatio;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ width: "100vw", height: "100vh", opacity: 0.9 }}
    />
  );
}
