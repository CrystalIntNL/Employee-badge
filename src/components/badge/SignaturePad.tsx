import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  onApply: (dataUrl: string) => void;
}

export function SignaturePad({ onApply }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width = 640;
    c.height = 200;
    const ctx = c.getContext("2d")!;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#111111";
  }, []);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * c.width, y: ((e.clientY - r.top) / r.height) * c.height };
  };

  return (
    <div className="space-y-2">
      <canvas
        ref={canvasRef}
        className="h-28 w-full cursor-crosshair rounded-md border border-border bg-white touch-none"
        onPointerDown={(e) => {
          const ctx = canvasRef.current!.getContext("2d")!;
          const p = pos(e);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          drawing.current = true;
          setDirty(true);
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drawing.current) return;
          const ctx = canvasRef.current!.getContext("2d")!;
          const p = pos(e);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }}
        onPointerUp={() => (drawing.current = false)}
        onPointerLeave={() => (drawing.current = false)}
      />
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => {
            const c = canvasRef.current!;
            c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
            setDirty(false);
          }}
        >
          Clear
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={!dirty}
          onClick={() => onApply(canvasRef.current!.toDataURL("image/png"))}
        >
          Use signature
        </Button>
      </div>
    </div>
  );
}
