// FieldReady Academy — Inline SVG teaching diagrams (no external files)
let __mcU = 0;
const mcU = (p) => p + '-' + (++__mcU);
window.MC_DIAGRAMS = {
  sfold: () => `
  <svg viewBox="0 0 520 220" class="mc-svg" role="img" aria-label="S-stroke vs scrubbing">
    <text x="130" y="20" class="t-ok" text-anchor="middle">✓ CORRECT: Unidirectional S-strokes</text>
    <rect x="20" y="32" width="220" height="150" rx="10" class="surf"/>
    <path d="M40 50 H220 Q232 50 232 62 Q232 74 220 74 H40 Q28 74 28 86 Q28 98 40 98 H220 Q232 98 232 110 Q232 122 220 122 H40 Q28 122 28 134 Q28 146 40 146 H220" class="stroke-ok"/>
    <polygon points="220,140 232,146 220,152" fill="#4ade80"/>
    <text x="130" y="205" class="cap" text-anchor="middle">Top → bottom, clean → dirty, overlap each pass</text>
    <text x="390" y="20" class="t-bad" text-anchor="middle">✗ WRONG: Back-and-forth scrubbing</text>
    <rect x="280" y="32" width="220" height="150" rx="10" class="surf"/>
    <path d="M300 60 L480 90 L310 120 L470 70 L300 150 L480 140 L320 80" class="stroke-bad"/>
    <circle cx="350" cy="100" r="7" fill="#f87171"/><circle cx="430" cy="125" r="6" fill="#f87171"/><circle cx="400" cy="65" r="5" fill="#f87171"/>
    <text x="390" y="205" class="cap" text-anchor="middle">Redeposits soil &amp; spreads MRSA / C. diff</text>
  </svg>`,

  fold16: () => {
    let cells = "";
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) {
      const n = r * 4 + c + 1;
      cells += `<rect x="${40 + c * 52}" y="${40 + r * 52}" width="48" height="48" rx="5" class="${n <= 3 ? "used" : "fresh"}"/><text x="${64 + c * 52}" y="${70 + r * 52}" text-anchor="middle" class="num">${n}</text>`;
    }
    return `
  <svg viewBox="0 0 520 190" class="mc-svg" role="img" aria-label="16-surface microfiber fold">
    <text x="20" y="22" class="t-ok">Fold in half 3 times → 8 panels × 2 sides = 16 clean faces</text>
    ${cells}
    <text x="40" y="170" class="cap">■ Used faces (1–3)   □ Fresh faces — rotate to a new face for every surface</text>
    <g transform="translate(320,40)">
      <rect width="170" height="104" rx="8" class="surf"/>
      <text x="85" y="26" text-anchor="middle" class="cap">Example sequence</text>
      <text x="14" y="48" class="small">Face 1 → Door handle</text>
      <text x="14" y="66" class="small">Face 2 → Light switch</text>
      <text x="14" y="84" class="small">Face 3 → Overbed table</text>
      <text x="14" y="100" class="small">Face 4 → Bed rail (L)</text>
    </g>
  </svg>`;
  },

  outsideIn: () => { const ah = mcU('ah'); return `
  <svg viewBox="0 0 520 220" class="mc-svg" role="img" aria-label="Outside-in spill containment">
    <text x="20" y="22" class="t-ok">Outside-In Spill Containment (perimeter first, work toward center)</text>
    <circle cx="150" cy="120" r="80" class="ring1"/>
    <circle cx="150" cy="120" r="55" class="ring2"/>
    <circle cx="150" cy="120" r="30" fill="#991b1b" opacity="0.9"/>
    <text x="150" y="125" text-anchor="middle" class="num">SPILL</text>
    ${[0, 60, 120, 180, 240, 300].map(a => {
      const r1 = 95, r2 = 40, rad = a * Math.PI / 180;
      return `<line x1="${150 + r1 * Math.cos(rad)}" y1="${120 + r1 * Math.sin(rad)}" x2="${150 + r2 * Math.cos(rad)}" y2="${120 + r2 * Math.sin(rad)}" class="arrow" marker-end="url(#${ah})"/>`;
    }).join("")}
    <defs><marker id="${ah}" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#38bdf8"/></marker></defs>
    <g transform="translate(270,45)" class="small">
      <text y="0">1. Secure area + signage, don PPE</text>
      <text y="24">2. Remove sharps/glass with forceps</text>
      <text y="48">3. Absorbent around OUTER edge first</text>
      <text y="72">4. Work inward, bag bulk material</text>
      <text y="96">5. Apply disinfectant — full wet dwell</text>
      <text y="120">6. Doff PPE, hand hygiene, document</text>
    </g>
  </svg>`; },

  roomPath: () => { const ah2 = mcU('ah2'); return `
  <svg viewBox="0 0 520 260" class="mc-svg" role="img" aria-label="Clean to dirty room path">
    <text x="20" y="22" class="t-ok">Terminal clean path: clockwise, high → low, clean → dirty, bathroom last</text>
    <rect x="30" y="36" width="330" height="200" rx="8" class="surf"/>
    <rect x="270" y="46" width="80" height="70" rx="6" fill="#1e293b" stroke="#475569"/><text x="310" y="85" text-anchor="middle" class="small">BATHROOM</text>
    <rect x="130" y="110" width="90" height="60" rx="6" fill="#334155"/><text x="175" y="145" text-anchor="middle" class="small">BED</text>
    <rect x="40" y="215" width="44" height="14" fill="#38bdf8"/><text x="62" y="210" text-anchor="middle" class="small">DOOR</text>
    <path d="M62 205 L62 60 L240 60 L240 190 L120 200 L105 135 L130 105 L230 100 L310 120" class="stroke-ok" marker-end="url(#${ah2})"/>
    <defs><marker id="${ah2}" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#4ade80"/></marker></defs>
    ${[[62, 180, 1], [62, 75, 2], [200, 60, 3], [240, 150, 4], [130, 115, 5], [225, 105, 6], [310, 125, 7]].map(([x, y, n]) => `<circle cx="${x}" cy="${y}" r="10" fill="#facc15"/><text x="${x}" y="${y + 4}" text-anchor="middle" class="numdark">${n}</text>`).join("")}
    <g transform="translate(378,52)" class="small">
      <text y="0">1 Door, switches</text><text y="22">2 Wall-mounted items</text>
      <text y="44">3 Window, ledges</text><text y="66">4 Overbed table, chairs</text>
      <text y="88">5 Bed rails, controls</text><text y="110">6 Mattress, call cord</text>
      <text y="132">7 Bathroom (last)</text><text y="160" class="t-ok">Floor is always last</text>
    </g>
  </svg>`; },

  atpScale: () => { const g = mcU('atpg'); return `
  <svg viewBox="0 0 520 150" class="mc-svg" role="img" aria-label="ATP RLU scale">
    <text x="20" y="22" class="t-ok">ATP Luminometer Result Bands (as used in this simulator)</text>
    <defs><linearGradient id="${g}" x1="0" x2="1"><stop offset="0" stop-color="#22c55e"/><stop offset="0.35" stop-color="#facc15"/><stop offset="1" stop-color="#ef4444"/></linearGradient></defs>
    <rect x="20" y="40" width="480" height="28" rx="14" fill="url(#${g})"/>
    <line x1="80" y1="34" x2="80" y2="74" stroke="#fff" stroke-width="2"/><text x="80" y="90" text-anchor="middle" class="small">25</text>
    <line x1="190" y1="34" x2="190" y2="74" stroke="#fff" stroke-width="2"/><text x="190" y="90" text-anchor="middle" class="small">250</text>
    <text x="45" y="112" class="t-ok" text-anchor="middle">PASS</text>
    <text x="135" y="112" class="t-warn" text-anchor="middle">CAUTION</text>
    <text x="345" y="112" class="t-bad" text-anchor="middle">FAIL — RECLEAN</text>
    <text x="20" y="138" class="cap">Thresholds vary by manufacturer and facility — always use your meter's validated limits.</text>
  </svg>`; },

  spaulding: () => `
  <svg viewBox="0 0 520 220" class="mc-svg" role="img" aria-label="Spaulding classification">
    <text x="20" y="22" class="t-ok">Spaulding Classification — risk decides the process</text>
    <polygon points="140,36 185,96 95,96" fill="#ef4444" opacity="0.85"/>
    <polygon points="95,100 185,100 222,150 58,150" fill="#f59e0b" opacity="0.85"/>
    <polygon points="58,154 222,154 258,204 22,204" fill="#22c55e" opacity="0.8"/>
    <text x="140" y="88" text-anchor="middle" class="numdark">CRITICAL</text>
    <text x="140" y="130" text-anchor="middle" class="numdark">SEMI-CRITICAL</text>
    <text x="140" y="184" text-anchor="middle" class="numdark">NON-CRITICAL</text>
    <text x="275" y="62" class="t-bad">Enters sterile tissue / blood</text>
    <text x="275" y="80" class="small">→ Sterilization (scalpels, implants)</text>
    <text x="275" y="116" class="t-warn">Contacts mucous membranes</text>
    <text x="275" y="134" class="small">→ High-level disinfection (endoscopes)</text>
    <text x="275" y="170" class="t-ok">Intact skin / environment</text>
    <text x="275" y="188" class="small">→ Low-level disinfection (bed rails)</text>
  </svg>`,

  ppe: () => {
    const don = ["Hand hygiene", "Gown", "Mask/N95", "Eye shield", "Gloves"];
    const doff = ["Gloves", "Eye shield", "Gown", "Mask/N95", "Hand hygiene"];
    const row = (arr, y, cls) => arr.map((s, i) => `<rect x="${20 + i * 98}" y="${y}" width="90" height="40" rx="8" class="${cls}"/><text x="${65 + i * 98}" y="${y + 25}" text-anchor="middle" class="tiny">${i + 1}. ${s}</text>`).join("");
    return `
  <svg viewBox="0 0 520 170" class="mc-svg" role="img" aria-label="PPE donning and doffing order">
    <text x="20" y="22" class="t-ok">DONNING (putting on) — common CDC sequence</text>
    ${row(don, 32, "fresh")}
    <text x="20" y="102" class="t-bad">DOFFING (removing) — dirtiest items first, hand hygiene last</text>
    ${row(doff, 112, "usedbox")}
  </svg>`;
  },

  sharps: () => `
  <svg viewBox="0 0 520 210" class="mc-svg" role="img" aria-label="Sharps container fill line">
    <text x="20" y="22" class="t-ok">Sharps container — replace at the fill line</text>
    <rect x="60" y="40" width="120" height="150" rx="10" fill="#7f1d1d" stroke="#ef4444" stroke-width="3"/>
    <rect x="63" y="98" width="114" height="89" fill="#b91c1c"/>
    <line x1="50" y1="78" x2="190" y2="78" stroke="#facc15" stroke-width="3" stroke-dasharray="6 4"/>
    <text x="196" y="82" class="t-warn">FULL LINE (~¾)</text>
    <text x="120" y="150" text-anchor="middle" class="num">BIOHAZARD</text>
    <g transform="translate(270,56)" class="small">
      <text class="t-ok" y="0">✓ Lock and replace at the fill line</text>
      <text y="26">✓ Use forceps/tongs for loose sharps</text>
      <text y="52">✓ Mount at a reachable height</text>
      <text class="t-bad" y="84">✗ Never shake, press, or reach in</text>
      <text class="t-bad" y="110">✗ Never recap needles by hand</text>
    </g>
  </svg>`,

  dwell: () => `
  <svg viewBox="0 0 520 170" class="mc-svg" role="img" aria-label="Disinfectant dwell time">
    <text x="20" y="22" class="t-ok">Wet contact (dwell) time — the surface must stay wet the whole time</text>
    <line x1="30" y1="90" x2="490" y2="90" stroke="#475569" stroke-width="4"/>
    <rect x="30" y="70" width="380" height="40" rx="6" fill="#0ea5e9" opacity="0.35"/>
    <text x="220" y="95" text-anchor="middle" class="small">SURFACE VISIBLY WET</text>
    <circle cx="30" cy="90" r="8" fill="#38bdf8"/><text x="30" y="130" text-anchor="middle" class="small">Apply</text>
    <circle cx="410" cy="90" r="8" fill="#4ade80"/><text x="410" y="130" text-anchor="middle" class="small">Label time met</text>
    <circle cx="250" cy="90" r="8" fill="#f87171"/><text x="250" y="56" text-anchor="middle" class="t-bad">Dried early? Re-wet.</text>
    <text x="20" y="158" class="cap">Contact time comes from the product's EPA label (often 1–10 min) — not from habit.</text>
  </svg>`,

  redbag: () => `
  <svg viewBox="0 0 520 236" class="mc-svg" role="img" aria-label="Waste segregation decision tree">
    <text x="20" y="22" class="t-ok">Where does it go? — waste segregation decision tree</text>
    <rect x="20" y="36" width="250" height="34" rx="8" class="surf"/>
    <text x="32" y="58" class="small">Needle, blade, or broken glass?</text>
    <rect x="20" y="92" width="250" height="34" rx="8" class="surf"/>
    <text x="32" y="114" class="small">Would it drip blood if squeezed?</text>
    <rect x="20" y="148" width="250" height="34" rx="8" class="surf"/>
    <text x="32" y="170" class="small">Caked with dried blood that flakes?</text>
    <rect x="20" y="200" width="250" height="30" rx="8" fill="#14532d" stroke="#22c55e"/>
    <text x="145" y="220" text-anchor="middle" class="small">All NO → regular trash (check local rules)</text>
    <line x1="145" y1="70" x2="145" y2="92" class="arrow-dim"/><text x="152" y="85" class="tiny">NO</text>
    <line x1="145" y1="126" x2="145" y2="148" class="arrow-dim"/><text x="152" y="141" class="tiny">NO</text>
    <line x1="145" y1="182" x2="145" y2="200" class="arrow-dim"/><text x="152" y="195" class="tiny">NO</text>
    <rect x="310" y="36" width="190" height="34" rx="8" fill="#7f1d1d" stroke="#ef4444"/>
    <text x="405" y="58" text-anchor="middle" class="num">SHARPS CONTAINER</text>
    <rect x="310" y="112" width="190" height="56" rx="8" fill="#991b1b" stroke="#f87171"/>
    <text x="405" y="136" text-anchor="middle" class="num">RED BAG (RMW)</text>
    <text x="405" y="154" text-anchor="middle" class="tiny">goose-neck seal • lidded bin</text>
    <line x1="270" y1="53" x2="310" y2="53" class="arrow"/><text x="278" y="47" class="tiny">YES</text>
    <line x1="270" y1="109" x2="310" y2="130" class="arrow"/><text x="278" y="104" class="tiny">YES</text>
    <line x1="270" y1="165" x2="310" y2="150" class="arrow"/><text x="278" y="178" class="tiny">YES</text>
  </svg>`,

  chain: () => {
    const items = [["Infectious", "agent"], ["Reservoir", "(surfaces)"], ["Portal of", "exit"], ["Mode of", "transmission"], ["Portal of", "entry"], ["Susceptible", "host"]];
    const cx = 140, cy = 128, R = 84;
    const pts = items.map((_, i) => { const a = -Math.PI / 2 + i * Math.PI / 3; return [cx + R * Math.cos(a), cy + R * Math.sin(a)]; });
    const links = pts.map(([x, y], i) => { const [x2, y2] = pts[(i + 1) % 6]; return `<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="#475569" stroke-width="3"/>`; }).join("");
    const nodes = items.map(([l1, l2], i) => { const [x, y] = pts[i]; const hit = i === 1 || i === 3; return `<circle cx="${x}" cy="${y}" r="33" class="${hit ? "fresh" : "surf"}"/><text x="${x}" y="${y - 2}" text-anchor="middle" class="tiny" style="font-size:9px">${l1}</text><text x="${x}" y="${y + 10}" text-anchor="middle" class="tiny" style="font-size:9px">${l2}</text>`; }).join("");
    return `
  <svg viewBox="0 0 520 250" class="mc-svg" role="img" aria-label="Chain of infection">
    <text x="20" y="22" class="t-ok">Chain of infection — break any link and transmission stops</text>
    ${links}${nodes}
    <g transform="translate(280,62)" class="small">
      <text class="t-ok" y="0">Cleaning &amp; disinfection break:</text>
      <text y="22">• Reservoir — contaminated rails,</text>
      <text y="38">  tables, call cords, floors</text>
      <text y="60">• Transmission — hands, cloths,</text>
      <text y="76">  carts and shared equipment</text>
      <text class="t-warn" y="104">Hand hygiene + PPE protect</text>
      <text class="t-warn" y="120">the portal of entry</text>
    </g>
  </svg>`;
  },

  spdFlow: () => {
    const ah = mcU('spd');
    const boxes = [["POINT OF", "USE", "pre-clean, keep moist"], ["DECON", "(dirty)", "negative pressure"], ["PREP &", "PACK", "inspect, assemble"], ["STERILIZE", "", "steam + indicators"], ["STERILE", "STORAGE", "positive pressure"]];
    const g = boxes.map(([a, b, c], i) => {
      const x = 10 + i * 102;
      const fill = i === 1 ? "usedbox" : i === 3 ? "fresh" : "surf";
      const arrow = i < 4 ? `<line x1="${x + 92}" y1="82" x2="${x + 102}" y2="82" class="arrow" marker-end="url(#${ah})"/>` : "";
      return `<rect x="${x}" y="46" width="92" height="72" rx="9" class="${fill}"/><text x="${x + 46}" y="70" text-anchor="middle" class="num" style="font-size:11px">${a}</text><text x="${x + 46}" y="85" text-anchor="middle" class="num" style="font-size:11px">${b}</text><text x="${x + 46}" y="106" text-anchor="middle" class="tiny" style="font-size:8.5px">${c}</text>${arrow}`;
    }).join("");
    return `
  <svg viewBox="0 0 520 200" class="mc-svg" role="img" aria-label="Sterile processing one-way workflow">
    <defs><marker id="${ah}" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#38bdf8"/></marker></defs>
    <text x="20" y="24" class="t-ok">One-way flow: dirty → clean → sterile (never backwards)</text>
    ${g}
    <path d="M464 118 L464 156 L56 156 L56 124" fill="none" stroke="#facc15" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#${ah})"/>
    <text x="260" y="178" text-anchor="middle" class="cap">Used instruments travel back in closed, labeled, puncture-resistant containers</text>
  </svg>`;
  }
};