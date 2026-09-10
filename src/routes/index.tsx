import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { EditorForm } from "@/components/badge/EditorForm";
import { DocumentCanvas } from "@/components/badge/DocumentCanvas";
import {
  ACCENTS,
  DEMO_DATA,
  SIZES,
  TEMPLATES,
  type AccentId,
  type BadgeData,
  type SizeId,
  type TemplateId,
} from "@/lib/badge-types";
import logoAsset from "@/assets/gold-logo.png.asset.json";
import portraitAsset from "@/assets/demo-portrait.jpg.asset.json";
import { Download, FileText, Printer, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Badge & Certificate Studio — Employee Credential Generator" },
      {
        name: "description",
        content:
          "Design, preview and export employee ID badges and certificates of employment as print-ready PDF or PNG in Letter, A4 or CR80 card sizes.",
      },
      { property: "og:title", content: "Badge & Certificate Studio" },
      {
        property: "og:description",
        content: "Live-preview employee badges and certificates, then export print-ready PDF or PNG.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Studio,
});

function Studio() {
  const [data, setData] = useState<BadgeData>({ ...DEMO_DATA, logoUrl: logoAsset.url, photoUrl: portraitAsset.url });
  const [template, setTemplate] = useState<TemplateId>("corporate");
  const [accent, setAccent] = useState<AccentId>("gold");
  const [size, setSize] = useState<SizeId>("letter");
  const [scale, setScale] = useState(0.6);
  const [busy, setBusy] = useState(false);

  const docRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const patch = useCallback((p: Partial<BadgeData>) => setData((d) => ({ ...d, ...p })), []);

  useEffect(() => {
    const fit = () => {
      const el = stageRef.current;
      if (!el) return;
      const pad = 48;
      const s = Math.min((el.clientWidth - pad) / SIZES[size].w, (el.clientHeight - pad) / SIZES[size].h, 1);
      setScale(Math.max(s, 0.2));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [size]);

  const snapshot = async () => {
    const node = docRef.current!;
    // Wait for webfonts + images so text metrics are final before rasterising.
    if (document.fonts?.ready) await document.fonts.ready;
    await Promise.all(
      Array.from(node.querySelectorAll("img")).map((img) =>
        img.complete ? Promise.resolve() : new Promise((r) => { img.onload = r; img.onerror = r; }),
      ),
    );

    // Capture an unscaled offscreen clone: capturing a CSS-transformed node makes
    // html2canvas mis-measure glyph positions (doubled / overlapping characters).
    const holder = document.createElement("div");
    holder.style.cssText = `position:fixed;left:-100000px;top:0;width:${SIZES[size].w}px;height:${SIZES[size].h}px;overflow:hidden;background:transparent;z-index:-1;`;
    const clone = node.cloneNode(true) as HTMLDivElement;
    clone.style.transform = "none";
    clone.style.margin = "0";
    holder.appendChild(clone);
    document.body.appendChild(holder);

    try {
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      return await html2canvas(clone, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
        logging: false,
        width: SIZES[size].w,
        height: SIZES[size].h,
        windowWidth: SIZES[size].w,
        windowHeight: SIZES[size].h,
        scrollX: 0,
        scrollY: 0,
      });
    } finally {
      holder.remove();
    }
  };


  const exportPng = async () => {
    setBusy(true);
    try {
      const canvas = await snapshot();
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `${data.fullName.replace(/\s+/g, "-").toLowerCase()}-${size}.png`;
      a.click();
      toast.success("PNG downloaded");
    } catch {
      toast.error("Export failed. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const exportPdf = async () => {
    setBusy(true);
    try {
      const canvas = await snapshot();
      const { pdf, orientation } = SIZES[size];
      const doc = new jsPDF({ orientation, unit: "mm", format: pdf });
      doc.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, pdf[0], pdf[1], undefined, "SLOW");
      doc.save(`${data.fullName.replace(/\s+/g, "-").toLowerCase()}-${size}.pdf`);
      toast.success("PDF downloaded");
    } catch {
      toast.error("Export failed. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-center" />
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <img src={logoAsset.url} alt="" className="h-9 w-9 object-contain" />
            <div>
              <h1 className="text-sm font-semibold tracking-tight">Badge &amp; Certificate Studio</h1>
              <p className="text-xs text-muted-foreground">Employee credential generator</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setData({ ...DEMO_DATA, logoUrl: logoAsset.url, photoUrl: portraitAsset.url })}>
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Demo data
            </Button>
            <Button variant="secondary" size="sm" onClick={() => window.print()}>
              <Printer className="mr-1.5 h-3.5 w-3.5" /> Print
            </Button>
            <Button variant="secondary" size="sm" disabled={busy} onClick={exportPng}>
              <Download className="mr-1.5 h-3.5 w-3.5" /> PNG
            </Button>
            <Button size="sm" disabled={busy} onClick={exportPdf}>
              <FileText className="mr-1.5 h-3.5 w-3.5" /> {busy ? "Exporting…" : "Export PDF"}
            </Button>
          </div>
        </div>
      </header>

      <main className="grid gap-0 lg:grid-cols-[400px_1fr]">
        <aside className="border-b border-border p-6 lg:h-[calc(100vh-61px)] lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <div className="space-y-8">
            <section className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Template</h3>
              <div className="grid gap-2">
                {TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setTemplate(tpl.id)}
                    className={cn(
                      "rounded-lg border p-3 text-left transition-colors",
                      template === tpl.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted",
                    )}
                  >
                    <div className="text-sm font-medium">{tpl.label}</div>
                    <div className="text-xs text-muted-foreground">{tpl.description}</div>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Accent colour</Label>
                <div className="flex gap-2">
                  {Object.values(ACCENTS).map((a) => (
                    <button
                      key={a.id}
                      title={a.label}
                      onClick={() => setAccent(a.id)}
                      className={cn(
                        "h-9 w-9 rounded-full border-2 transition-transform",
                        accent === a.id ? "scale-110 border-foreground" : "border-transparent",
                      )}
                      style={{ background: a.swatch }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Print size</Label>
                <div className="grid gap-2">
                  {Object.values(SIZES).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSize(s.id)}
                      className={cn(
                        "rounded-md border px-3 py-2 text-left text-sm transition-colors",
                        size === s.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted",
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <EditorForm data={data} onChange={patch} />
          </div>
        </aside>

        <div
          ref={stageRef}
          className="flex min-h-[70vh] items-center justify-center overflow-auto bg-muted/40 p-6 lg:h-[calc(100vh-61px)]"
        >
          <div
            style={{
              width: SIZES[size].w * scale,
              height: SIZES[size].h * scale,
            }}
          >
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                boxShadow: "0 30px 80px -20px rgba(0,0,0,0.45)",
                width: SIZES[size].w,
                height: SIZES[size].h,
              }}
            >
              <DocumentCanvas ref={docRef} data={data} template={template} accent={accent} size={size} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
