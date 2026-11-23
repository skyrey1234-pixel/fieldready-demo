// FieldReady Academy — photos, diagrams, before/after sliders, worked examples,
// per-step visual guide, scenario drills and lightbox.
// Loads after medclean-3d-engine.js and medclean-diagrams.js.
(function () {
  const D = () => window.MC_DIAGRAMS || {};
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  // ---------- photo library: [src, source type, title, caption] ----------
  const SRC = { ai: "AI ILLUSTRATION", project: "PROJECT IMAGE", sim: "SIM SCREENSHOT" };
  const PHOTOS = {
    bedrail: ["./photos/bedrail-microfiber.jpg", "ai", "Bed-rail wipe", "Folded blue microfiber, one direction, a fresh face for each surface."],
    evs: ["./photos/evs-terminal-clean.jpg", "ai", "Terminal clean in full PPE", "Gown, N95, face shield and gloves while wiping a bed rail."],
    ppe: ["./photos/ppe-donning.jpg", "ai", "Donning PPE", "Gloves go on last and pull over the gown cuffs."],
    spd: ["./photos/spd-brush-underwater.jpg", "ai", "Brushing below the waterline", "Scrubbing a hemostat hinge under water keeps splashes and aerosols down."],
    sterilizer: ["./photos/steam-sterilizer.jpg", "ai", "Loading a steam sterilizer", "Only cleaned, inspected and packaged instruments go into the chamber."],
    redbag: ["./photos/redbag-gooseneck.jpg", "ai", "Goose-neck seal", "Twist, fold over and tie the red liner, holding it away from your body."],
    sharps: ["./photos/sharps-forceps.jpg", "ai", "Sharps with forceps", "Tools, not fingers, move needles and blades into the sharps container."],
    spill: ["./photos/spill-outside-in.jpg", "ai", "Outside-in spill containment", "Absorbent ring around the edge first, then work inward with a scoop."],
    atp: ["./photos/atp-uv-audit.jpg", "ai", "ATP + UV audit", "An ATP swab gives a number; UV markers show what was missed."],
    uvRoom: ["./photos/room-uv-residue.jpg", "ai", "Blacklight inspection", "AI-edited version of the simulator room photo, showing residue under UV."],
    uvcTower: ["./photos/uvc-tower.jpg", "ai", "UV-C disinfection tower", "No-touch UV-C is an add-on after manual cleaning, not a replacement."],
    room: ["./vr-room-pov-base.png", "project", "Patient room baseline", "The hospital room used in simulator mode 2."],
    crimeRoom: ["./crime-scene-trauma-room.png", "project", "Trauma-scene room", "The forensic scene used in the photo visor."],
    crimeUv: ["./crime-scene-uv-blacklight.png", "project", "Forensic blacklight view", "Latent prints glow under 365 nm UV."],
    event: ["./vr-live-event-training.png", "project", "Live training event", "Concept art of a multi-trainee session."],
    simCrime: ["./verified-3d-crime-scene-live.png", "sim", "Walkable 3D crime-scene lab", "Live screenshot of simulator mode 1."],
    simHospital: ["./verified-hospital-room-live.png", "sim", "Hospital room VR", "Live screenshot of simulator mode 2."]
  };

  function figure(key, cls) {
    const p = PHOTOS[key];
    if (!p) return "";
    const [src, type, title, cap] = p;
    return `<figure class="mc-fig${cls ? " " + cls : ""}" data-lightbox="${esc(src)}" data-cap="${esc(title + " — " + cap)}">
      <span class="mc-src">${SRC[type]}</span>
      <img src="${esc(src)}" alt="${esc(title)}" loading="lazy" decoding="async" />
      ${cls === "mh-fig" ? "" : `<figcaption><b>${esc(title)}</b>${esc(cap)}</figcaption>`}
    </figure>`;
  }

  const gallery = (keys) => `<div class="mc-gallery">${keys.map((k) => figure(k)).join("")}</div>`;

  const diagrams = (list) => `<div class="mc-diagrams">${list
    .map(([id, cap]) => (D()[id] ? `<figure class="mc-diagram">${D()[id]()}<figcaption>${esc(cap)}</figcaption></figure>` : ""))
    .join("")}</div>`;

  // ---------- before / after sliders (pixel-aligned image pairs) ----------
  const SLIDERS = {
    uvReveal: {
      before: "./vr-room-pov-base.png",
      after: "./photos/room-uv-residue.jpg",
      l: "ROOM LIGHT",
      r: "UV BLACKLIGHT",
      cap: "Drag the handle. Under a 365 nm blacklight, residue shows up on rails, bed controls and the cart that look clean in room light. (UV side is an AI-edited illustration of the project photo.)"
    },
    uvAfter: {
      before: "./photos/room-uv-residue.jpg",
      after: "./photos/room-uv-clean.jpg",
      l: "BEFORE CLEANING",
      r: "AFTER CLEANING",
      cap: "Same blacklight view before and after a thorough wipe-down. Anything still glowing is what an audit sends back for re-cleaning. (Illustration.)"
    }
  };

  function slider(key) {
    const s = SLIDERS[key];
    if (!s) return "";
    return `<figure class="mc-ba" data-slider="${key}">
      <div class="ba-wrap">
        <img src="${s.after}" alt="${esc(s.r)}" loading="lazy" />
        <img class="ba-top" src="${s.before}" alt="${esc(s.l)}" loading="lazy" style="clip-path: inset(0 50% 0 0)" />
        <div class="ba-line" style="left:50%"><div class="ba-knob">⇆</div></div>
        <span class="ba-tag l">◀ ${s.l}</span><span class="ba-tag r">${s.r} ▶</span>
        <input class="ba-range" type="range" min="0" max="100" value="50" aria-label="Before and after: ${esc(s.l)} versus ${esc(s.r)}" />
      </div>
      <figcaption>${esc(s.cap)}</figcaption>
    </figure>`;
  }

  document.addEventListener("input", (e) => {
    const r = e.target && e.target.classList && e.target.classList.contains("ba-range") ? e.target : null;
    if (!r) return;
    const wrap = r.parentElement;
    const v = Number(r.value);
    wrap.querySelector(".ba-top").style.clipPath = `inset(0 ${100 - v}% 0 0)`;
    wrap.querySelector(".ba-line").style.left = v + "%";
  });

  // ---------- worked examples ----------
  function examples(list) {
    return `<div class="mc-examples">${list
      .map((e) => {
        const p = e.photo && PHOTOS[e.photo];
        return `<div class="mc-example">
        ${p ? `<img class="ex-photo" src="${p[0]}" alt="${esc(p[2])}" loading="lazy" data-lightbox="${p[0]}" data-cap="${esc(p[2] + " — " + p[3])}" />` : ""}
        <div class="ex-in">
          <h4>${e.title}</h4>
          <p class="sit"><strong>Situation:</strong> ${e.situation}</p>
          <div class="mc-cmp">
            <div class="bad"><span>✗ WRONG</span>${e.wrong}</div>
            <div class="good"><span>✓ RIGHT</span>${e.right}</div>
          </div>
          <div class="mc-why"><strong>Why:</strong> ${e.why}</div>
        </div>
      </div>`;
      })
      .join("")}</div>`;
  }

  // ---------- module content ----------
  const MODULES = {
    fundamentals: {
      hero: "bedrail",
      visuals: [["chain", "Chain of infection: where cleaning breaks it"], ["spaulding", "Spaulding: risk decides the process"], ["dwell", "Wet contact (dwell) time"]],
      sliders: ["uvReveal"],
      examples: [
        { photo: "bedrail", title: "Example: “It looked clean”", situation: "A bed rail is sprayed with disinfectant, but dried blood is still packed into the hinge.", wrong: "Spray disinfectant over the soil and walk away.", right: "Remove the soil first with detergent or enzymatic cleaner and friction, then disinfect for the full label contact time.", why: "Organic soil shields microbes and can weaken the disinfectant." },
        { photo: "sterilizer", title: "Example: choosing the right process", situation: "A reusable laryngoscope blade comes back after use.", wrong: "Wipe it with a low-level surface disinfectant wipe.", right: "Treat it as semi-critical: send it for high-level disinfection or sterilization per the manufacturer’s instructions.", why: "It touches mucous membranes, so Spaulding places it above non-critical surfaces." },
        { photo: "uvcTower", title: "Example: C. diff discharge room", situation: "A patient with C. difficile is discharged and the room needs a terminal clean.", wrong: "Use the everyday quat wipe with its usual contact time.", right: "Use a sporicidal product registered for C. diff (EPA List K) per facility policy and keep surfaces wet for its label time. UV-C can be added afterward, never instead.", why: "C. diff spores survive many routine disinfectants." }
      ],
      gallery: ["uvRoom", "atp", "bedrail", "crimeUv"],
      drill: { q: "A disinfectant label says 3 minutes wet contact. The surface dries at 90 seconds. What do you do?", opts: ["Count it as done", "Re-apply so it stays wet for the full 3 minutes", "Wipe it dry immediately"], ans: 1, exp: "Label claims only hold if the surface stays wet for the full contact time." }
    },
    facility: {
      hero: "evs",
      visuals: [["roomPath", "Terminal-clean room path"], ["sfold", "Wiping technique"], ["fold16", "16-face cloth fold"]],
      sliders: ["uvAfter"],
      examples: [
        { photo: "evs", title: "Example: discharge (terminal) clean", situation: "A contact-precautions patient is discharged and the next admission is waiting.", wrong: "Start in the bathroom, then wipe the bed rails with the same cloth.", right: "Start at the door, go clockwise high to low with a fresh cloth face per surface, and finish with the bathroom and floor.", why: "It stops bathroom and high-bioburden soil from moving onto patient-contact surfaces." },
        { photo: "bedrail", title: "Example: color coding", situation: "A cleaner uses one cloth color for the whole room.", wrong: "Use the same cloth for the toilet and the overbed table.", right: "Follow your facility’s color code, such as one color for the patient zone and another for the restroom.", why: "Segregating cloths reduces cross-transfer of enteric organisms." },
        { title: "Example: double-dipping", situation: "Halfway through a room, the cleaner’s cloth is visibly soiled.", wrong: "Dunk it back into the disinfectant bucket and keep going.", right: "Bag the used cloth and take a fresh one (or a fresh folded face). Never return used cloths to clean solution.", why: "Double-dipping contaminates the whole bucket and spreads soil room to room." }
      ],
      gallery: ["evs", "bedrail", "uvcTower", "room"],
      drill: { q: "Which surface is cleaned LAST in a terminal clean?", opts: ["Bed rails", "Door handle", "Floor"], ans: 2, exp: "Floors go last because debris and droplets fall while higher surfaces are cleaned." }
    },
    instruments: {
      hero: "spd",
      visuals: [["spdFlow", "One-way sterile processing workflow"], ["dwell", "Enzymatic and chemical contact time"]],
      sliders: [],
      examples: [
        { title: "Example: dried blood on instruments", situation: "A surgical tray sits for hours before transport.", wrong: "Let the instruments dry out, or soak them in saline.", right: "Keep them moist with an approved pre-cleaning product per the IFU, open the hinges, and transport them in a closed, labeled container.", why: "Dried soil is much harder to remove, and saline can pit and corrode stainless steel." },
        { photo: "spd", title: "Example: manual brushing", situation: "A technician is brushing instruments in the decontamination sink.", wrong: "Brush above the water line to see better.", right: "Brush below the water surface while wearing a gown, face protection and long-cuff gloves.", why: "It keeps splashes and aerosols out of the air and off the technician." },
        { photo: "sterilizer", title: "Example: “the sterilizer will handle it”", situation: "A tray is still visibly soiled, but the next case is scheduled soon.", wrong: "Skip cleaning because sterilization kills everything.", right: "Clean, inspect and package first; only then sterilize.", why: "Residual soil can shield organisms from the sterilant." }
      ],
      gallery: ["spd", "sterilizer"],
      drill: { q: "What confirms a sterilization cycle actually killed resistant spores?", opts: ["Chemical tape color change", "Biological indicator", "Instruments look shiny"], ans: 1, exp: "Biological indicators test lethality; tape only shows the pack was exposed to the process." }
    },
    waste: {
      hero: "redbag",
      visuals: [["redbag", "Where does it go?"], ["sharps", "Sharps container rules"], ["ppe", "PPE order"]],
      sliders: [],
      examples: [
        { photo: "redbag", title: "Example: red bag or regular trash?", situation: "A paper towel used after handwashing, and gauze that drips blood when squeezed.", wrong: "Put both in the red bag “to be safe.”", right: "Paper towel goes in regular trash; the saturated gauze is regulated medical waste.", why: "Over-segregating wastes money; under-segregating is a safety and compliance risk. Follow your state rules." },
        { photo: "sharps", title: "Example: full sharps container", situation: "The sharps container has reached its fill line.", wrong: "Shake it down to make room for a few more.", right: "Close it, lock it and replace it.", why: "Overfilling and shaking are common causes of needlesticks." },
        { title: "Example: squeezing a red bag", situation: "A full red liner has a lot of trapped air.", wrong: "Press the bag against your body to push the air out.", right: "Gather the top gently, goose-neck twist and tie it, and keep it away from your body.", why: "Hidden sharps can puncture the bag, and squeezing pushes contaminated air out." }
      ],
      gallery: ["redbag", "sharps", "crimeRoom"],
      drill: { q: "You find a loose needle on the floor. What do you use?", opts: ["Gloved fingers", "Forceps or tongs", "A broom into a trash bag"], ans: 1, exp: "Pick up sharps mechanically and put them directly into a sharps container." }
    },
    spills: {
      hero: "spill",
      visuals: [["outsideIn", "Outside-in containment"], ["dwell", "Disinfectant contact time"]],
      sliders: [],
      examples: [
        { photo: "spill", title: "Example: large floor spill", situation: "About a cup of blood on vinyl flooring, with broken glass in it.", wrong: "Pour bleach directly on the pool and mop it.", right: "PPE on, glass out with tools, absorb from the outside in, bag the waste, then apply disinfectant for the full label time.", why: "Bulk organic material weakens disinfectants, and tools prevent cuts." },
        { title: "Example: mixing bleach", situation: "You need 1 L of 1:10 bleach solution for a spill.", wrong: "Eyeball the amount, or mix it with another cleaner.", right: "100 mL bleach + 900 mL water, labeled and dated. Never mix bleach with ammonia or acids.", why: "Concentration matters, and mixing chemicals can release toxic gases. Check the product label." },
        { photo: "crimeRoom", title: "Example: using the room mop", situation: "Staff want to clean a blood spill quickly with the regular floor mop.", wrong: "Mop it up and return the mop to the cart.", right: "Use the spill kit’s disposable absorbent and scoop; treat anything that touched the blood as contaminated.", why: "A reused mop spreads blood to every floor it touches afterward." }
      ],
      gallery: ["spill", "crimeRoom", "simCrime"],
      drill: { q: "Where do you place absorbent first on a spill?", opts: ["Center of the spill", "Around the outer edge", "Only on the wettest spot"], ans: 1, exp: "Outside-in stops the spill from spreading." }
    },
    qa: {
      hero: "atp",
      visuals: [["atpScale", "ATP result bands"]],
      sliders: ["uvReveal", "uvAfter"],
      examples: [
        { photo: "atp", title: "Example: reading an ATP result", situation: "A bed-rail swab reads 312 RLU after cleaning.", wrong: "Pass it because it looks clean.", right: "Re-clean, re-swab and record both results.", why: "Visual checks miss residue; ATP gives a measurable check (limits depend on the device)." },
        { photo: "uvRoom", title: "Example: UV marker audit", situation: "Fluorescent dots placed before cleaning are still glowing afterward.", wrong: "Assume the disinfectant worked.", right: "Those surfaces weren’t wiped. Re-clean them and coach the technique.", why: "UV markers check whether surfaces were physically wiped, not microbial kill." }
      ],
      gallery: ["atp", "uvRoom", "uvcTower", "simHospital"],
      drill: { q: "What does a fluorescent marker audit tell you?", opts: ["Bacteria count", "Whether the surface was wiped", "Disinfectant concentration"], ans: 1, exp: "It verifies wiping coverage, not microbial level." }
    }
  };

  function drill(key, d) {
    return `<div class="mc-drill" id="drill-${key}">
      <div class="mc-drill-tag">⚡ QUICK SCENARIO DRILL</div>
      <p class="q">${d.q}</p>
      <div class="opts">${d.opts.map((o, i) => `<button class="quiz-opt" onclick="window.mcDrill('${key}', ${i})">${o}</button>`).join("")}</div>
      <div class="res" id="drill-res-${key}"></div>
    </div>`;
  }

  window.mcDrill = function (key, i) {
    const d = MODULES[key].drill;
    const box = document.getElementById("drill-" + key);
    box.querySelectorAll(".quiz-opt").forEach((b, j) => {
      b.classList.remove("correct", "wrong", "selected");
      if (j === d.ans) b.classList.add("correct");
      else if (j === i) b.classList.add("wrong");
    });
    const res = document.getElementById("drill-res-" + key);
    res.className = "res " + (i === d.ans ? "ok" : "err");
    res.textContent = (i === d.ans ? "✅ Correct — " : "❌ Not quite — ") + d.exp;
  };

  // ---------- lightbox ----------
  window.mcLightbox = function (src, cap) {
    let lb = document.getElementById("mc-lightbox");
    if (!lb) {
      lb = document.createElement("div");
      lb.id = "mc-lightbox";
      lb.onclick = () => (lb.style.display = "none");
      document.body.appendChild(lb);
    }
    lb.innerHTML = `<figure><img src="${esc(src)}" alt="" /><figcaption>${esc(cap || "")} — click anywhere or press Esc to close</figcaption></figure>`;
    lb.style.display = "flex";
  };
  document.addEventListener("click", (e) => {
    const t = e.target.closest && e.target.closest("[data-lightbox]");
    if (t) window.mcLightbox(t.getAttribute("data-lightbox"), t.getAttribute("data-cap"));
  });
  document.addEventListener("keydown", (e) => {
    const lb = document.getElementById("mc-lightbox");
    if (e.key === "Escape" && lb) lb.style.display = "none";
  });

  // ---------- inject into course modules ----------
  function enhanceModules() {
    Object.entries(MODULES).forEach(([key, m]) => {
      const host = document.getElementById("module-content-" + key);
      if (!host || host.querySelector(".mc-extras")) return;
      const hero = host.querySelector(".module-hero");
      if (hero && !hero.classList.contains("has-photo")) {
        const txt = document.createElement("div");
        txt.className = "mh-text";
        while (hero.firstChild) txt.appendChild(hero.firstChild);
        hero.appendChild(txt);
        hero.insertAdjacentHTML("beforeend", figure(m.hero, "mh-fig"));
        hero.classList.add("has-photo");
      }
      const visualBlock = document.createElement("div");
      visualBlock.className = "mc-extras";
      visualBlock.innerHTML = `
        <h3 class="mc-h">📊 Visual Guides <span class="mc-chip">${m.visuals.length} DIAGRAM${m.visuals.length > 1 ? "S" : ""}</span></h3>
        ${diagrams(m.visuals)}
        ${m.sliders.length ? `<h3 class="mc-h">🔦 Looks Clean vs. Is Clean <span class="mc-chip">DRAG TO COMPARE</span></h3><div class="mc-ba-grid">${m.sliders.map(slider).join("")}</div>` : ""}
        <h3 class="mc-h">📘 Core Protocols</h3>`;
      if (hero) hero.after(visualBlock);
      else host.prepend(visualBlock);

      const practice = document.createElement("div");
      practice.className = "mc-extras mc-practice";
      practice.innerHTML = `
        <h3 class="mc-h">🧪 Worked Examples <span class="mc-chip">WRONG vs. RIGHT</span></h3>
        ${examples(m.examples)}
        <h3 class="mc-h">🖼️ Photo Gallery <span class="mc-chip">CLICK TO ENLARGE</span></h3>
        ${gallery(m.gallery)}
        ${drill(key, m.drill)}
        <p class="mc-disclaimer">Educational content. Always follow your facility policy, product labels, manufacturer IFUs and applicable OSHA, CDC and state rules. Images marked AI ILLUSTRATION are generated for teaching and do not show real people, products or facilities.</p>`;
      host.appendChild(practice);
    });
  }

  function enhanceHome() {
    const home = document.getElementById("section-home");
    if (!home || home.querySelector(".mc-showcase")) return;
    const s = document.createElement("div");
    s.className = "mc-showcase";
    s.innerHTML = `
      <h3 class="mc-h">🎬 Inside the Simulator</h3>
      ${gallery(["simCrime", "simHospital", "crimeUv", "event"])}
      <h3 class="mc-h">🔦 Looks Clean vs. Is Clean <span class="mc-chip">DRAG TO COMPARE</span></h3>
      <div class="mc-ba-grid">${slider("uvReveal")}${slider("uvAfter")}</div>
      <h3 class="mc-h">📊 Core Concepts at a Glance</h3>
      ${diagrams([["chain", "Chain of infection"], ["ppe", "PPE donning and doffing"], ["atpScale", "Reading an ATP result"]])}
      <h3 class="mc-h">📸 Technique Photos</h3>
      ${gallery(["ppe", "bedrail", "spill", "sharps", "redbag", "spd"])}`;
    home.appendChild(s);
  }

  // ---------- per-step visual guide under the simulator ----------
  const GUIDES = {
    crime: {
      1: { photo: "crimeRoom", visual: "chain", look: "Shoeprints at the doorway are the first thing you meet, and the easiest way to carry blood out of the room.", wrong: "Walk straight through the trail to reach the big spill first.", right: "Clean the entry threshold first and set a clean path in and out so boots and wheels don’t track blood out of the hot zone." },
      2: { photo: "spill", visual: "outsideIn", look: "Absorbent goes around the outer edge first, then you work inward.", wrong: "Pour disinfectant straight onto the pool and mop it around.", right: "Absorb from the edge in, scoop the bulk into a red bag, then apply disinfectant for the full label contact time." },
      3: { photo: "sharps", visual: "sharps", look: "Forceps or tongs keep your fingers away from blades and needles.", wrong: "Pick up the scalpel and needles by hand — gloves don’t stop a needlestick.", right: "Use forceps or tongs and drop each sharp straight into a puncture-resistant sharps container." },
      4: { photo: "bedrail", visual: "dwell", look: "Walls get the same technique: top to bottom, one direction, a fresh face for each pass.", wrong: "Spray once and wipe it off before it has had any contact time.", right: "Use a foaming or clinging product so the wall stays wet for the label time, then wipe top to bottom in S-strokes." },
      5: { photo: "evs", visual: "fold16", look: "Rails, controls and mattress seams are high-touch, so each gets a fresh cloth face.", wrong: "Wipe both rails and the mattress with the same cloth face.", right: "Fold the cloth into panels, turn to a fresh face for each surface, and inspect seams and zippers for fluid." },
      6: { photo: "crimeUv", visual: "slider:uvReveal", look: "Under 365 nm UV, residue you can’t see in room light glows.", wrong: "Skip areas that look clean.", right: "Dim the lights, sweep with the UV lamp, clean every glowing area, and re-check until nothing fluoresces." },
      7: { photo: "redbag", visual: "redbag", look: "Twist the neck, fold it over (goose-neck) and tie it. Hold bags away from your body.", wrong: "Squash the bag down by hand to fit more in.", right: "Put saturated gauze in the red liner, goose-neck seal it at about ¾ full, then disinfect the drum rim." },
      8: { photo: "atp", visual: "atpScale", look: "An ATP swab gives you a number instead of a guess.", wrong: "Release the scene because it looks clean.", right: "Swab the test areas, re-clean anything above your meter’s limit, record the results, then run the UV-C cycle if your protocol uses one." }
    },
    hospital: {
      1: { photo: "ppe", visual: "ppe", look: "Gloves go on last and pull over the gown cuffs.", wrong: "Put gloves on first, then wrestle into the gown.", right: "Hand hygiene → gown → N95 or mask → eye protection → gloves over the cuffs." },
      2: { photo: "sharps", visual: "sharps", look: "Look before you wipe: procedure trays can hide needles.", wrong: "Sweep a cloth across the tray to clear it.", right: "Inspect first, move sharps into the sharps container with forceps, then disinfect the tray." },
      3: { photo: "spill", visual: "outsideIn", look: "Spill kit first, mop never.", wrong: "Mop the spill with the regular floor mop.", right: "Absorb from the edge in, bag the waste, then apply disinfectant (fresh 1:10 bleach for large spills) for the full contact time." },
      4: { photo: "redbag", visual: "redbag", look: "Tie it off at about ¾ full; never push trash down by hand.", wrong: "Push the trash down with your hand to make room.", right: "Goose-neck tie the liner, then disinfect the lid and foot pedal." },
      5: { photo: "bedrail", visual: "sfold", look: "One direction, clean to dirty, overlapping strokes.", wrong: "Scrub back and forth over the whole rail.", right: "Wipe top to bottom in S-strokes, then turn to a fresh face." },
      6: { photo: "evs", visual: "fold16", look: "A new surface means a new cloth face.", wrong: "Keep using the cloth face from the left rail.", right: "Turn to a fresh face, wipe the right rail and bed controls, and keep them wet for the contact time." },
      7: { photo: "uvRoom", visual: "slider:uvAfter", look: "Call cords and mattress edges are easy to miss, and a UV audit shows it.", wrong: "Wipe the middle of the mattress and skip the cord and zipper flaps.", right: "Wipe the call button and cord, pillow cover, mattress top, edges and zipper flaps, keeping them wet for the full contact time." },
      8: { photo: "uvcTower", visual: "atpScale", look: "No-touch UV-C is an add-on after manual cleaning, never a replacement.", wrong: "Run the UV-C tower instead of wiping.", right: "Swab the rails and call cord, re-clean anything above your meter’s limit, log the result, then release the room." }
    }
  };

  function visual(v) {
    if (v.indexOf("slider:") === 0) return slider(v.slice(7));
    const fn = D()[v];
    return fn ? `<figure class="mc-diagram">${fn()}</figure>` : "";
  }

  function renderGuide() {
    const st = window.medCleanState;
    const host = document.getElementById("step-guide");
    const head = document.getElementById("step-guide-h");
    if (!st || !host) return;
    const key = st.simMode + "|" + st.activeIdx;
    if (host.dataset.key === key) return;
    host.dataset.key = key;
    const show = st.simMode !== "booth";
    host.style.display = show ? "" : "none";
    if (head) head.style.display = show ? "" : "none";
    if (!show) return;
    const fam = st.simMode === "hospital" ? "hospital" : "crime";
    const tasks = fam === "hospital" ? window.HOSPITAL_ROOM_TASKS : window.CRIME_SCENE_TASKS;
    const t = tasks[st.activeIdx] || tasks[0];
    const g = GUIDES[fam][t.id];
    if (!g) return;
    host.innerHTML = `
      <div class="sg-card"><div class="sg-tag">📸 WHAT IT LOOKS LIKE · STEP ${t.id}</div>${figure(g.photo)}<div class="sg-cap">${g.look}</div></div>
      <div class="sg-card"><div class="sg-tag">📐 VISUAL GUIDE</div>${visual(g.visual)}</div>
      <div class="sg-card"><div class="sg-tag">🧪 WORKED EXAMPLE</div><div class="sg-title">#${t.id} ${t.shortLabel}</div>
        <div class="mc-cmp"><div class="bad"><span>✗ WRONG</span>${g.wrong}</div><div class="good"><span>✓ RIGHT</span>${g.right}</div></div>
        <div class="mc-why"><strong>Tool:</strong> ${t.tool}</div></div>`;
  }

  function syncUvTag() {
    const st = window.medCleanState;
    let tag = document.getElementById("uv-illus-tag");
    const bar = document.querySelector(".hud-top-bar");
    if (!tag && bar) {
      tag = document.createElement("div");
      tag.id = "uv-illus-tag";
      tag.className = "hud-box";
      tag.innerHTML = `<div class="hud-tag" style="color:#f0abfc;">🔦 UV BLACKLIGHT VIEW</div><div class="hud-sub-val">Glow fades as each step is cleaned<br/>AI-edited illustration</div>`;
      const radar = document.getElementById("radar-hud-box");
      if (radar) radar.after(tag);
      else bar.appendChild(tag);
    }
    if (!tag || !st) return false;
    const want = st.simMode === "hospital" && st.uvOn ? "" : "none";
    if (tag.style.display === want) return false;
    tag.style.display = want;
    return true;
  }

  // ---------- keep 2D hotspot labels clear of the HUD, walk pad, action bar and edges ----------
  // Positions are computed from the stage transform in state (not measured), so the result
  // is correct even while the 0.14s pan transition is still running.
  const DIRS = [];
  [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach((d) => DIRS.push(d));
  for (let k = 0; k < 16; k++) {
    const a = (k * Math.PI) / 8;
    if (k % 4) DIRS.push([Math.cos(a), Math.sin(a)]);
  }
  let layoutQueued = false;
  window.mcLayoutPins = function (immediate) {
    if (immediate) {
      layoutPinsNow();
      return;
    }
    if (layoutQueued) return;
    layoutQueued = true;
    requestAnimationFrame(() => {
      layoutQueued = false;
      layoutPinsNow();
    });
  };

  // opaque bands of the gloved-hand PNGs (fractions of the natural image), measured from alpha
  const HAND_BANDS = {
    "left-hand-wrap": [[0.436, 0.065, 0.504, 0.221], [0.333, 0.221, 0.637, 0.377], [0.271, 0.377, 0.67, 0.532], [0.21, 0.532, 0.695, 0.688], [0.097, 0.688, 0.693, 0.844], [0, 0.844, 0.652, 1]],
    "right-hand-wrap": [[0.323, 0.241, 0.705, 0.367], [0.352, 0.367, 0.753, 0.493], [0.387, 0.493, 0.827, 0.62], [0.399, 0.62, 0.973, 0.747], [0.402, 0.747, 1, 0.873], [0.403, 0.873, 1, 1]]
  };
  function handObstacles(ox, oy, GAP) {
    const out = [];
    const layer = document.getElementById("hands-layer");
    if (!layer || getComputedStyle(layer).display === "none") return out;
    const clip = layer.getBoundingClientRect();
    Object.entries(HAND_BANDS).forEach(([id, bands]) => {
      const img = document.querySelector(`#${id} img`);
      if (!img || !img.naturalWidth) return;
      const r = img.getBoundingClientRect();
      const s = Math.min(r.width / img.naturalWidth, r.height / img.naturalHeight);
      const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
      const x0 = r.left + (r.width - dw) / 2, y0 = r.top + (r.height - dh) / 2;
      bands.forEach(([l, t, rr, b]) => {
        const top = Math.max(y0 + t * dh, clip.top), bot = Math.min(y0 + b * dh, clip.bottom);
        if (bot <= top) return;
        out.push({ l: x0 + l * dw - ox - GAP, t: top - oy - GAP, r: x0 + rr * dw - ox + GAP, b: bot - oy + GAP });
      });
    });
    return out;
  }

  function layoutPinsNow() {
    syncUvTag();
    const st = window.medCleanState;
    const vp = document.getElementById("visor-viewport");
    const layer = document.getElementById("photo-hotspots-layer");
    if (!st || !vp || !layer || (st.simMode !== "hospital" && st.simMode !== "photovisor")) return;
    const pins = [...layer.querySelectorAll(".photo-hotspot")];
    const W = vp.clientWidth, H = vp.clientHeight;
    if (!pins.length || !W || !H) return;
    const tasks = st.simMode === "hospital" ? window.HOSPITAL_ROOM_TASKS : window.CRIME_SCENE_TASKS;
    const vr = vp.getBoundingClientRect();
    const ox = vr.left + vp.clientLeft, oy = vr.top + vp.clientTop;
    const z = st.zoom || 1, GAP = 4, M = 6;

    const obstacles = [];
    vp.querySelectorAll(".hud-top-bar > *, .walk-pad-box, .visor-bottom-bar").forEach((el) => {
      if (getComputedStyle(el).display === "none") return;
      const r = el.getBoundingClientRect();
      if (r.width && r.height) obstacles.push({ l: r.left - ox - GAP, t: r.top - oy - GAP, r: r.right - ox + GAP, b: r.bottom - oy + GAP });
    });
    obstacles.push(...handObstacles(ox, oy, GAP));

    const info = pins.map((pin, i) => {
      const t = tasks[i] || tasks[0];
      const w = pin.offsetWidth, h = pin.offsetHeight;
      const ax = (t.visX / 100) * W, ay = (t.visY / 100) * H;
      return { pin, i, w, h, hw: (z * w) / 2, hh: (z * h) / 2, cx: W / 2 + st.panX + z * (ax - W / 2), cy: H / 2 + st.panY + z * (ay - H / 2) };
    });
    const rectAt = (p, dx, dy) => ({ l: p.cx + dx - p.hw, t: p.cy + dy - p.hh, r: p.cx + dx + p.hw, b: p.cy + dy + p.hh });
    const hit = (a, b) => a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;
    const placed = [];
    const free = (a) => a.l >= M && a.t >= M && a.r <= W - M && a.b <= H - M && !obstacles.some((o) => hit(a, o)) && !placed.some((o) => hit(a, o));

    // active task first, so it keeps its exact spot and the others move around it
    info.sort((a, b) => (b.i === st.activeIdx) - (a.i === st.activeIdx));
    info.forEach((p) => {
      let dx = 0, dy = 0;
      if (!free(rectAt(p, 0, 0))) {
        let found = false;
        for (let r = 6; r <= 280 && !found; r += 6) {
          for (const [ux, uy] of DIRS) {
            if (free(rectAt(p, ux * r, uy * r))) { dx = ux * r; dy = uy * r; found = true; break; }
          }
        }
        if (!found) {
          const a = rectAt(p, 0, 0);
          dx = a.l < M ? M - a.l : a.r > W - M ? W - M - a.r : 0;
          dy = a.t < M ? M - a.t : a.b > H - M ? H - M - a.b : 0;
        }
      }
      const g = { l: p.cx + dx - p.hw - GAP, t: p.cy + dy - p.hh - GAP, r: p.cx + dx + p.hw + GAP, b: p.cy + dy + p.hh + GAP };
      placed.push(g);

      const tx = dx / z, ty = dy / z, L = Math.hypot(tx, ty);
      p.pin.style.translate = L > 0.5 ? `${tx.toFixed(1)}px ${ty.toFixed(1)}px` : "";
      let leader = false;
      if (L > 0.5) {
        const ux = -tx / L, uy = -ty / L;
        const te = Math.min(ux ? p.w / 2 / Math.abs(ux) : Infinity, uy ? p.h / 2 / Math.abs(uy) : Infinity);
        if (L > te + 6) {
          leader = true;
          const s = p.pin.style;
          s.setProperty("--lx", `calc(50% + ${(ux * te).toFixed(1)}px)`);
          s.setProperty("--ly", `calc(50% + ${(uy * te - 1).toFixed(1)}px)`);
          s.setProperty("--ll", `${(L - te).toFixed(1)}px`);
          s.setProperty("--la", `${Math.atan2(uy, ux).toFixed(4)}rad`);
          s.setProperty("--ax", `calc(50% - ${tx.toFixed(1)}px - 4px)`);
          s.setProperty("--ay", `calc(50% - ${ty.toFixed(1)}px - 4px)`);
        }
      }
      p.pin.classList.toggle("displaced", leader);
    });
    // new pins: commit their position before enabling the slide transition, so they don't animate in
    const fresh = pins.filter((pin) => !pin.classList.contains("placed"));
    if (fresh.length) {
      void layer.offsetWidth;
      fresh.forEach((pin) => pin.classList.add("placed"));
    }
  }
  window.addEventListener("resize", () => window.mcLayoutPins());

  function init() {
    enhanceModules();
    enhanceHome();
    // phones: the swipeable nav fades + shows "›" until it has been scrolled to the end
    const nav = document.querySelector(".site-nav");
    const header = document.querySelector(".site-header");
    const syncNavEdge = () => {
      if (!nav) return;
      const end = nav.scrollLeft + nav.clientWidth >= nav.scrollWidth - 4;
      nav.classList.toggle("at-end", end);
      if (header) header.classList.toggle("nav-end", end);
    };
    if (nav) {
      nav.addEventListener("scroll", syncNavEdge, { passive: true });
      window.addEventListener("resize", syncNavEdge);
      syncNavEdge();
    }
    // phones: keep the active nav tab / sim mode scrolled into view in the swipeable rows
    const centerActive = (sel) => {
      const el = document.querySelector(sel);
      const bar = el && el.parentElement;
      if (!bar || bar.scrollWidth <= bar.clientWidth + 1) return;
      const br = bar.getBoundingClientRect(), er = el.getBoundingClientRect();
      bar.scrollTo({ left: Math.max(0, bar.scrollLeft + (er.left - br.left) - (br.width - er.width) / 2), behavior: "smooth" });
    };
    ["setNavTab", "setSimMode"].forEach((fn) => {
      const orig = window[fn];
      if (typeof orig !== "function" || orig.__mcWrapped) return;
      const wrapped = function (...args) {
        const r = orig.apply(this, args);
        requestAnimationFrame(() => { centerActive(".nav-btn.active"); centerActive(".sim-mode-btn.active"); setTimeout(syncNavEdge, 450); });
        return r;
      };
      wrapped.__mcWrapped = true;
      window[fn] = wrapped;
    });
    const grid = document.querySelector("#section-vr .sim-grid");
    if (grid && !document.getElementById("step-guide")) {
      grid.insertAdjacentHTML("afterend", `<h3 class="mc-h" id="step-guide-h">🎯 Step Visual Guide <span class="mc-chip">FOLLOWS THE ACTIVE TASK</span></h3><div class="step-guide" id="step-guide"></div>`);
    }
    renderGuide();
    syncUvTag();
    setInterval(() => {
      renderGuide();
      if (syncUvTag()) window.mcLayoutPins();
    }, 300);
  }

  if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", init);
  else init();
})();
