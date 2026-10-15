import { forwardRef } from "react";
import { ACCENTS, SIZES, type AccentId, type BadgeData, type SizeId, type TemplateId } from "@/lib/badge-types";
import diamondWatermarkAsset from "@/assets/ci-diamond-watermark.png.asset.json";
import { GuillocheWaves, TechGrid } from "./Guilloche";

interface Props {
  data: BadgeData;
  template: TemplateId;
  accent: AccentId;
  size: SizeId;
}

interface Theme {
  bg: string;
  panel: string;
  ink: string;
  soft: string;
  hair: string;
  display: string;
  sans: string;
  mono: string;
  ornate: boolean;
}

function themeFor(template: TemplateId, accent: string): Theme {
  const sans = "'Inter', system-ui, sans-serif";
  const mono = "'JetBrains Mono', ui-monospace, monospace";
  if (template === "minimalist") {
    return {
      bg: "#FBFAF7",
      panel: "#FFFFFF",
      ink: "#14161A",
      soft: "#6B7280",
      hair: "#E3E1DA",
      display: "'Cormorant Garamond', Georgia, serif",
      sans,
      mono,
      ornate: false,
    };
  }
  if (template === "tech") {
    return {
      bg: "#0C0F14",
      panel: "#12161D",
      ink: "#E8EDF4",
      soft: "#8A94A6",
      hair: "#1F2937",
      display: mono,
      sans,
      mono,
      ornate: false,
    };
  }
  if (template === "classic") {
    return {
      bg: "#FFFCF3",
      panel: "rgba(255,255,255,0.72)",
      ink: "#272016",
      soft: "#706656",
      hair: accent,
      display: "'Cormorant Garamond', Georgia, serif",
      sans,
      mono,
      ornate: true,
    };
  }
  return {
    bg: "#0A0A0B",
    panel: "#111113",
    ink: "#F4F1E8",
    soft: "#9C968A",
    hair: accent,
    display: "'Cormorant Garamond', Georgia, serif",
    sans,
    mono,
    ornate: true,
  };
}

function fmtDate(v: string) {
  if (!v) return "—";
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  const d = dateOnly
    ? new Date(Date.UTC(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3])))
    : new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function Photo({ data, size, ring }: { data: BadgeData; size: number; ring: string }) {
  return (
    <div
      style={{
        width: size,
        height: size * 1.18,
        overflow: "hidden",
        background: "rgba(128,128,128,0.14)",
        border: `1px solid ${ring}`,
        boxShadow: `0 0 0 4px rgba(0,0,0,0.06)`,
        flexShrink: 0,
      }}
    >
      {data.photoUrl ? (
        <img
          src={data.photoUrl}
          alt={data.fullName}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: `${data.photoX}% ${data.photoY}%`,
            transform: `scale(${data.photoZoom})`,
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: size * 0.34,
            fontFamily: "'Cormorant Garamond', serif",
            color: ring,
          }}
        >
          {data.fullName.trim().charAt(0) || "?"}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, t, mono }: { label: string; value: string; t: Theme; mono?: boolean }) {
  return (
    <div>
      <div
        style={{
          fontFamily: t.sans,
          fontSize: 8,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: t.soft,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div style={{ fontFamily: mono ? t.mono : t.sans, fontSize: 12.5, color: t.ink, fontWeight: 500 }}>
        {value || "—"}
      </div>
    </div>
  );
}

export const DocumentCanvas = forwardRef<HTMLDivElement, Props>(function DocumentCanvas(
  { data, template, accent, size },
  ref,
) {
  const a = ACCENTS[accent];
  const t = themeFor(template, a.base);
  const dims = SIZES[size];
  const card = size === "cr80";
  const gradient = `linear-gradient(120deg, ${a.deep}, ${a.base} 42%, ${a.light} 58%, ${a.base} 78%, ${a.deep})`;

  const Header = (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      {data.logoUrl ? (
        <img
          src={data.logoUrl}
          alt=""
          style={{ height: card ? 32 : 42, width: "auto", objectFit: "contain", flexShrink: 0 }}
        />
      ) : (
        <div
          style={{
            width: card ? 40 : 56,
            height: card ? 40 : 56,
            border: `1px solid ${a.base}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: t.display,
            fontSize: card ? 15 : 22,
            color: a.base,
          }}
        >
          {data.orgName.trim().charAt(0) || "C"}
        </div>
      )}
      <div>
        <div
          style={{
            fontFamily: t.display,
            fontSize: card ? 16 : 24,
            letterSpacing: "0.02em",
            color: t.ink,
            lineHeight: 1.1,
          }}
        >
          {data.orgName}
        </div>
        <div
          style={{
            fontFamily: t.sans,
            fontSize: card ? 7.5 : 9,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: a.base,
            marginTop: 4,
          }}
        >
          {data.department}
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={ref}
      style={{
        width: dims.w,
        height: dims.h,
        background: t.bg,
        color: t.ink,
        position: "relative",
        overflow: "hidden",
        padding: card ? 22 : 44,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* backdrop */}
      {template === "tech" && (
        <TechGrid
          color={a.base}
          style={{ opacity: 0.18, position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
      )}
      <img
        src={diamondWatermarkAsset.url}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: card ? 360 : 650,
          maxWidth: "84%",
          maxHeight: "76%",
          height: "auto",
          transform: "translate(-50%, -50%)",
          objectFit: "contain",
          opacity: template === "minimalist" ? 0.055 : template === "tech" ? 0.075 : 0.065,
          filter: template === "minimalist" ? "grayscale(1)" : "grayscale(1) invert(1)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {t.ornate && (
        <>
          <GuillocheWaves
            color={a.base}
            style={{
              opacity: 0.22,
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "100%",
              height: card ? 60 : 110,
            }}
          />
        </>
      )}

      {template === "classic" && (
        <>
          <div
            style={{
              position: "absolute",
              inset: card ? 13 : 28,
              border: `3px double ${a.base}`,
              opacity: 0.72,
              pointerEvents: "none",
            }}
          />
          {!card && (
            <div
              style={{
                position: "absolute",
                inset: 34,
                border: `1px solid ${a.base}`,
                opacity: 0.28,
                pointerEvents: "none",
              }}
            />
          )}
        </>
      )}


      {/* frame */}
      <div
        style={{
          position: "absolute",
          inset: card ? 8 : 18,
          border: `1px solid ${template === "minimalist" ? t.hair : a.base}`,
          opacity: template === "minimalist" ? 1 : template === "classic" ? 0.35 : 0.75,
          pointerEvents: "none",
        }}
      />
      {!card && t.ornate && (
        <div style={{ position: "absolute", inset: 25, border: `0.5px solid ${a.base}`, opacity: 0.35, pointerEvents: "none" }} />
      )}

      {/* content */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%", gap: card ? 12 : 0, justifyContent: card ? "flex-start" : "space-between" }}>
        {card ? (
          <>
            {Header}
            <div style={{ display: "flex", gap: 16, flex: 1 }}>
              <Photo data={data} size={132} ring={a.base} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <div style={{ fontFamily: t.display, fontSize: 26, lineHeight: 1.05, color: t.ink }}>{data.fullName}</div>
                  <div style={{ fontFamily: t.sans, fontSize: 10.5, color: a.base, marginTop: 3 }}>{data.position}</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <Field label="Employee No." value={data.employmentNumber} t={t} mono />
                  <Field label="Location" value={data.location} t={t} />
                  <Field label="Issued" value={fmtDate(data.issueDate)} t={t} />
                  <Field label="Card ID" value={data.certificateId} t={t} mono />
                </div>
                <div style={{ marginTop: "auto", display: "flex", alignItems: "flex-end", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 26, display: "flex", alignItems: "flex-end" }}>
                      {data.signatureUrl ? (
                        <img src={data.signatureUrl} alt="" style={{ maxHeight: 26, maxWidth: 130, objectFit: "contain" }} />
                      ) : (
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: t.soft }}>
                          {data.signerName}
                        </span>
                      )}
                    </div>
                    <div style={{ borderTop: `1px solid ${a.base}`, paddingTop: 3, fontFamily: t.sans, fontSize: 7.5, color: t.soft }}>
                      {data.signerTitle}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                borderTop: `1px solid ${t.hair}`,
                paddingTop: 8,
                display: "flex",
                justifyContent: "space-between",
                fontFamily: t.mono,
                fontSize: 7.5,
                letterSpacing: "0.1em",
                color: t.soft,
                textTransform: "uppercase",
              }}
            >
              <span>{data.officeAddress}</span>
              <span style={{ color: a.base }}>Property of {data.orgName}</span>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              {Header}
              <div style={{ textAlign: "right", fontFamily: t.mono, fontSize: 8.5, color: t.soft, lineHeight: 1.7 }}>
                <div style={{ color: a.base, letterSpacing: "0.14em" }}>{data.certificateId}</div>
                <div>ISSUED {fmtDate(data.issueDate).toUpperCase()}</div>
              </div>
            </div>

            <div style={{ marginTop: 34, textAlign: "center" }}>
              <div
                style={{
                  fontFamily: t.sans,
                  fontSize: 9.5,
                  letterSpacing: "0.42em",
                  textTransform: "uppercase",
                  color: a.base,
                }}
              >
                Employee Credential
              </div>
              <div
                style={{
                  fontFamily: t.display,
                  fontSize: template === "tech" ? 34 : 46,
                  letterSpacing: template === "tech" ? "0.02em" : "0.01em",
                  marginTop: 8,
                  lineHeight: 1.05,
                }}
              >
                Certificate of Employment
              </div>
              <div
                style={{
                  width: 120,
                  height: 2,
                  margin: "16px auto 0",
                  background: gradient,
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 28, marginTop: 34, alignItems: "flex-start" }}>
              <Photo data={data} size={150} ring={a.base} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: t.display, fontSize: 40, lineHeight: 1.05 }}>{data.fullName}</div>
                <div
                  style={{
                    fontFamily: t.sans,
                    fontSize: 13,
                    letterSpacing: "0.06em",
                    color: a.base,
                    marginTop: 6,
                  }}
                >
                  {data.position}
                </div>
                <div
                  style={{
                    marginTop: 18,
                    padding: 16,
                    background: t.panel,
                    border: `1px solid ${t.hair}`,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                  }}
                >
                  <Field label="Employment Number" value={data.employmentNumber} t={t} mono />
                  <Field label="Location" value={data.location} t={t} />
                  <Field label="Department" value={data.department} t={t} />
                  <Field label="Date of Issue" value={fmtDate(data.issueDate)} t={t} />
                </div>
              </div>
            </div>

            <p
              style={{
                fontFamily: template === "tech" ? t.sans : t.display,
                fontSize: template === "tech" ? 12.5 : 16,
                lineHeight: 1.75,
                color: template === "tech" ? t.soft : t.ink,
                marginTop: 28,
                textAlign: "justify",
              }}
            >
              {data.body}
            </p>

            <div
              style={{
                marginTop: 26,
                display: "flex",
                alignItems: "center",
                gap: 26,
                padding: "14px 4px 12px",
                borderTop: `1px solid ${t.hair}`,
                borderBottom: `1px solid ${t.hair}`,
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 28, rowGap: 15, flex: 1 }}>
                <Field label="Credential status" value="Active" t={t} />
                <Field label="Verification" value={data.certificateId} t={t} mono />
                <Field label="Holder" value={data.fullName} t={t} />
                <Field label="Authorised by" value={data.signerName} t={t} />
              </div>
            </div>



            <div style={{ paddingTop: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
                <div style={{ maxWidth: 260, fontFamily: t.sans, fontSize: 9, lineHeight: 1.7, color: t.soft }}>
                  <div style={{ letterSpacing: "0.18em", textTransform: "uppercase", color: a.base, marginBottom: 5 }}>
                    Registered Office
                  </div>
                  {data.officeAddress}
                </div>
                <div style={{ textAlign: "center", minWidth: 230 }}>
                  <div style={{ height: 52, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                    {data.signatureUrl ? (
                      <img src={data.signatureUrl} alt="" style={{ maxHeight: 52, maxWidth: 210, objectFit: "contain" }} />
                    ) : (
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: t.soft }}>
                        {data.signerName}
                      </span>
                    )}
                  </div>
                  <div style={{ borderTop: `1px solid ${a.base}`, marginTop: 6, paddingTop: 7 }}>
                    <div style={{ fontFamily: t.sans, fontSize: 11.5, fontWeight: 600 }}>{data.signerName}</div>
                    <div style={{ fontFamily: t.sans, fontSize: 9, color: t.soft, marginTop: 2 }}>{data.signerTitle}</div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: 22,
                  borderTop: `1px solid ${t.hair}`,
                  paddingTop: 12,
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {[
                  `ID ${data.employmentNumber}`,
                  `CERT ${data.certificateId}`,
                  "VERIFIED CREDENTIAL",
                  data.location,
                ].map((chip) => (
                  <span
                    key={chip}
                    style={{
                      fontFamily: t.mono,
                      fontSize: 7.5,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      padding: "5px 10px",
                      border: `1px solid ${t.hair}`,
                      color: t.soft,
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
});
