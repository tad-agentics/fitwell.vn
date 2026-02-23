import { useState } from "react";

// ─── GOOGLE FONTS ────────────────────────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Be+Vietnam+Pro:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Be Vietnam Pro', Helvetica, sans-serif;
      background: #F5F5F5;
      color: #041E3A;
      -webkit-font-smoothing: antialiased;
    }
  `}</style>
);

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const tokens = {
  color: {
    navy:        "#041E3A",
    navyHover:   "#0A3055",
    white:       "#FFFFFF",
    greySurface: "#F5F5F5",
    greyWarm:    "#EBEBF0",
    greyText:    "#9D9FA3",
    gold:        "#8C693B",
    amber:       "#D97706",
    risk:        "#DC2626",
    success:     "#059669",
  },
  space: {
    "1": "4px",  "2": "8px",   "3": "12px",
    "4": "16px", "5": "20px",  "6": "24px",
    "8": "32px", "10": "40px", "12": "48px",
    "16": "64px",
  },
};

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const S = {
  page: {
    background: "#F5F5F5",
    minHeight: "100vh",
    fontFamily: "'Be Vietnam Pro', Helvetica, sans-serif",
    color: "#041E3A",
  } as React.CSSProperties,

  wrap: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "0 40px",
  } as React.CSSProperties,

  sectionLabel: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "#9D9FA3",
    marginBottom: 8,
  } as React.CSSProperties,

  sectionHeading: {
    fontFamily: "'Be Vietnam Pro', Helvetica, sans-serif",
    fontSize: 22,
    fontWeight: 600,
    color: "#041E3A",
    marginBottom: 32,
    paddingBottom: 16,
    borderBottom: "1px solid #EBEBF0",
  } as React.CSSProperties,

  subHeading: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "#9D9FA3",
    marginBottom: 16,
    marginTop: 40,
  } as React.CSSProperties,

  divider: {
    border: "none",
    borderTop: "1px solid #EBEBF0",
    margin: "0",
  } as React.CSSProperties,
};

// ─── NAV ──────────────────────────────────────────────────────────────────────
const sections = ["Colours", "Typography", "Spacing", "Components", "Motion", "Do / Don't"];

const Nav = ({ active, onSelect }: { active: string; onSelect: (s: string) => void }) => (
  <nav style={{
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
    background: "#041E3A", height: 56,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 40px",
  }}>
    <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
      <span style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 13, fontWeight: 500,
        letterSpacing: "0.12em", textTransform: "uppercase",
        color: "#FFFFFF",
      }}>FitWell</span>
      <span style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 10, color: "#9D9FA3", letterSpacing: "0.06em",
      }}>Design System v1.0</span>
    </div>
    <div style={{ display: "flex", gap: 32 }}>
      {sections.map(s => (
        <button key={s} onClick={() => onSelect(s)} style={{
          background: "none", border: "none", cursor: "pointer", padding: 0,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10, fontWeight: 500,
          letterSpacing: "0.08em", textTransform: "uppercase",
          color: active === s ? "#FFFFFF" : "#9D9FA3",
          borderBottom: active === s ? "1px solid #FFFFFF" : "1px solid transparent",
          paddingBottom: 2,
          transition: "color 150ms ease-out, border-color 150ms ease-out",
        }}>{s}</button>
      ))}
    </div>
  </nav>
);

// ─── COLOUR SECTION ───────────────────────────────────────────────────────────
const Swatch = ({ name, hex, token, note }: { name: string; hex: string; token: string; note: string }) => (
  <div style={{ display: "flex", alignItems: "stretch", marginBottom: 2 }}>
    <div style={{
      width: 64, height: 56, background: hex, flexShrink: 0,
      border: hex === "#FFFFFF" ? "1px solid #EBEBF0" : "none",
    }} />
    <div style={{
      flex: 1, padding: "12px 16px", background: "#FFFFFF",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      borderBottom: "1px solid #EBEBF0",
    }}>
      <div>
        <div style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 14, fontWeight: 600, color: "#041E3A" }}>{name}</div>
        <div style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 12, color: "#9D9FA3", marginTop: 2 }}>{note}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#041E3A" }}>{hex}</div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#9D9FA3", marginTop: 2 }}>{token}</div>
      </div>
    </div>
  </div>
);

const ColourSection = () => (
  <div>
    <p style={S.subHeading}>Primary — RL Derived</p>
    <Swatch name="Navy" hex="#041E3A" token="navy" note="Primary text, CTAs, dark surfaces, timer background, eyebrow colour" />
    <Swatch name="Navy Hover" hex="#0A3055" token="navy-hover" note="Pressed / hover state on navy elements" />
    <Swatch name="White" hex="#FFFFFF" token="white" note="Page background, on-dark text, elevated card surface" />
    <Swatch name="Grey Surface" hex="#F5F5F5" token="grey-surface" note="App background, default screen, card alternates" />
    <Swatch name="Grey Warm" hex="#EBEBF0" token="grey-warm" note="Component borders, row separators, dividers" />
    <Swatch name="Grey Text" hex="#9D9FA3" token="grey-text" note="Rationale copy, muted labels, disabled states, timestamps" />

    <p style={S.subHeading}>Accent — Sparse Use Only</p>
    <Swatch name="Gold" hex="#8C693B" token="gold" note="Household Plan badge + brief tier indicator only — maximum 2 uses in entire app" />

    <p style={S.subHeading}>Functional — Health Context Only</p>
    <Swatch name="Amber" hex="#D97706" token="amber" note="Warning, unread dot indicator, medium risk level" />
    <Swatch name="Risk" hex="#DC2626" token="risk" note="High-risk day, avoid item, critical alert text" />
    <Swatch name="Success" hex="#059669" token="success" note="Action complete, recovery on-track, low risk" />
  </div>
);

// ─── TYPOGRAPHY SECTION ───────────────────────────────────────────────────────
const TypeRow = ({
  label, fontName, size, weight, sample, isSerif = false, isMono = false,
}: {
  label: string; fontName: string; size: number; weight: number; sample: string;
  isSerif?: boolean; isMono?: boolean;
}) => {
  const ff = isSerif
    ? "'DM Serif Display', Georgia, serif"
    : isMono
      ? "'IBM Plex Mono', 'Courier New', monospace"
      : "'Be Vietnam Pro', Helvetica, sans-serif";

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "180px 1fr",
      borderBottom: "1px solid #EBEBF0", background: "#FFFFFF", marginBottom: 2,
    }}>
      <div style={{ padding: "16px 20px", borderRight: "1px solid #EBEBF0" }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#9D9FA3", letterSpacing: "0.06em" }}>{label}</div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#041E3A", marginTop: 4 }}>{fontName}</div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#9D9FA3", marginTop: 2 }}>{size}px / {weight}</div>
      </div>
      <div style={{
        padding: "16px 24px", display: "flex", alignItems: "center",
        fontFamily: ff, fontSize: size, fontWeight: weight, color: "#041E3A",
        overflow: "hidden", lineHeight: 1.2,
      }}>{sample}</div>
    </div>
  );
};

const TypographySection = () => (
  <div>
    <TypeRow label="Display XL" fontName="DM Serif Display" size={48} weight={400} sample="03:00" isSerif />
    <TypeRow label="Display L"  fontName="DM Serif Display" size={36} weight={400} sample="7.2 mg/dL" isSerif />
    <TypeRow label="Heading 1"  fontName="Be Vietnam Pro"   size={28} weight={600} sample="Nhậu Hải Sản — Kịch Bản Tối Nay" />
    <TypeRow label="Heading 2"  fontName="Be Vietnam Pro"   size={22} weight={600} sample="3 Quy Tắc Tối Nay" />
    <TypeRow label="Body L"     fontName="Be Vietnam Pro"   size={17} weight={400} sample="Cortisol đang đạt đỉnh. Nước lạnh rửa mặt điều chỉnh thay vì tăng thêm với caffeine." />
    <TypeRow label="Body M"     fontName="Be Vietnam Pro"   size={15} weight={400} sample="Bạn ngủ thế nào? — Ngon / Chập chờn / Kém" />
    <TypeRow label="Body S"     fontName="Be Vietnam Pro"   size={13} weight={400} sample="Được tạo từ dữ liệu 8 tuần gần đây" />
    <TypeRow label="Label / CTA" fontName="IBM Plex Mono"         size={11} weight={500} sample="BẮT ĐẦU" isMono />
    <TypeRow label="Eyebrow"    fontName="IBM Plex Mono"          size={10} weight={400} sample="POST-EVENT RECOVERY" isMono />
    <TypeRow label="Micro"      fontName="Be Vietnam Pro"   size={11} weight={400} sample="Bỏ qua · 11px · Be Vietnam Pro" />
  </div>
);

// ─── SPACING SECTION ──────────────────────────────────────────────────────────
const SpacingSection = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
    {Object.entries(tokens.space).map(([key, val]) => (
      <div key={key} style={{
        background: "#FFFFFF", padding: "16px 20px",
        display: "flex", alignItems: "center", gap: 16,
        borderBottom: "1px solid #EBEBF0",
      }}>
        <div style={{
          width: parseInt(val), height: parseInt(val),
          background: "#041E3A", flexShrink: 0,
          minWidth: 4, minHeight: 4,
        }} />
        <div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#041E3A" }}>space-{key}</div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#9D9FA3", marginTop: 2 }}>{val}</div>
        </div>
      </div>
    ))}
  </div>
);

// ─── COMPONENTS SECTION ───────────────────────────────────────────────────────
const CheckInCard = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const opts = ["Ngon", "Chập chờn", "Kém"];
  return (
    <div>
      <div style={S.subHeading}>Check-In Option Card</div>
      <div style={{ background: "#F5F5F5", padding: 20, maxWidth: 400, border: "1px solid #EBEBF0" }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
          letterSpacing: "0.08em", textTransform: "uppercase",
          color: "#041E3A", marginBottom: 4,
        }}>MORNING BASELINE</div>
        <div style={{
          fontFamily: "'Be Vietnam Pro'", fontSize: 22, fontWeight: 600,
          color: "#041E3A", marginBottom: 20,
        }}>Bạn ngủ thế nào?</div>
        {opts.map(opt => (
          <button key={opt} onClick={() => setSelected(opt)} style={{
            display: "flex", alignItems: "center",
            width: "100%", minHeight: 80,
            marginBottom: 12, padding: "20px 24px",
            background: selected === opt ? "#F0F4F8" : "#FFFFFF",
            border: "none",
            borderLeft: selected === opt ? "4px solid #041E3A" : "1px solid #EBEBF0",
            outline: selected === opt ? "1px solid #041E3A" : "1px solid #EBEBF0",
            borderRadius: 4, cursor: "pointer",
            fontFamily: "'Be Vietnam Pro'", fontSize: 22, fontWeight: 600,
            color: "#041E3A", textAlign: "left",
            transition: "background 120ms ease-out, border-color 120ms ease-out",
          }}>{opt}</button>
        ))}
      </div>
    </div>
  );
};

const TimerScreen = () => {
  const [running, setRunning] = useState(false);
  return (
    <div>
      <div style={S.subHeading}>Micro-Action Timer Screen</div>
      <div style={{
        background: "#041E3A", maxWidth: 340,
        padding: "48px 24px 40px",
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 32, alignSelf: "flex-start" }}>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 500,
            letterSpacing: "0.08em", textTransform: "uppercase", color: "#9D9FA3",
          }}>HEAVY NIGHT RECOVERY</span>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
            color: "#9D9FA3", borderLeft: "1px solid #9D9FA3", paddingLeft: 8,
          }}>RIÊNG TƯ</span>
        </div>
        <div style={{
          fontFamily: "'Be Vietnam Pro'", fontSize: 28, fontWeight: 600,
          color: "#FFFFFF", textAlign: "center", marginBottom: 16,
        }}>Wall Sit</div>
        <div style={{
          fontFamily: "'Be Vietnam Pro'", fontSize: 17, fontWeight: 400,
          color: "#9D9FA3", textAlign: "center", lineHeight: 1.6, marginBottom: 40,
        }}>
          Cơ bắp của bạn là bể chứa glucose. Hai phút vào buổi sáng làm nhiều hơn bất cứ điều gì bạn sẽ làm ở phòng gym sau đó.
        </div>
        <div style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: 72, fontWeight: 400, color: "#FFFFFF",
          lineHeight: 1, marginBottom: 40,
        }}>{running ? "01:43" : "02:00"}</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
          {[true, false, false].map((active, i) => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: "50%",
              background: active ? "#FFFFFF" : "#9D9FA3",
            }} />
          ))}
        </div>
        <button onClick={() => setRunning(!running)} style={{
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 500,
          letterSpacing: "0.1em", textTransform: "uppercase", color: "#FFFFFF",
          borderBottom: "1px solid #FFFFFF", paddingBottom: 2,
        }}>{running ? "XONG RỒI" : "BẮT ĐẦU"}</button>
        <div style={{
          fontFamily: "'Be Vietnam Pro'", fontSize: 13, color: "#9D9FA3",
          marginTop: 20, cursor: "pointer",
        }}>Bỏ qua</div>
      </div>
    </div>
  );
};

const ButtonGallery = () => (
  <div>
    <div style={S.subHeading}>CTA / Button Treatment</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 380 }}>
      {[
        { label: "PRIMARY ACTION", el: (
          <button style={{
            width: "100%", height: 56, background: "#041E3A", border: "none",
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 500,
            letterSpacing: "0.1em", textTransform: "uppercase", color: "#FFFFFF",
            borderRadius: 4, cursor: "pointer",
          }}>VÀO RỒI</button>
        )},
        { label: "SECONDARY / INLINE", el: (
          <span style={{
            fontFamily: "'Be Vietnam Pro'", fontSize: 15, color: "#041E3A",
            borderBottom: "1px solid #041E3A", paddingBottom: 1, cursor: "pointer",
          }}>Xem kịch bản đầy đủ →</span>
        )},
        { label: "GHOST / SKIP", el: (
          <span style={{
            fontFamily: "'Be Vietnam Pro'", fontSize: 13, color: "#9D9FA3", cursor: "pointer",
          }}>Bỏ qua — nhắc sau</span>
        )},
        { label: "DISABLED", el: (
          <button style={{
            width: "100%", height: 56, background: "#F5F5F5",
            border: "1px solid #EBEBF0", borderRadius: 4,
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 500,
            letterSpacing: "0.1em", textTransform: "uppercase", color: "#9D9FA3",
            cursor: "not-allowed",
          }}>BẮT ĐẦU</button>
        )},
      ].map(({ label, el }) => (
        <div key={label}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#9D9FA3", marginBottom: 8, letterSpacing: "0.06em" }}>{label}</div>
          {el}
        </div>
      ))}
    </div>
  </div>
);

const EyebrowDemo = () => (
  <div>
    <div style={S.subHeading}>Eyebrow Label Hierarchy</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {[
        { eyebrow: "MORNING ACTIVATION",   headline: "Wall Sit",            dark: false },
        { eyebrow: "POST-EVENT RECOVERY",  headline: "Tối qua thế nào?",    dark: false },
        { eyebrow: "DESK & SEDENTARY",     headline: "Desk Calf Raises",     dark: true  },
        { eyebrow: "STRESS & MENTAL LOAD", headline: "4-7-8 Breathing",     dark: true  },
      ].map((row, i) => (
        <div key={i} style={{
          padding: "20px 24px",
          background: row.dark ? "#041E3A" : "#FFFFFF",
          border: row.dark ? "none" : "1px solid #EBEBF0",
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 400,
            letterSpacing: "0.08em", textTransform: "uppercase",
            color: row.dark ? "#9D9FA3" : "#041E3A", marginBottom: 4,
          }}>{row.eyebrow}</div>
          <div style={{
            fontFamily: "'Be Vietnam Pro'", fontSize: 22, fontWeight: 600,
            color: row.dark ? "#FFFFFF" : "#041E3A",
          }}>{row.headline}</div>
        </div>
      ))}
    </div>
  </div>
);

const RiskCalendar = () => {
  const days = [
    { day: "Thứ Hai",   risk: "low",    label: "Thấp" },
    { day: "Thứ Ba",    risk: "low",    label: "Thấp" },
    { day: "Thứ Tư",    risk: "medium", label: "Khả năng bữa tối công việc" },
    { day: "Thứ Năm",   risk: "high",   label: "CAO — đêm rủi ro nhất" },
    { day: "Thứ Sáu",   risk: "low",    label: "Phục hồi nếu Thứ Năm nặng" },
    { day: "Cuối tuần", risk: "low",    label: "Thấp" },
  ];
  const riskColor: Record<string, string> = { low: "#059669", medium: "#D97706", high: "#DC2626" };

  return (
    <div>
      <div style={S.subHeading}>Weekly Brief — Risk Calendar</div>
      <div style={{ background: "#FFFFFF", border: "1px solid #EBEBF0", maxWidth: 480 }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #EBEBF0" }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#9D9FA3",
            letterSpacing: "0.06em", textTransform: "uppercase",
          }}>TUẦN TỚI — Cửa sổ rủi ro</div>
        </div>
        {days.map((d, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "13px 24px", minHeight: 44,
            borderBottom: i < days.length - 1 ? "1px solid #EBEBF0" : "none",
          }}>
            <div style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 15, color: "#041E3A" }}>{d.day}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: riskColor[d.risk] }} />
              <div style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 15, color: riskColor[d.risk] }}>{d.label}</div>
            </div>
          </div>
        ))}
        <div style={{ padding: "20px 24px", borderTop: "2px solid #EBEBF0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 22, fontWeight: 600, color: "#041E3A", flex: 1 }}>
              Thứ Năm là đêm rủi ro cao nhất — 4/6 tuần gần đây
            </div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fontWeight: 500,
              letterSpacing: "0.06em", textTransform: "uppercase",
              color: "#8C693B", marginLeft: 12, flexShrink: 0,
            }}>TUẦN 1–4</div>
          </div>
          <div style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 15, color: "#9D9FA3", lineHeight: 1.5 }}>
            Dữ liệu check-in của bạn cho thấy Thứ Năm nhà hàng liên tục là điểm rủi ro cao nhất trong tuần.
          </div>
          <div style={{ marginTop: 20 }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#9D9FA3", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>SO VỚI 4 TUẦN QUA</div>
            {[{ label: "Tuần này", value: 72, color: "#041E3A" }, { label: "TB 4 tuần", value: 58, color: "#EBEBF0" }].map(b => (
              <div key={b.label} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 13, color: "#041E3A" }}>{b.label}</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#041E3A" }}>{b.value}/100</div>
                </div>
                <div style={{ height: 6, background: "#F5F5F5" }}>
                  <div style={{ width: `${b.value}%`, height: "100%", background: b.color }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20 }}>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 500,
              letterSpacing: "0.08em", textTransform: "uppercase",
              color: "#041E3A", borderBottom: "1px solid #041E3A", paddingBottom: 2, cursor: "pointer",
            }}>Đặt nhắc cho Thứ Năm</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const BottomNav = () => {
  const [active, setActive] = useState("Tối nay");
  const tabs = [
    { label: "Tối nay",   icon: "◈" },
    { label: "Check-in",  icon: "◎" },
    { label: "Hành động", icon: "▷" },
    { label: "Tuần này",  icon: "◻", dot: true },
    { label: "Tôi",       icon: "○" },
  ];
  return (
    <div>
      <div style={S.subHeading}>Bottom Navigation</div>
      <div style={{ background: "#FFFFFF", borderTop: "1px solid #EBEBF0", display: "flex", maxWidth: 380 }}>
        {tabs.map(t => (
          <button key={t.label} onClick={() => setActive(t.label)} style={{
            flex: 1, height: 56, background: "none", border: "none",
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: 3, cursor: "pointer", position: "relative",
          }}>
            {t.dot && (
              <div style={{
                position: "absolute", top: 8, right: "calc(50% - 14px)",
                width: 6, height: 6, borderRadius: "50%", background: "#D97706",
              }} />
            )}
            <div style={{ fontSize: 16, color: active === t.label ? "#041E3A" : "#9D9FA3" }}>{t.icon}</div>
            <div style={{
              fontFamily: "'Be Vietnam Pro'", fontSize: 10,
              fontWeight: active === t.label ? 600 : 400,
              color: active === t.label ? "#041E3A" : "#9D9FA3",
              transition: "color 150ms ease-out",
            }}>{t.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

const ComponentsSection = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
      <CheckInCard />
      <TimerScreen />
    </div>
    <hr style={S.divider} />
    <EyebrowDemo />
    <hr style={S.divider} />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
      <ButtonGallery />
      <BottomNav />
    </div>
    <hr style={S.divider} />
    <RiskCalendar />
  </div>
);

// ─── MOTION SECTION ───────────────────────────────────────────────────────────
const MotionSection = () => (
  <div>
    {[
      { name: "Card Select",       duration: "120ms", easing: "ease-out",                        desc: "Background colour change only — no scale, no translate" },
      { name: "Screen Transition", duration: "200ms", easing: "ease-in-out",                     desc: "Slide left/right — never fade between screens" },
      { name: "Timer CTA Swap",    duration: "150ms", easing: "ease-out",                        desc: "Button label swap on start — no scale transform" },
      { name: "Bottom Sheet",      duration: "250ms", easing: "cubic-bezier(0.4, 0, 0.2, 1)",   desc: "Slides up from bottom edge" },
      { name: "Unread Dot",        duration: "0ms",   easing: "—",                               desc: "No animation — information, not alert" },
      { name: "Nav Active State",  duration: "150ms", easing: "ease-out",                        desc: "Colour change only — no background fill animation" },
    ].map((m, i) => (
      <div key={i} style={{
        display: "grid", gridTemplateColumns: "180px 200px 1fr",
        borderBottom: "1px solid #EBEBF0", background: "#FFFFFF", marginBottom: 2,
        padding: "16px 20px", alignItems: "center", gap: 16,
      }}>
        <div style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 14, fontWeight: 600, color: "#041E3A" }}>{m.name}</div>
        <div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#041E3A" }}>{m.duration}</div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#9D9FA3", marginTop: 2 }}>{m.easing}</div>
        </div>
        <div style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 13, color: "#9D9FA3" }}>{m.desc}</div>
      </div>
    ))}
    <div style={{ marginTop: 24, padding: "20px 24px", background: "#041E3A" }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#9D9FA3", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>RULE</div>
      <div style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 15, color: "#FFFFFF", lineHeight: 1.6 }}>
        No spring physics. No bounce easing. No scale transforms. The target user is checking in at 7 AM managing a health condition. Every animation that draws attention to itself is a distraction.
      </div>
    </div>
  </div>
);

// ─── DO / DON'T SECTION ───────────────────────────────────────────────────────
const DoDontSection = () => {
  const rows: [string, string][] = [
    ["Use IBM Plex Mono for all uppercase labels and CTA text", "Use Be Vietnam Pro in all-caps — grotesque uppercase hurts Vietnamese readability"],
    ["Use #041E3A navy as the primary CTA fill", "Invent a brand colour (teal, blue, green) — navy + white is the entire palette"],
    ["Use #041E3A for the timer screen background", "Use any colour other than RL navy for full-screen dark surfaces"],
    ["4px border-radius maximum on cards", "Round corners beyond 4px — reads as a consumer wellness app"],
    ["1px #EBEBF0 border to separate surfaces", "Add drop-shadows to any component"],
    ["20px screen edge margins — non-negotiable", "Reduce margins to squeeze more content per screen"],
    ["Navy eyebrow above every action name", "Introduce a category without the eyebrow/headline pair"],
    ["Flat colour backgrounds only", "Use gradients anywhere in the interface"],
    ["DM Serif Display for timer countdown only", "Use the display serif for navigation, UI text, or body copy"],
    ["Amber #D97706 for informational signals only", "Use amber for primary actions — it is a warning colour, not a brand colour"],
    ["Gold #8C693B in exactly two places max", "Use gold a third time — three instances breaks the RL restraint principle"],
    ["150–250ms transitions, ease-out only", "Use spring physics, bounce, or scale transforms on any element"],
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
      <div style={{
        padding: "12px 20px", background: "#041E3A",
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 500,
        letterSpacing: "0.1em", textTransform: "uppercase", color: "#FFFFFF",
      }}>DO</div>
      <div style={{
        padding: "12px 20px", background: "#DC2626",
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 500,
        letterSpacing: "0.1em", textTransform: "uppercase", color: "#FFFFFF",
      }}>{"DON'T"}</div>
      {rows.map(([doText, dontText], i) => (
        <>
          <div key={`do-${i}`} style={{
            padding: "14px 20px", background: "#FFFFFF", borderBottom: "1px solid #EBEBF0",
            display: "flex", alignItems: "flex-start", gap: 10,
          }}>
            <span style={{ color: "#059669", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
            <span style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 14, color: "#041E3A", lineHeight: 1.5 }}>{doText}</span>
          </div>
          <div key={`dont-${i}`} style={{
            padding: "14px 20px", background: "#FFFFFF", borderBottom: "1px solid #EBEBF0",
            display: "flex", alignItems: "flex-start", gap: 10,
          }}>
            <span style={{ color: "#DC2626", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✗</span>
            <span style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 14, color: "#4B5563", lineHeight: 1.5 }}>{dontText}</span>
          </div>
        </>
      ))}
    </div>
  );
};

// ─── SECTION CONTENT MAP ─────────────────────────────────────────────────────
const sectionContent: Record<string, React.ReactNode> = {
  "Colours":    <ColourSection />,
  "Typography": <TypographySection />,
  "Spacing":    <SpacingSection />,
  "Components": <ComponentsSection />,
  "Motion":     <MotionSection />,
  "Do / Don't": <DoDontSection />,
};

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function FitWellDesignSystem() {
  const [active, setActive] = useState("Colours");

  return (
    <>
      <FontLoader />
      <div style={S.page}>
        <Nav active={active} onSelect={setActive} />

        {/* Hero */}
        <div style={{ background: "#041E3A", paddingTop: 56 }}>
          <div style={{ ...S.wrap, padding: "64px 40px 56px" }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 500,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "#9D9FA3", marginBottom: 12,
            }}>FITWELL · DESIGN SYSTEM · V1.0</div>
            <div style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: 48, fontWeight: 400, color: "#FFFFFF",
              lineHeight: 1.05, marginBottom: 16,
            }}>Restraint as Authority</div>
            <div style={{
              fontFamily: "'Be Vietnam Pro'", fontSize: 15, color: "#9D9FA3",
              lineHeight: 1.6, maxWidth: 560,
            }}>
              Derived from Ralph Lauren — navy, white, grey. No gradients. No shadows. Typography and whitespace carry the full aesthetic load.
            </div>
            {/* Palette bar */}
            <div style={{ display: "flex", marginTop: 40, height: 4 }}>
              {["#041E3A","#0A3055","#FFFFFF","#F5F5F5","#EBEBF0","#9D9FA3","#8C693B","#D97706","#DC2626","#059669"].map((c, i) => (
                <div key={i} style={{ flex: 1, background: c, border: c === "#FFFFFF" ? "1px solid #EBEBF0" : "none" }} />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ ...S.wrap, padding: "0 40px 120px" }}>
          <div style={{ padding: "80px 0 0" }}>
            <div style={S.sectionLabel}>Section</div>
            <div style={S.sectionHeading}>{active}</div>
            {sectionContent[active]}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: "1px solid #EBEBF0", padding: "24px 40px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "#FFFFFF",
        }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#9D9FA3", letterSpacing: "0.06em" }}>
            FITWELL DESIGN SYSTEM · V1.0 · FEBRUARY 2026
          </span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#9D9FA3", letterSpacing: "0.06em" }}>
            REF: RALPHLAUREN.COM · FONTS: GOOGLE FONTS
          </span>
        </div>
      </div>
    </>
  );
}
