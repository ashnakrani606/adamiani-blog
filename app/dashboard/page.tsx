"use client";
// app/dashboard/page.tsx
// Adamiani.ai — პაციენტის dashboard დემო (მხოლოდ ნიმუშის მონაცემები / FAKE DATA)
// pitch ინსტრუმენტი კლინიკებისთვის. login/medical data არ არის — ეს ფაზა B-ის საქმეა.
import type { ReactNode } from "react";
import { motion, MotionConfig, type Variants } from "framer-motion";

// ── ანიმაციის ვარიანტები ─────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const threadItem: Variants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// ── ბრენდის ფერები ───────────────────────────────────────────────
const C = {
  blue: "#1A3A5C",
  blueHover: "#15314E",
  gold: "#D4A574",
  goldDeep: "#B8893F",
  goldHover: "#C4955F",
  canvas: "#FAFAF7",
  aiBubble: "#F5ECDD",
  body: "#5A6B7B",
  muted: "#8A97A3",
  card: "#FFFFFF",
  line: "#ECE6DC", // hairline
  ok: "#5E8C6A", // muted sage — "ნორმა"
  warn: "#C68A3E", // amber (ოქროს ოჯახი) — "ყურადღება"
};

// ── ნიმუშის პაციენტი ─────────────────────────────────────────────
const patient = { name: "ნინო ბერიძე", age: 42, since: "2026 თებერვლიდან" };

// ── ჯანმრთელობის მაჩვენებლები (FAKE) ─────────────────────────────
type Metric = {
  key: string;
  label: string;
  unit: string;
  series: { points: number[]; color: string; name?: string }[];
  latest: string;
  status: { text: string; color: string };
};

const metrics: Metric[] = [
  {
    key: "weight",
    label: "წონა",
    unit: "კგ",
    series: [{ points: [78, 77, 76.5, 75, 74, 73.5], color: C.blue }],
    latest: "73.5",
    status: { text: "სტაბილური კლება", color: C.ok },
  },
  {
    key: "bp",
    label: "არტერიული წნევა",
    unit: "mmHg",
    series: [
      { points: [145, 142, 138, 132, 130, 128], color: C.blue, name: "სისტოლური" },
      { points: [95, 93, 90, 87, 85, 84], color: C.gold, name: "დიასტოლური" },
    ],
    latest: "128/84",
    status: { text: "უმჯობესდება", color: C.ok },
  },
  {
    key: "chol",
    label: "ქოლესტერინი",
    unit: "mmol/L",
    series: [{ points: [6.2, 6.0, 5.6, 5.4, 5.2, 5.1], color: C.goldDeep }],
    latest: "5.1",
    status: { text: "ნორმასთან ახლოს", color: C.warn },
  },
];

// ── "ერთი შეხედვით" შეჯამება (FAKE) — ავსებს გრაფიკებს, არ იმეორებს ──
const summary = [
  { label: "შემდეგი ვიზიტი", value: "კარდიოლოგი", meta: "12 ივლისი", accent: "#1A3A5C" },
  { label: "აქტიური დიაგნოზი", value: "ჰიპერტენზია, I ხარისხი", meta: "მკურნალობა მიმდინარეობს", accent: "#C68A3E" },
  { label: "ბოლო ანალიზი", value: "ლიპიდური პროფილი", meta: "18 მაისი", accent: "#B8893F" },
];

// ── ჯანმრთელობის ქრონიკა (FAKE) ──────────────────────────────────
type EventKind = "visit" | "lab" | "diagnosis";
const timeline: { kind: EventKind; date: string; title: string; detail: string }[] = [
  {
    kind: "visit",
    date: "2026 ივნისი",
    title: "კარდიოლოგის კონტროლი",
    detail: "წნევა გაუმჯობესდა. მკურნალობა გრძელდება იმავე დოზით.",
  },
  {
    kind: "lab",
    date: "2026 მაისი",
    title: "სისხლის საერთო + ლიპიდური პროფილი",
    detail: "ქოლესტერინი დაეცა 5.4-მდე. დანარჩენი მაჩვენებლები ნორმაში.",
  },
  {
    kind: "diagnosis",
    date: "2026 აპრილი",
    title: "არტერიული ჰიპერტენზია, I ხარისხი",
    detail: "დანიშნულია მკურნალობა და ცხოვრების წესის კორექცია.",
  },
  {
    kind: "visit",
    date: "2026 მარტი",
    title: "ოჯახის ექიმის ვიზიტი",
    detail: "ჩივილი: პერიოდული თავის ტკივილი. გადამისამართება კარდიოლოგთან.",
  },
  {
    kind: "lab",
    date: "2026 თებერვალი",
    title: "გლუკოზა და ჰემოგლობინი",
    detail: "მაჩვენებლები ნორმის ფარგლებში. საბაზისო შემოწმება.",
  },
];

const kindMeta: Record<EventKind, { label: string; color: string }> = {
  visit: { label: "ვიზიტი", color: C.blue },
  lab: { label: "ანალიზი", color: C.goldDeep },
  diagnosis: { label: "დიაგნოზი", color: C.warn },
};

// ── AI საუბრები (FAKE) ───────────────────────────────────────────
const chats = [
  {
    title: "ქოლესტერინის ანალიზის შედეგები",
    snippet: "შენი ბოლო ანალიზი 5.1-ია — ეს ნორმასთან ახლოსაა. მნიშვნელოვანია…",
    when: "3 დღის წინ",
    count: 7,
  },
  {
    title: "თავის ტკივილი და წნევა",
    snippet: "თუ თავის ტკივილს თან ახლავს მაღალი წნევა, სჯობს ექიმს მიმართო…",
    when: "1 კვირის წინ",
    count: 12,
  },
  {
    title: "კვება ქოლესტერინის შესამცირებლად",
    snippet: "რამდენიმე პრაქტიკული ნაბიჯი: ბოჭკოს მომატება, ნაჯერი ცხიმის შემცირება…",
    when: "2 კვირის წინ",
    count: 9,
  },
];

// ── პატარა SVG ხაზოვანი გრაფიკი (დამოკიდებულების გარეშე) ─────────
function Sparkline({
  series,
}: {
  series: { points: number[]; color: string; name?: string }[];
}) {
  const W = 240;
  const H = 64;
  const pad = 6;
  const all = series.flatMap((s) => s.points);
  const min = Math.min(...all);
  const max = Math.max(...all);
  const range = max - min || 1;
  const n = series[0].points.length;
  const stepX = (W - pad * 2) / (n - 1);
  const toY = (v: number) => H - pad - ((v - min) / range) * (H - pad * 2);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={H}
      preserveAspectRatio="none"
      role="img"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {series.map((s, si) => {
        const coords = s.points.map(
          (p, i) => [pad + i * stepX, toY(p)] as const
        );
        const lineD = coords
          .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`)
          .join(" ");
        const last = coords[coords.length - 1];
        return (
          <g key={si}>
            {si === 0 && (
              <path
                d={`${lineD} L ${last[0].toFixed(1)} ${H} L ${pad} ${H} Z`}
                fill={s.color}
                opacity={0.07}
              />
            )}
            <path d={lineD} fill="none" stroke={s.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={last[0]} cy={last[1]} r={3} fill={s.color} />
          </g>
        );
      })}
    </svg>
  );
}

// ── ხატულები (inline SVG) ────────────────────────────────────────
function KindIcon({ kind }: { kind: EventKind }) {
  const common = { width: 16, height: 16, fill: "none", stroke: "#fff", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (kind === "visit")
    return (
      <svg {...common} viewBox="0 0 24 24"><path d="M12 21s-7-4.5-7-10a7 7 0 0 1 14 0c0 5.5-7 10-7 10Z" /><circle cx="12" cy="11" r="2.5" /></svg>
    );
  if (kind === "lab")
    return (
      <svg {...common} viewBox="0 0 24 24"><path d="M9 3h6M10 3v6l-4.5 8a2 2 0 0 0 1.8 3h9.4a2 2 0 0 0 1.8-3L14 9V3" /></svg>
    );
  return (
    <svg {...common} viewBox="0 0 24 24"><path d="M3 12h4l2 6 4-14 2 8h6" /></svg>
  );
}

// ── გვერდი ───────────────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <MotionConfig reducedMotion="user">
    <main style={{ minHeight: "100vh", background: C.canvas, color: C.body }}>
      {/* ზედა ზოლი */}
      <header
        style={{
          borderBottom: `1px solid ${C.line}`,
          background: "rgba(250,250,247,0.85)",
          backdropFilter: "blur(6px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <a href="/" style={{ fontSize: 13, color: C.muted, textDecoration: "none" }}>← მთავარი</a>
            <span style={{ width: 1, height: 16, background: C.line }} />
            <span style={{ fontSize: 18, letterSpacing: "0.04em", color: C.blue, fontWeight: 600 }}>adamiani</span>
          </div>
          <span
            style={{
              fontSize: 11.5, letterSpacing: "0.03em", color: C.goldDeep,
              border: `1px solid ${C.gold}`, background: C.aiBubble,
              padding: "4px 10px", borderRadius: 999,
            }}
          >
            დემო · ნიმუშის მონაცემები
          </span>
        </div>
      </header>

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "32px 24px 64px" }}>
        {/* მისალმება */}
        <motion.section style={{ marginBottom: 28 }} variants={fadeUp} initial="hidden" animate="show">
          <h1 style={{ fontSize: 32, fontWeight: 400, color: C.blue, margin: 0, lineHeight: 1.2 }}>
            გამარჯობა, {patient.name.split(" ")[0]}
          </h1>
          <p style={{ fontSize: 15, color: C.body, margin: "8px 0 0" }}>
            შენი ჯანმრთელობის ისტორია — ერთ ადგილას. {patient.since}.
          </p>
        </motion.section>

        {/* ერთი შეხედვით */}
        <motion.section
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 28 }}
          variants={stagger} initial="hidden" animate="show"
        >
          {summary.map((s) => (
            <motion.div key={s.label} variants={fadeUp} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: "14px 16px", borderTop: `3px solid ${s.accent}` }}>
              <div style={{ fontSize: 12.5, color: C.muted }}>{s.label}</div>
              <div style={{ fontSize: 17, fontWeight: 600, color: C.blue, marginTop: 6, lineHeight: 1.25 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: C.body, marginTop: 6 }}>{s.meta}</div>
            </motion.div>
          ))}
        </motion.section>

        {/* ძირითადი ბადე */}
        <div style={{ display: "grid", gap: 20 }} className="adm-grid">
          {/* მარცხენა სვეტი */}
          <div style={{ display: "grid", gap: 20 }}>
            {/* მაჩვენებლები — გრაფიკები */}
            <Card title="ჯანმრთელობის მაჩვენებლები" hint="ბოლო 6 თვე">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                {metrics.map((m) => (
                  <div key={m.key}>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: C.body }}>{m.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.blue }}>{m.latest}<span style={{ fontWeight: 400, color: C.muted }}> {m.unit}</span></span>
                    </div>
                    <Sparkline series={m.series} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: C.muted, marginTop: 4 }}>
                      <span>თებ</span><span>ივნ</span>
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 6, fontSize: 11.5 }}>
                      <span style={{ width: 6, height: 6, borderRadius: 999, background: m.status.color }} />
                      <span style={{ color: m.status.color }}>{m.status.text}</span>
                    </div>
                    {m.series.length > 1 && (
                      <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
                        {m.series.map((s) => (
                          <span key={s.name} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, color: C.muted }}>
                            <span style={{ width: 10, height: 2, background: s.color, display: "inline-block" }} />
                            {s.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* ქრონიკა — signature: continuum thread */}
            <Card title="ჯანმრთელობის ქრონიკა" hint="ვიზიტები, ანალიზები, დიაგნოზები">
              <motion.div
                style={{ position: "relative", paddingLeft: 6 }}
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.15 }}
              >
                {/* ვერტიკალური ოქროს ძაფი */}
                <span
                  aria-hidden="true"
                  style={{ position: "absolute", left: 17, top: 8, bottom: 8, width: 2.5, background: `linear-gradient(${C.gold}, ${C.goldDeep} 55%, ${C.line})`, borderRadius: 2 }}
                />
                {timeline.map((e, i) => {
                  const meta = kindMeta[e.kind];
                  return (
                    <motion.div key={i} variants={threadItem} style={{ position: "relative", display: "flex", gap: 16, paddingBottom: i === timeline.length - 1 ? 0 : 22 }}>
                      <span
                        style={{
                          position: "relative", zIndex: 1, flex: "0 0 auto",
                          width: 24, height: 24, borderRadius: 999, background: meta.color,
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          boxShadow: `0 0 0 4px ${C.canvas}`,
                        }}
                      >
                        <KindIcon kind={e.kind} />
                      </span>
                      <div style={{ paddingTop: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 11, color: meta.color, fontWeight: 600 }}>{meta.label}</span>
                          <span style={{ fontSize: 11, color: C.muted }}>· {e.date}</span>
                        </div>
                        <div style={{ fontSize: 14.5, color: C.blue, fontWeight: 600, marginTop: 2 }}>{e.title}</div>
                        <div style={{ fontSize: 13, color: C.body, marginTop: 3, lineHeight: 1.5 }}>{e.detail}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </Card>
          </div>

          {/* მარჯვენა სვეტი — AI საუბრები */}
          <div>
            <Card title="AI საუბრები" hint="წინა საუბრები">
              <div style={{ display: "grid", gap: 10 }}>
                {chats.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      background: C.aiBubble, border: `1px solid ${C.line}`,
                      borderRadius: 12, padding: "12px 14px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: C.blue }}>{c.title}</span>
                      <span style={{ fontSize: 11, color: C.muted, whiteSpace: "nowrap" }}>{c.when}</span>
                    </div>
                    <p style={{ fontSize: 12.5, color: C.body, margin: "6px 0 0", lineHeight: 1.5 }}>{c.snippet}</p>
                    <div style={{ fontSize: 11, color: C.goldDeep, marginTop: 8 }}>{c.count} შეტყობინება</div>
                  </div>
                ))}
                <a
                  href="/#assistant"
                  style={{
                    textAlign: "center", fontSize: 13, color: C.blue, textDecoration: "none",
                    border: `1px solid ${C.gold}`, borderRadius: 10, padding: "10px 0", marginTop: 2,
                  }}
                >
                  ახალი საუბრის დაწყება
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* responsive: 2/3 + 1/3 lg-ზე */}
      <style>{`
        @media (min-width: 1024px) {
          .adm-grid { grid-template-columns: 2fr 1fr; align-items: start; }
        }
      `}</style>
    </main>
    </MotionConfig>
  );
}

// ── ბარათის გარსი ────────────────────────────────────────────────
function Card({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <motion.section
      style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 18, padding: 22 }}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: C.blue, margin: 0 }}>{title}</h2>
        {hint && <span style={{ fontSize: 12, color: C.muted }}>{hint}</span>}
      </div>
      {children}
    </motion.section>
  );
}