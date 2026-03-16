import { useState } from "react";

// ── Design tokens — grayscale lo-fi + copy highlight ──────────────────────────
const W = {
  bg:"#FFFFFF", s50:"#FAFAFA", s100:"#F5F5F5", s150:"#EFEFEF",
  s200:"#E8E8E8", s300:"#D0D0D0", s400:"#AAAAAA",
  s500:"#777777", s600:"#444444", s700:"#2A2A2A", s900:"#111111",
  border:"#CCCCCC",
  // copy highlight colors — subtle, grayscale-compatible
  cpBg:"#F0F0F0",   // copy block bg
  cpBorder:"#999",  // copy block border
};

const RULE_COLORS = {
  "fear":     "#555",
  "insight":  "#333",
  "protocol": "#444",
  "dry":      "#888",
  "peer-nod": "#444",
  "warmth":   "#555",
  "pattern":  "#444",
  "action":   "#333",
  "honest":   "#555",
  "zero-guilt":"#444",
};

// ── Primitives ─────────────────────────────────────────────────────────────────
const Box = ({ w="100%", h=32, s={} }) =>
  <div style={{ width:w, height:h, background:W.s200, border:`1px solid ${W.s300}`, borderRadius:3, flexShrink:0, ...s }}/>;

const Mono = ({ children, s={} }) =>
  <span style={{ fontFamily:"monospace", fontSize:7.5, color:W.s500, letterSpacing:"0.07em", textTransform:"uppercase", ...s }}>{children}</span>;

// Real copy block — the main thing being specced
const CP = ({ children, rule, s={} }) => (
  <div style={{ position:"relative", background:W.cpBg, border:`1px solid ${W.cpBorder}`, borderRadius:5, padding:"7px 9px", ...s }}>
    {rule && (
      <div style={{ position:"absolute", top:-7, right:6, background:W.s200, border:`1px solid ${W.s400}`, borderRadius:99, padding:"1px 6px" }}>
        <Mono s={{ fontSize:6.5, color:RULE_COLORS[rule]||W.s500 }}>{rule}</Mono>
      </div>
    )}
    <div style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:11, color:W.s700, lineHeight:1.65 }}>
      {children}
    </div>
  </div>
);

// Copy for CTAs
const CpBtn = ({ children, fill=false, s={} }) => (
  <div style={{ height:36, borderRadius:5, border:`${fill?"2px":"1px"} solid ${fill?W.s700:W.s400}`, background:fill?W.s700:W.bg, display:"flex", alignItems:"center", justifyContent:"center", ...s }}>
    <span style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:11, fontWeight:600, color:fill?W.bg:W.s600 }}>{children}</span>
  </div>
);

// Chip / pill option
const Chip = ({ children, selected=false, s={} }) => (
  <div style={{ height:34, paddingLeft:12, paddingRight:12, border:`1.5px solid ${selected?W.s700:W.s300}`, background:selected?W.s200:W.bg, borderRadius:99, display:"flex", alignItems:"center", whiteSpace:"nowrap", ...s }}>
    <span style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:10, fontWeight:selected?600:400, color:selected?W.s700:W.s500 }}>{children}</span>
  </div>
);

// Radio row
const RadioRow = ({ children, sub, selected=false }) => (
  <div style={{ minHeight:44, border:`1.5px solid ${selected?W.s600:W.border}`, background:selected?W.s150:W.bg, borderRadius:8, display:"flex", alignItems:"center", padding:"8px 10px", gap:10 }}>
    <div style={{ width:14, height:14, borderRadius:"50%", border:`2px solid ${selected?W.s700:W.s300}`, background:selected?W.s600:"none", flexShrink:0 }}/>
    <div style={{ flex:1 }}>
      <div style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:11, fontWeight:selected?600:400, color:selected?W.s700:W.s500, lineHeight:1.4 }}>{children}</div>
      {sub && <div style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:9.5, color:W.s400, marginTop:2, lineHeight:1.4 }}>{sub}</div>}
    </div>
  </div>
);

// Checkbox row
const CheckRow = ({ children, checked=false }) => (
  <div style={{ minHeight:38, border:`1.5px solid ${checked?W.s600:W.border}`, background:checked?W.s150:W.bg, borderRadius:7, display:"flex", alignItems:"center", padding:"7px 10px", gap:10, justifyContent:"space-between" }}>
    <span style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:11, fontWeight:checked?600:400, color:checked?W.s700:W.s500 }}>{children}</span>
    <div style={{ width:13, height:13, border:`2px solid ${checked?W.s700:W.s300}`, borderRadius:3, background:checked?W.s500:"none", flexShrink:0 }}/>
  </div>
);

const ProgressBar = ({ total=4, current=1 }) => (
  <div style={{ display:"flex", gap:4 }}>
    {[...Array(total)].map((_,i)=>(
      <div key={i} style={{ flex:1, height:3, borderRadius:99, background:i<current?W.s600:W.s200 }}/>
    ))}
  </div>
);

const BottomNav = ({ active=0 }) => (
  <div style={{ height:46, borderTop:`1px solid ${W.border}`, display:"flex", background:W.bg, flexShrink:0 }}>
    {["Hôm nay","Lịch sử","Tiến triển","Hồ sơ"].map((t,i)=>(
      <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2, borderBottom:i===active?`2px solid ${W.s600}`:"none" }}>
        <Box w={13} h={13} s={{ background:i===active?W.s500:W.s200, border:`1px solid ${i===active?W.s600:W.s300}` }}/>
        <Mono s={{ color:i===active?W.s700:W.s400 }}>{t}</Mono>
      </div>
    ))}
  </div>
);

const DotGrid = ({ pct=78 }) => {
  const filled = Math.round(30*pct/100);
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(10,1fr)", gap:2.5, marginBottom:3 }}>
        {[...Array(30)].map((_,i)=>(
          <div key={i} style={{ width:9, height:9, borderRadius:2, background:i<filled?W.s600:W.s200, border:`1px solid ${i<filled?W.s500:W.s300}` }}/>
        ))}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between" }}>
        <Mono>30 ngày</Mono>
        <Mono s={{ fontWeight:700, color:W.s600 }}>{pct}%</Mono>
      </div>
    </div>
  );
};

// Phone wrapper
const Phone = ({ id, isActive, onClick, children }) => (
  <div onClick={onClick} style={{ flexShrink:0, width:176, cursor:"pointer" }}>
    <div style={{ marginBottom:6 }}>
      <Mono s={{ fontWeight:700, color:W.s600, fontSize:8.5 }}>{id}</Mono>
    </div>
    <div style={{ background:W.bg, borderRadius:18, border:`2px solid ${isActive?W.s700:W.s300}`, overflow:"hidden", boxShadow:isActive?"0 4px 18px rgba(0,0,0,0.16)":"0 1px 4px rgba(0,0,0,0.06)", transition:"all 140ms" }}>
      <div style={{ height:17, background:W.s100, borderBottom:`1px solid ${W.s200}`, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 10px" }}>
        <Mono>9:41</Mono>
        <div style={{ display:"flex", gap:3 }}>{[...Array(3)].map((_,i)=><div key={i} style={{ width:5, height:3, background:W.s400, borderRadius:1 }}/>)}</div>
      </div>
      <div style={{ height:374, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {children}
      </div>
      <div style={{ height:11, background:W.s100, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ width:34, height:3, background:W.s300, borderRadius:2 }}/>
      </div>
    </div>
  </div>
);

// ── PHASES ─────────────────────────────────────────────────────────────────────
const PHASES = [
  { id:"entry",    label:"Phase 1 · Entry",       screens:["S01","S02"] },
  { id:"onboard",  label:"Phase 2 · Onboarding",  screens:["S03","S03b","S04A","S04","S05","S06","S04C","SMSK05","SMSK08","SLS03","S07","S30"] },
  { id:"value",    label:"Phase 3 · First Value",  screens:["S08","SMSK01","SMSK02","S09","S10"] },
  { id:"loop",     label:"Phase 4 · Daily Loop",   screens:["S11","S12","S12b","SMSK03","SMSK04","SMSK04b","SMSK07","S13","SLS01","S14","S15"] },
  { id:"progress", label:"Phase 5 · Progress",     screens:["S16","S17","SLS02","S18","S28"] },
  { id:"convert",  label:"Phase 6 · Conversion",   screens:["S19","S19b","S26","S27","S20"] },
  { id:"edge",     label:"Phase 7 · Edge States",  screens:["S21","S22","S23","S29","S24","S25","S25b","S25d","SMSK06"] },
];

// ── SCREENS ────────────────────────────────────────────────────────────────────
const SCREENS = {

  // ── PHASE 1 ──────────────────────────────────────────────────────────────────

  S01: {
    label:"Splash — Entry",
    phase:"entry",
    note:"Không animation. Không logo lớn. Vào thẳng pain hook. CTA 1.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:16, justifyContent:"space-between", background:W.bg }}>
        <div/>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <Box w={48} h={16} s={{ background:W.s500, border:"none", borderRadius:3 }}/>
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <CP rule="action" s={{ borderLeft:"3px solid #555" }}>
              Đúng bài. Đúng bệnh. Mỗi ngày.
            </CP>
            <CP rule="action" s={{ background:"none", border:"none", padding:"3px 0" }}>
              Hỏi 3 câu. Trả lời ngay. Làm được hôm nay.
            </CP>
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
          <CpBtn fill>Bắt đầu — Miễn phí 7 ngày</CpBtn>
          <div style={{ textAlign:"center" }}>
            <CP rule="action" s={{ background:"none", border:"none", padding:0, textAlign:"center" }}>
              <span style={{ color:W.s400, fontSize:10 }}>Không cần tài khoản ngay</span>
            </CP>
          </div>
        </div>
      </div>
    )
  },

  S02: {
    label:"Pain Entry — Search",
    phase:"entry",
    note:"Fear reduction dòng đầu. Insight ngắn. CTA thấp.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:11, gap:8, background:W.bg }}>
        <div style={{ height:22, background:W.s100, border:`1px solid ${W.border}`, borderRadius:4, display:"flex", alignItems:"center", padding:"0 8px", gap:5 }}>
          <Box w={8} h={8} s={{ borderRadius:"50%", flexShrink:0, background:W.s300, border:"none" }}/>
          <Mono>đau cân gan bàn chân buổi sáng</Mono>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          <CP rule="fear" s={{ borderLeft:"3px solid #555" }}>
            Pattern này rất phổ biến với người đứng nhiều — không phải bệnh nặng.
          </CP>
          <CP rule="insight">
            Cơ bàn chân đang chịu tải sai cách khi bước đầu tiên buổi sáng. Kéo giãn đúng 90 giây trước khi đặt chân xuống sàn.
          </CP>
          <CpBtn fill>Xem bài ngay →</CpBtn>
        </div>
        <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:6, padding:"7px 9px" }}>
          <Mono s={{ display:"block", marginBottom:5 }}>Tình trạng tương tự</Mono>
          <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
            {["Đau gót chân","Viêm cân gan","Đau đầu gối","Đau lưng"].map(t=>(
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
        </div>
      </div>
    )
  },

  // ── PHASE 2 ──────────────────────────────────────────────────────────────────

  S03: {
    label:"Hook — Onboard 0/4",
    phase:"onboard",
    note:"Nói thẳng điều user đang nghĩ. Không welcome screen. Không feature list.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:16, justifyContent:"space-between", background:W.bg }}>
        <div/>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <CP rule="honest" s={{ borderLeft:"3px solid #333", background:W.s50 }}>
            <span style={{ fontSize:14, fontWeight:700, lineHeight:1.4, display:"block" }}>
              Đang ở đây vì đau — không phải vì muốn healthy lifestyle.
            </span>
          </CP>
          <CP rule="action">
            FitWell không bán lời khuyên chung. Hỏi 3 câu, đưa bài cụ thể cho đúng pattern của bạn — làm được ngay hôm nay.
          </CP>
        </div>
        <CpBtn fill>Kể cho FitWell nghe →</CpBtn>
      </div>
    )
  },

  S03b: {
    label:"Path Chooser — Biết bệnh chưa?",
    phase:"onboard",
    note:"Gate screen. Path A → S04A (condition search + AI free-text tab toggle). Path B → S04 (body map + trigger questions). Cả hai path đều dẫn đến S04C trước S07. Không dùng từ 'chẩn đoán' — quá clinical. [v1.4: S04B merged vào S04A tab toggle]",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:16, gap:12, background:W.bg }}>
        <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
          <CP rule="action" s={{ border:"none", background:"none", padding:0 }}>
            <span style={{ fontSize:14, fontWeight:700, color:W.s700 }}>Bạn đã biết tên bệnh của mình chưa?</span>
          </CP>
          <CP s={{ border:"none", background:"none", padding:0 }}>
            <span style={{ color:W.s400, fontSize:10 }}>Từng đi khám, hoặc đã tự xác định được</span>
          </CP>
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:7 }}>
          <RadioRow selected sub="Ví dụ: thoát vị đĩa đệm, viêm cân gan chân, đau cổ vai gáy...">
            Biết rồi — tôi đã từng đi khám hoặc tự xác định được
          </RadioRow>
          <RadioRow sub="Chỉ biết đang đau ở đâu, không chắc là bệnh gì">
            Chưa chắc — chỉ biết mình đang khó chịu
          </RadioRow>
        </div>
        <div style={{ background:W.s100, border:`1px dashed ${W.s300}`, borderRadius:5, padding:"5px 8px" }}>
          <Mono s={{ color:W.s500 }}>Path A → S04A (tab: [Tên bệnh] | [Mô tả triệu chứng]) · Path B → S04 (body map) · Both → S04C</Mono>
        </div>
        <CpBtn fill>Tiếp theo →</CpBtn>
      </div>
    )
  },

  S04A: {
    label:"Path A — Tìm / Mô tả tình trạng (tab toggle)",
    phase:"onboard",
    note:"Merged từ S04A + S04B. Tab [Tên bệnh] = search/scroll list (Path A cũ). Tab [Mô tả triệu chứng] = free-text AI mapping (G23). Cùng 1 screen, 2 modes — user segment giống nhau: 'biết hoặc muốn tìm tên bệnh'. Tab default: [Tên bệnh]. Sau khi select/confirm → S04C. S04B standalone removed (naming conflict + redundant screen). [v1.4 merge]",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:11, gap:8, background:W.bg }}>
        <ProgressBar total={4} current={1}/>
        {/* Tab toggle */}
        <div style={{ display:"flex", gap:0, background:W.s100, border:`1px solid ${W.border}`, borderRadius:6, overflow:"hidden" }}>
          {["Tên bệnh","Mô tả triệu chứng"].map((t,i)=>(
            <div key={t} style={{ flex:1, padding:"6px 0", textAlign:"center", background:i===0?W.s600:W.s100, borderRight:i===0?`1px solid ${W.s400}`:"none" }}>
              <Mono s={{ color:i===0?W.bg:W.s500 }}>{t}</Mono>
            </div>
          ))}
        </div>
        {/* Tab A — Tên bệnh (default, shown) */}
        <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
          <div style={{ height:30, background:W.s100, border:`1px solid ${W.border}`, borderRadius:5, display:"flex", alignItems:"center", padding:"0 9px", gap:6 }}>
            <Box w={9} h={9} s={{ borderRadius:"50%", flexShrink:0, background:W.s300, border:"none" }}/>
            <Mono s={{ color:W.s400 }}>Tìm: "thoát vị", "gân", "đầu gối"...</Mono>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            <Mono s={{ color:W.s500, marginBottom:1 }}>Cổ · Vai · Lưng</Mono>
            <CheckRow checked>Đau cổ vai gáy (Cervical pain)</CheckRow>
            <CheckRow checked>Thoát vị đĩa đệm thắt lưng (L4-L5 / L5-S1)</CheckRow>
            <CheckRow>Đau thần kinh tọa (Sciatica)</CheckRow>
            <Mono s={{ color:W.s500, marginTop:3, marginBottom:1 }}>Gối · Háng · Bàn chân</Mono>
            <CheckRow checked>Viêm cân gan chân (Plantar fasciitis)</CheckRow>
            <CheckRow>Viêm gân Achilles</CheckRow>
          </div>
        </div>
        {/* Tab B — Mô tả triệu chứng (AI map, collapsed annotation) */}
        <div style={{ background:W.s50, border:`1px dashed ${W.s300}`, borderRadius:6, padding:8 }}>
          <Mono s={{ color:W.s600, display:"block", marginBottom:4 }}>Tab B · Mô tả triệu chứng (AI mapping G23):</Mono>
          <CP s={{ border:"none", background:"none", padding:0 }}>
            <span style={{ fontSize:10, color:W.s500 }}>Free-text input → Claude Haiku → top 1–2 condition suggestions với confidence + match reason. Confidence &lt; 0.25 → show "Không tìm thấy" → user fallback sang Tab A. Target latency &lt; 400ms.</span>
          </CP>
        </div>
        <div style={{ background:W.s100, border:`1px dashed ${W.s300}`, borderRadius:5, padding:"4px 7px" }}>
          <Mono>Both tabs → S04C. Multi-select. Không thấy bệnh ở cả 2 tab → "Không tìm thấy" → Path B body map (S04).</Mono>
        </div>
        <CpBtn fill>Xác nhận ({`3`} bệnh) →</CpBtn>
      </div>
    )
  },

  S04C: {
    label:"Condition Confirm — Convergence",
    phase:"onboard",
    note:"ĐIỂM HỘI TỤ CỦA CẢ HAI PATH. Path A: FitWell confirm lại những gì user tự chọn. Path B: FitWell ĐỀ XUẤT tên bệnh dựa trên body map + trigger + behavior — user chỉ confirm hoặc adjust. Tâm lý quan trọng: FitWell 'nhận ra' bệnh, không phải user tự gán nhãn. Sau screen này → S07 (First Insight).",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:11, gap:8, background:W.bg }}>
        <ProgressBar total={4} current={4}/>
        <div style={{ display:"flex", gap:7, alignItems:"center" }}>
          <Box w={22} h={22} s={{ borderRadius:5, flexShrink:0 }}/>
          <Mono>FitWell · nhận diện tình trạng</Mono>
        </div>
        {/* Condition recognition block */}
        <div style={{ background:W.s150, border:`1.5px solid ${W.s500}`, borderRadius:8, padding:10, display:"flex", flexDirection:"column", gap:6 }}>
          <Mono s={{ color:W.s600 }}>Tình trạng FitWell nhận ra:</Mono>
          {[
            { name:"Đau cổ vai gáy", tag:"Cổ · Cervical pain" },
            { name:"Thoát vị đĩa đệm L4–L5", tag:"Lưng dưới · Lumbar" },
            { name:"Viêm cân gan chân", tag:"Bàn chân · Plantar fasciitis" },
          ].map(({name,tag})=>(
            <div key={name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:W.bg, borderRadius:5, padding:"5px 8px", border:`1px solid ${W.s300}` }}>
              <div>
                <div style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:11, fontWeight:600, color:W.s700 }}>{name}</div>
                <Mono s={{ color:W.s400 }}>{tag}</Mono>
              </div>
              <div style={{ width:13, height:13, borderRadius:3, border:`2px solid ${W.s600}`, background:W.s500 }}/>
            </div>
          ))}
        </div>
        {/* Path B annotation */}
        <div style={{ background:W.s100, border:`1px dashed ${W.s300}`, borderRadius:5, padding:"5px 8px" }}>
          <Mono s={{ color:W.s600, display:"block", marginBottom:2 }}>Path B variant:</Mono>
          <CP rule="insight" s={{ border:"none", background:"none", padding:0 }}>
            <span style={{ fontSize:10 }}>Dựa trên vùng đau + pattern bạn mô tả, FitWell nhận ra 3 tình trạng trên. Đúng không?</span>
          </CP>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          <CpBtn s={{ flex:1 }}>Điều chỉnh</CpBtn>
          <CpBtn fill s={{ flex:2 }}>Đúng rồi, tiếp tục →</CpBtn>
        </div>
      </div>
    )
  },

  S04: {
    label:"Onboard Q1 — Vị trí",
    phase:"onboard",
    note:"Multi-select chips. Tất cả vùng đau. Copy không clinical.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:11, gap:9, background:W.bg }}>
        <ProgressBar total={4} current={1}/>
        <div>
          <Mono s={{ display:"block", marginBottom:4 }}>Câu 1 / 3</Mono>
          <CP rule="action" s={{ border:"none", background:"none", padding:"0", marginBottom:4 }}>
            <span style={{ fontSize:14, fontWeight:700, color:W.s700 }}>Đang khó chịu nhất ở đâu?</span>
          </CP>
          <CP s={{ border:"none", background:"none", padding:0 }}>
            <span style={{ color:W.s400, fontSize:10 }}>Chọn tất cả vùng đang có vấn đề</span>
          </CP>
        </div>
        <div style={{ flex:1, display:"flex", flexWrap:"wrap", gap:7, alignContent:"flex-start" }}>
          {[
            { t:"Lưng / Thắt lưng", sel:true },
            { t:"Cổ / Vai / Gáy",   sel:false },
            { t:"Đầu gối",          sel:false },
            { t:"Bàn chân / Gót",   sel:false },
            { t:"Tay / Cổ tay",     sel:false },
            { t:"Hông",             sel:false },
          ].map(({t,sel})=>(
            <Chip key={t} selected={sel}>{t}</Chip>
          ))}
        </div>
        <CpBtn fill>Tiếp theo →</CpBtn>
      </div>
    )
  },

  S05: {
    label:"Onboard Q2 — Trigger",
    phase:"onboard",
    note:"Single-select. Mỗi option → 1 protocol path. Sub-copy mô tả chính xác cảm giác.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:11, gap:9, background:W.bg }}>
        <ProgressBar total={4} current={2}/>
        <div>
          <Mono s={{ display:"block", marginBottom:4 }}>Câu 2 / 3</Mono>
          <CP rule="action" s={{ border:"none", background:"none", padding:0, marginBottom:2 }}>
            <span style={{ fontSize:14, fontWeight:700, color:W.s700 }}>Đau kiểu nào?</span>
          </CP>
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:6 }}>
          <RadioRow selected sub="Cứng, khó cúi khi bước xuống giường">Buổi sáng — mới thức dậy</RadioRow>
          <RadioRow sub="Dần nặng hơn theo buổi chiều">Sau ngồi lâu — họp xong</RadioRow>
          <RadioRow sub="Đau khi chuyển động, nhẹ khi nghỉ">Khi vận động — leo cầu thang</RadioRow>
          <RadioRow sub="Tích lũy theo giờ trong ngày">Cuối ngày — về đến nhà</RadioRow>
          <RadioRow sub="Không thay đổi nhiều theo hoạt động">Liên tục cả ngày</RadioRow>
        </div>
        <CpBtn fill>Tiếp theo →</CpBtn>
      </div>
    )
  },

  S06: {
    label:"Onboard Q3 — Đang xử lý",
    phase:"onboard",
    note:"Multi-select. Zero judgment. Surfaces execution gap.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:11, gap:9, background:W.bg }}>
        <ProgressBar total={4} current={3}/>
        <div>
          <Mono s={{ display:"block", marginBottom:4 }}>Câu 3 / 3</Mono>
          <CP rule="action" s={{ border:"none", background:"none", padding:0, marginBottom:2 }}>
            <span style={{ fontSize:14, fontWeight:700, color:W.s700 }}>Bạn đang làm gì để xử lý?</span>
          </CP>
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:5 }}>
          <CheckRow>Chịu đựng</CheckRow>
          <CheckRow checked>Dầu nóng / massage</CheckRow>
          <CheckRow>Gym / PT</CheckRow>
          <CheckRow checked>Google / YouTube</CheckRow>
          <CheckRow>Đang uống thuốc</CheckRow>
          <CheckRow>Chưa làm gì</CheckRow>
        </div>
        <CpBtn fill>Xem bài của bạn →</CpBtn>
      </div>
    )
  },

  S07: {
    label:"First Insight — 4/4",
    phase:"onboard",
    note:"3-part mandatory: Fear → Insight → Protocol. Thứ tự cố định. Không skip.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:11, gap:8, background:W.bg }}>
        <ProgressBar total={4} current={4}/>
        <div style={{ display:"flex", gap:7, alignItems:"center" }}>
          <Box w={22} h={22} s={{ borderRadius:5, flexShrink:0 }}/>
          <Mono>FitWell</Mono>
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:6 }}>
          <CP rule="fear" s={{ borderLeft:"3px solid #555" }}>
            Pattern này rất phổ biến với người ngồi 8 tiếng — không phải dấu hiệu bệnh nặng.
          </CP>
          <CP rule="insight">
            Lưng không phải lỗi của lưng. Cơ hông yếu đang khiến lưng bù tải suốt ngày — đó là lý do đau nhiều vào buổi sáng và sau khi ngồi lâu.
          </CP>
          <CP rule="protocol" s={{ background:W.s150, borderLeft:"3px solid #444" }}>
            <span style={{ fontWeight:600 }}>Kích hoạt cơ hông</span>
            <span style={{ color:W.s500 }}> · 5 phút · Nằm trên giường</span>
          </CP>
        </div>
        <CpBtn fill>Bài đầu tiên →</CpBtn>
        <div style={{ textAlign:"center" }}>
          <Mono s={{ color:W.s400 }}>[Không có nút Skip]</Mono>
        </div>
      </div>
    )
  },

  // ── PHASE 3 ──────────────────────────────────────────────────────────────────

  S08: {
    label:"AI First Response",
    phase:"value",
    note:"State B — sau typing 800ms. 3-part structure. Exercise card auto-surface.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:11, gap:7, background:W.bg }}>
        <div style={{ background:W.s150, borderRadius:5, padding:"3px 7px", display:"inline-flex", alignSelf:"flex-start" }}>
          <Mono>State B — response (typing 800ms trước)</Mono>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
          <div style={{ display:"flex", gap:7, alignItems:"flex-start" }}>
            <Box w={22} h={22} s={{ borderRadius:5, flexShrink:0, marginTop:2 }}/>
            <div style={{ flex:1, display:"flex", flexDirection:"column", gap:5 }}>
              <CP rule="fear" s={{ borderLeft:"3px solid #555" }}>
                Pattern này rất phổ biến với người ngồi 8 tiếng — không phải dấu hiệu bệnh nặng.
              </CP>
              <CP rule="insight">
                Lưng không phải lỗi của lưng. Cơ hông yếu đang khiến lưng bù tải suốt ngày — đó là lý do đau nhiều buổi sáng.
              </CP>
              <CP rule="protocol" s={{ background:W.s150 }}>
                <span style={{ fontWeight:600 }}>Kích hoạt cơ hông</span>
                <span style={{ color:W.s500 }}> · 5 phút · Nằm trên giường</span>
              </CP>
            </div>
          </div>
        </div>
        {/* Exercise card */}
        <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:9, display:"flex", gap:8, alignItems:"center" }}>
          <div style={{ width:42, height:42, background:W.s200, borderRadius:5, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:0, height:0, borderTop:"6px solid transparent", borderBottom:"6px solid transparent", borderLeft:`10px solid ${W.s500}`, marginLeft:2 }}/>
          </div>
          <div style={{ flex:1 }}>
            <CP rule="protocol" s={{ border:"none", background:"none", padding:0 }}>
              <span style={{ fontWeight:600 }}>Kích hoạt cơ hông</span>
              <span style={{ color:W.s400 }}> · 5 phút · Trên giường</span>
            </CP>
          </div>
        </div>
        <CpBtn fill>Làm ngay — 5 phút →</CpBtn>
      </div>
    )
  },

  S09: {
    label:"Exercise — Timer",
    phase:"value",
    note:"Video 38%. Timer to nhất. Zero interrupt. Progress bar: 400ms delay, 700ms fill.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", background:W.bg, overflow:"hidden" }}>
        <div style={{ height:132, background:W.s200, borderBottom:`1px solid ${W.border}`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", flexShrink:0 }}>
          <div style={{ width:42, height:42, borderRadius:"50%", border:`2px solid ${W.s400}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:0, height:0, borderTop:"7px solid transparent", borderBottom:"7px solid transparent", borderLeft:`12px solid ${W.s500}`, marginLeft:2 }}/>
          </div>
          <div style={{ position:"absolute", top:7, right:9 }}>
            <CP s={{ border:"none", background:"none", padding:0 }}>
              <Mono>Bước 2 / 3</Mono>
            </CP>
          </div>
          <div style={{ position:"absolute", bottom:7, left:11, right:11 }}>
            <div style={{ height:3, background:W.s300, borderRadius:99 }}>
              <div style={{ width:"35%", height:"100%", background:W.s600, borderRadius:99 }}/>
            </div>
            <Mono s={{ display:"block", marginTop:2, color:W.s400 }}>400ms delay · 700ms fill · earned</Mono>
          </div>
        </div>
        <div style={{ padding:"9px 11px", flex:1, display:"flex", flexDirection:"column", gap:7 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <CP rule="protocol" s={{ border:"none", background:"none", padding:0, marginBottom:4 }}>
                <span style={{ fontWeight:600, fontSize:12 }}>Kích hoạt cơ hông</span>
              </CP>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:"monospace", fontSize:26, fontWeight:700, color:W.s700 }}>0:42</div>
              <Mono>còn lại</Mono>
            </div>
          </div>
          <CP rule="action">
            Nằm ngửa, gối gập 90°. Ép hông xuống sàn — giữ 3 giây, thả ra.
          </CP>
          <div style={{ display:"flex", gap:7, marginTop:"auto" }}>
            <CpBtn s={{ flex:1 }}>← Bước trước</CpBtn>
            <CpBtn fill s={{ flex:1 }}>Bước tiếp →</CpBtn>
          </div>
        </div>
      </div>
    )
  },

  S10: {
    label:"Post-Bài — Quiet Ack.",
    phase:"value",
    note:"Dry. Max 6 từ. 3 chips exactly. Zero theatrical.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:13, gap:8, background:W.bg }}>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, paddingTop:10 }}>
          <div style={{ width:30, height:30, borderRadius:"50%", border:`2px solid ${W.s400}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontFamily:"monospace", fontSize:13, color:W.s600 }}>✓</span>
          </div>
          <CP rule="dry" s={{ textAlign:"center", background:"none", border:"none", padding:"0 8px" }}>
            <span style={{ fontWeight:600, fontSize:12 }}>Xong rồi — đúng hướng đấy.</span>
          </CP>
        </div>
        <div style={{ height:1, background:W.s200 }}/>
        <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:9 }}>
          <CP rule="action" s={{ border:"none", background:"none", padding:0, marginBottom:7 }}>
            Sau khi làm xong, lưng thấy thế nào?
          </CP>
          <div style={{ display:"flex", gap:5 }}>
            {["Nhẹ hơn","Như cũ","Nặng hơn"].map((t,i)=>(
              <div key={t} style={{ flex:1, height:32, border:`1.5px solid ${i===0?W.s600:W.border}`, background:i===0?W.s200:W.bg, borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:10, fontWeight:i===0?600:400, color:i===0?W.s700:W.s400 }}>{t}</span>
              </div>
            ))}
          </div>
          <Mono s={{ display:"block", marginTop:5, color:W.s400 }}>3 options only · each → separate AI path</Mono>
        </div>
        <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:9 }}>
          <Mono s={{ display:"block", marginBottom:4 }}>Ngày mai</Mono>
          <CP rule="protocol" s={{ border:"none", background:"none", padding:0 }}>
            Cầu lưng cơ bản · 4 phút · Nằm trên giường
          </CP>
        </div>
        <CpBtn fill>Bật nhắc sáng — 7am</CpBtn>
        <div style={{ background:W.s50, border:`1px dashed ${W.s300}`, borderRadius:5, padding:"4px 7px" }}>
          <Mono s={{ color:W.s500 }}>CTA triggers S30 (notification permission). Platform detect: Android/Chrome → web push prompt. iOS Safari → in-app banner path (không web push). [D1]</Mono>
        </div>
      </div>
    )
  },

  // ── PHASE 4 ──────────────────────────────────────────────────────────────────

  S11: {
    label:"Notification — Web Push (Android/Chrome) + iOS Banner",
    phase:"loop",
    note:"2 paths — D1 decision. Path A: Android/Chrome → web push (lock screen, OS-level). Path B: iOS Safari → in-app banner (top of screen khi app đang mở). Max 2/day, quiet 10pm–7am áp dụng cho cả 2 paths. iOS banner chỉ hiển thị khi user đang trong app — implication: iOS daily loop phụ thuộc vào user tự mở app, không phải notification. Cần set expectation này khi user setup trên iOS.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", background:W.s200, padding:"14px 11px", gap:7 }}>
        <div style={{ textAlign:"center", marginBottom:3 }}>
          <div style={{ fontFamily:"monospace", fontSize:26, fontWeight:700, color:W.s700 }}>7:02</div>
          <Mono>Thứ Ba, 4 tháng 3</Mono>
        </div>
        {/* Active FitWell notif */}
        <div style={{ background:"rgba(255,255,255,0.93)", border:`1.5px solid ${W.s400}`, borderRadius:9, padding:10 }}>
          <Mono s={{ display:"block", marginBottom:5 }}>FitWell · Type A (7am)</Mono>
          <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
            <Box w={26} h={26} s={{ borderRadius:6, flexShrink:0 }}/>
            <CP rule="action" s={{ flex:1, border:"none", background:"none", padding:0 }}>
              Lưng sáng nay thế nào? Bài 90 giây trước khi đứng dậy.
            </CP>
          </div>
        </div>
        {/* Type B preview */}
        <div style={{ background:"rgba(255,255,255,0.93)", border:`1px solid ${W.s300}`, borderRadius:9, padding:9, opacity:0.7 }}>
          <Mono s={{ display:"block", marginBottom:4 }}>Type B (2pm / sau họp)</Mono>
          <CP rule="action" s={{ border:"none", background:"none", padding:0 }}>
            Cổ đang cứng không? Làm được ngay tại ghế — 2 phút.
          </CP>
        </div>
        {/* Type C preview */}
        <div style={{ background:"rgba(255,255,255,0.93)", border:`1px solid ${W.s300}`, borderRadius:9, padding:9, opacity:0.7 }}>
          <Mono s={{ display:"block", marginBottom:4 }}>Type C (10pm / tối)</Mono>
          <CP rule="action" s={{ border:"none", background:"none", padding:0 }}>
            Tay có tê không? Bài này trước khi ngủ.
          </CP>
        </div>
        <Mono s={{ textAlign:"center", marginTop:2 }}>Max 2/day · Min 4h gap · Quiet 10pm–7am</Mono>
        {/* iOS fallback banner */}
        <div style={{ background:W.s50, border:`1px dashed ${W.s300}`, borderRadius:6, padding:8 }}>
          <Mono s={{ color:W.s600, display:"block", marginBottom:4 }}>Path B · iOS Safari · In-app banner (khi đang mở app):</Mono>
          <div style={{ background:"rgba(255,255,255,0.93)", border:`1px solid ${W.s400}`, borderRadius:7, padding:8, display:"flex", gap:7, alignItems:"center" }}>
            <Box w={20} h={20} s={{ borderRadius:5, flexShrink:0 }}/>
            <CP rule="action" s={{ flex:1, border:"none", background:"none", padding:0 }}>
              Lưng sáng nay thế nào? Bài 90 giây trước khi đứng dậy.
            </CP>
            <div style={{ fontSize:10, color:W.s500, fontFamily:"monospace" }}>✕</div>
          </div>
          <Mono s={{ marginTop:4, color:W.s400, display:"block" }}>Chỉ hiển thị khi user đang trong app. iOS user cần tự mở app — không OS-level push. [D1]</Mono>
        </div>
      </div>
    )
  },

  S12: {
    label:"Check-in Pain 1–3",
    phase:"loop",
    note:"Pain 3 selected. Dry tone. Protocol format exact. Day 3 skeptical variant in annotation.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:11, gap:8, background:W.bg }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <Mono s={{ display:"block", marginBottom:3 }}>Check-in · 7:04 SA · Ngày 5</Mono>
            <CP rule="action" s={{ border:"none", background:"none", padding:0 }}>
              <span style={{ fontSize:13, fontWeight:600 }}>Lưng sáng nay thế nào?</span>
            </CP>
          </div>
          <Box w={40} h={18} s={{ borderRadius:3 }}/>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {[1,2,3,4,5].map(n=>(
            <div key={n} style={{ flex:1, height:44, border:`1.5px solid ${n===3?W.s700:W.border}`, background:n===3?W.s200:W.bg, borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontFamily:"monospace", fontSize:17, fontWeight:700, color:n===3?W.s700:W.s400 }}>{n}</span>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:3, height:3 }}>
          <div style={{ flex:2, background:W.s300, borderRadius:99 }}/>
          <div style={{ flex:1, background:W.s500, borderRadius:99 }}/>
          <div style={{ flex:2, background:W.s700, borderRadius:99 }}/>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <Mono>Ổn · teal</Mono><Mono>Vừa · amber</Mono><Mono>Nặng · risk</Mono>
        </div>
        {/* AI response — pain 3, dry */}
        <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:9 }}>
          <Mono s={{ display:"block", marginBottom:5 }}>FitWell · [typing 800ms] · dry · pain 3</Mono>
          <CP rule="dry">
            Mức 3 — ổn để làm bài. Hôm nay: Kéo giãn cơ hông · 5 phút · Tại bàn làm việc.
          </CP>
          <div style={{ marginTop:7, background:W.bg, border:`1px dashed ${W.s300}`, borderRadius:5, padding:"5px 7px" }}>
            <Mono>Day 3–5 skeptical variant:</Mono>
            <CP rule="honest" s={{ border:"none", background:"none", padding:"4px 0 0" }}>
              3 ngày chưa đủ — cơ thể cần 7–10 ngày consistent. Bài đang đúng hướng.
            </CP>
          </div>
          <div style={{ marginTop:5, background:W.bg, border:`1px dashed ${W.s300}`, borderRadius:5, padding:"5px 7px" }}>
            <Mono>positive_trajectory variant (pain delta ≤ -2 trong 5 ngày):</Mono>
            <CP rule="peer-nod" s={{ border:"none", background:"none", padding:"4px 0 0" }}>
              Từ [X] xuống [Y] trong 5 ngày — đang đúng hướng. Tuần này thêm [progression cụ thể] cuối bài.
            </CP>
            <Mono s={{ marginTop:3, color:W.s400, display:"block" }}>Không dùng: "Tuyệt vời", "Xuất sắc", "!" · adaptation_signal: positive_trajectory [G25]</Mono>
          </div>
          <div style={{ marginTop:5, background:W.bg, border:`1px dashed ${W.s300}`, borderRadius:5, padding:"5px 7px" }}>
            <Mono>Worsening trend variant (pain tăng hoặc flat ≥ 3 ngày liên tiếp):</Mono>
            <CP rule="honest" s={{ border:"none", background:"none", padding:"4px 0 0" }}>
              Hôm nay: [bài]. Lưu ý — 3 ngày không giảm, thử giảm biên độ động tác xem có khác không.
            </CP>
            <Mono s={{ marginTop:3, color:W.s400, display:"block" }}>Trigger: recent_pain_scores không đổi hoặc tăng ≥ 3 ngày. Không blame user. Không thay bài — chỉ suggest form check. Dùng "thử xem" không "bạn cần".</Mono>
          </div>
        </div>
        {/* Exercise card */}
        <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:8, display:"flex", gap:7, alignItems:"center" }}>
          <div style={{ width:38, height:38, background:W.s200, borderRadius:5, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:0, height:0, borderTop:"5px solid transparent", borderBottom:"5px solid transparent", borderLeft:`9px solid ${W.s500}`, marginLeft:2 }}/>
          </div>
          <CP rule="protocol" s={{ flex:1, border:"none", background:"none", padding:0 }}>
            <span style={{ fontWeight:600 }}>Kéo giãn cơ hông</span>
            <span style={{ color:W.s400 }}> · 5 phút · Tại bàn</span>
          </CP>
        </div>
      </div>
    )
  },

  S13: {
    label:"Check-in Pain 4–5",
    phase:"loop",
    note:"Pain 5 — 4-part mandatory. Warmth + honest. NO protocol.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:11, gap:7, background:W.bg }}>
        <Mono s={{ display:"block" }}>Check-in · 7:04 SA</Mono>
        <div style={{ display:"flex", gap:4 }}>
          {[1,2,3,4,5].map(n=>(
            <div key={n} style={{ flex:1, height:44, border:`1.5px solid ${n===5?W.s700:W.border}`, background:n===5?W.s500:W.bg, borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontFamily:"monospace", fontSize:17, fontWeight:700, color:n===5?W.bg:W.s400 }}>{n}</span>
            </div>
          ))}
        </div>
        {/* 4-part mandatory */}
        <div style={{ background:W.s150, border:`1.5px solid ${W.s500}`, borderRadius:7, padding:10, display:"flex", flexDirection:"column", gap:7 }}>
          <Mono>FitWell · Pain 5 · 4-part mandatory</Mono>
          <CP rule="warmth" s={{ borderLeft:"3px solid #555" }}>
            <Mono s={{ display:"block", marginBottom:3, fontSize:6.5 }}>① acknowledge</Mono>
            Mức 5 — nghe rồi, hôm nay nặng thật.
          </CP>
          <CP rule="honest" s={{ borderLeft:"3px solid #444" }}>
            <Mono s={{ display:"block", marginBottom:3, fontSize:6.5 }}>② rest permission</Mono>
            Nghỉ hoàn toàn đi — không cần cố.
          </CP>
          <CP rule="honest" s={{ borderLeft:"3px solid #333" }}>
            <Mono s={{ display:"block", marginBottom:3, fontSize:6.5 }}>③ red flag check</Mono>
            Nếu tê chân hoặc đau lan xuống đùi — đừng chờ, gặp bác sĩ. Không phải lo xa, là nói thật.
          </CP>
          <div style={{ background:W.s100, border:`1px dashed ${W.s400}`, borderRadius:5, padding:"5px 7px", textAlign:"center" }}>
            <Mono>④ No protocol — không bài, không "cố lên ngày mai"</Mono>
          </div>
        </div>
      </div>
    )
  },

  S14: {
    label:"Home — Hôm nay Tab",
    phase:"loop",
    note:"Dot grid. 1 task. Pattern neutral — không prescribe. Warmth: dry (standard day).",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", background:W.bg, overflow:"hidden" }}>
        <div style={{ padding:"9px 11px 0" }}>
          <Mono s={{ display:"block", marginBottom:5 }}>Thứ Ba · Ngày 5</Mono>
          <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:6, padding:"7px 9px", marginBottom:8 }}>
            <Mono s={{ display:"block", marginBottom:5 }}>Consistency · 30 ngày</Mono>
            <DotGrid pct={83}/>
          </div>
        </div>
        <div style={{ padding:"0 11px", flex:1, display:"flex", flexDirection:"column", gap:7, overflow:"auto" }}>
          <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:10 }}>
            <Mono s={{ display:"block", marginBottom:5 }}>Bài hôm nay</Mono>
            <CP rule="protocol" s={{ border:"none", background:"none", padding:0, marginBottom:7 }}>
              <span style={{ fontWeight:600 }}>Kích hoạt cơ hông</span>
              <span style={{ color:W.s400 }}> · 5 phút · Trên giường</span>
            </CP>
            <CpBtn fill>Làm bài ▶</CpBtn>
          </div>
          {/* Sparkline */}
          <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:9 }}>
            <Mono s={{ display:"block", marginBottom:5 }}>5 ngày · điểm đau</Mono>
            <div style={{ display:"flex", gap:3, alignItems:"flex-end", height:28, marginBottom:5 }}>
              {[4,4,3,3,3].map((v,i)=>(
                <div key={i} style={{ flex:1, background:`rgba(0,0,0,${v*0.11})`, borderRadius:"2px 2px 0 0", height:`${v*22}%`, minHeight:4, border:`1px solid rgba(0,0,0,0.08)` }}/>
              ))}
            </div>
            <Mono>4 → 4 → 3 → 3 → 3 · ↓ đang cải thiện</Mono>
          </div>
          {/* Pattern insight */}
          <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:9, borderLeft:"3px solid #555" }}>
            <Mono s={{ display:"block", marginBottom:5 }}>Pattern · 14d+ · neutral observer</Mono>
            <CP rule="pattern">
              Nhận ra: lưng hay nặng hơn sau buổi chiều ngồi họp. Bạn quyết định làm gì với thông tin đó.
            </CP>
            <div style={{ marginTop:6, background:W.bg, border:`1px dashed ${W.s300}`, borderRadius:5, padding:"5px 7px" }}>
              <Mono>First pattern variant (is_first_pattern = true · M8 identity lock-in):</Mono>
              <CP rule="peer-nod" s={{ border:"none", background:"none", padding:"4px 0 0" }}>
                Đủ data rồi — bắt đầu thấy pattern của bạn. Nhận ra: lưng hay nặng hơn sau deadline. Lần này sẽ nhắc trước 1 tuần — bạn quyết định làm gì với thông tin đó.
              </CP>
              <Mono s={{ marginTop:3, color:W.s400, display:"block" }}>1 câu warm trước observation. Subsequent patterns: pure neutral, không thêm warmth. [EDS M8 + Pattern Prompt is_first_pattern rule]</Mono>
            </div>
          </div>
        </div>
        <BottomNav active={0}/>
      </div>
    )
  },

  S15: {
    label:"Re-engagement — 2+ ngày skip",
    phase:"loop",
    note:"Zero guilt. Không hỏi lý do. Như chưa có gì. Không mention streak. 2 copy variants: (A) 2–6 ngày skip = 'không hỏi lý do. Cơ thể vẫn nhớ. Làm bài hôm nay bình thường.' (B) 7+ ngày skip = 'Không sao — cơ thể vẫn nhớ. Tiếp bài cũ, không cần restart.' [EDS re-engagement rules]. Cả hai: KHÔNG mention số ngày cụ thể trong copy user-facing, KHÔNG mention streak.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:11, gap:8, background:W.bg }}>
        <Mono s={{ display:"block" }}>Thứ Năm · Ngày 7</Mono>
        <div style={{ display:"flex", gap:7, alignItems:"flex-start" }}>
          <Box w={22} h={22} s={{ borderRadius:5, flexShrink:0, marginTop:2 }}/>
          <CP rule="zero-guilt" s={{ flex:1, borderLeft:"3px solid #444" }}>
            <Mono s={{ display:"block", marginBottom:4 }}>FitWell · re-engagement · Variant A (2–6 ngày)</Mono>
            Không thấy vài ngày — không sao, không hỏi lý do. Cơ thể vẫn nhớ. Làm bài hôm nay bình thường, như chưa có gì.
          </CP>
        </div>
        <div style={{ background:W.s50, border:`1px dashed ${W.s300}`, borderRadius:6, padding:8 }}>
          <Mono s={{ color:W.s600, display:"block", marginBottom:4 }}>Variant B · 7+ ngày skip:</Mono>
          <CP rule="zero-guilt" s={{ border:"none", background:"none", padding:0 }}>
            <span style={{ fontSize:10 }}>Không sao — cơ thể vẫn nhớ. Không cần restart từ đầu, tiếp bài cũ hôm nay bình thường.</span>
          </CP>
          <Mono s={{ marginTop:4, color:W.s400, display:"block" }}>Khác biệt vs Variant A: thêm 'Không cần restart từ đầu' vì user lo ngại mất progress sau gap dài. [EDS: 7+ ngày variant]</Mono>
        </div>
        <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:10 }}>
          <CP rule="action" s={{ border:"none", background:"none", padding:0, marginBottom:8 }}>
            <span style={{ fontWeight:600 }}>Lưng hôm nay thế nào?</span>
          </CP>
          <div style={{ display:"flex", gap:4 }}>
            {[1,2,3,4,5].map(n=>(
              <div key={n} style={{ flex:1, height:40, border:`1px solid ${W.border}`, borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontFamily:"monospace", fontSize:14, color:W.s400 }}>{n}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:9 }}>
          <Mono s={{ display:"block", marginBottom:5 }}>Consistency · 30 ngày · không phạt skip</Mono>
          <DotGrid pct={73}/>
        </div>
      </div>
    )
  },

  // ── PHASE 5 ──────────────────────────────────────────────────────────────────

  S16: {
    label:"Lịch sử Tab",
    phase:"progress",
    note:"Calendar 30 ngày. Shade = pain. Số thật không interpret.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", background:W.bg, overflow:"hidden" }}>
        <div style={{ padding:"9px 11px 0" }}>
          <Mono s={{ display:"block", marginBottom:3 }}>Lịch sử</Mono>
          <CP rule="dry" s={{ border:"none", background:"none", padding:0, marginBottom:7 }}>
            <span style={{ fontWeight:600, fontSize:13 }}>Tháng 3</span>
          </CP>
        </div>
        <div style={{ padding:"0 11px", flex:1, overflow:"auto", display:"flex", flexDirection:"column", gap:6 }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
            {["T2","T3","T4","T5","T6","T7","CN"].map(d=>(
              <div key={d} style={{ textAlign:"center" }}><Mono>{d}</Mono></div>
            ))}
          </div>
          {[[0,0,0,0,1,2,3],[4,4,3,3,3,2,2],[2,3,2,2,2,1,1],[2,2,1,1,0,1,2],[2,2,2,0,0,0,0]].map((week,wi)=>(
            <div key={wi} style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
              {week.map((v,di)=>(
                <div key={di} style={{ height:22, borderRadius:3, background:v===0?W.s100:`rgba(0,0,0,${v*0.13+0.04})`, border:`1px solid ${W.s200}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Mono>{wi*7+di-3>0&&wi*7+di-3<=31?wi*7+di-3:""}</Mono>
                </div>
              ))}
            </div>
          ))}
          <div style={{ display:"flex", gap:4, alignItems:"center" }}>
            <Mono>Đau:</Mono>
            {[1,2,3,4,5].map(v=>(
              <div key={v} style={{ display:"flex", alignItems:"center", gap:2 }}>
                <div style={{ width:11, height:11, borderRadius:2, background:`rgba(0,0,0,${v*0.13+0.04})`, border:`1px solid ${W.s200}` }}/>
                <Mono>{v}</Mono>
              </div>
            ))}
          </div>
          <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:9, display:"flex", gap:0 }}>
            {[["Bài hoàn thành","18 / 23"],["Check-in","21 / 23"],["Điểm 1–2","5 ngày"]].map(([l,v],i)=>(
              <div key={i} style={{ flex:1, padding:"0 5px", borderRight:i<2?`1px solid ${W.s200}`:"none", textAlign:"center" }}>
                <div style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:12, fontWeight:700, color:W.s700 }}>{v}</div>
                <Mono>{l}</Mono>
              </div>
            ))}
          </div>
        </div>
        <BottomNav active={1}/>
      </div>
    )
  },

  S17: {
    label:"Tiến triển Tab",
    phase:"progress",
    note:"14-day chart. Delta = tín hiệu chính. Pattern 14d+. Neutral, không interpret.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", background:W.bg, overflow:"hidden" }}>
        <div style={{ padding:"9px 11px 0" }}>
          <Mono s={{ display:"block", marginBottom:3 }}>Tiến triển</Mono>
          <CP rule="dry" s={{ border:"none", background:"none", padding:0, marginBottom:7 }}>
            <span style={{ fontWeight:600, fontSize:13 }}>Điểm đau</span>
          </CP>
        </div>
        <div style={{ padding:"0 11px", flex:1, display:"flex", flexDirection:"column", gap:7, overflow:"auto" }}>
          <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
              <Mono>14 ngày gần nhất</Mono>
              <CP rule="pattern" s={{ border:"none", background:"none", padding:0 }}>
                <span style={{ fontWeight:700, color:W.s600 }}>↓ −1.5 điểm</span>
              </CP>
            </div>
            <div style={{ display:"flex", gap:2, alignItems:"flex-end", height:46 }}>
              {[4,5,4,4,3,4,3,3,3,2,3,2,2,2].map((v,i)=>(
                <div key={i} style={{ flex:1, background:`rgba(0,0,0,${0.07+v*0.1})`, borderRadius:"2px 2px 0 0", height:`${(v/5)*100}%`, minHeight:4, border:`1px solid rgba(0,0,0,0.08)` }}/>
              ))}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:3 }}>
              <Mono>Tuần 1</Mono><Mono>Tuần 2</Mono>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
            {[["18 / 23","Bài hoàn thành"],["83%","Consistency"],["5 ngày","Điểm 1–2"],["2.4","Avg pain / ngày"]].map(([v,l])=>(
              <div key={l} style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:6, padding:9 }}>
                <div style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:15, fontWeight:700, color:W.s700, marginBottom:2 }}>{v}</div>
                <Mono>{l}</Mono>
              </div>
            ))}
          </div>
          <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:9, borderLeft:"3px solid #555" }}>
            <Mono s={{ display:"block", marginBottom:5 }}>Pattern · 14d+ · neutral [Variant A — standard, is_first_pattern=false]</Mono>
            <CP rule="pattern">
              5 ngày qua: 3 → 3 → 2 → 2 → 2. Nhận ra: lưng hay nặng hơn sau họp dài. Bạn quyết định làm gì với thông tin đó.
            </CP>
          </div>
          <div style={{ background:W.s50, border:`1px dashed ${W.s300}`, borderRadius:7, padding:9, borderLeft:"3px solid #333" }}>
            <Mono s={{ display:"block", marginBottom:5, color:W.s600 }}>Pattern · Variant B — first pattern (is_first_pattern=true) [M8]</Mono>
            <CP rule="warmth" s={{ marginBottom:5 }}>
              Đủ data rồi — bắt đầu thấy pattern của bạn.
            </CP>
            <CP rule="pattern">
              Nhận ra: lưng hay nặng hơn sau deadline cuối quý. Lần này sẽ nhắc trước 1 tuần — bạn quyết định làm gì với thông tin đó.
            </CP>
            <Mono s={{ marginTop:4, color:W.s400, display:"block" }}>1 câu warm trước observation. Chỉ trigger lần đầu tiên pattern surface (is_first_pattern=true). Subsequent = Variant A only.</Mono>
          </div>
        </div>
        <BottomNav active={2}/>
      </div>
    )
  },

  S18: {
    label:"Day 7 Summary — Pre-Paywall",
    phase:"progress",
    note:"Milestone — peer nod được phép. Số thật user. Copy honest. Paywall: dry.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:13, gap:8, background:W.bg }}>
        <div style={{ textAlign:"center" }}>
          <CP rule="dry" s={{ border:"none", background:"none", padding:0, marginBottom:5 }}>
            <span style={{ fontSize:15, fontWeight:700 }}>7 ngày xong rồi.</span>
          </CP>
          <CP rule="peer-nod" s={{ borderLeft:"3px solid #444" }}>
            Được đấy — 7 ngày liên tiếp. Không phải ai cũng làm được.
          </CP>
        </div>
        <div style={{ display:"flex", gap:0, background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, overflow:"hidden" }}>
          {[["18/23","Bài xong"],["↓1.5","Điểm đau"],["5 ngày","Điểm 1–2"]].map(([v,l],i)=>(
            <div key={i} style={{ flex:1, padding:"9px 5px", textAlign:"center", borderRight:i<2?`1px solid ${W.s200}`:"none" }}>
              <div style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:14, fontWeight:700, color:W.s700 }}>{v}</div>
              <Mono>{l}</Mono>
            </div>
          ))}
        </div>
        <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:10 }}>
          <Mono s={{ display:"block", marginBottom:6 }}>Kết quả của bạn</Mono>
          {[["Điểm đau lưng","4.0","→","2.5"],["Sáng không đau","1 ngày","→","4 ngày"],["Bài hoàn thành","—","→","18/23"]].map(([l,b,a,v])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"5px 0", borderBottom:`1px solid ${W.s100}` }}>
              <span style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:10, color:W.s600 }}>{l}</span>
              <div style={{ display:"flex", gap:4, alignItems:"center" }}>
                <span style={{ fontFamily:"monospace", fontSize:10, color:W.s500 }}>{b}</span>
                <span style={{ fontFamily:"monospace", fontSize:9, color:W.s400 }}>→</span>
                <span style={{ fontFamily:"monospace", fontSize:10, fontWeight:700, color:W.s700 }}>{v}</span>
              </div>
            </div>
          ))}
        </div>
        <CP rule="honest">
          Bạn tự biết nó có work không.
        </CP>
        <CpBtn fill>Tiếp tục với FitWell →</CpBtn>
      </div>
    )
  },

  // ── PHASE 6 ──────────────────────────────────────────────────────────────────

  // [EDS Day 28 complacency] S28 — Re-anchor (Day 28–30)
  S28: {
    label:"Re-anchor — Day 28–30 Complacency",
    phase:"progress",
    note:"Trigger: day_number ≥ 28 AND pain đã stable (avg ≤ 2.5 trong 14 ngày) AND consistency ≥ 70%. User đang ổn — đây là dip nguy hiểm nhất: 'ổn rồi, không cần nữa'. Không phải re-engagement (user vẫn đang dùng). Là gentle re-anchor trước khi họ tự exit. Tone: amber — không teal (không celebrate), không risk (không alarm). C9_Reanchor pattern: acknowledge → data → forward-framing → suggest lighter cadence. [EDS Day 28 complacency arc]",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:11, gap:8, background:W.bg }}>
        <Mono s={{ display:"block" }}>Ngày 28</Mono>
        {/* Re-anchor card — amber top border */}
        <div style={{ border:`1px solid ${W.border}`, borderTop:`2px solid #D4820A`, borderRadius:7, padding:10, display:"flex", flexDirection:"column", gap:7 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <Mono s={{ color:"#D4820A", display:"block", marginBottom:3 }}>Tháng đầu · Ngày 28</Mono>
              <div style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:13, fontWeight:700, color:W.s700 }}>Tháng đầu xong rồi.</div>
            </div>
            <span style={{ fontFamily:"monospace", fontSize:20, fontWeight:700, color:"#D4820A" }}>28</span>
          </div>
          <CP rule="peer-nod" s={{ borderLeft:"3px solid #D4820A" }}>
            Ổn đấy. Điểm đau trung bình từ [X] xuống [Y] trong 28 ngày. Tháng 2 sẽ dễ hơn — base đã có rồi.
          </CP>
          {/* Re-anchor suggestion */}
          <div style={{ background:W.s100, borderRadius:5, padding:"8px 10px", border:`1px solid #D4820A22` }}>
            <Mono s={{ color:"#D4820A", display:"block", marginBottom:4 }}>Re-anchor suggestion</Mono>
            <CP rule="pattern" s={{ border:"none", background:"none", padding:0 }}>
              Pattern đang ổn định. Giảm xuống 3 buổi/tuần thay vì dừng — duy trì được lâu hơn nhiều.
            </CP>
          </div>
          <CpBtn s={{ border:`1px solid ${W.border}` }}>Điều chỉnh lịch</CpBtn>
        </div>
        <div style={{ background:W.s50, border:`1px dashed ${W.s300}`, borderRadius:5, padding:"5px 8px" }}>
          <Mono>Trigger: day ≥ 28 + pain stable (avg ≤ 2.5 / 14 ngày) + consistency ≥ 70%. Hiện 1 lần. Không repeat nếu user dismiss. Nếu pain tăng lại sau này → re-engagement flow bình thường, không re-anchor. [EDS Day 28 complacency + C9_Reanchor]</Mono>
        </div>
      </div>
    )
  },

  S19: {
    label:"Paywall — Day 7",
    phase:"convert",
    note:"Dry — không emotional manipulation. Anchor copy. Dismiss luôn visible.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:11, gap:8, background:W.bg }}>
        <Mono s={{ display:"block" }}>Ngày 7 — [không countdown]</Mono>
        <CP rule="honest">
          7 ngày. Số thật của bạn ở trên. Bạn tự quyết định có tiếp tục không.
        </CP>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {/* 6 months */}
          <div style={{ border:`1px solid ${W.border}`, borderRadius:7, padding:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:11, fontWeight:700, color:W.s600 }}>6 tháng</div>
              <Mono>~132.000đ / tháng</Mono>
            </div>
            <span style={{ fontFamily:"monospace", fontSize:15, fontWeight:700, color:W.s700 }}>790.000đ</span>
          </div>
          {/* 1 year — default selected */}
          <div style={{ border:`2px solid ${W.s600}`, borderRadius:7, padding:10, background:W.s100, position:"relative" }}>
            <div style={{ position:"absolute", top:-8, right:10, background:W.s600, borderRadius:99, padding:"2px 7px" }}>
              <span style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:8, fontWeight:600, color:W.bg }}>Tiết kiệm ~200k</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:11, fontWeight:700, color:W.s700 }}>1 năm</div>
                <Mono>~82.000đ / tháng</Mono>
              </div>
              <span style={{ fontFamily:"monospace", fontSize:15, fontWeight:700, color:W.s700 }}>990.000đ</span>
            </div>
          </div>
        </div>
        <CP rule="honest" s={{ borderLeft:"3px solid #444" }}>
          1 buổi PT: 200–400k. FitWell 1 năm: 82k/tháng. Bài tập tại nhà, không cần đi đâu.
        </CP>
        <CpBtn fill>Tiếp tục với FitWell</CpBtn>
        <div style={{ textAlign:"center" }}>
          <CP rule="action" s={{ border:"none", background:"none", padding:0, textAlign:"center" }}>
            <span style={{ color:W.s500 }}>Không tiếp tục — thôi cũng được.</span>
          </CP>
        </div>
        <div style={{ textAlign:"center" }}>
          <span style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:9, color:W.s400 }}>Khôi phục mua hàng · <span style={{ color:W.s600 }}>Đã có tài khoản</span></span>
        </div>
        <div style={{ background:W.s100, border:`1px dashed ${W.s300}`, borderRadius:5, padding:"5px 8px" }}>
          <Mono>"Tiếp tục" → S19b (PayOS loading) → S26 Sign Up · "Đã có tài khoản" → S27 Login</Mono>
        </div>
      </div>
    )
  },

  S19b: {
    label:"Payment Processing — Desktop QR / Mobile Redirect (2 paths)",
    phase:"convert",
    note:"D2 decision: spec cả 2 paths. Path A (Desktop): user xem QR trên màn hình lớn, quét bằng điện thoại → payment trên phone → PayOS webhook → desktop tab auto-refresh (polling mỗi 2s). Path B (Mobile web): tap nút → redirect sang banking app → payment → return to tab. Platform detect: screen width > 768px = desktop path. KHÔNG generic spinner. Timeout 30s cả 2 paths → fallback copy. [D2]",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:11, gap:7, background:W.bg }}>
        {/* Path selector — annotation only */}
        <div style={{ display:"flex", gap:5 }}>
          {["Path A · Desktop","Path B · Mobile"].map((t,i)=>(
            <div key={t} style={{ flex:1, padding:"4px 0", textAlign:"center", background:i===0?W.s600:W.s100, border:`1px solid ${i===0?W.s600:W.s300}`, borderRadius:5 }}>
              <Mono s={{ color:i===0?W.bg:W.s400, fontSize:7 }}>{t}</Mono>
            </div>
          ))}
        </div>

        {/* PATH A — Desktop QR */}
        <div style={{ background:W.s100, border:`1.5px solid ${W.s500}`, borderRadius:7, padding:10, display:"flex", flexDirection:"column", gap:7 }}>
          <Mono s={{ color:W.s600 }}>Path A · Desktop · QR on screen</Mono>
          {/* QR placeholder */}
          <div style={{ alignSelf:"center", width:64, height:64, background:W.s200, border:`1px solid ${W.s300}`, borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Mono s={{ fontSize:7, textAlign:"center", color:W.s500 }}>PayOS QR</Mono>
          </div>
          <CP rule="action" s={{ border:"none", background:"none", padding:0, textAlign:"center" }}>
            <span style={{ fontSize:10 }}>Mở banking app → quét QR này</span>
          </CP>
          {/* Waiting state */}
          <div style={{ display:"flex", gap:3, justifyContent:"center" }}>
            {[0.3,0.6,1.0,0.6,0.3].map((o,i)=>(
              <div key={i} style={{ width:5, height:5, borderRadius:"50%", background:W.s500, opacity:o }}/>
            ))}
          </div>
          <CP s={{ border:"none", background:"none", padding:0, textAlign:"center" }}>
            <span style={{ color:W.s400, fontSize:10 }}>Đang chờ xác nhận · polling mỗi 2 giây · không cần refresh</span>
          </CP>
        </div>

        {/* PATH B — Mobile redirect */}
        <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:10, display:"flex", flexDirection:"column", gap:6, opacity:0.5 }}>
          <Mono s={{ color:W.s500 }}>Path B · Mobile · Redirect to banking app</Mono>
          <CpBtn fill>Thanh toán qua banking app →</CpBtn>
          <CP s={{ border:"none", background:"none", padding:0 }}>
            <span style={{ color:W.s400, fontSize:10 }}>Chuyển sang app ngân hàng → thanh toán → tự động quay lại FitWell.</span>
          </CP>
          {/* Return state */}
          <div style={{ background:W.s150, border:`1px solid ${W.s300}`, borderRadius:5, padding:"5px 8px" }}>
            <Mono>Return state: tab reactivate → check webhook → nếu confirmed → S26. Nếu chưa → hiện "Đang xác nhận..."</Mono>
          </div>
        </div>

        {/* Shared timeout */}
        <div style={{ background:W.s50, border:`1px dashed ${W.s300}`, borderRadius:6, padding:"6px 8px" }}>
          <Mono s={{ display:"block", marginBottom:3, color:W.s500 }}>Timeout 30s · cả 2 paths:</Mono>
          <CP s={{ border:"none", background:"none", padding:0 }}>
            <span style={{ fontSize:10, color:W.s500 }}>Thanh toán có thể đã thành công — kiểm tra app ngân hàng. Bị trừ tiền → email support@fitwell.vn kèm screenshot.</span>
          </CP>
        </div>
      </div>
    )
  },

  S20: {
    label:"Post-Sub — Full Access",
    phase:"convert",
    note:"Long-term loop. Pattern memory active. App lùi lại. User là chuyên gia.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", background:W.bg, overflow:"hidden" }}>
        <div style={{ padding:"9px 11px 0" }}>
          <Mono s={{ display:"block", marginBottom:3 }}>Ngày 8 · Đã kích hoạt</Mono>
          <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:6, padding:"7px 9px", marginBottom:7 }}>
            <Mono s={{ display:"block", marginBottom:5 }}>Consistency · 30 ngày</Mono>
            <DotGrid pct={86}/>
          </div>
        </div>
        <div style={{ padding:"0 11px", flex:1, display:"flex", flexDirection:"column", gap:7, overflow:"auto" }}>
          <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:10 }}>
            <Mono s={{ display:"block", marginBottom:5 }}>Bài hôm nay · adaptive</Mono>
            <CP rule="protocol" s={{ border:"none", background:"none", padding:0, marginBottom:7 }}>
              <span style={{ fontWeight:600 }}>Kích hoạt cơ hông sâu</span>
              <span style={{ color:W.s400 }}> · 6 phút · Nằm sấp</span>
            </CP>
            <CpBtn fill>Làm bài ▶</CpBtn>
          </div>
          <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:9, borderLeft:"3px solid #444" }}>
            <Mono s={{ display:"block", marginBottom:5 }}>Pattern memory · day 10+</Mono>
            <CP rule="pattern">
              Nhận ra: lưng hay nặng sau deadline cuối quý. Lần này sẽ nhắc trước 1 tuần — bạn quyết định làm gì.
            </CP>
          </div>
          <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:9 }}>
            <Mono s={{ display:"block", marginBottom:5 }}>Pattern mới phát hiện</Mono>
            <CP rule="insight">
              Cổ vai có dấu hiệu căng sau buổi sáng nhiều họp. Muốn thêm vào danh sách theo dõi không?
            </CP>
          </div>
        </div>
        <BottomNav active={0}/>
      </div>
    )
  },

  // ── PHASE 6 · AUTH ───────────────────────────────────────────────────────────

  S26: {
    label:"Sign Up — Post-Paywall",
    phase:"convert",
    note:"Không phải 'Tạo tài khoản' — frame là bảo vệ data 7 ngày của họ. SSO trước. Email fallback. Zero friction.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:14, gap:9, background:W.bg }}>
        <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
          <CP rule="honest" s={{ borderLeft:"3px solid #444" }}>
            <span style={{ fontWeight:700, fontSize:12 }}>Lưu 7 ngày dữ liệu của bạn.</span>
          </CP>
          <CP rule="action" s={{ background:"none", border:"none", padding:0 }}>
            <span style={{ color:W.s400, fontSize:10 }}>
              Dữ liệu đau, bài tập, pattern — mất hết nếu không lưu. Email để đồng bộ thiết bị khác.
            </span>
          </CP>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {/* Google SSO — primary (web MVP: no Apple SSO per Tech Spec v1.2) */}
          <div style={{ height:40, border:`1.5px solid ${W.s700}`, borderRadius:7, background:W.s700, display:"flex", alignItems:"center", justifyContent:"center", gap:9 }}>
            <Box w={14} h={14} s={{ background:W.bg, borderRadius:2, border:"none", flexShrink:0 }}/>
            <span style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:11, fontWeight:600, color:W.bg }}>Tiếp tục với Google</span>
          </div>
          {/* Divider */}
          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
            <div style={{ flex:1, height:1, background:W.s200 }}/>
            <Mono>hoặc email</Mono>
            <div style={{ flex:1, height:1, background:W.s200 }}/>
          </div>
          {/* Email magic link */}
          <div style={{ height:38, border:`1px solid ${W.border}`, borderRadius:7, padding:"0 11px", display:"flex", alignItems:"center" }}>
            <span style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:11, color:W.s400 }}>Email của bạn</span>
          </div>
        </div>
        <CpBtn fill>Lưu dữ liệu →</CpBtn>
        <CP rule="honest" s={{ background:"none", border:"none", padding:0, textAlign:"center" }}>
          <span style={{ fontSize:9, color:W.s400 }}>
            Không spam. Không share data. Chỉ dùng để khôi phục tài khoản.
          </span>
        </CP>
        <div style={{ textAlign:"center" }}>
          <CP rule="action" s={{ background:"none", border:"none", padding:0, textAlign:"center" }}>
            <span style={{ fontSize:10, color:W.s500 }}>
              Đã có tài khoản? <span style={{ color:W.s700, fontWeight:600 }}>Đăng nhập</span>
            </span>
          </CP>
        </div>
        <div style={{ background:W.s100, border:`1px dashed ${W.s300}`, borderRadius:5, padding:"5px 8px" }}>
          <Mono>Trigger: S19 "Tiếp tục" → S19b → S26. Web MVP: Google OAuth primary, email+password fallback. No magic link. Apple SSO native only. [v1.5]</Mono>
        </div>
      </div>
    )
  },

  S27: {
    label:"Login — Returning User",
    phase:"convert",
    note:"Returning user — đã có data trước đó. Google OAuth primary. Email + password fallback — KHÔNG dùng magic link (removed v1.5). Forgot password → reset email. Entry: S23 Hồ sơ, S26 'Đã có tài khoản'.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:14, gap:9, background:W.bg }}>
        <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
          <CP rule="dry" s={{ border:"none", background:"none", padding:0, marginBottom:2 }}>
            <span style={{ fontWeight:700, fontSize:13 }}>Đăng nhập.</span>
          </CP>
          <CP rule="action" s={{ background:"none", border:"none", padding:0 }}>
            <span style={{ color:W.s400, fontSize:10 }}>
              Khôi phục dữ liệu và pattern của bạn.
            </span>
          </CP>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {/* Google OAuth — primary */}
          <div style={{ height:40, border:`1.5px solid ${W.s700}`, borderRadius:7, background:W.s700, display:"flex", alignItems:"center", justifyContent:"center", gap:9 }}>
            <Box w={14} h={14} s={{ background:W.bg, borderRadius:2, border:"none", flexShrink:0 }}/>
            <span style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:11, fontWeight:600, color:W.bg }}>Tiếp tục với Google</span>
          </div>
          {/* Divider */}
          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
            <div style={{ flex:1, height:1, background:W.s200 }}/>
            <Mono>hoặc email / mật khẩu</Mono>
            <div style={{ flex:1, height:1, background:W.s200 }}/>
          </div>
          {/* Email */}
          <div style={{ height:38, border:`1px solid ${W.border}`, borderRadius:7, padding:"0 11px", display:"flex", alignItems:"center" }}>
            <span style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:11, color:W.s400 }}>Email đã đăng ký</span>
          </div>
          {/* Password */}
          <div style={{ height:38, border:`1px solid ${W.border}`, borderRadius:7, padding:"0 11px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:11, color:W.s400 }}>Mật khẩu</span>
            <span style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:10, color:W.s500 }}>Quên?</span>
          </div>
          <CpBtn fill>Đăng nhập →</CpBtn>
        </div>
        {/* Forgot password note */}
        <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:6, padding:"8px 10px" }}>
          <Mono s={{ display:"block", marginBottom:4 }}>Không nhớ đăng ký bằng gì?</Mono>
          <CP rule="action" s={{ background:"none", border:"none", padding:0 }}>
            <span style={{ color:W.s500, fontSize:10 }}>
              Thử Google trước. Nếu không được — nhập email để nhận link reset mật khẩu.
            </span>
          </CP>
        </div>
        <div style={{ background:W.s100, border:`1px dashed ${W.s300}`, borderRadius:5, padding:"5px 8px" }}>
          <Mono>Entry: S23 · S26 "Đã có tài khoản". No magic link — Google OAuth + email/password only. [v1.5 fix]</Mono>
        </div>
      </div>
    )
  },

  // ── MSK SCREENS ─────────────────────────────────────────────────────────────

  SMSK05: {
    label:"Multi-condition Schedule",
    phase:"onboard",
    note:"Xuất hiện sau S04C khi user có ≥2 conditions. Hiển thị 5 time slots cụ thể. Key insight: 3 conditions không phải 3× effort — overlap detection tự động. KHÔNG xuất hiện cho single-condition user.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:11, gap:8, background:W.bg }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <Mono>3 tình trạng · 1 lịch trình</Mono>
          <div style={{ display:"flex", gap:3 }}>
            {["Cổ","Lưng","Bàn chân"].map(t=>(
              <div key={t} style={{ height:18, padding:"0 6px", background:W.s200, border:`1px solid ${W.s300}`, borderRadius:99, display:"flex", alignItems:"center" }}>
                <Mono s={{ fontSize:7 }}>{t}</Mono>
              </div>
            ))}
          </div>
        </div>
        <CP rule="insight" s={{ borderLeft:"3px solid #333" }}>
          3 tình trạng — không phải 3× thời gian. FitWell gộp overlap, sắp theo timing quan trọng nhất.
        </CP>
        <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
          {[
            { time:"06:55 SA", tag:"critical", items:"Kéo giãn bàn chân · 4' · Tại giường", note:"Trước bước đầu tiên" },
            { time:"07:10 SA", tag:"daily", items:"Cổ + Lưng + Bàn chân · 15'", note:"3 bài liền — 1 routine" },
            { time:"Mỗi 45'", tag:"micro", items:"Cổ micro-dose · 2' · Tại ghế", note:"5–6× trong giờ làm việc" },
            { time:"21:30 CH", tag:"daily", items:"Cat-cow + Cổ + Bàn chân · 8'", note:"Trên giường" },
            { time:"23:30 CH", tag:"quiet", items:"Tư thế ngủ · 1 dòng", note:"Nhắc im lặng — không mở app" },
          ].map(({time,tag,items,note})=>(
            <div key={time} style={{ background:W.s100, border:`1px solid ${tag==="critical"?W.s500:W.border}`, borderRadius:6, padding:"6px 9px", display:"flex", gap:8, alignItems:"flex-start" }}>
              <div style={{ width:36, flexShrink:0, textAlign:"right" }}>
                <Mono s={{ fontWeight:700, color:tag==="critical"?W.s700:W.s500 }}>{time}</Mono>
                {tag==="critical" && <div style={{ width:6, height:6, borderRadius:"50%", background:W.s600, margin:"2px auto 0" }}/>}
              </div>
              <div style={{ flex:1 }}>
                <CP rule="protocol" s={{ border:"none", background:"none", padding:0, marginBottom:2 }}>
                  <span style={{ fontWeight:600 }}>{items}</span>
                </CP>
                <Mono s={{ color:W.s400 }}>{note}</Mono>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background:W.s100, border:`1px dashed ${W.s300}`, borderRadius:5, padding:"4px 8px" }}>
          <Mono>Tổng: ~30' / ngày · Overlap detected · Load cap tự động</Mono>
        </div>
        <CpBtn fill>Bắt đầu với 06:55 sáng mai →</CpBtn>
      </div>
    )
  },

  SLS03: {
    label:"Ergonomics 1-time Setup",
    phase:"onboard",
    note:"Chỉ hiển thị 1 lần, trong onboarding — không nhắc lại. Trigger: user có ≥1 trong [Cổ, Lưng, FHP, Rounded shoulders]. 3-item checklist, không quiz dài. Embedded vào onboarding flow, không phải screen riêng biệt sau khi dùng app.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:11, gap:9, background:W.bg }}>
        <div>
          <Mono s={{ display:"block", marginBottom:4 }}>Cài đặt 1 lần — không nhắc lại</Mono>
          <CP rule="action" s={{ border:"none", background:"none", padding:0, marginBottom:2 }}>
            <span style={{ fontSize:13, fontWeight:700, color:W.s700 }}>Setup tư thế làm việc</span>
          </CP>
          <CP s={{ border:"none", background:"none", padding:0 }}>
            <span style={{ color:W.s400, fontSize:10 }}>3 thứ — làm được ngay, không cần mua gì mới</span>
          </CP>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {[
            { item:"Màn hình ngang tầm mắt", sub:"Đỉnh màn hình = mắt. Dùng sách kê nếu cần.", checked:true },
            { item:"Ghế: khuỷu tay 90°", sub:"Bàn phím ngang khuỷu tay, không vươn tay ra ngoài.", checked:true },
            { item:"Chuột gần bàn phím", sub:"Không để chuột ở xa — vai không phải giơ.", checked:false },
          ].map(({item,sub,checked})=>(
            <div key={item} style={{ background:checked?W.s150:W.bg, border:`1.5px solid ${checked?W.s500:W.border}`, borderRadius:8, padding:"8px 10px", display:"flex", gap:10, alignItems:"flex-start" }}>
              <div style={{ width:16, height:16, borderRadius:3, border:`2px solid ${checked?W.s700:W.s300}`, background:checked?W.s500:"none", flexShrink:0, marginTop:2, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {checked && <span style={{ fontFamily:"monospace", fontSize:9, color:W.bg }}>✓</span>}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:11, fontWeight:checked?600:400, color:checked?W.s700:W.s500, marginBottom:2 }}>{item}</div>
                <Mono s={{ color:W.s400 }}>{sub}</Mono>
              </div>
            </div>
          ))}
        </div>
        <CP rule="insight" s={{ borderLeft:"3px solid #333" }}>
          45° cúi xuống điện thoại = 27kg lên cổ. Nâng điện thoại lên ngang mắt = loại bỏ 20kg áp lực.
        </CP>
        <div style={{ display:"flex", gap:7 }}>
          <CpBtn s={{ flex:1 }}>Bỏ qua</CpBtn>
          <CpBtn fill s={{ flex:2 }}>Đã setup →</CpBtn>
        </div>
        <div style={{ background:W.s100, border:`1px dashed ${W.s300}`, borderRadius:5, padding:"4px 8px" }}>
          <Mono>Trigger: Cổ / Lưng / FHP / Rounded shoulders in profile · 1× only · no repeat</Mono>
        </div>
      </div>
    )
  },

  SMSK01: {
    label:"Morning Critical Timing — 06:55 AM",
    phase:"value",
    note:"Đây là màn hình quan trọng nhất trong Phase 3. Trigger: user có #15 Plantar fasciitis, #16 Achilles, hoặc #6 Lưng. Timing IS the product — 06:55 không phải 07:10. Copy emphasizes: TRƯỚC KHI đặt chân xuống sàn. User làm xong → bước đầu tiên ít đau → physical dopamine mạnh nhất trong toàn app.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", background:W.bg, overflow:"hidden" }}>
        {/* Notification lock screen style */}
        <div style={{ background:W.s200, padding:"12px 11px 9px", borderBottom:`1px solid ${W.border}`, flexShrink:0 }}>
          <div style={{ textAlign:"center", marginBottom:8 }}>
            <div style={{ fontFamily:"monospace", fontSize:28, fontWeight:700, color:W.s700, lineHeight:1 }}>6:55</div>
            <Mono>Thứ Tư · 5 tháng 3</Mono>
          </div>
          <div style={{ background:"rgba(255,255,255,0.93)", border:`1.5px solid ${W.s500}`, borderRadius:9, padding:10 }}>
            <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
              <Box w={24} h={24} s={{ borderRadius:6, flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <CP rule="action" s={{ border:"none", background:"none", padding:0, marginBottom:3 }}>
                  <span style={{ fontWeight:700 }}>Đừng đặt chân xuống sàn trước.</span>
                </CP>
                <CP s={{ border:"none", background:"none", padding:0 }}>
                  <span style={{ color:W.s500, fontSize:10 }}>4 phút — kéo giãn tại giường · Viêm cân gan chân</span>
                </CP>
              </div>
            </div>
          </div>
        </div>
        {/* Protocol screen after tap */}
        <div style={{ padding:"9px 11px", flex:1, display:"flex", flexDirection:"column", gap:7, overflow:"hidden" }}>
          <Mono>State B — sau khi mở notification</Mono>
          <CP rule="fear" s={{ borderLeft:"3px solid #555" }}>
            Đau bước đầu tiên xảy ra vì cân gan chân co lại qua đêm. 4 phút stretch trước khi đứng — hôm nay sẽ đỡ hơn hẳn.
          </CP>
          <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:9, display:"flex", flexDirection:"column", gap:5 }}>
            <Mono s={{ color:W.s600 }}>Tại giường · Bây giờ</Mono>
            {[
              "① Ngồi dậy, duỗi thẳng chân — kéo ngón về phía ống đồng · 30 giây",
              "② Xoay cổ chân 10 vòng mỗi bên · 30 giây",
              "③ Đứng dậy từ từ, dồn trọng lượng dần · 30 giây",
            ].map((s,i)=>(
              <CP key={i} rule="protocol" s={{ border:"none", background:"none", padding:"2px 0" }}>
                <span style={{ fontSize:10 }}>{s}</span>
              </CP>
            ))}
          </div>
          <div style={{ background:W.s100, border:`1px dashed ${W.s300}`, borderRadius:5, padding:"4px 8px" }}>
            <Mono>Timing exception: notification lúc 06:55, không phải 07:10 — sai timing mất hiệu quả (fascia đã bị kéo căng sau khi chịu tải). [corrected v1.4]</Mono>
          </div>
          <CpBtn fill>Bắt đầu · 4 phút →</CpBtn>
        </div>
      </div>
    )
  },

  SMSK02: {
    label:"Tendon Pain Paradox — Working Signal",
    phase:"value",
    note:"Chỉ hiển thị cho user có Achilles (#16), Plantar (#15), hoặc Tennis elbow (#5). Đây là counterintuitive truth quan trọng nhất của app — user phải hiểu cơ chế trước khi làm bài. Nếu app chỉ instruct mà không explain WHY, user sẽ dừng ở pain 3–4 và condition không cải thiện. Rule: clinical authority + cơ chế trước protocol.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:11, gap:8, background:W.bg }}>
        <div style={{ background:W.s200, border:`1px solid ${W.s400}`, borderRadius:5, padding:"3px 8px", alignSelf:"flex-start" }}>
          <Mono s={{ color:W.s600 }}>Tendon track · Viêm gân Achilles</Mono>
        </div>
        <CP rule="fear" s={{ borderLeft:"3px solid #555" }}>
          Đau khi làm bài eccentric — không phải dấu hiệu dừng lại. Đây là điều ngược với mọi thứ bạn từng nghe.
        </CP>
        <CP rule="insight" s={{ borderLeft:"3px solid #333" }}>
          Gân tái tạo collagen qua micro-stress có kiểm soát. Eccentric load tạo ra stress đó. Đau 3–4 = gân đang được kích thích đúng cách — không phải cảnh báo nguy hiểm.
        </CP>
        {/* Pain threshold guide */}
        <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:9 }}>
          <Mono s={{ display:"block", marginBottom:6 }}>Hướng dẫn đau — Tendon track</Mono>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            {[
              { range:"1–2", label:"Quá nhẹ", action:"Tăng range hoặc tốc độ", color:W.s300 },
              { range:"3–4", label:"Working signal ✓", action:"Tiếp tục — đây là mục tiêu", color:W.s500 },
              { range:"5",   label:"Giảm range", action:"Không dừng — giảm biên độ chuyển động", color:W.s600 },
            ].map(({range,label,action,color})=>(
              <div key={range} style={{ display:"flex", gap:8, alignItems:"center", padding:"4px 7px", background:range==="3–4"?W.s200:W.bg, border:`1px solid ${range==="3–4"?W.s500:W.s200}`, borderRadius:5 }}>
                <div style={{ width:20, height:20, borderRadius:99, background:color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontFamily:"monospace", fontSize:8, fontWeight:700, color:W.bg }}>{range}</span>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:10, fontWeight:range==="3–4"?700:400, color:W.s700 }}>{label}</div>
                  <Mono s={{ color:W.s400 }}>{action}</Mono>
                </div>
              </div>
            ))}
          </div>
        </div>
        <CP rule="honest" s={{ borderLeft:"3px solid #444" }}>
          Alfredson protocol (Achilles): 3 set × 15 reps, 2×/ngày, 12 tuần. Đau trong bài là bình thường — đau nghỉ ngơi không giảm sau 24h thì báo.
        </CP>
        <CpBtn fill>Hiểu rồi — bắt đầu bài →</CpBtn>
      </div>
    )
  },

  SMSK03: {
    label:"Check-in Bifurcation — Joint vs Tendon",
    phase:"loop",
    note:"Đây là screen state mới — sau khi user chọn pain level trong check-in. Logic: nếu condition = Tendon track VÀ pain = 3–4, response khác hoàn toàn với Joint track. Joint track pain 4 → modify to isometric. Tendon track pain 4 → confirm working signal + tiếp tục. Designer phải thấy cả hai variants trên 1 screen.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:11, gap:7, background:W.bg }}>
        <Mono s={{ display:"block" }}>Check-in Bifurcation · Pain 4 selected</Mono>
        <div style={{ display:"flex", gap:4, marginBottom:2 }}>
          {[1,2,3,4,5].map(n=>(
            <div key={n} style={{ flex:1, height:36, border:`1.5px solid ${n===4?W.s700:W.border}`, background:n===4?W.s500:W.bg, borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontFamily:"monospace", fontSize:15, fontWeight:700, color:n===4?W.bg:W.s400 }}>{n}</span>
            </div>
          ))}
        </div>
        {/* Two variants side by side */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, flex:1 }}>
          {/* Joint track */}
          <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:8, display:"flex", flexDirection:"column", gap:5 }}>
            <div style={{ background:W.s200, borderRadius:4, padding:"2px 6px", alignSelf:"flex-start" }}>
              <Mono s={{ fontSize:6.5 }}>Joint track</Mono>
            </div>
            <Mono s={{ fontSize:6.5, color:W.s500 }}>Lưng / Cổ / Gối</Mono>
            <CP rule="warmth" s={{ borderLeft:"2px solid #555", padding:"4px 6px" }}>
              <span style={{ fontSize:9.5 }}>Đau 4 — hôm nay chuyển sang isometric. Không bỏ bài.</span>
            </CP>
            <div style={{ background:W.bg, border:`1px solid ${W.s300}`, borderRadius:5, padding:"5px 7px" }}>
              <Mono s={{ display:"block", marginBottom:2 }}>Bài thay thế:</Mono>
              <CP rule="protocol" s={{ border:"none", background:"none", padding:0 }}>
                <span style={{ fontSize:9, fontWeight:600 }}>Isometric hip hold · 3' · Nằm ngửa</span>
              </CP>
            </div>
            <Mono s={{ color:W.s400, fontSize:6.5 }}>Pain 4 → isometric · Pain 5 → nghỉ hoàn toàn</Mono>
          </div>
          {/* Tendon track */}
          <div style={{ background:W.s200, border:`1.5px solid ${W.s500}`, borderRadius:7, padding:8, display:"flex", flexDirection:"column", gap:5 }}>
            <div style={{ background:W.s500, borderRadius:4, padding:"2px 6px", alignSelf:"flex-start" }}>
              <Mono s={{ fontSize:6.5, color:W.bg }}>Tendon track ✓</Mono>
            </div>
            <Mono s={{ fontSize:6.5, color:W.s600 }}>Achilles / Plantar / Tennis elbow</Mono>
            <CP rule="insight" s={{ borderLeft:"2px solid #333", padding:"4px 6px" }}>
              <span style={{ fontSize:9.5 }}>Đau 3–4 khi hạ gót = working signal. Gân đang được kích thích đúng cách. Tiếp tục.</span>
            </CP>
            <div style={{ background:W.bg, border:`1px solid ${W.s300}`, borderRadius:5, padding:"5px 7px" }}>
              <Mono s={{ display:"block", marginBottom:2 }}>Bài giữ nguyên:</Mono>
              <CP rule="protocol" s={{ border:"none", background:"none", padding:0 }}>
                <span style={{ fontSize:9, fontWeight:600 }}>Alfredson eccentric · Set A + B · Tiếp tục</span>
              </CP>
            </div>
            <Mono s={{ color:W.s600, fontSize:6.5 }}>Pain 3–4 = tiếp tục · Pain 5 = giảm range · KHÔNG dừng</Mono>
          </div>
        </div>
        <div style={{ background:W.s100, border:`1px dashed ${W.s300}`, borderRadius:5, padding:"4px 8px" }}>
          <Mono>Logic: condition_track từ profile → bifurcate response. 1 check-in screen, 2 AI response paths.</Mono>
        </div>
      </div>
    )
  },

  SMSK04: {
    label:"Phase Gate — Phase 2 Locked",
    phase:"loop",
    note:"Trigger: user hoàn thành đủ Phase 1, app detect xem đã đáp ứng phase unlock criteria chưa. Nếu chưa → hiển thị screen này. Tone: matter-of-fact, không phạt user — explain clinical reason tại sao Phase 1 quan trọng. Ví dụ điển hình: Rotator cuff — scapula rhythm phải ổn trước khi RC strengthen, nếu không impingement nặng hơn.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:11, gap:8, background:W.bg }}>
        <div style={{ display:"flex", gap:7, alignItems:"center" }}>
          <Box w={22} h={22} s={{ borderRadius:5, flexShrink:0 }}/>
          <div>
            <Mono s={{ display:"block" }}>Tiến độ · Ngày 7</Mono>
            <div style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:11, fontWeight:600, color:W.s700 }}>Đau cổ vai gáy · Rotator Cuff</div>
          </div>
        </div>
        {/* Phase progress */}
        <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:9 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <Mono>Giai đoạn điều trị</Mono>
          </div>
          <div style={{ display:"flex", gap:4 }}>
            {[
              { label:"Phase 1", sub:"Scapular stabilization", done:true, active:false },
              { label:"Phase 2", sub:"RC strengthening", done:false, active:false, locked:true },
              { label:"Phase 3", sub:"Functional", done:false, active:false, locked:true },
            ].map(({label,sub,done,locked})=>(
              <div key={label} style={{ flex:1, background:done?W.s600:W.bg, border:`1.5px solid ${done?W.s600:locked?W.s200:W.s400}`, borderRadius:6, padding:"6px 5px", textAlign:"center", position:"relative" }}>
                {locked && (
                  <div style={{ position:"absolute", top:-6, right:-3, background:W.s200, border:`1px solid ${W.s300}`, borderRadius:99, padding:"1px 5px" }}>
                    <Mono s={{ fontSize:6, color:W.s500 }}>LOCKED</Mono>
                  </div>
                )}
                <Mono s={{ color:done?W.bg:W.s500, fontWeight:done?"700":"400" }}>{label}</Mono>
                <Mono s={{ color:done?W.s200:W.s400, fontSize:6.5, display:"block", marginTop:1 }}>{sub}</Mono>
              </div>
            ))}
          </div>
        </div>
        {/* Clinical reason — key content */}
        <CP rule="honest" s={{ borderLeft:"3px solid #444" }}>
          Scapula rhythm chưa đúng — nếu bắt đầu RC strengthen bây giờ, cơ sai sẽ compensate và impingement tệ hơn. Phase 1 thêm vài ngày nữa.
        </CP>
        <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:9 }}>
          <Mono s={{ display:"block", marginBottom:5 }}>Bài Phase 1 hôm nay</Mono>
          <CP rule="protocol" s={{ border:"none", background:"none", padding:0 }}>
            <span style={{ fontWeight:600 }}>Serratus anterior wall push-up plus</span>
            <span style={{ color:W.s400 }}> · 3 set × 12 reps · Đứng</span>
          </CP>
        </div>
        <div style={{ background:W.s100, border:`1px dashed ${W.s300}`, borderRadius:5, padding:"4px 8px" }}>
          <Mono>Unlock criteria: pain ≤2 sustained 5 days + correct movement quality (self-reported)</Mono>
        </div>
        <CpBtn fill>Làm bài Phase 1 →</CpBtn>
      </div>
    )
  },

  // ── LIFESTYLE LAYER SCREENS ──────────────────────────────────────────────────

  SLS01: {
    label:"Lifestyle Insight — Triggered in Check-in",
    phase:"loop",
    note:"Lifestyle layer KHÔNG phải tab riêng. Xuất hiện như 1 card bổ sung bên trong check-in response — chỉ khi pattern detected. Trigger ví dụ: stress 4+ AND pain không giảm sau 2 ngày → cortisol insight. Tone: data + implication, không instruction. Rule: KHÔNG dùng 'bạn nên' hay 'bạn cần'. User quyết định làm gì.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:11, gap:7, background:W.bg }}>
        <Mono s={{ display:"block" }}>Check-in · Ngày 9 · Pattern detected</Mono>
        {/* Standard check-in response */}
        <div style={{ display:"flex", gap:7, alignItems:"flex-start" }}>
          <Box w={22} h={22} s={{ borderRadius:5, flexShrink:0, marginTop:2 }}/>
          <div style={{ flex:1, display:"flex", flexDirection:"column", gap:5 }}>
            <CP rule="dry">
              Mức 3 — ổn để làm bài. Kéo giãn cơ hông · 5 phút · Tại bàn.
            </CP>
            {/* Exercise card */}
            <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:6, padding:"6px 8px", display:"flex", gap:7, alignItems:"center" }}>
              <div style={{ width:32, height:32, background:W.s200, borderRadius:4, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ width:0, height:0, borderTop:"5px solid transparent", borderBottom:"5px solid transparent", borderLeft:`8px solid ${W.s500}`, marginLeft:2 }}/>
              </div>
              <CP rule="protocol" s={{ flex:1, border:"none", background:"none", padding:0 }}>
                <span style={{ fontWeight:600 }}>Kéo giãn cơ hông</span>
                <span style={{ color:W.s400 }}> · 5' · Tại bàn</span>
              </CP>
            </div>
          </div>
        </div>
        {/* Lifestyle insight card — triggered, embedded */}
        <div style={{ background:W.s150, border:`1.5px solid ${W.s500}`, borderRadius:7, padding:9 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
            <Mono s={{ color:W.s600 }}>Pattern nhận ra</Mono>
            <div style={{ background:W.s200, border:`1px solid ${W.s400}`, borderRadius:99, padding:"1px 7px" }}>
              <Mono s={{ fontSize:6.5 }}>lifestyle · triggered</Mono>
            </div>
          </div>
          <CP rule="pattern" s={{ borderLeft:"3px solid #444", marginBottom:6 }}>
            3 ngày qua: stress 4+ + lưng không giảm. Cortisol làm cơ cơ lưng co thắt — đây có thể là biến số bị bỏ qua.
          </CP>
          <div style={{ background:W.bg, border:`1px solid ${W.s300}`, borderRadius:5, padding:"5px 8px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <CP rule="action" s={{ border:"none", background:"none", padding:0 }}>
              <span style={{ fontSize:10 }}>+ 5' breathing vào cuối bài hôm nay</span>
            </CP>
            <div style={{ height:22, padding:"0 8px", background:W.s200, border:`1px solid ${W.s300}`, borderRadius:99, display:"flex", alignItems:"center" }}>
              <Mono>Thêm vào →</Mono>
            </div>
          </div>
        </div>
        <div style={{ background:W.s100, border:`1px dashed ${W.s300}`, borderRadius:5, padding:"4px 8px" }}>
          <Mono>Trigger: stress ≥4 AND pain delta 0 sau 2 ngày · Pattern-based, không scheduled · Dismiss luôn available</Mono>
        </div>
      </div>
    )
  },

  SLS02: {
    label:"Weekly Pattern — Lifestyle Link",
    phase:"progress",
    note:"Xuất hiện trong tab Tiến triển vào Chủ nhật, sau khi có ≥14 ngày data. Lifestyle insight ở đây là pattern-level — không phải daily trigger. Format: summary card + 1 pattern observation. Lifestyle insight được EMBED vào progress tab, không phải separate section. Rule: neutral observation, không prescribe.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", background:W.bg, overflow:"hidden" }}>
        <div style={{ padding:"9px 11px 0" }}>
          <Mono s={{ display:"block", marginBottom:3 }}>Tiến triển · Chủ nhật · Tuần 3</Mono>
        </div>
        <div style={{ padding:"0 11px", flex:1, display:"flex", flexDirection:"column", gap:6, overflow:"auto" }}>
          {/* Pain chart */}
          <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:9 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <Mono>14 ngày</Mono>
              <CP rule="pattern" s={{ border:"none", background:"none", padding:0 }}>
                <span style={{ fontWeight:700, color:W.s600 }}>↓ −1.8 điểm</span>
              </CP>
            </div>
            <div style={{ display:"flex", gap:2, alignItems:"flex-end", height:38 }}>
              {[4,4,3,4,3,3,2,3,2,3,2,2,2,1].map((v,i)=>(
                <div key={i} style={{ flex:1, background:`rgba(0,0,0,${0.06+v*0.1})`, borderRadius:"2px 2px 0 0", height:`${(v/5)*100}%`, minHeight:3 }}/>
              ))}
            </div>
          </div>
          {/* Weekly summary stats */}
          <div style={{ display:"flex", gap:0, background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, overflow:"hidden" }}>
            {[["5/7","Bài xong"],["83%","Check-in"],["↓1.8","Điểm đau"]].map(([v,l],i)=>(
              <div key={i} style={{ flex:1, padding:"8px 5px", textAlign:"center", borderRight:i<2?`1px solid ${W.s200}`:"none" }}>
                <div style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:13, fontWeight:700, color:W.s700 }}>{v}</div>
                <Mono>{l}</Mono>
              </div>
            ))}
          </div>
          {/* Lifestyle pattern observation */}
          <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:9, borderLeft:"3px solid #444" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
              <Mono s={{ fontWeight:700 }}>Pattern quan sát · tuần 2–3</Mono>
              <div style={{ background:W.s200, border:`1px solid ${W.s300}`, borderRadius:99, padding:"1px 6px" }}>
                <Mono s={{ fontSize:6.5, color:W.s500 }}>lifestyle</Mono>
              </div>
            </div>
            <CP rule="pattern">
              Lưng hay nặng hơn vào ngày có stress ≥3. Cortisol + ngủ ít = tổ hợp phổ biến. Bạn quyết định làm gì với thông tin này.
            </CP>
            <div style={{ display:"flex", gap:5, marginTop:7 }}>
              <Chip>Thêm sleep check-in</Chip>
              <Chip>Thêm stress logging</Chip>
            </div>
          </div>
          {/* Nutrition micro-insight — once per week */}
          <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:9 }}>
            <Mono s={{ display:"block", marginBottom:5 }}>Insight tuần này</Mono>
            <CP rule="insight">
              Gân tái tạo collagen chủ yếu trong deep sleep. Ngủ dưới 6h — recovery chậm không phải bài sai, là thiếu recovery window.
            </CP>
          </div>
        </div>
        <BottomNav active={2}/>
      </div>
    )
  },

  SMSK06: {
    label:"Red Flag — Hard Stop + Referral",
    phase:"edge",
    note:"Trigger: user check-in với các triệu chứng red flag cụ thể (xem list). Tone: CALM + GROUNDED — không alarm, không panic. User cần action rõ ràng, không cần sợ hãi. Rule: fear reduction TRƯỚC, sau đó action cụ thể (không chỉ 'gặp bác sĩ'). 5 red flag categories: Cauda equina, Achilles rupture, Septic joint, VBA insufficiency, Progressive nerve.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:11, gap:8, background:W.bg }}>
        <Mono s={{ display:"block" }}>Edge State · Red Flag Detected</Mono>
        {/* Calm header — không alarm */}
        <div style={{ background:W.s150, border:`1.5px solid ${W.s500}`, borderRadius:8, padding:10 }}>
          <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
            <Box w={22} h={22} s={{ borderRadius:5, flexShrink:0, marginTop:2 }}/>
            <div style={{ flex:1 }}>
              <CP rule="warmth" s={{ borderLeft:"3px solid #555", marginBottom:6 }}>
                Triệu chứng bạn vừa mô tả cần được đánh giá trực tiếp — app không thể làm được việc đó.
              </CP>
              {/* Specific red flag — Cauda equina example */}
              <div style={{ background:W.bg, border:`1px solid ${W.s300}`, borderRadius:6, padding:"6px 8px", marginBottom:6 }}>
                <Mono s={{ display:"block", marginBottom:3, color:W.s600 }}>Nhận ra:</Mono>
                <CP rule="honest" s={{ border:"none", background:"none", padding:0 }}>
                  <span style={{ fontSize:10 }}>Tê vùng bẹn + mất kiểm soát tiểu tiện → có thể là Cauda equina syndrome. Hiếm nhưng cần loại trừ hôm nay.</span>
                </CP>
              </div>
              {/* Clear action */}
              <CP rule="action" s={{ borderLeft:"3px solid #333" }}>
                Đến cấp cứu hôm nay — không phải ngày mai. Không cần hoảng sợ, nhưng không để qua đêm.
              </CP>
            </div>
          </div>
        </div>
        {/* 5 categories reference */}
        <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:9 }}>
          <Mono s={{ display:"block", marginBottom:5 }}>5 Red flag categories · Reference</Mono>
          <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
            {[
              { flag:"Cauda equina", trigger:"Tê bẹn + mất kiểm soát tiểu tiện", action:"Cấp cứu hôm nay" },
              { flag:"Achilles rupture", trigger:"Tiếng 'bụp' + không đứng mũi chân", action:"Cấp cứu hôm nay" },
              { flag:"Septic joint", trigger:"Sốt + đau khớp vai đột ngột", action:"Đừng để qua đêm" },
              { flag:"VBA insufficiency", trigger:"Chóng mặt + mờ mắt khi xoay cổ", action:"Ngừng xoay cổ" },
              { flag:"Progressive nerve", trigger:"Tê bì tăng + yếu cơ bàn chân", action:"Cần MRI + bác sĩ" },
            ].map(({flag,trigger,action})=>(
              <div key={flag} style={{ display:"flex", gap:6, padding:"3px 0", borderBottom:`1px solid ${W.s100}` }}>
                <Mono s={{ minWidth:90, color:W.s600 }}>{flag}</Mono>
                <Mono s={{ flex:1, color:W.s400 }}>{trigger}</Mono>
                <Mono s={{ color:W.s700, fontWeight:"700" }}>{action}</Mono>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", gap:7 }}>
          <CpBtn s={{ flex:1 }}>Triệu chứng khác →</CpBtn>
          <CpBtn fill s={{ flex:1 }}>Tôi hiểu →</CpBtn>
        </div>
        <div style={{ background:W.s100, border:`1px dashed ${W.s300}`, borderRadius:5, padding:"4px 8px" }}>
          <Mono>Tone rule: Calm + grounded. Không alarm. Fear reduction line 1. Action cụ thể line 2.</Mono>
        </div>
      </div>
    )
  },

  // ── PHASE 7 ──────────────────────────────────────────────────────────────────

  S21: {
    label:"Empty States — 6 variants",
    phase:"edge",
    note:"Không 'No data yet' generic. Mỗi state có copy specific + anticipation.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:11, gap:5, background:W.bg }}>
        <Mono s={{ display:"block", marginBottom:3 }}>Empty States · 6 variants</Mono>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, flex:1 }}>
          {[
            { icon:"○", l:"No data", copy:"Check-in 7 ngày để thấy pattern. Chưa đủ data.", cta:"Check-in hôm nay →" },
            { icon:"▷", l:"No exercise", copy:"Chưa có bài hôm nay. Làm được trước bữa sáng.", cta:"Xem bài →" },
            { icon:"□", l:"No history", copy:"Lịch sử bắt đầu từ check-in đầu tiên.", cta:null },
            { icon:"◇", l:"No condition", copy:"Thêm vùng đau để theo dõi thêm.", cta:"Thêm vùng →" },
            { icon:"?", l:"Insight N/A", copy:"Cần thêm 2 ngày check-in để thấy pattern.", cta:null },
            { icon:"⊘", l:"Offline", copy:"Bài tập vẫn dùng được. Sẽ đồng bộ khi có mạng.", cta:null },
          ].map((s,i)=>(
            <div key={i} style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:9, display:"flex", flexDirection:"column", gap:5 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontFamily:"monospace", fontSize:16, color:W.s400 }}>{s.icon}</span>
                <Mono>{s.l}</Mono>
              </div>
              <CP s={{ border:"none", background:"none", padding:0 }}>{s.copy}</CP>
              {s.cta && <CpBtn small s={{ height:26, borderRadius:99 }}>{s.cta}</CpBtn>}
            </div>
          ))}
        </div>
      </div>
    )
  },

  S22: {
    label:"Error States — 4 variants",
    phase:"edge",
    note:"Offline graceful. Fallback luôn available. Không alarm.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:11, gap:6, background:W.bg }}>
        <Mono s={{ display:"block", marginBottom:2 }}>Error States · 4 variants</Mono>
        {[
          { sev:"amber", l:"Sync failed", copy:"Check-in đã lưu — sẽ đồng bộ khi có mạng.", cta:null },
          { sev:"dark",  l:"Server error", copy:"Lỗi kết nối. Bài tập vẫn dùng được offline.", cta:"Thử lại" },
          { sev:"amber", l:"Form incomplete", copy:"Cần chọn ít nhất 1 vùng đau để tiếp tục.", cta:null },
          { sev:"amber", l:"Video failed", copy:"Video không tải được. Xem hướng dẫn bằng chữ.", cta:"Xem bằng chữ →" },
        ].map((e,i)=>(
          <div key={i} style={{ background:W.s100, border:`1px solid ${e.sev==="dark"?W.s500:W.s300}`, borderRadius:7, padding:10 }}>
            <div style={{ display:"flex", gap:7, alignItems:"flex-start" }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:e.sev==="dark"?W.s600:W.s400, flexShrink:0, marginTop:4 }}/>
              <div style={{ flex:1 }}>
                <Mono s={{ display:"block", marginBottom:4, color:e.sev==="dark"?W.s600:W.s500 }}>{e.l}</Mono>
                <CP s={{ border:"none", background:"none", padding:0, marginBottom:e.cta?6:0 }}>{e.copy}</CP>
                {e.cta && <CpBtn small s={{ height:25, width:120, borderRadius:99 }}>{e.cta}</CpBtn>}
              </div>
            </div>
          </div>
        ))}
        <div style={{ background:W.s100, border:`1px dashed ${W.s300}`, borderRadius:6, padding:"6px 9px" }}>
          <Mono>Loading states: skeleton / spinner / typing dots</Mono>
        </div>
      </div>
    )
  },

  S23: {
    label:"Hồ sơ Tab",
    phase:"edge",
    note:"Conditions managed. Notif settings. No social. Private by design.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", background:W.bg, overflow:"hidden" }}>
        <div style={{ padding:"9px 11px 0" }}>
          <Mono s={{ display:"block", marginBottom:3 }}>Hồ sơ</Mono>
        </div>
        <div style={{ padding:"0 11px", flex:1, display:"flex", flexDirection:"column", gap:7, overflow:"auto" }}>
          <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:10 }}>
            <Mono s={{ display:"block", marginBottom:7 }}>Vùng đau đang theo dõi</Mono>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
              <Chip selected>Lưng / Thắt lưng</Chip>
              <Chip selected>Cổ / Vai / Gáy</Chip>
              <Chip>+ Thêm vùng</Chip>
            </div>
          </div>
          <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:10 }}>
            <Mono s={{ display:"block", marginBottom:7 }}>Thông báo</Mono>
            {[["Nhắc sáng (7am)","on"],["Nhắc sau họp (2pm)","on"],["Nhắc tối (10pm)","off"]].map(([l,v])=>(
              <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:`1px solid ${W.s100}` }}>
                <span style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:11, color:W.s600 }}>{l}</span>
                <div style={{ width:30, height:15, borderRadius:99, background:v==="on"?W.s500:W.s200, border:`1px solid ${v==="on"?W.s600:W.s300}` }}/>
              </div>
            ))}
          </div>
          <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:10 }}>
            <Mono s={{ display:"block", marginBottom:5 }}>Tài khoản</Mono>
            <CP s={{ border:"none", background:"none", padding:0, marginBottom:7 }}>
              <span style={{ color:W.s400, fontSize:10 }}>1 năm · hết hạn tháng 3 / 2027</span>
            </CP>
            <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
              <div style={{ height:30, border:`1px solid ${W.border}`, borderRadius:5, display:"flex", alignItems:"center", padding:"0 9px" }}>
                <span style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:10, color:W.s500 }}>nguyenvana@gmail.com</span>
              </div>
              <div style={{ display:"flex", gap:5 }}>
                <div style={{ flex:1, height:28, border:`1px solid ${W.border}`, borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:9, color:W.s500 }}>Đăng xuất</span>
                </div>
                <div style={{ flex:1, height:28, border:`1px solid ${W.border}`, borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:9, color:W.s500 }}>Xuất dữ liệu</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <BottomNav active={3}/>
      </div>
    )
  },

  S24: {
    label:"Exit Exercise Modal",
    phase:"edge",
    note:"Bottom sheet. 2 options. 'Tiến độ sẽ không được lưu.' Không full-screen.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", background:W.bg, position:"relative", overflow:"hidden" }}>
        <div style={{ flex:1, background:W.s200, display:"flex", alignItems:"center", justifyContent:"center", opacity:0.4 }}>
          <Mono>[Exercise screen — dimmed]</Mono>
        </div>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, background:W.bg, borderRadius:"12px 12px 0 0", border:`1px solid ${W.border}`, padding:"18px 14px 22px" }}>
          <div style={{ textAlign:"center", marginBottom:13 }}>
            <CP rule="honest" s={{ border:"none", background:"none", padding:0, marginBottom:5 }}>
              <span style={{ fontWeight:700, fontSize:12 }}>Thoát bài?</span>
            </CP>
            <CP s={{ border:"none", background:"none", padding:0 }}>
              <span style={{ color:W.s400, fontSize:10 }}>Tiến độ sẽ không được lưu.</span>
            </CP>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
            <CpBtn fill>Tiếp tục bài tập</CpBtn>
            <CpBtn>Thoát — lưu lần sau</CpBtn>
          </div>
        </div>
      </div>
    )
  },

  S25: {
    label:"Adaptive Protocol",
    phase:"edge",
    note:"Trigger: 10 ngày không thay đổi. App đề nghị — không phải user request. Thẳng.",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:11, gap:8, background:W.bg }}>
        <Mono s={{ display:"block" }}>Ngày 10 · Adaptive Protocol</Mono>
        <div style={{ background:W.s150, border:`1px solid ${W.border}`, borderRadius:7, padding:9 }}>
          <Mono s={{ display:"block", marginBottom:5 }}>10 ngày gần nhất</Mono>
          <div style={{ display:"flex", gap:2, alignItems:"flex-end", height:28, marginBottom:5 }}>
            {[3,3,3,3,2,3,3,3,3,3].map((v,i)=>(
              <div key={i} style={{ flex:1, background:`rgba(0,0,0,${v*0.09})`, borderRadius:"2px 2px 0 0", height:`${v*28}%`, minHeight:4 }}/>
            ))}
          </div>
          <Mono>Không thay đổi sau 10 ngày</Mono>
        </div>
        <div style={{ display:"flex", gap:7, alignItems:"flex-start" }}>
          <Box w={22} h={22} s={{ borderRadius:5, flexShrink:0, marginTop:2 }}/>
          <CP rule="honest" s={{ flex:1, borderLeft:"3px solid #444" }}>
            Bài hiện tại chưa thay đổi sau 10 ngày — thử cách khác không?
          </CP>
        </div>
        <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:9 }}>
          <Mono s={{ display:"block", marginBottom:5 }}>Protocol mới · preview</Mono>
          <CP rule="protocol">
            <span style={{ fontWeight:600 }}>Kích hoạt cơ hông sâu</span>
            <span style={{ color:W.s400 }}> · 6 phút · Nằm sấp</span>
          </CP>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          <CpBtn fill>Thử protocol mới →</CpBtn>
          <CpBtn>Tiếp tục bài cũ</CpBtn>
        </div>
      </div>
    )
  },

  // ══ GAP PATCH v1.3 → v1.4 ══════════════════════════════════════════════════
  // S04B REMOVED: merged into S04A as tab toggle [Tên bệnh | Mô tả triệu chứng]
  // See S04A note + render for full spec. Routing: S03b Path A → S04A (both tabs).

  // [GAP 2] SMSK08 — Safety Warning Modal (1-time, onboarding)
  SMSK08: {
    label:"Safety Warning — Drug Interaction Modal",
    phase:"onboard",
    note:"Trigger: user có #16 Achilles → Fluoroquinolone warning. Cũng trigger cho cortisone mention và NSAIDs long-term. Xuất hiện 1 lần duy nhất trong onboarding sau S04C. Modal bắt buộc: không thể dismiss bằng tap outside — chỉ [Đã hiểu] button. KHÔNG repeat sau đó. Safety-critical, không phải lifestyle advice. [G22]",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", background:W.s600, position:"relative" }}>
        {/* Dimmed background — exercise screen behind */}
        <div style={{ flex:1, opacity:0.25, padding:11 }}>
          <Mono s={{ color:W.bg }}>Onboarding · đang tiến hành...</Mono>
          <div style={{ marginTop:8, height:60, background:W.s400, borderRadius:7 }}/>
        </div>
        {/* Modal */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, background:W.bg, borderRadius:"12px 12px 0 0", padding:14, display:"flex", flexDirection:"column", gap:10, boxShadow:"0 -4px 20px rgba(0,0,0,0.15)" }}>
          <div style={{ width:32, height:3, background:W.s300, borderRadius:99, alignSelf:"center", marginBottom:2 }}/>
          <div style={{ background:W.s700, borderRadius:6, padding:"5px 9px", alignSelf:"flex-start" }}>
            <Mono s={{ color:W.bg }}>Thông tin cần biết</Mono>
          </div>
          <CP rule="honest" s={{ borderLeft:"3px solid #333" }}>
            Nếu bác sĩ kê <span style={{ fontWeight:700 }}>Ciprofloxacin hoặc Levofloxacin</span> trong thời gian điều trị gân Achilles, báo họ bạn đang điều trị — thuốc này làm yếu cấu trúc gân, tăng nguy cơ đứt.
          </CP>
          <CP s={{ borderLeft:"2px solid #AAA" }}>
            <span style={{ color:W.s500, fontSize:10 }}>Không phải lo xa — là thông tin thực tế. FitWell không kê đơn hay thay thế bác sĩ.</span>
          </CP>
          <CpBtn fill>Đã hiểu →</CpBtn>
          <div style={{ background:W.s100, border:`1px dashed ${W.s300}`, borderRadius:5, padding:"4px 7px" }}>
            <Mono>Dismiss only via button — không tap outside. Không xuất hiện lần 2. Variants: cortisone / NSAIDs. [G22]</Mono>
          </div>
        </div>
      </div>
    )
  },

  // [GAP 5] S12b — Check-in với Free-text Field (G24 variant)
  S12b: {
    label:"Check-in + Free-text Field (G24 variant)",
    phase:"loop",
    note:"Variant của S12 — thêm optional free-text field sau khi user tap pain level. Field xuất hiện dưới pain selector, không block flow. Max 500 chars. Parser chạy ASYNC sau khi response đã được trả — không tăng latency. Extracted signals (sleep, stress, trigger) → lifestyle events table (G18). Nếu free_text.length < 20 → skip parser. [G24]",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:11, gap:7, background:W.bg }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <Mono s={{ display:"block", marginBottom:3 }}>Check-in · 7:04 SA · Ngày 5</Mono>
            <CP rule="action" s={{ border:"none", background:"none", padding:0 }}>
              <span style={{ fontSize:13, fontWeight:600 }}>Lưng sáng nay thế nào?</span>
            </CP>
          </div>
          <Box w={40} h={18} s={{ borderRadius:3 }}/>
        </div>
        {/* Pain selector */}
        <div style={{ display:"flex", gap:4 }}>
          {[1,2,3,4,5].map(n=>(
            <div key={n} style={{ flex:1, height:44, border:`1.5px solid ${n===3?W.s700:W.border}`, background:n===3?W.s200:W.bg, borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontFamily:"monospace", fontSize:17, fontWeight:700, color:n===3?W.s700:W.s400 }}>{n}</span>
            </div>
          ))}
        </div>
        {/* Optional free-text — appears after pain tap */}
        <div style={{ background:W.s50, border:`1px solid ${W.s300}`, borderRadius:6, padding:"7px 9px" }}>
          <Mono s={{ display:"block", marginBottom:4, color:W.s500 }}>Thêm context? (không bắt buộc)</Mono>
          <div style={{ minHeight:36, background:W.bg, border:`1px solid ${W.s200}`, borderRadius:5, padding:"6px 8px" }}>
            <div style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:11, color:W.s500, fontStyle:"italic" }}>
              Hôm nay họp dài, ngồi từ sáng tới 3 giờ...
            </div>
          </div>
          <div style={{ marginTop:3, display:"flex", justifyContent:"space-between" }}>
            <Mono s={{ color:W.s400, fontSize:6.5 }}>Async parse — không ảnh hưởng tốc độ response</Mono>
            <Mono s={{ color:W.s400 }}>0 / 500</Mono>
          </div>
        </div>
        {/* AI response block */}
        <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:9 }}>
          <Mono s={{ display:"block", marginBottom:5 }}>FitWell · [typing 800ms] · dry · pain 3</Mono>
          <CP rule="dry">
            Mức 3 — ổn để làm bài. Hôm nay: Kéo giãn cơ hông · 5 phút · Tại bàn làm việc.
          </CP>
        </div>
        <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:8, display:"flex", gap:7, alignItems:"center" }}>
          <div style={{ width:38, height:38, background:W.s200, borderRadius:5, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:0, height:0, borderTop:"5px solid transparent", borderBottom:"5px solid transparent", borderLeft:`9px solid ${W.s500}`, marginLeft:2 }}/>
          </div>
          <CP rule="protocol" s={{ flex:1, border:"none", background:"none", padding:0 }}>
            <span style={{ fontWeight:600 }}>Kéo giãn cơ hông</span>
            <span style={{ color:W.s400 }}> · 5 phút · Tại bàn</span>
          </CP>
        </div>
        <div style={{ background:W.s100, border:`1px dashed ${W.s300}`, borderRadius:5, padding:"4px 7px" }}>
          <Mono>Parsed signals (async): trigger_detail, sleep_hours_implied, stress_signal → lifestyle_events if confidence &gt; 0.7. [G24]</Mono>
        </div>
      </div>
    )
  },

  // [GAP 3] SMSK04b — Frozen Shoulder Phase 1 (critical variant)
  SMSK04b: {
    label:"Phase Gate — Frozen Shoulder Phase 1 (NO stretch)",
    phase:"loop",
    note:"Frozen shoulder là condition DUY NHẤT mà Phase 1 (Freezing) có chống chỉ định stretch — ngược hoàn toàn với mọi condition khác. UI KHÔNG hiển thị Phase 2/3, không có stretch option, không có progress bar đến Phase 2. Chỉ có pendulum nhẹ. Designer không được reuse SMSK04 template cho condition này. Timeline 12–24 tháng phải set expectation rõ từ đầu. [Gap 1 patch]",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:11, gap:8, background:W.bg }}>
        <div style={{ display:"flex", gap:7, alignItems:"center" }}>
          <Box w={22} h={22} s={{ borderRadius:5, flexShrink:0 }}/>
          <div>
            <Mono s={{ display:"block" }}>Frozen Shoulder · Ngày 12</Mono>
            <div style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:11, fontWeight:600, color:W.s700 }}>Giai đoạn Freezing · Tháng 1–9</div>
          </div>
        </div>
        {/* Single phase display — no Phase 2 visible */}
        <div style={{ background:W.s150, border:`1.5px solid ${W.s600}`, borderRadius:7, padding:9 }}>
          <Mono s={{ display:"block", marginBottom:5 }}>Giai đoạn điều trị hiện tại</Mono>
          <div style={{ background:W.s600, borderRadius:6, padding:"7px 9px", marginBottom:6 }}>
            <div style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:11, fontWeight:700, color:W.bg }}>Freezing — đang viêm</div>
            <Mono s={{ color:W.s300, display:"block", marginTop:2 }}>Tháng 1–9 · Không có Phase tiếp theo visible</Mono>
          </div>
          <div style={{ background:W.s100, border:`1px dashed ${W.s300}`, borderRadius:5, padding:"4px 7px" }}>
            <Mono s={{ color:W.s600 }}>Phase 2 (Frozen) chỉ xuất hiện khi pain ổn định + range tự mở. Không hiển thị lúc này.</Mono>
          </div>
        </div>
        {/* Critical clinical reason */}
        <CP rule="honest" s={{ borderLeft:"3px solid #222", background:W.s100 }}>
          Giai đoạn đang viêm: stretch mạnh làm tăng viêm, không giảm — ngược với mọi tình trạng khác. Pendulum nhẹ (gravity only) là đúng.
        </CP>
        {/* Protocol — pendulum ONLY, no stretch option */}
        <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:9 }}>
          <Mono s={{ display:"block", marginBottom:5 }}>Bài hôm nay · KHÔNG CÓ STRETCH</Mono>
          <CP rule="protocol" s={{ borderLeft:"3px solid #444" }}>
            <span style={{ fontWeight:600 }}>Pendulum swing</span>
            <span style={{ color:W.s400 }}> · 3 phút · Đứng, cúi nhẹ, để tay thõng tự do</span>
          </CP>
          <div style={{ marginTop:6, background:W.s50, border:`1px dashed ${W.s400}`, borderRadius:5, padding:"4px 7px" }}>
            <Mono s={{ color:W.s600 }}>Gravity only — không dùng tay kéo. Không xuất hiện: towel stretch, cross-body stretch, overhead reach.</Mono>
          </div>
        </div>
        {/* Timeline expectation */}
        <CP s={{ borderLeft:"2px solid #AAA" }}>
          <span style={{ color:W.s500, fontSize:10 }}>Timeline thật: 12–24 tháng tổng. FitWell không hứa ngắn hơn.</span>
        </CP>
        <CpBtn fill>Làm bài hôm nay →</CpBtn>
      </div>
    )
  },

  // [GAP 1] SMSK07 — Assessment Fork Screen (#6b/#10)
  SMSK07: {
    label:"Assessment Fork — Protocol Assignment (#6b / #10)",
    phase:"loop",
    note:"Trigger: user có #6b Thoát vị hoặc #10 Hip flexor, lần đầu vào protocol screen. Mini-test bắt buộc — không thể skip. 2 conditions × 2 path = 4 protocol variants. Kết quả saved, không hỏi lại. Đây là protocol FORK — không phải phase gate — hai path ngược nhau: sai path = protocol làm nặng hơn. [Gap 1 patch]",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:11, gap:8, background:W.bg }}>
        <div style={{ display:"flex", gap:7, alignItems:"center" }}>
          <Box w={22} h={22} s={{ borderRadius:5, flexShrink:0 }}/>
          <div>
            <Mono s={{ display:"block" }}>Trước khi bắt đầu · Một bài test nhỏ</Mono>
            <div style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:11, fontWeight:600, color:W.s700 }}>30 giây — để assign đúng bài cho bạn</div>
          </div>
        </div>
        {/* Condition selector annotation */}
        <div style={{ display:"flex", gap:5 }}>
          {[{id:"#6b Thoát vị",active:true},{id:"#10 Hip flexor",active:false}].map(({id,active})=>(
            <div key={id} style={{ flex:1, padding:"5px 8px", background:active?W.s200:W.s100, border:`1.5px solid ${active?W.s600:W.border}`, borderRadius:6, textAlign:"center" }}>
              <Mono s={{ color:active?W.s700:W.s400 }}>{id}</Mono>
            </div>
          ))}
        </div>
        {/* #6b test — showing active */}
        <div style={{ background:W.s100, border:`1.5px solid ${W.s500}`, borderRadius:7, padding:9 }}>
          <Mono s={{ display:"block", marginBottom:5, color:W.s600 }}>#6b · Direction Test</Mono>
          <CP rule="action" s={{ marginBottom:8 }}>
            Thử nằm sấp, thư giãn 2 phút. Lưng cảm thấy thế nào sau đó?
          </CP>
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <RadioRow selected sub="→ McKenzie protocol (prone press-up · Bird Dog · Glute Bridge)">Nhẹ hơn hoặc không đổi</RadioRow>
            <RadioRow sub="→ Lateral shift protocol (side-gliding — TRÁNH McKenzie)">Nặng hơn</RadioRow>
          </div>
        </div>
        {/* #10 test — collapsed annotation */}
        <div style={{ background:W.s50, border:`1px dashed ${W.s300}`, borderRadius:6, padding:8 }}>
          <Mono s={{ color:W.s500, display:"block", marginBottom:4 }}>#10 · Thomas Test variant:</Mono>
          <CP s={{ border:"none", background:"none", padding:0 }}>
            <span style={{ fontSize:10, color:W.s500 }}>Nằm ngửa, kéo đầu gối về ngực. Chân còn lại: [Tự nổi] → Protocol A Stretch | [Chạm giường] → Protocol B Strengthen. 50% cases là inhibited (yếu), không phải tight — assign sai = không cải thiện.</span>
          </CP>
        </div>
        <CpBtn fill>Xác nhận → bài của bạn →</CpBtn>
        <div style={{ background:W.s100, border:`1px dashed ${W.s300}`, borderRadius:5, padding:"4px 7px" }}>
          <Mono>Result saved → không hỏi lại. Developer: check conditions.assessment_done flag trước khi render protocol. [G23-adjacent, Gap 1 patch]</Mono>
        </div>
      </div>
    )
  },

  // ── PHASE 7 · ADAPTATION VARIANTS (G25) ──────────────────────────────────────

  // [GAP 6a] S25b — Adaptation: Reduce Intensity (joint track pain ≥4 × 5 days)
  S25b: {
    label:"Adaptive Protocol — Reduce Intensity (joint, pain 4+)",
    phase:"edge",
    note:"Trigger: joint track condition, recent_pain_scores[-5:] all ≥4. AI adaptation_signal = 'reduce_intensity'. Khác với S25 (plateau/no-change) — đây là đau CAO liên tục, không phải không thay đổi. App switch protocol sang isometric variant. User không request — app propose. [G25]",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:11, gap:8, background:W.bg }}>
        <Mono s={{ display:"block" }}>Ngày 5 · Adaptive Protocol · Đau 4+ liên tục</Mono>
        <div style={{ background:W.s150, border:`1px solid ${W.border}`, borderRadius:7, padding:9 }}>
          <Mono s={{ display:"block", marginBottom:5 }}>5 ngày gần nhất</Mono>
          <div style={{ display:"flex", gap:2, alignItems:"flex-end", height:28, marginBottom:5 }}>
            {[4,4,5,4,4].map((v,i)=>(
              <div key={i} style={{ flex:1, background:`rgba(0,0,0,${v*0.10})`, borderRadius:"2px 2px 0 0", height:`${v*20}%`, minHeight:4, border:`1px solid rgba(0,0,0,0.1)` }}/>
            ))}
          </div>
          <Mono>Đau 4–5 liên tục — cần giảm load trước</Mono>
        </div>
        <div style={{ display:"flex", gap:7, alignItems:"flex-start" }}>
          <Box w={22} h={22} s={{ borderRadius:5, flexShrink:0, marginTop:2 }}/>
          <CP rule="honest" s={{ flex:1, borderLeft:"3px solid #333" }}>
            5 ngày mức 4–5 — hôm nay chuyển sang isometric. Cơ khớp cần giảm load trước khi tiếp tục bài cũ.
          </CP>
        </div>
        <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:9 }}>
          <Mono s={{ display:"block", marginBottom:5 }}>Isometric variant · hôm nay</Mono>
          <CP rule="protocol" s={{ borderLeft:"3px solid #444" }}>
            <span style={{ fontWeight:600 }}>Dead bug — isometric hold</span>
            <span style={{ color:W.s400 }}> · 5 phút · Nằm ngửa · Giữ 10s × 10 reps</span>
          </CP>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          <CpBtn fill>Làm bài isometric hôm nay →</CpBtn>
          <CpBtn>Tiếp tục bài cũ</CpBtn>
        </div>
        <div style={{ background:W.s100, border:`1px dashed ${W.s300}`, borderRadius:5, padding:"4px 7px" }}>
          <Mono>adaptation_signal: 'reduce_intensity'. Khác S25 (plateau). Return to main protocol khi pain ≤3 × 3 days. [G25]</Mono>
        </div>
      </div>
    )
  },

  // NOTE: S25c (positive_trajectory) removed — no distinct UI pattern.
  // Signal handled as variant within S12 check-in response.
  // See S12 annotation: "positive_trajectory variant: peer-nod tone + progression cue".

  // [GAP 6c] S25d — Adaptation: Post-Flare Recovery
  S25d: {
    label:"Adaptive Protocol — Post-Flare Recovery",
    phase:"edge",
    note:"Trigger: previous score ≥4, current score ≤2 (đột ngột giảm sau flare). adaptation_signal = 'post_flare_recovery'. Khác với positive trajectory: đây là bounce-back sau 1 ngày tệ — không phải trend dài. Protocol nhẹ hơn standard, không phải full intensity. Tone: acknowledge flare đã qua, không ask lý do. [G25]",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:11, gap:8, background:W.bg }}>
        <Mono s={{ display:"block" }}>Check-in · Ngày 7 · Sau flare</Mono>
        <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:9 }}>
          <Mono s={{ display:"block", marginBottom:5 }}>Hôm qua vs hôm nay</Mono>
          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            <div style={{ flex:1, textAlign:"center" }}>
              <div style={{ fontFamily:"monospace", fontSize:24, fontWeight:700, color:W.s600 }}>5</div>
              <Mono>Hôm qua</Mono>
            </div>
            <div style={{ color:W.s400, fontSize:16 }}>→</div>
            <div style={{ flex:1, textAlign:"center" }}>
              <div style={{ fontFamily:"monospace", fontSize:24, fontWeight:700, color:W.s700 }}>2</div>
              <Mono>Hôm nay</Mono>
            </div>
          </div>
        </div>
        <div style={{ display:"flex", gap:7, alignItems:"flex-start" }}>
          <Box w={22} h={22} s={{ borderRadius:5, flexShrink:0, marginTop:2 }}/>
          <CP rule="warmth" s={{ flex:1, borderLeft:"3px solid #444" }}>
            Hôm qua 5, hôm nay 2 — flare qua rồi. Nhẹ thôi hôm nay, không cần full bài.
          </CP>
        </div>
        <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:9 }}>
          <Mono s={{ display:"block", marginBottom:5 }}>Protocol nhẹ · post-flare</Mono>
          <CP rule="protocol" s={{ borderLeft:"2px solid #888" }}>
            <span style={{ fontWeight:600 }}>Cat-cow nhẹ</span>
            <span style={{ color:W.s400 }}> · 3 phút · Tại giường · Không force range</span>
          </CP>
          <div style={{ marginTop:5, background:W.s50, border:`1px dashed ${W.s300}`, borderRadius:5, padding:"4px 7px" }}>
            <Mono>50% volume so với standard protocol. Return full intensity ngày mai nếu pain ≤2.</Mono>
          </div>
        </div>
        <CpBtn fill>Làm bài nhẹ hôm nay →</CpBtn>
        <div style={{ background:W.s100, border:`1px dashed ${W.s300}`, borderRadius:5, padding:"4px 7px" }}>
          <Mono>adaptation_signal: 'post_flare_recovery'. Trigger: prev ≥4 AND curr ≤2. Khác positive_trajectory (trend dài). [G25]</Mono>
        </div>
      </div>
    )
  },

  // ══ D1 / D3 PATCH v1.5 ══════════════════════════════════════════════════════

  // [D3] S29 — Add Condition Modal (inline on S23)
  S29: {
    label:"Add Condition Modal — từ S23 Hồ sơ",
    phase:"edge",
    note:"Trigger: user tap '+ Thêm vùng' trên S23. Modal bottom sheet — KHÔNG navigate away. Search/select condition inline (reuse S04A Tab A list + search). Confirm → condition added → modal dismiss → S23 updated với condition mới. Không hỏi trigger/behavior lại — user đã onboarded. Nếu condition mới cần safety warning (Achilles → SMSK08) → SMSK08 xuất hiện sau modal dismiss. [D3]",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", background:W.s600, position:"relative" }}>
        {/* S23 dimmed behind */}
        <div style={{ flex:1, opacity:0.25, padding:11, display:"flex", flexDirection:"column", gap:5 }}>
          <Mono s={{ color:W.bg }}>Hồ sơ · đang mở...</Mono>
          <div style={{ height:40, background:W.s400, borderRadius:7 }}/>
          <div style={{ height:40, background:W.s400, borderRadius:7 }}/>
        </div>
        {/* Modal */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, background:W.bg, borderRadius:"12px 12px 0 0", padding:13, display:"flex", flexDirection:"column", gap:9, boxShadow:"0 -4px 20px rgba(0,0,0,0.15)" }}>
          <div style={{ width:32, height:3, background:W.s300, borderRadius:99, alignSelf:"center" }}/>
          <CP rule="action" s={{ border:"none", background:"none", padding:0 }}>
            <span style={{ fontWeight:700, fontSize:13 }}>Thêm vùng đau</span>
          </CP>
          {/* Inline search */}
          <div style={{ height:32, background:W.s100, border:`1px solid ${W.border}`, borderRadius:5, display:"flex", alignItems:"center", padding:"0 9px", gap:6 }}>
            <Box w={9} h={9} s={{ borderRadius:"50%", flexShrink:0, background:W.s300, border:"none" }}/>
            <Mono s={{ color:W.s400 }}>Tìm: "đầu gối", "vai", "Achilles"...</Mono>
          </div>
          {/* Condition list — compact */}
          <div style={{ display:"flex", flexDirection:"column", gap:4, maxHeight:120, overflow:"hidden" }}>
            <CheckRow>Viêm gân Achilles</CheckRow>
            <CheckRow>Thoái hóa khớp gối</CheckRow>
            <CheckRow>Đau thần kinh tọa (Sciatica)</CheckRow>
            <CheckRow checked>Hội chứng ống cổ tay</CheckRow>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            <CpBtn s={{ flex:1 }}>Bỏ qua</CpBtn>
            <CpBtn fill s={{ flex:2 }}>Thêm (1) →</CpBtn>
          </div>
          <div style={{ background:W.s100, border:`1px dashed ${W.s300}`, borderRadius:5, padding:"4px 7px" }}>
            <Mono>Confirm → condition added to profile → modal dismiss → S23 re-renders. Nếu condition = Achilles → SMSK08 sau dismiss. Không hỏi trigger/behavior. [D3]</Mono>
          </div>
        </div>
      </div>
    )
  },

  // [D1] S30 — Notification Permission Screen (Web Push request)
  S30: {
    label:"Notification Permission — Web Push Request",
    phase:"onboard",
    note:"Trigger: user tap 'Bật nhắc sáng — 7am' trên S10 (first time). Hiển thị pre-prompt explanation TRƯỚC browser native dialog — để user hiểu tại sao cần permission. Sau khi user tap 'Đồng ý', native browser dialog xuất hiện. 2 outcomes: (A) Granted → confirm + back to S14. (B) Denied → iOS fallback path (in-app banner) + guide user để lại. Không ask lại nếu đã denied — chỉ 1 lần. [D1]",
    render:()=>(
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:14, gap:9, background:W.bg, justifyContent:"space-between" }}>
        <div/>
        <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
          {/* Icon */}
          <div style={{ width:36, height:36, borderRadius:9, background:W.s200, border:`1px solid ${W.s300}`, display:"flex", alignItems:"center", justifyContent:"center", alignSelf:"flex-start" }}>
            <Mono s={{ fontSize:16 }}>🔔</Mono>
          </div>
          <CP rule="action" s={{ border:"none", background:"none", padding:0 }}>
            <span style={{ fontSize:14, fontWeight:700, color:W.s700, lineHeight:1.4, display:"block" }}>FitWell nhắc đúng lúc — bài buổi sáng hiệu quả hơn nhiều.</span>
          </CP>
          <CP rule="honest" s={{ borderLeft:"3px solid #444" }}>
            Nhắc nhở đúng thời điểm là lý do app này work. Không phải để bán thêm thứ gì.
          </CP>
          {/* What they'll get */}
          <div style={{ background:W.s100, border:`1px solid ${W.border}`, borderRadius:7, padding:9, display:"flex", flexDirection:"column", gap:5 }}>
            <Mono s={{ marginBottom:2 }}>Sẽ nhận tối đa 2 thông báo / ngày:</Mono>
            {["Sáng — trước khi đặt chân xuống sàn","Chiều — sau cuộc họp dài"].map(t=>(
              <div key={t} style={{ display:"flex", gap:6, alignItems:"center" }}>
                <div style={{ width:4, height:4, borderRadius:"50%", background:W.s500, flexShrink:0 }}/>
                <CP s={{ border:"none", background:"none", padding:0 }}><span style={{ fontSize:10 }}>{t}</span></CP>
              </div>
            ))}
          </div>
          <CpBtn fill>Đồng ý — bật thông báo</CpBtn>
          <div style={{ textAlign:"center" }}>
            <span style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:10, color:W.s400 }}>Để sau — tôi tự nhớ mở app</span>
          </div>
        </div>
        {/* Denied fallback annotation */}
        <div style={{ background:W.s50, border:`1px dashed ${W.s300}`, borderRadius:6, padding:"7px 9px" }}>
          <Mono s={{ display:"block", marginBottom:4, color:W.s500 }}>Nếu browser denied:</Mono>
          <CP s={{ border:"none", background:"none", padding:0 }}>
            <span style={{ fontSize:10, color:W.s500 }}>Không hỏi lại. Fallback: in-app banner khi mở app (D1 Path B). Hiển thị 1 lần: "Bạn có thể bật lại thông báo trong Settings trình duyệt."</span>
          </CP>
        </div>
      </div>
    )
  },

};

// ── Main ──────────────────────────────────────────────────────────────────────
export default function CopyWireframe() {
  const [active, setActive] = useState("S01");
  const [filterPhase, setFilterPhase] = useState(null);
  const data = SCREENS[active];
  const allIds = Object.keys(SCREENS);
  const visiblePhases = filterPhase ? PHASES.filter(p=>p.id===filterPhase) : PHASES;

  const RULE_LEGEND = [
    { r:"fear",      d:"Fear reduction — normalize dòng 1" },
    { r:"insight",   d:"Nguyên nhân thật — không phải triệu chứng" },
    { r:"protocol",  d:"[Tên bài] · [Thời lượng] · [Địa điểm]" },
    { r:"dry",       d:"Dry tone — daily standard, no warmth" },
    { r:"peer-nod",  d:"Peer approval — milestone only" },
    { r:"pattern",   d:"Neutral observation — không prescribe" },
    { r:"warmth",    d:"Warmth — pain 4–5, flare-up, skip return" },
    { r:"honest",    d:"Thẳng thắn — kể cả khi không có câu đẹp" },
    { r:"zero-guilt",d:"Re-engagement — không guilt, không mention skip" },
    { r:"action",    d:"Copy hành động — rõ ràng, cụ thể" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#F7F7F7", fontFamily:"monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar{height:4px;width:4px;}
        ::-webkit-scrollbar-track{background:#F0F0F0;}
        ::-webkit-scrollbar-thumb{background:#CCC;borderRadius:2px;}
      `}</style>

      {/* Top bar */}
      <div style={{ position:"sticky", top:0, zIndex:100, background:W.bg, borderBottom:`1px solid ${W.border}`, height:46, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontFamily:"monospace", fontSize:12, fontWeight:700, color:W.s900 }}>FITWELL</span>
          <div style={{ width:1, height:14, background:W.s300 }}/>
          <Mono>COPY WIREFRAME v1.6 · 48 SCREENS · MSK + LIFESTYLE + AI + ADAPTATION + WEB · EDS-SYNC</Mono>
        </div>
        <div style={{ display:"flex", gap:2 }}>
          <button onClick={()=>setFilterPhase(null)} style={{ background:!filterPhase?W.s200:"none", border:`1px solid ${!filterPhase?W.s500:W.s200}`, cursor:"pointer", padding:"3px 9px", borderRadius:4, fontSize:8, fontFamily:"monospace", color:!filterPhase?W.s700:W.s500 }}>ALL</button>
          {PHASES.map(p=>(
            <button key={p.id} onClick={()=>setFilterPhase(filterPhase===p.id?null:p.id)} style={{ background:filterPhase===p.id?W.s200:"none", border:`1px solid ${filterPhase===p.id?W.s500:W.s200}`, cursor:"pointer", padding:"3px 7px", borderRadius:4, fontSize:8, fontFamily:"monospace", color:filterPhase===p.id?W.s700:W.s500, whiteSpace:"nowrap" }}>
              {p.label.split("·")[1]?.trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Copy rule legend */}
      <div style={{ background:W.bg, borderBottom:`1px solid ${W.border}`, padding:"7px 24px", display:"flex", gap:4, flexWrap:"wrap", alignItems:"center" }}>
        <Mono s={{ color:W.s600, marginRight:4 }}>Copy rules:</Mono>
        {RULE_LEGEND.map(({r,d})=>(
          <div key={r} style={{ display:"flex", alignItems:"center", gap:4, background:W.s100, border:`1px solid ${W.border}`, borderRadius:99, padding:"2px 8px" }}>
            <div style={{ width:5, height:5, borderRadius:99, background:W.cpBorder }}/>
            <span style={{ fontFamily:"monospace", fontSize:7, color:W.s600 }}>
              <span style={{ fontWeight:700 }}>[{r}]</span>
              <span style={{ color:W.s400 }}> {d}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Phase strip */}
      <div style={{ background:W.bg, borderBottom:`1px solid ${W.border}`, padding:"7px 24px", display:"flex", gap:3, alignItems:"center", flexWrap:"wrap" }}>
        {PHASES.map((p,pi)=>(
          <div key={p.id} style={{ display:"flex", alignItems:"center", gap:3 }}>
            <div style={{ border:`1px solid ${W.s400}`, borderRadius:99, padding:"2px 9px" }}>
              <Mono s={{ color:W.s600 }}>{p.label} ({p.screens.length})</Mono>
            </div>
            {pi<PHASES.length-1 && <span style={{ fontSize:9, color:W.s300 }}>→</span>}
          </div>
        ))}
      </div>

      {/* Canvas */}
      <div style={{ overflowX:"auto", padding:"20px 24px 8px" }}>
        <div style={{ display:"flex", gap:0, alignItems:"flex-start", minWidth:"max-content" }}>
          {visiblePhases.map((phase,pIdx)=>{
            const allVisible = PHASES.filter(p=>!filterPhase||p.id===filterPhase);
            return (
              <div key={phase.id} style={{ display:"flex", alignItems:"flex-start" }}>
                <div>
                  <div style={{ paddingLeft:10, paddingBottom:9 }}>
                    <Mono s={{ fontWeight:700, color:W.s500 }}>{phase.label}</Mono>
                  </div>
                  <div style={{ display:"flex", gap:11, paddingLeft:10 }}>
                    {phase.screens.map((id,si)=>(
                      <div key={id} style={{ display:"flex", alignItems:"center" }}>
                        <Phone id={id} isActive={active===id} onClick={()=>setActive(id)}>
                          {SCREENS[id].render()}
                        </Phone>
                        {si<phase.screens.length-1 && (
                          <div style={{ width:18, display:"flex", alignItems:"center", justifyContent:"center", paddingBottom:44 }}>
                            <span style={{ fontSize:9, color:W.s300 }}>→</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Labels */}
                  <div style={{ display:"flex", gap:11, paddingLeft:10, paddingTop:7 }}>
                    {phase.screens.map((id,si)=>(
                      <div key={id} style={{ display:"flex", alignItems:"flex-start" }}>
                        <div onClick={()=>setActive(id)} style={{ width:176, cursor:"pointer", padding:"4px 6px", borderRadius:4, background:active===id?W.s200:W.s100, border:`1px solid ${active===id?W.s500:W.border}` }}>
                          <Mono s={{ color:active===id?W.s700:W.s600, fontWeight:active===id?"700":"400" }}>{SCREENS[id].label}</Mono>
                        </div>
                        {si<phase.screens.length-1 && <div style={{ width:18 }}/>}
                      </div>
                    ))}
                  </div>
                </div>
                {pIdx<allVisible.length-1 && (
                  <div style={{ width:30, display:"flex", alignItems:"center", justifyContent:"center", paddingBottom:56, paddingTop:24 }}>
                    <span style={{ fontSize:13, color:W.s300 }}>⟶</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      <div style={{ margin:"14px 24px 12px", background:W.bg, border:`1px solid ${W.border}`, borderRadius:8, padding:18, display:"grid", gridTemplateColumns:"200px 1fr 180px", gap:18 }}>
        <div>
          <Mono s={{ fontWeight:700, color:W.s700, fontSize:9 }}>{active} · {data.phase?.toUpperCase()}</Mono>
          <div style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:12, fontWeight:700, color:W.s900, margin:"6px 0 7px", lineHeight:1.4 }}>{data.label}</div>
          <div style={{ fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:10, color:W.s500, lineHeight:1.7 }}>{data.note}</div>
        </div>
        <div>
          <Mono s={{ display:"block", marginBottom:8, fontWeight:700 }}>Copy rules applied — {active}</Mono>
          <div style={{ background:W.cpBg, border:`1px solid ${W.cpBorder}`, borderRadius:6, padding:"8px 10px" }}>
            <div style={{ fontFamily:"monospace", fontSize:8, color:W.s500, lineHeight:2 }}>
              Tất cả copy trên màn hình này tuân theo:<br/>
              • Max 20 từ/câu. Hầu hết 8–14 từ.<br/>
              • Không dấu ! bao giờ. Không emoji.<br/>
              • Không mở đầu bằng "Tôi hiểu..." hoặc "Chào bạn".<br/>
              • Không kết thúc bằng câu sáo rỗng "Cố lên nhé!".<br/>
              • Protocol: [Tên] · [Thời lượng] · [Địa điểm].<br/>
              • Số cụ thể: "5 phút", không "vài phút".<br/>
              • Blacklist: Tuyệt vời / Xuất sắc / Kiên trì / Streak / Healing
            </div>
          </div>
        </div>
        <div>
          <Mono s={{ display:"block", marginBottom:7, fontWeight:700 }}>All 39 screens</Mono>
          <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
            {allIds.map(id=>(
              <button key={id} onClick={()=>setActive(id)} style={{ background:active===id?W.s200:"none", border:`1px solid ${active===id?W.s500:W.s200}`, borderRadius:4, padding:"3px 6px", cursor:"pointer", textAlign:"left", display:"flex", gap:6 }}>
                <span style={{ fontFamily:"monospace", fontSize:7.5, fontWeight:700, color:W.s500, minWidth:24 }}>{id}</span>
                <span style={{ fontFamily:"monospace", fontSize:7.5, color:active===id?W.s900:W.s500, lineHeight:1.3 }}>{SCREENS[id].label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Phase summary */}
      <div style={{ margin:"0 24px 32px", display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:7 }}>
        {PHASES.map(p=>(
          <div key={p.id} style={{ background:W.bg, border:`1px solid ${W.border}`, borderRadius:7, padding:"9px 10px" }}>
            <Mono s={{ display:"block", marginBottom:3, fontWeight:700 }}>{p.label.split("·")[1]?.trim()}</Mono>
            <div style={{ fontFamily:"monospace", fontSize:17, fontWeight:700, color:W.s700 }}>{p.screens.length}</div>
            <Mono s={{ color:W.s400 }}>screens</Mono>
          </div>
        ))}
      </div>
    </div>
  );
}
