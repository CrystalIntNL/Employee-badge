export type TemplateId = "corporate" | "minimalist" | "tech" | "classic";
export type AccentId = "gold" | "navy" | "emerald" | "mono";
export type SizeId = "letter" | "a4" | "cr80";

export interface BadgeData {
  orgName: string;
  department: string;
  officeAddress: string;
  logoUrl: string | null;
  photoUrl: string | null;
  photoZoom: number;
  photoX: number;
  photoY: number;
  fullName: string;
  position: string;
  employmentNumber: string;
  location: string;
  issueDate: string;
  certificateId: string;
  body: string;
  signerName: string;
  signerTitle: string;
  signatureUrl: string | null;
}

export interface Accent {
  id: AccentId;
  label: string;
  base: string;
  light: string;
  deep: string;
  swatch: string;
}

export const ACCENTS: Record<AccentId, Accent> = {
  gold: { id: "gold", label: "Gold", base: "#C9A227", light: "#F2DE97", deep: "#7A5F12", swatch: "#C9A227" },
  navy: { id: "navy", label: "Navy", base: "#3B6FD4", light: "#AFC7F5", deep: "#132A5C", swatch: "#3B6FD4" },
  emerald: { id: "emerald", label: "Emerald", base: "#2FA37A", light: "#A8E2CD", deep: "#0F4634", swatch: "#2FA37A" },
  mono: { id: "mono", label: "Monochrome", base: "#9AA0A6", light: "#E4E6E8", deep: "#3C4043", swatch: "#9AA0A6" },
};

export const TEMPLATES: { id: TemplateId; label: string; description: string }[] = [
  { id: "corporate", label: "Corporate Executive", description: "Black & metallic, guilloche engraving" },
  { id: "minimalist", label: "Modern Minimalist", description: "Light paper, clean editorial type" },
  { id: "tech", label: "Tech Badge", description: "Dark grid, monospaced data blocks" },
  { id: "classic", label: "Classic Certificate", description: "Formal ivory paper, gold border & serif type" },
];

export const SIZES: Record<SizeId, { id: SizeId; label: string; w: number; h: number; pdf: [number, number]; orientation: "portrait" | "landscape" }> = {
  letter: { id: "letter", label: "Letter · 8.5×11 in", w: 816, h: 1056, pdf: [215.9, 279.4], orientation: "portrait" },
  a4: { id: "a4", label: "A4 · 210×297 mm", w: 794, h: 1123, pdf: [210, 297], orientation: "portrait" },
  cr80: { id: "cr80", label: "ID Card · CR80", w: 648, h: 408, pdf: [85.6, 53.98], orientation: "landscape" },
};

export const DEMO_DATA: BadgeData = {
  orgName: "Crystal Intelligence",
  department: "Advanced Analytics Division",
  officeAddress: "42 Kensington Court, London EC2M 4NR, United Kingdom",
  logoUrl: null,
  photoUrl: null,
  photoZoom: 1,
  photoX: 50,
  photoY: 50,
  fullName: "Amara V. Sinclair",
  position: "Principal Intelligence Analyst",
  employmentNumber: "CI-2026-04871",
  location: "London · Headquarters",
  issueDate: "2026-09-10",
  certificateId: "CRT-9F42-AX70-1183",
  body:
    "This certifies that the named individual is a duly appointed member of staff, authorised to represent the organisation in all professional capacities set out in their engagement terms. This credential remains the property of the issuing office and must be surrendered upon conclusion of employment.",
  signerName: "Jonathan R. Whitfield",
  signerTitle: "Chief Operating Officer",
  signatureUrl: null,
};
