import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { SignaturePad } from "./SignaturePad";
import type { BadgeData } from "@/lib/badge-types";
import { Upload, X } from "lucide-react";

interface Props {
  data: BadgeData;
  onChange: (patch: Partial<BadgeData>) => void;
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function ImageField({
  label,
  value,
  onSet,
  hint,
}: {
  label: string;
  value: string | null;
  onSet: (v: string | null) => void;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-contain" />
          ) : (
            <Upload className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
            Choose file
          </Button>
          {value && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onSet(null)}>
              <X className="mr-1 h-3.5 w-3.5" /> Remove
            </Button>
          )}
        </div>
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f) onSet(await readFile(f));
          e.target.value = "";
        }}
      />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{title}</h3>
      {children}
    </section>
  );
}

function Text({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function EditorForm({ data, onChange }: Props) {
  return (
    <div className="space-y-8">
      <Section title="Organisation">
        <Text label="Organisation name" value={data.orgName} onChange={(v) => onChange({ orgName: v })} />
        <Text label="Department" value={data.department} onChange={(v) => onChange({ department: v })} />
        <div className="space-y-1.5">
          <Label>Office address</Label>
          <Textarea rows={2} value={data.officeAddress} onChange={(e) => onChange({ officeAddress: e.target.value })} />
        </div>
        <ImageField label="Organisation logo" value={data.logoUrl} onSet={(v) => onChange({ logoUrl: v })} />
      </Section>

      <Separator />

      <Section title="Employee photo">
        <ImageField
          label="Portrait"
          value={data.photoUrl}
          onSet={(v) => onChange({ photoUrl: v })}
          hint="Use the sliders to zoom and reposition the crop."
        />
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="flex justify-between text-xs">
              <span>Zoom</span>
              <span className="text-muted-foreground">{data.photoZoom.toFixed(2)}×</span>
            </Label>
            <Slider min={1} max={2.5} step={0.01} value={[data.photoZoom]} onValueChange={([v]) => onChange({ photoZoom: v })} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Horizontal</Label>
            <Slider min={0} max={100} step={1} value={[data.photoX]} onValueChange={([v]) => onChange({ photoX: v })} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Vertical</Label>
            <Slider min={0} max={100} step={1} value={[data.photoY]} onValueChange={([v]) => onChange({ photoY: v })} />
          </div>
        </div>
      </Section>

      <Separator />

      <Section title="Employee details">
        <Text label="Full name" value={data.fullName} onChange={(v) => onChange({ fullName: v })} />
        <Text label="Position / title" value={data.position} onChange={(v) => onChange({ position: v })} />
        <div className="grid grid-cols-2 gap-3">
          <Text label="Employment number" value={data.employmentNumber} onChange={(v) => onChange({ employmentNumber: v })} />
          <Text label="Location / home" value={data.location} onChange={(v) => onChange({ location: v })} />
          <Text label="Issue date" type="date" value={data.issueDate} onChange={(v) => onChange({ issueDate: v })} />
          <Text label="Certificate ID" value={data.certificateId} onChange={(v) => onChange({ certificateId: v })} />
        </div>
        <div className="space-y-1.5">
          <Label>Body description</Label>
          <Textarea rows={5} value={data.body} onChange={(e) => onChange({ body: e.target.value })} />
        </div>
      </Section>

      <Separator />

      <Section title="Signatory">
        <Text label="Authorised signer" value={data.signerName} onChange={(v) => onChange({ signerName: v })} />
        <Text label="Signer title" value={data.signerTitle} onChange={(v) => onChange({ signerTitle: v })} />
        <ImageField label="Signature image" value={data.signatureUrl} onSet={(v) => onChange({ signatureUrl: v })} />
        <div className="space-y-2">
          <Label>Or draw a signature</Label>
          <SignaturePad onApply={(url) => onChange({ signatureUrl: url })} />
        </div>
      </Section>
    </div>
  );
}
