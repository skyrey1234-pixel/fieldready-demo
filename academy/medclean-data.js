// FieldReady Academy — Complete Curriculum, 3D Crime Scene, Hospital Room & Quiz Data
window.CRIME_SCENE_TASKS = [
  {
    id: 1,
    shortLabel: "BLOODY SHOEPRINTS",
    title: "Evidence #1: Bloody Shoeprint Trail on Floor (1,240 RLU)",
    rluInit: 1240,
    rluClean: 18,
    clearance: "≤25 RLU",
    tool: "Enzymatic Protein Dissolver + Microfiber Mop",
    pos3d: { x: -1.1, y: 0.02, z: 3.1 },
    lookAt3d: { x: -1.1, y: 0.35, z: 2.3 },
    standPos3d: { x: -0.9, z: 4.5, yaw: 0.12, pitch: -0.22 },
    visX: 44, visY: 82,
    desc: "Walk forward to Evidence Marker #1 on the floor. Spray the bloody shoeprint trail before walking deeper into the room so you don't track bloodborne pathogens outward.",
    protocol: "Crime-scene remediation always establishes a clean perimeter at the threshold first to prevent cross-tracking HIV/HBV/HCV outside the hot zone."
  },
  {
    id: 2,
    shortLabel: "ARTERIAL BLOOD POOL",
    title: "Evidence #2: Large Pooled Arterial Blood Spill (2,480 RLU)",
    rluInit: 2480,
    rluClean: 22,
    clearance: "≤25 RLU",
    tool: "EPA-Registered Bloodborne-Pathogen / Tuberculocidal Disinfectant + Absorbent Gel",
    pos3d: { x: 1.25, y: 0.02, z: 1.8 },
    lookAt3d: { x: 1.25, y: 0.25, z: 1.5 },
    standPos3d: { x: 0.85, z: 3.3, yaw: -0.24, pitch: -0.24 },
    visX: 60, visY: 73,
    desc: "Contain the large arterial blood pool from the outside perimeter inward using absorbent polymer granules, scoop with rigid scrapers, then apply EPA-registered tuberculocidal disinfectant for full contact time.",
    protocol: "High organic blood load inactivates standard sodium hypochlorite unless gross bulk material is absorbed and removed prior to chemical disinfection."
  },
  {
    id: 3,
    shortLabel: "DISCARDED SHARPS",
    title: "Evidence #3: Overturned Tray with Bloody Scalpel & Needles (1,620 RLU)",
    rluInit: 1620,
    rluClean: 14,
    clearance: "≤18 RLU",
    tool: "Mechanical Forceps + FDA-Cleared Puncture-Resistant Sharps Box",
    pos3d: { x: -2.4, y: 0.02, z: 0.6 },
    lookAt3d: { x: -2.4, y: 0.4, z: 0.4 },
    standPos3d: { x: -1.3, z: 2.0, yaw: 0.58, pitch: -0.2 },
    visX: 25, visY: 67,
    desc: "Never use gloved hands to pick up loose blades or hypodermic needles. Use mechanical forceps to transfer all sharps into the puncture-resistant sharps container, then sanitize the tray zone.",
    protocol: "OSHA 29 CFR 1910.1030(d)(4)(ii)(D): contaminated broken glassware must not be picked up directly with the hands — use mechanical means such as tongs, forceps, or a brush and dust pan. Treat loose sharps the same way."
  },
  {
    id: 4,
    shortLabel: "WALL BLOOD SPATTER",
    title: "Evidence #4: Cast-Off Arterial Wall Blood Spatter (1,890 RLU)",
    rluInit: 1890,
    rluClean: 16,
    clearance: "≤25 RLU",
    tool: "Foaming Enzymatic Cling Spray + Unidirectional S-Fold Wipe",
    pos3d: { x: 3.55, y: 1.45, z: -0.7 },
    lookAt3d: { x: 3.75, y: 1.45, z: -0.7 },
    standPos3d: { x: 1.7, z: 0.4, yaw: -1.05, pitch: 0.04 },
    visX: 83, visY: 42,
    desc: "Apply foaming enzymatic cleaner to the vertical cast-off blood spatter on the right wall so it clings without rapid runoff, allow protein lysis, then wipe top-to-bottom in S-strokes.",
    protocol: "Vertical surfaces dry rapidly; foaming surfactants maintain the required wet contact time to break down dried hemoglobin and fibrin matrices."
  },
  {
    id: 5,
    shortLabel: "CONTAMINATED TRAUMA BED & RAILS",
    title: "Evidence #5: Trauma Bed Rails & Mattress (960 RLU)",
    rluInit: 960,
    rluClean: 12,
    clearance: "≤18 RLU",
    tool: "Blue Color-Coded Microfiber (16-Surface Fold) + Quaternary/HP Disinfectant",
    pos3d: { x: -0.2, y: 0.92, z: -1.35 },
    lookAt3d: { x: -0.2, y: 0.85, z: -1.6 },
    standPos3d: { x: -0.2, z: 0.65, yaw: 0.0, pitch: -0.14 },
    visX: 48, visY: 54,
    desc: "Inspect the trauma gurney rails, mattress seams, and headboard spatter. Spray thoroughly and wipe from cleaner upper rails down toward heavily soiled zones, unfolding to a fresh cloth face.",
    protocol: "Mattress seams and bed side rails harbor high-touch biofilms; a damaged cover with fluid in the foam core must be taken out of service per facility policy."
  },
  {
    id: 6,
    shortLabel: "HIDDEN UV LATENT STAIN",
    title: "Evidence #6: Hidden UV Latent Body-Fluid Stain (840 RLU)",
    rluInit: 840,
    rluClean: 11,
    clearance: "≤18 RLU",
    tool: "365nm UV Blacklight Lamp + Hydrogen Peroxide Sporicidal",
    pos3d: { x: -3.5, y: 1.15, z: -1.6 },
    lookAt3d: { x: -3.7, y: 1.15, z: -1.6 },
    standPos3d: { x: -1.6, z: -0.4, yaw: 1.05, pitch: 0.0 },
    visX: 17, visY: 48,
    desc: "Toggle UV Blacklight ON to expose invisible biological proteins glowing purple/cyan on the left cabinet and floor perimeter, then scrub until fluorescence is eliminated.",
    protocol: "Clear plasma, serous fluid, and diluted body fluids are invisible under ambient light but fluoresce strongly under 365nm UV inspection."
  },
  {
    id: 7,
    shortLabel: "BIOHAZARD GAUZE & WASTE",
    title: "Evidence #7: Blood-Soaked Gauze & Red Biohazard Drum (1,150 RLU)",
    rluInit: 1150,
    rluClean: 15,
    clearance: "≤25 RLU",
    tool: "DOT-Compliant 6-Mil Red Biohazard Liner + Goose-Neck Tie",
    pos3d: { x: 2.35, y: 0.45, z: -2.65 },
    lookAt3d: { x: 2.45, y: 0.55, z: -2.8 },
    standPos3d: { x: 1.2, z: -1.0, yaw: -0.58, pitch: -0.16 },
    visX: 77, visY: 63,
    desc: "Segregate all caked, pourable, or dripping blood-soaked gauze into the double-lined Red Regulated Medical Waste (RMW) drum, goose-neck seal the bag, and disinfect the exterior rim.",
    protocol: "Items releasing liquid or semi-liquid blood when compressed are Regulated Medical Waste and cannot enter municipal trash streams."
  },
  {
    id: 8,
    shortLabel: "ATP & UV-C CLEARANCE",
    title: "Evidence #8: Final ATP Luminometer Swab (<25 RLU) & UV-C Sweep (210 RLU)",
    rluInit: 210,
    rluClean: 12,
    clearance: "≤18 RLU",
    tool: "Handheld ATP Bioluminescence Meter + 254nm UV-C Tower",
    pos3d: { x: 0.85, y: 1.1, z: -3.2 },
    lookAt3d: { x: 0.85, y: 1.1, z: -3.4 },
    standPos3d: { x: 0.4, z: -1.4, yaw: -0.22, pitch: -0.05 },
    visX: 35, visY: 29,
    desc: "Swab a 10×10cm cross-hatch grid with your ATP Luminometer to verify ≤25 RLU quantitative clearance, then run the 254nm UV-C tower cycle to complete forensic release.",
    protocol: "Quantitative ATP bioluminescence (<25 RLU for critical remediation) provides objective audit documentation before releasing a scene."
  }
];

window.HOSPITAL_ROOM_TASKS = [
  {
    id: 1,
    shortLabel: "DON FULL PPE",
    title: "Step 1: Don Full PPE (Gown, N95, Shield, Extended Gloves)",
    rluInit: 410,
    rluClean: 14,
    clearance: "≤25 RLU",
    tool: "AAMI Level 3 Isolation Gown + N95 + Face Shield + Nitrile Gloves",
    visX: 20, visY: 28,
    desc: "Perform hand hygiene, don fluid-resistant isolation gown, fit-check N95 respirator, secure full-face splash shield, and pull extended-cuff nitrile gloves over gown wrists.",
    protocol: "CDC Isolation Precautions require donning PPE in sequence (Gown → Mask/Respirator → Goggles/Face Shield → Gloves) before entering a contact/droplet isolation room."
  },
  {
    id: 2,
    shortLabel: "MAYO SHARPS",
    title: "Step 2: Isolate Contaminated Sharps from Mayo Stand (620 RLU)",
    rluInit: 620,
    rluClean: 19,
    clearance: "≤25 RLU",
    tool: "Hemostat Forceps + Wall-Mounted Sharps Collector",
    visX: 84, visY: 40,
    desc: "Inspect the rolling stainless Mayo stand before wiping. Remove any suture needles or scalpels using forceps into the sharps box, then disinfect the stainless tray.",
    protocol: "Sweeping a cloth across an uninspected procedure tray is a common way environmental services staff get stuck by hidden needles."
  },
  {
    id: 3,
    shortLabel: "FLOOR BLOOD SPILL",
    title: "Step 3: Bloodborne Spill Outside-In Containment & Scrub (890 RLU)",
    rluInit: 890,
    rluClean: 28,
    clearance: "≤50 RLU",
    tool: "1:10 Sodium Hypochlorite (5,000 ppm) + Spill Absorbent Pad",
    visX: 48, visY: 66,
    desc: "Absorb bulk blood on the vinyl floor from the outer edge inward, dispose of pads in red bag waste, and wet with fresh 1:10 bleach solution for full contact time.",
    protocol: "CDC guidelines specify a 1:10 dilution of household bleach (approx. 5,000 ppm available chlorine) after organic bulk removal for bloodborne pathogen spills."
  },
  {
    id: 4,
    shortLabel: "RED BIOHAZARD BIN",
    title: "Step 4: Segregate Infectious Waste into Red Biohazard Bin (480 RLU)",
    rluInit: 480,
    rluClean: 18,
    clearance: "≤25 RLU",
    tool: "Foot-Pedal Red RMW Container + EPA Hospital Disinfectant",
    visX: 73, visY: 57,
    desc: "Close and goose-neck seal the regulated medical waste liner when 3/4 full, never compress trash by hand, and sanitize the foot-pedal bin exterior and lid.",
    protocol: "Compressing medical waste bags by hand can force aerosols outward or drive hidden sharps through the liner."
  },
  {
    id: 5,
    shortLabel: "LEFT BED RAIL",
    title: "Step 5: S-Fold Microfiber Wipe on Left Bed Rail (720 RLU)",
    rluInit: 720,
    rluClean: 22,
    clearance: "≤25 RLU",
    tool: "Blue Color-Coded Microfiber (16 Clean Surfaces) + Disinfectant",
    visX: 35, visY: 52,
    desc: "Aim at the glowing purple biofilm on the '720 RLU LEFT BED RAIL' and click to wipe from top-to-bottom in unidirectional S-strokes, unfolding to a fresh quarter face.",
    protocol: "Microfiber removes soil and microbes mechanically far better than cotton when you use a fresh face per surface. Back-and-forth scrubbing redeposits soil and can spread MRSA and C. diff."
  },
  {
    id: 6,
    shortLabel: "RIGHT BED RAIL",
    title: "Step 6: Disinfect Right Bed Rail & Bed Controls (680 RLU)",
    rluInit: 680,
    rluClean: 21,
    clearance: "≤25 RLU",
    tool: "Fresh Fold of Blue Microfiber + One-Step Hospital Disinfectant",
    visX: 61, visY: 50,
    desc: "Rotate to a clean folded quadrant of your microfiber cloth and wipe the right bed rail and integrated patient pendant controls without double-dipping.",
    protocol: "Bed rails are among the most frequently touched and most contaminated surfaces in a patient room, so they need strict single-direction wiping."
  },
  {
    id: 7,
    shortLabel: "MATTRESS & CALL CORD",
    title: "Step 7: Sanitize Mattress Surface, Pillow & Nurse Call Cord (540 RLU)",
    rluInit: 540,
    rluClean: 20,
    clearance: "≤25 RLU",
    tool: "Matte-Safe Disinfectant Wipe + Seam Inspection",
    visX: 48, visY: 43,
    desc: "Wipe the nurse call button, cord, pillow cover, and impermeable mattress top, zippers, and underside flaps; verify required wet dwell time.",
    protocol: "Call cords and mattress zipper flaps are commonly missed when staff only wipe the center of the mattress."
  },
  {
    id: 8,
    shortLabel: "ATP SWAB & UV-C TOWER",
    title: "Step 8: Final ATP Bioluminescence Swab & UV-C Verification (185 RLU)",
    rluInit: 185,
    rluClean: 16,
    clearance: "≤25 RLU",
    tool: "Digital ATP Luminometer (<25 RLU Pass) + UV-C Emitter",
    visX: 49, visY: 22,
    desc: "Swab high-touch bed rails and call cord with the ATP Luminometer to confirm ≤25 RLU PASS, then log terminal room release for the next admission.",
    protocol: "ATP swabbing documents cleaning quality. No-touch UV-C can add pathogen reduction after manual cleaning, but it never replaces wiping."
  }
];

window.COURSE_MODULES = {
  fundamentals: {
    badge: "MODULE 1 • INFECTION CONTROL CORE",
    title: "Fundamentals of Biohazard & Healthcare Decontamination",
    subtitle: "Chain of Infection, Spaulding Classification, Mechanical Friction vs. Biofilm, and Wet Contact (Dwell) Time.",
    cards: [
      {
        tag: "CORE PRINCIPLE #1",
        title: "Cleaning Always Precedes Disinfection",
        body: "Organic soil (blood, serum, proteins, pus, feces) physically shields microbes and chemically neutralizes disinfectants—especially sodium hypochlorite (bleach) and quaternary ammonium compounds. Gross soil must be removed with detergent/enzymatic surfactant + mechanical friction before applying a disinfectant.",
        bullets: [
          "Step 1: Gross soil removal & enzymatic protein digestion",
          "Step 2: Unidirectional mechanical friction (S-fold microfiber)",
          "Step 3: EPA-registered disinfectant kept visibly wet for full label dwell time"
        ]
      },
      {
        tag: "CORE PRINCIPLE #2",
        title: "Spaulding Classification of Surfaces & Devices",
        body: "Rational selection of sterilization vs. high-, intermediate-, or low-level disinfection depends on risk of infection transmission:",
        bullets: [
          "Critical (Enters sterile tissue/vascular system): Surgical instruments → Steam Autoclave / EtO / H2O2 Plasma Sterilization",
          "Semi-Critical (Contacts mucous membranes): Endoscopes, laryngoscopes → High-Level Disinfection (Glutaraldehyde / OPA / Peracetic Acid)",
          "Non-Critical (Intact skin / environmental surfaces): Bed rails, floors, walls → Low- to Intermediate-Level EPA Hospital Disinfectant"
        ]
      },
      {
        tag: "CORE PRINCIPLE #3",
        title: "Biofilm Matrix Disruption & Contact Time",
        body: "Pathogens like MRSA, VRE, Pseudomonas, and Acinetobacter secrete extracellular polymeric substances (EPS) forming a protective biofilm within hours. Spraying alone cannot penetrate mature biofilm—split-fiber microfiber mechanical shear + full wet contact time (1–10 min per EPA label) is mandatory.",
        bullets: [
          "Never fan, blow-dry, or wipe off disinfectant before label dwell time expires",
          "Re-wet surfaces if evaporation occurs prior to required contact time",
          "Use sporicidal agents (EPA List K) for Clostridioides difficile rooms"
        ]
      }
    ]
  },
  facility: {
    badge: "MODULE 2 • ENVIRONMENTAL SERVICES (EVS)",
    title: "Facility & Terminal Patient Room Cleaning",
    subtitle: "Clockwise High-to-Low, Clean-to-Dirty Workflow, 16-Surface Color-Coded Microfiber Protocol & Isolation Turnover.",
    cards: [
      {
        tag: "WORKFLOW SEQUENCE",
        title: "Clean-to-Dirty & Top-to-Bottom Rule",
        body: "Always clean in a predictable clockwise pattern starting from the patient doorway threshold, moving from cleaner low-bioburden areas toward the patient bed (high-touch zone), and finishing with the restroom last.",
        bullets: [
          "Top-to-Bottom: Gravity pulls dust and droplets downward—clean overhead lights/vents before bed rails, and floors very last",
          "16-Surface Microfiber Fold: Fold cloth in quarters (8 faces per side) and rotate to a fresh quadrant for each surface",
          "Zero Double-Dipping: Never return a used cloth or mop head into clean disinfectant solution"
        ]
      },
      {
        tag: "HIGH-TOUCH SURFACES",
        title: "CDC Priority High-Touch Audit Checklist",
        body: "CDC environmental toolkits identify the following inpatient surfaces as critical reservoirs for hand-borne pathogen transmission:",
        bullets: [
          "Bed rails (left & right), bed adjustment controls, and nurse call button/cord",
          "Overbed tray table, IV pole grab zone, and bedside vital signs monitor/cables",
          "Room inner doorknob, light switches, sink faucets, and toilet flush handle/grab bars"
        ]
      },
      {
        tag: "COLOR CODING",
        title: "Standardized Microfiber Color Segregation",
        body: "Strict color-coding prevents cross-transferring enteric restroom pathogens onto patient care equipment:",
        bullets: [
          "Blue Cloths: General patient room high-touch surfaces & medical furnishings",
          "Green Cloths: Patient bathroom sinks, mirrors, and counters",
          "Red / Yellow Cloths: Toilets, bedpans, commodes, and high-risk biohazard zones (used once and bagged)"
        ]
      }
    ]
  },
  instruments: {
    badge: "MODULE 3 • STERILE PROCESSING (SPD / CSSD)",
    title: "Instrument Processing & Sterilization Workflow",
    subtitle: "Point-of-Use Pre-Cleaning, Negative-Pressure Decontamination, Ultrasonic Cavitation, Packaging & Biological Indicators.",
    cards: [
      {
        tag: "ZONE 1 • POINT OF USE",
        title: "Point-of-Use Transport & Enzymatic Foam",
        body: "Blood and saline allowed to dry on surgical stainless steel cause pitting corrosion and lock bioburden inside box locks and lumens.",
        bullets: [
          "Wipe gross blood immediately with sterile water (never saline—chloride pits steel)",
          "Open hinged box locks and spray with neutral-pH enzymatic transport gel/foam",
          "Transport in closed, rigid, puncture-proof biohazard-labeled containers to Decon"
        ]
      },
      {
        tag: "ZONE 2 • DECONTAMINATION",
        title: "Manual Below-Waterline Brushing & Ultrasonic Cleaning",
        body: "The Decontamination room operates under negative air pressure (≥10 air changes/hr) with full fluid-resistant PPE.",
        bullets: [
          "Brush instruments submerged BELOW the water surface to prevent infectious aerosol generation",
          "Ultrasonic Cavitation: Microscopic imploding bubbles strip soil from serrations and hinges after degassing",
          "Final rinse with Critical (Deionized / Reverse-Osmosis) water to prevent endotoxin and mineral spotting"
        ]
      },
      {
        tag: "ZONE 3 • STERILIZATION",
        title: "Steam Autoclave Parameters & Geobacillus Biological Monitoring",
        body: "Cleaned, dried, and inspected instruments are packaged with internal Class 4/5 chemical integrators and sterilized:",
        bullets: [
          "Dynamic-Air-Removal (Pre-Vacuum) Steam: 132°C (270°F) for 4 minutes exposure",
          "Gravity Displacement Steam: 121°C (250°F) for 30 minutes",
          "Biological Indicator (BI): Geobacillus stearothermophilus spores verify actual microbial lethality"
        ]
      }
    ]
  },
  waste: {
    badge: "MODULE 4 • OSHA 1910.1030 & DOT RMW",
    title: "Regulated Medical Waste (RMW) & Sharps Segregation",
    subtitle: "Federal OSHA Bloodborne Pathogens Standard, Red Bag Criteria, Sharps Fill Limits & Waste Stream Compliance.",
    cards: [
      {
        tag: "RED BAG CRITERIA",
        title: "What Legally Qualifies as Regulated Medical Waste?",
        body: "Not all hospital trash belongs in a Red Biohazard Bag. Over-segregating regular trash into RMW costs far more to treat and dispose of, while under-segregating creates safety and compliance violations:",
        bullets: [
          "Liquid or semi-liquid blood or Other Potentially Infectious Materials (OPIM)",
          "Contaminated items that would release liquid/semi-liquid blood if compressed",
          "Items caked with dried blood/OPIM capable of releasing flakes during handling",
          "Microbiological lab cultures/stocks and pathological anatomical waste"
        ]
      },
      {
        tag: "SHARPS SAFETY",
        title: "FDA-Cleared Sharps Containers & 3/4 Fill Line",
        body: "Needlesticks occur most frequently during disposal when containers are overfilled or improperly mounted:",
        bullets: [
          "Containers must be closable, puncture-resistant, leakproof on sides/bottom, and labeled with the biohazard symbol",
          "Permanently lock and replace when contents reach the 3/4 FULL line—never reach in or shake down",
          "Use mechanical forceps/tongs to retrieve dropped needles—never gloved fingers"
        ]
      },
      {
        tag: "PACKAGING & TRANSPORT",
        title: "Goose-Neck Sealing & Secondary Rigid Containment",
        body: "When removing a red biohazard liner:",
        bullets: [
          "Never squeeze air out against your body (risk of aerosol inhalation and hidden needle puncture)",
          "Twist the top into a tight goose-neck, fold over, and secure with heavy tape or tie",
          "Place sealed red bags inside rigid, leakproof, lidded secondary DOT transport drums"
        ]
      }
    ]
  },
  spills: {
    badge: "MODULE 5 • FORENSIC & CLINICAL SPILL RESPONSE",
    title: "Bloodborne Pathogen & Biohazard Spill Management",
    subtitle: "Outside-In Perimeter Containment, Organic Load vs. Chlorine Bleach, and Real-Time Disinfectant Dilution Calculator.",
    cards: [
      {
        tag: "6-STEP SPILL PROTOCOL",
        title: "OSHA 1910.1030 Blood Spill Response Sequence",
        body: "Execute every biohazard spill using the Outside-In containment method:",
        bullets: [
          "1. Secure perimeter with caution signage & don PPE (gown, N95/mask, eye shield, double nitrile gloves)",
          "2. Remove any broken glass or sharps from the spill using mechanical forceps/cardboard scoops",
          "3. Apply absorbent pads or solidifying polymer granules around the OUTER perimeter first, working inward",
          "4. Scoop absorbed bulk organic matter into a red biohazard bag before applying disinfectant",
          "5. Apply fresh 1:10 bleach (~5,000 ppm) or an EPA-registered disinfectant with HIV/HBV (bloodborne) claims, kept wet for the full label dwell time",
          "6. Wipe dry, doff PPE inside-out into biohazard waste, and perform handwashing"
        ]
      },
      {
        tag: "CHEMICAL SCIENCE",
        title: "Why Bulk Blood Must Be Removed Before Spraying Bleach",
        body: "Sodium hypochlorite reacts indiscriminately with organic proteins (hemoglobin, albumin). Flooding a thick pool of raw blood directly with bleach consumes free available chlorine on surface proteins, forms chloramines, and leaves viable HBV/HIV trapped underneath.",
        bullets: [
          "1:10 Dilution (1 part 5.25%–6% bleach : 9 parts water ≈ 5,000 ppm) for initial blood spill decontamination",
          "1:100 Dilution (≈ 500 ppm) for routine non-porous surface disinfection after cleaning",
          "Diluted bleach solutions lose potency rapidly and must be mixed fresh every 24 hours"
        ]
      }
    ]
  },
  qa: {
    badge: "MODULE 6 • QUANTITATIVE AUDIT & VERIFICATION",
    title: "Quality Assurance: Visual, Fluorescent & ATP Bioluminescence",
    subtitle: "Comparing Audit Methodologies, Firefly Luciferase RLU Chemistry, and Quantitative Clearance Benchmarks.",
    cards: [
      {
        tag: "ATP BIOLUMINESCENCE",
        title: "How Handheld ATP Luminometers Measure Bioburden (RLU)",
        body: "Adenosine Triphosphate (ATP) is the energy molecule present in living cells, microbes, and organic residue such as blood and body fluids. The swab reacts ATP with luciferin/luciferase to emit light measured in Relative Light Units (RLU). Example course thresholds below — real pass limits vary by device and facility:",
        bullets: [
          "≤ 25 RLU: PASS — Ultra-Clean / ICU / OR / Forensic Post-Remediation Clearance",
          "26 – 250 RLU: CAUTION — General Inpatient Acceptable / Marginal Zone (Reclean if high-risk)",
          "> 250 RLU: FAIL — High Organic Bioburden / Biofilm Present (Immediate Reclean Required)"
        ]
      },
      {
        tag: "AUDIT COMPARISON",
        title: "Visual Inspection vs. UV Fluorescent Markers vs. ATP",
        body: "Surfaces that look clean frequently fail fluorescent-marker or ATP audits — each method answers a different question:",
        bullets: [
          "Visual Observation: Subjective; misses invisible biofilms and clear body fluids",
          "Fluorescent UV Gel Marker: Evaluates physical wiping mechanics (did the cloth touch the target?)",
          "Quantitative ATP Swab (10×10cm grid): Measures actual residual organic and microbial bioburden in 15 seconds"
        ]
      }
    ]
  }
};

window.QUIZ_QUESTIONS = [
  {
    q: "1. When entering a crime scene or trauma room with bloody shoeprints at the doorway (#1), why must you remediate the threshold first?",
    opts: [
      "Because doorway tiles absorb stains faster than center tiles",
      "To establish a clean perimeter and prevent cross-tracking bloodborne pathogens (HIV/HBV/HCV) outward",
      "Because ATP meters only calibrate near room entrances",
      "To allow the UV-C tower to run while staff walk through the room"
    ],
    ans: 1,
    exp: "Establishing a clean entry threshold prevents boots and equipment wheels from tracking bloodborne pathogens outside the hot zone."
  },
  {
    q: "2. Why must gross pooled blood (#2) be absorbed and scooped up BEFORE applying sodium hypochlorite (bleach)?",
    opts: [
      "Bleach turns solid blood into a permanent purple dye",
      "High organic protein loads chemically neutralize free chlorine before it can kill deeper pathogens",
      "Bleach only works on vertical surfaces",
      "Absorbent granules increase the RLU reading to 5,000"
    ],
    ans: 1,
    exp: "Organic proteins in bulk blood rapidly consume free available chlorine, preventing effective microbial inactivation unless bulk soil is removed first."
  },
  {
    q: "3. Under OSHA 29 CFR 1910.1030, how must you handle the overturned tray with a bloody scalpel and hypodermic needles (#3)?",
    opts: [
      "Pick them up carefully using double nitrile gloves",
      "Sweep them into a dustpan with a wet microfiber mop",
      "Use mechanical forceps/tongs and place them immediately into an FDA-cleared puncture-resistant sharps container",
      "Wrap them in red biohazard gauze and place in a soft red bag"
    ],
    ans: 2,
    exp: "OSHA strictly prohibits picking up contaminated sharps or broken glass directly by hand; mechanical tools (forceps/tongs) and rigid sharps containers are required."
  },
  {
    q: "4. What is the correct wiping technique with a split-conjugated microfiber cloth on a contaminated bed rail (720 RLU)?",
    opts: [
      "Vigorous back-and-forth scrubbing across all four rails with one cloth face",
      "Unidirectional top-to-bottom S-strokes, folding the cloth into 16 clean quadrants so a fresh face is used per surface",
      "Circular buffing after spraying dry",
      "Dipping the same cloth repeatedly into an open bucket of bleach"
    ],
    ans: 1,
    exp: "Unidirectional S-strokes with a fresh folded face per surface remove soil mechanically without redepositing MRSA or C. diff across surfaces."
  },
  {
    q: "5. What happens if an EPA-registered disinfectant evaporates from a vertical wall spatter (#4) before its label contact (dwell) time expires?",
    opts: [
      "The surface is automatically sterile once dry",
      "Pathogens inside the biofilm may survive; the surface must be re-wetted to maintain full wet dwell time",
      "The ATP reading drops to 0 RLU",
      "You must switch to plain tap water"
    ],
    ans: 1,
    exp: "Disinfectants only kill the pathogens listed on their EPA label if the surface remains visibly wet for the full specified contact (dwell) time."
  },
  {
    q: "6. Why do forensic and hospital infection-control teams use a 365nm UV Blacklight lamp (#6) during inspection?",
    opts: [
      "365nm UV-A instantly sterilizes C. diff spores in 1 second",
      "Latent biological proteins, plasma, and body fluids that are invisible under normal light fluoresce under 365nm UV",
      "It recharges the battery of the handheld ATP luminometer",
      "It replaces the need for personal protective equipment"
    ],
    ans: 1,
    exp: "365nm UV blacklight causes invisible biological residues and fluorescent audit markers to glow, revealing missed contamination zones."
  },
  {
    q: "7. Which item legally requires disposal inside a DOT-compliant Red Regulated Medical Waste (RMW) container (#7)?",
    opts: [
      "A paper towel used to dry clean hands after washing",
      "Empty cardboard packaging from sterile gloves",
      "Blood-soaked gauze that releases liquid or semi-liquid blood when compressed",
      "A food wrapper from the nurse breakroom"
    ],
    ans: 2,
    exp: "Under OSHA 1910.1030, items saturated to the point of releasing liquid/semi-liquid blood or caked dried blood are Regulated Medical Waste."
  },
  {
    q: "8. In FieldReady Academy's forensic & critical-care ATP bioluminescence clearance protocol (#8), what RLU reading confirms a strict forensic/ICU PASS?",
    opts: [
      "≤ 25 RLU (with <250 RLU as the upper general baseline limit)",
      "1,240 RLU",
      "2,480 RLU",
      "Any reading above 900 RLU"
    ],
    ans: 0,
    exp: "Quantitative ATP swabbing verifies organic/microbial residue reduction; ≤25 RLU represents strict critical/forensic remediation pass criteria."
  }
  ,
  {
    q: "9. PHOTO: This worker is finishing donning PPE. In the common CDC donning sequence, which item goes on LAST?",
    img: "./photos/ppe-donning.jpg",
    opts: ["Gown", "N95 respirator", "Gloves, pulled over the gown cuffs", "Face shield"],
    ans: 2,
    exp: "Hand hygiene → gown → mask/respirator → eye protection → gloves. Gloves go on last so they overlap the gown cuffs."
  },
  {
    q: "10. PHOTO: Why is the absorbent placed as a ring around the edge of this spill?",
    img: "./photos/spill-outside-in.jpg",
    opts: [
      "It looks neater for the audit",
      "Working from the outer edge inward keeps the spill from spreading",
      "Absorbent only works on a dry floor",
      "So bleach can be poured into the middle first"
    ],
    ans: 1,
    exp: "Outside-in containment stops the spill from spreading while you absorb and scoop the bulk material."
  },
  {
    q: "11. PHOTO: Why is this technician brushing the instrument BELOW the waterline?",
    img: "./photos/spd-brush-underwater.jpg",
    opts: [
      "Water makes the brush bristles softer",
      "To keep contaminated splashes and aerosols out of the air",
      "Enzymatic cleaners only work underwater",
      "Brushing underwater replaces sterilization"
    ],
    ans: 1,
    exp: "Brushing below the surface keeps contaminated fluid from splashing or aerosolizing onto the technician."
  },
  {
    q: "12. PHOTO: Under a blacklight, fluorescent marks still glow on these surfaces after cleaning. What does that tell you?",
    img: "./photos/room-uv-residue.jpg",
    opts: [
      "The disinfectant worked",
      "Those surfaces were not wiped",
      "The bacteria count is zero",
      "The UV lamp needs replacing"
    ],
    ans: 1,
    exp: "Fluorescent marker audits check wiping coverage: anything still glowing was missed and needs re-cleaning."
  }
];
