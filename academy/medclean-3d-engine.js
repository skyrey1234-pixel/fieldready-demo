// FieldReady Academy — Complete 3D Walkable Crime Scene Engine, Hospital Room VR & Course Controller
(function () {
  const state = {
    navTab: "vr",
    simMode: "crime3d", // 'crime3d' | 'hospital' | 'photovisor' | 'booth'
    activeIdx: 0,
    cleanedCrime: new Set(),
    cleanedHospital: new Set(),
    foundCrime: new Set([1, 2, 3]),
    uvOn: true,
    soundOn: true,
    curRlu: 1240,
    actionTimer: null,
    // 3D Player Walk & 360 Look State
    camX: -0.2,
    camY: 1.55,
    camZ: 4.3,
    yaw: 0.0,
    pitch: -0.14,
    targetX: -0.2,
    targetZ: 4.3,
    targetYaw: 0.0,
    targetPitch: -0.14,
    keys: {},
    // 2D Panorama Pan/Zoom for Hospital & Photo Visor modes
    panX: 0,
    panY: 0,
    zoom: 1.0,
    // Quiz State
    quizAnswers: {},
    quizSubmitted: false
  };

  window.medCleanState = state;

  // Synthesized Audio Feedback (Web Audio API - zero external files needed)
  let audioCtx = null;
  function playSound(kind) {
    if (!state.soundOn) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
      const now = audioCtx.currentTime;
      if (kind === "spray") {
        const bufferSize = audioCtx.sampleRate * 0.45;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.6));
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 1800;
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.44);
        noise.connect(filter).connect(gain).connect(audioCtx.destination);
        noise.start(now);
      } else if (kind === "pass") {
        [587.33, 880, 1174.66].forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.12, now + idx * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.25);
          osc.connect(gain).connect(audioCtx.destination);
          osc.start(now + idx * 0.09);
          osc.stop(now + idx * 0.09 + 0.26);
        });
      } else if (kind === "click") {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.value = 520;
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
      }
    } catch (e) {}
  }

  function getActiveTaskList() {
    return state.simMode === "hospital" ? window.HOSPITAL_ROOM_TASKS : window.CRIME_SCENE_TASKS;
  }

  function getActiveCleanSet() {
    return state.simMode === "hospital" ? state.cleanedHospital : state.cleanedCrime;
  }

  // ==================== THREE.JS 3D WALKABLE CRIME SCENE ROOM ====================
  let scene, camera, renderer, raycaster, floorMesh, walkRing;
  let ambientLight, mainPointLight, uvPointLight, uvFloorLight;
  let markerMeshes = [];
  let stainMeshes = {};
  let uvLatentMeshes = [];
  let sprayParticles = null;
  let sprayBurstFrames = 0;
  let sprayTargetVec = null;

  function makeNumberTentTexture(num, isClean) {
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext("2d");
    ctx.fillStyle = isClean ? "#22c55e" : "#facc15";
    ctx.fillRect(0, 0, 128, 128);
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, 120, 120);
    ctx.fillStyle = "#0f172a";
    ctx.font = "900 72px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(num), 64, 68);
    return new THREE.CanvasTexture(c);
  }

  function makeFloorTexture() {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 4;
    for (let i = 0; i <= 512; i += 64) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    return tex;
  }

  function makeCautionTapeTexture() {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 128;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#facc15";
    ctx.fillRect(0, 0, 1024, 128);
    ctx.fillStyle = "#0f172a";
    for (let x = -128; x < 1152; x += 160) {
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x + 45, 0); ctx.lineTo(x + 15, 128); ctx.lineTo(x - 30, 128);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = "#facc15";
    ctx.fillRect(0, 26, 1024, 76);
    ctx.fillStyle = "#0f172a";
    ctx.font = "900 44px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("⚠ CRIME SCENE BIOHAZARD • DO NOT CROSS ⚠", 512, 64);
    return new THREE.CanvasTexture(c);
  }

  function initThreeRoom() {
    const mount = document.getElementById("three-crime-mount");
    if (!mount || typeof THREE === "undefined") return;
    mount.innerHTML = "";

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111827);
    scene.fog = new THREE.Fog(0x111827, 7, 17);

    const w = mount.clientWidth || 760;
    const h = mount.clientHeight || 520;
    camera = new THREE.PerspectiveCamera(62, w / h, 0.1, 40);
    camera.rotation.order = "YXZ";

    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mount.appendChild(renderer.domElement);

    raycaster = new THREE.Raycaster();

    // Lighting
    ambientLight = new THREE.AmbientLight(0xdbeafe, 0.65);
    scene.add(ambientLight);

    mainPointLight = new THREE.PointLight(0xf8fafc, 0.85, 20);
    mainPointLight.position.set(0, 3.1, 0.5);
    scene.add(mainPointLight);

    uvPointLight = new THREE.PointLight(0xa855f7, 1.35, 18);
    uvPointLight.position.set(0, 2.9, -0.5);
    scene.add(uvPointLight);

    uvFloorLight = new THREE.PointLight(0x38bdf8, 0.65, 12);
    uvFloorLight.position.set(-1.2, 1.2, 1.5);
    scene.add(uvFloorLight);

    // Room Floor (8m wide x 10m deep)
    const floorGeo = new THREE.PlaneGeometry(8.2, 10.4);
    const floorMat = new THREE.MeshStandardMaterial({
      map: makeFloorTexture(),
      roughness: 0.55,
      metalness: 0.08
    });
    floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.name = "floor";
    scene.add(floorMesh);

    // Ceiling & 4 Walls
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.8 });
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(8.2, 3.6), wallMat);
    backWall.position.set(0, 1.8, -5.2);
    scene.add(backWall);

    const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(8.2, 3.6), wallMat);
    frontWall.position.set(0, 1.8, 5.2);
    frontWall.rotation.y = Math.PI;
    scene.add(frontWall);

    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(10.4, 3.6), wallMat);
    leftWall.position.set(-4.1, 1.8, 0);
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(10.4, 3.6), wallMat);
    rightWall.position.set(4.1, 1.8, 0);
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(8.2, 10.4),
      new THREE.MeshBasicMaterial({ color: 0x1e293b })
    );
    ceiling.position.y = 3.6;
    ceiling.rotation.x = Math.PI / 2;
    scene.add(ceiling);

    // Baseboard Trim
    const trimMat = new THREE.MeshBasicMaterial({ color: 0x334155 });
    const backTrim = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.14, 0.06), trimMat);
    backTrim.position.set(0, 0.07, -5.16);
    scene.add(backTrim);

    // Yellow CRIME SCENE BIOHAZARD Caution Tape Ribbon across room
    const tapeMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(8.0, 0.34),
      new THREE.MeshBasicMaterial({ map: makeCautionTapeTexture(), side: THREE.DoubleSide })
    );
    tapeMesh.position.set(0, 2.25, -2.5);
    scene.add(tapeMesh);

    // Walk Target Indicator Ring on Floor
    walkRing = new THREE.Mesh(
      new THREE.RingGeometry(0.18, 0.28, 32),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.75 })
    );
    walkRing.rotation.x = -Math.PI / 2;
    walkRing.position.set(state.camX, 0.015, state.camZ - 1.2);
    scene.add(walkRing);

    // ==================== 3D FORENSIC FURNITURE & PROPS ====================
    // 1. Hospital Trauma Gurney / Bed (#5)
    const bedGroup = new THREE.Group();
    bedGroup.position.set(-0.2, 0, -1.55);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.5, roughness: 0.4 });
    const mattressMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.6 });
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.22, 2.25), mattressMat);
    mattress.position.y = 0.78;
    bedGroup.add(mattress);

    const headBoard = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.65, 0.1), mattressMat);
    headBoard.position.set(0, 1.15, -1.1);
    bedGroup.add(headBoard);

    // Legs & Side Rails
    [[-0.5, -0.95], [0.5, -0.95], [-0.5, 0.95], [0.5, 0.95]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.75, 12), frameMat);
      leg.position.set(lx, 0.375, lz);
      bedGroup.add(leg);
    });
    const leftRail = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.28, 1.55), frameMat);
    leftRail.position.set(-0.6, 1.0, 0);
    bedGroup.add(leftRail);
    const rightRail = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.28, 1.55), frameMat);
    rightRail.position.set(0.6, 1.0, 0);
    bedGroup.add(rightRail);
    scene.add(bedGroup);

    // 2. Fire Extinguisher on Left Wall
    const extGroup = new THREE.Group();
    const extBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.58, 16),
      new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3 })
    );
    extGroup.add(extBody);
    extGroup.position.set(-3.95, 1.35, -2.2);
    scene.add(extGroup);

    // 3. Left Storage Cabinet (#6 Hidden UV Latent Stain)
    const cab = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 1.6, 1.3),
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6 })
    );
    cab.position.set(-3.7, 0.8, -1.6);
    scene.add(cab);

    // 4. Overturned Stainless Mayo Tray & Sharps (#3)
    const tray = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.04, 0.45),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.25 })
    );
    tray.position.set(-2.4, 0.03, 0.55);
    tray.rotation.y = 0.35;
    scene.add(tray);

    // 5. Red Biohazard Drum & Wall Sharps Container (#7)
    const redDrum = new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.32, 0.85, 24),
      new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 })
    );
    redDrum.position.set(2.55, 0.425, -2.75);
    scene.add(redDrum);

    // 6. 254nm UV-C Disinfection Tower (#8)
    const uvTowerGroup = new THREE.Group();
    uvTowerGroup.position.set(0.85, 0, -3.35);
    const towerBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.32, 0.35, 20),
      new THREE.MeshStandardMaterial({ color: 0x334155 })
    );
    towerBase.position.y = 0.175;
    uvTowerGroup.add(towerBase);
    const towerBulb = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 1.45, 16),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    towerBulb.position.y = 1.05;
    uvTowerGroup.add(towerBulb);
    scene.add(uvTowerGroup);

    // 7. Scale Reference Cube on Left Floor
    const scaleDie = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.28, 0.28),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 })
    );
    scaleDie.position.set(-2.25, 0.14, 1.9);
    scene.add(scaleDie);

    // ==================== CONTAMINATION STAINS & UV BIOFILMS ====================
    stainMeshes = {};
    uvLatentMeshes = [];

    const bloodMat = () => new THREE.MeshBasicMaterial({
      color: 0x991b1b,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    });
    const uvGlowMat = () => new THREE.MeshBasicMaterial({
      color: 0xc026d3,
      transparent: true,
      opacity: 0.78,
      side: THREE.DoubleSide
    });

    // Stain #1: Bloody Shoeprints Trail
    const s1 = new THREE.Group();
    [[-1.1, 3.1], [-0.95, 2.55], [-1.12, 2.0], [-0.92, 1.45]].forEach(([sx, sz]) => {
      const print = new THREE.Mesh(new THREE.CircleGeometry(0.16, 16), bloodMat());
      print.rotation.x = -Math.PI / 2;
      print.position.set(sx, 0.011, sz);
      s1.add(print);
      const uvP = new THREE.Mesh(new THREE.RingGeometry(0.14, 0.22, 16), uvGlowMat());
      uvP.rotation.x = -Math.PI / 2;
      uvP.position.set(sx, 0.013, sz);
      s1.add(uvP);
      uvLatentMeshes.push(uvP);
    });
    scene.add(s1);
    stainMeshes[1] = s1;

    // Stain #2: Arterial Blood Pool
    const s2 = new THREE.Group();
    const pool = new THREE.Mesh(new THREE.CircleGeometry(0.68, 28), bloodMat());
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(1.25, 0.012, 1.8);
    s2.add(pool);
    const poolUv = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.78, 28), uvGlowMat());
    poolUv.rotation.x = -Math.PI / 2;
    poolUv.position.set(1.25, 0.014, 1.8);
    s2.add(poolUv);
    uvLatentMeshes.push(poolUv);
    scene.add(s2);
    stainMeshes[2] = s2;

    // Stain #3: Sharps Spatter
    const s3 = new THREE.Mesh(new THREE.CircleGeometry(0.42, 20), bloodMat());
    s3.rotation.x = -Math.PI / 2;
    s3.position.set(-2.4, 0.012, 0.55);
    scene.add(s3);
    stainMeshes[3] = s3;

    // Stain #4: Cast-Off Wall Blood Spatter (Right Wall & Back Wall)
    const s4 = new THREE.Group();
    const wallSplat = new THREE.Mesh(new THREE.CircleGeometry(0.62, 24), bloodMat());
    wallSplat.position.set(4.06, 1.45, -0.7);
    wallSplat.rotation.y = -Math.PI / 2;
    s4.add(wallSplat);
    const backSplat = new THREE.Mesh(new THREE.CircleGeometry(0.55, 24), bloodMat());
    backSplat.position.set(-0.2, 1.75, -5.15);
    s4.add(backSplat);
    scene.add(s4);
    stainMeshes[4] = s4;

    // Stain #5: Trauma Bed Mattress & Headboard Blood
    const s5 = new THREE.Group();
    const bedSplat = new THREE.Mesh(new THREE.CircleGeometry(0.46, 24), bloodMat());
    bedSplat.rotation.x = -Math.PI / 2;
    bedSplat.position.set(-0.2, 0.90, -1.55);
    s5.add(bedSplat);
    const hbSplat = new THREE.Mesh(new THREE.CircleGeometry(0.35, 20), bloodMat());
    hbSplat.position.set(-0.2, 1.18, -2.59);
    s5.add(hbSplat);
    scene.add(s5);
    stainMeshes[5] = s5;

    // Stain #6: Hidden UV Latent Body-Fluid Stain on Left Cabinet & Floor
    const s6 = new THREE.Group();
    const cabGlow = new THREE.Mesh(new THREE.CircleGeometry(0.44, 24), uvGlowMat());
    cabGlow.position.set(-3.36, 1.1, -1.6);
    cabGlow.rotation.y = Math.PI / 2;
    s6.add(cabGlow);
    const floorGlow = new THREE.Mesh(new THREE.CircleGeometry(0.5, 24), uvGlowMat());
    floorGlow.rotation.x = -Math.PI / 2;
    floorGlow.position.set(-2.9, 0.015, -1.6);
    s6.add(floorGlow);
    uvLatentMeshes.push(cabGlow, floorGlow);
    scene.add(s6);
    stainMeshes[6] = s6;

    // Stain #7: Blood-Soaked Gauze around Red Biohazard Drum
    const s7 = new THREE.Mesh(new THREE.CircleGeometry(0.45, 20), bloodMat());
    s7.rotation.x = -Math.PI / 2;
    s7.position.set(2.3, 0.012, -2.5);
    scene.add(s7);
    stainMeshes[7] = s7;

    // Stain #8: Final UV-C / ATP Clearance Zone Ring
    const s8 = new THREE.Mesh(new THREE.RingGeometry(0.32, 0.48, 24), uvGlowMat());
    s8.rotation.x = -Math.PI / 2;
    s8.position.set(0.85, 0.015, -3.0);
    uvLatentMeshes.push(s8);
    scene.add(s8);
    stainMeshes[8] = s8;

    // ==================== 8 NUMBERED 3D EVIDENCE MARKER TENTS ====================
    markerMeshes = [];
    window.CRIME_SCENE_TASKS.forEach((task, idx) => {
      const group = new THREE.Group();
      group.position.set(task.pos3d.x, task.pos3d.y, task.pos3d.z);

      const tentGeo = new THREE.BoxGeometry(0.34, 0.34, 0.24);
      const tentMat = new THREE.MeshBasicMaterial({
        map: makeNumberTentTexture(task.id, state.cleanedCrime.has(task.id))
      });
      const tent = new THREE.Mesh(tentGeo, tentMat);
      tent.position.y = 0.18;
      tent.userData = { taskIdx: idx, taskId: task.id };
      group.add(tent);

      const ringGeo = new THREE.RingGeometry(0.26, 0.36, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: state.cleanedCrime.has(task.id) ? 0x22c55e : 0xfacc15,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.01;
      ring.userData = { taskIdx: idx, taskId: task.id };
      group.add(ring);

      group.userData = { taskIdx: idx, taskId: task.id, tent, ring };
      scene.add(group);
      markerMeshes.push(group);
    });

    // ==================== 3D SPRAY PARTICLE MIST ====================
    const pCount = 260;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(pCount * 3);
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.09,
      transparent: true,
      opacity: 0.85
    });
    sprayParticles = new THREE.Points(pGeo, pMat);
    sprayParticles.visible = false;
    scene.add(sprayParticles);

    window.medCleanThree = { scene, camera, renderer, markerMeshes, stainMeshes };
    setupPointerAndDrag(renderer.domElement);
    syncThreeStainsAndMarkers();
  }

  function syncThreeStainsAndMarkers() {
    if (!scene) return;
    // Update UV lighting
    if (uvPointLight && ambientLight && mainPointLight) {
      uvPointLight.intensity = state.uvOn ? 1.55 : 0.0;
      uvFloorLight.intensity = state.uvOn ? 0.75 : 0.0;
      ambientLight.intensity = state.uvOn ? 0.45 : 0.82;
      mainPointLight.intensity = state.uvOn ? 0.55 : 0.95;
    }
    uvLatentMeshes.forEach((m) => {
      m.visible = state.uvOn;
    });
    window.CRIME_SCENE_TASKS.forEach((t) => {
      const isClean = state.cleanedCrime.has(t.id);
      if (stainMeshes[t.id]) stainMeshes[t.id].visible = !isClean;
    });
    markerMeshes.forEach((g) => {
      const id = g.userData.taskId;
      const isClean = state.cleanedCrime.has(id);
      g.userData.tent.material.map = makeNumberTentTexture(id, isClean);
      g.userData.tent.material.needsUpdate = true;
      g.userData.ring.material.color.setHex(isClean ? 0x22c55e : (state.activeIdx + 1 === id ? 0x38bdf8 : 0xfacc15));
    });
  }

  function setupPointerAndDrag(canvas) {
    let dragging = false;
    let downX = 0, downY = 0;
    let moved = false;

    canvas.addEventListener("pointerdown", (e) => {
      dragging = true;
      moved = false;
      downX = e.clientX;
      downY = e.clientY;
    });

    window.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - downX;
      const dy = e.clientY - downY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
      downX = e.clientX;
      downY = e.clientY;
      state.targetYaw -= dx * 0.0055;
      state.targetPitch = Math.max(-0.75, Math.min(0.65, state.targetPitch - dy * 0.0045));
    });

    window.addEventListener("pointercancel", () => {
      dragging = false;
    });

    window.addEventListener("pointerup", (e) => {
      if (!dragging) return;
      dragging = false;
      if (moved || state.simMode !== "crime3d") return;

      const rect = canvas.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) return;

      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(mouse, camera);

      // 1. Check if clicked an Evidence Marker Tent
      const clickTargets = [];
      markerMeshes.forEach((g) => {
        clickTargets.push(g.userData.tent, g.userData.ring);
      });
      const markerHits = raycaster.intersectObjects(clickTargets, false);
      if (markerHits.length > 0) {
        const idx = markerHits[0].object.userData.taskIdx;
        window.selectTask(idx, true);
        window.triggerCleanAction();
        return;
      }

      // 2. Check if clicked the 3D Floor to walk there
      if (floorMesh) {
        const floorHits = raycaster.intersectObject(floorMesh, false);
        if (floorHits.length > 0) {
          const pt = floorHits[0].point;
          state.targetX = Math.max(-3.3, Math.min(3.3, pt.x));
          state.targetZ = Math.max(-4.1, Math.min(4.6, pt.z));
          if (walkRing) walkRing.position.set(state.targetX, 0.016, state.targetZ);
          playSound("click");
        }
      }
    });
  }

  // ==================== ROOM RADAR MINI-MAP & FLOATING CALLOUTS ====================
  function drawRoomRadar() {
    const canvas = document.getElementById("radar-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    ctx.clearRect(0, 0, w, h);

    // Radar background & rings
    ctx.fillStyle = "rgba(8, 15, 29, 0.92)";
    ctx.beginPath();
    ctx.arc(cx, cy, cx - 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(250, 204, 21, 0.65)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.strokeStyle = "rgba(56, 189, 248, 0.22)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, (cx - 6) * 0.55, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 6); ctx.lineTo(cx, h - 6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(6, cy); ctx.lineTo(w - 6, cy); ctx.stroke();

    const mapX = (x3d) => cx + (x3d / 4.2) * (cx - 14);
    const mapY = (z3d) => cy + (z3d / 5.2) * (cy - 14);

    // Draw 8 Evidence Markers on Radar
    window.CRIME_SCENE_TASKS.forEach((t, idx) => {
      const mx = mapX(t.pos3d.x);
      const my = mapY(t.pos3d.z);
      const isClean = state.cleanedCrime.has(t.id);
      const isActive = idx === state.activeIdx;
      ctx.fillStyle = isClean ? "#22c55e" : isActive ? "#facc15" : "#ef4444";
      ctx.beginPath();
      ctx.arc(mx, my, isActive ? 5.5 : 4.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "700 8px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(t.id), mx, my - 6);
    });

    // Draw Player Dot & View Cone
    const px = mapX(state.camX);
    const py = mapY(state.camZ);
    const dirAngle = -Math.PI / 2 - state.yaw;
    ctx.fillStyle = "rgba(56, 189, 248, 0.24)";
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.arc(px, py, 22, dirAngle - 0.45, dirAngle + 0.45);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function updateFloating3DLabels() {
    const layer = document.getElementById("floating-callouts-layer");
    const mount = document.getElementById("three-crime-mount");
    if (!layer || !mount || state.simMode !== "crime3d" || !camera) return;

    const width = mount.clientWidth || 760;
    const height = mount.clientHeight || 520;

    window.CRIME_SCENE_TASKS.forEach((t, idx) => {
      let el = document.getElementById("callout-3d-" + t.id);
      if (!el) {
        el = document.createElement("button");
        el.id = "callout-3d-" + t.id;
        el.className = "floating-callout";
        el.onclick = (ev) => {
          ev.stopPropagation();
          window.selectTask(idx, true);
        };
        layer.appendChild(el);
      }

      const worldVec = new THREE.Vector3(t.pos3d.x, t.pos3d.y + 0.42, t.pos3d.z);
      const dist = Math.hypot(t.pos3d.x - state.camX, t.pos3d.z - state.camZ);
      if (dist < 4.5) state.foundCrime.add(t.id);

      const projected = worldVec.clone().project(camera);
      if (projected.z > 1 || projected.z < -1) {
        el.style.display = "none";
        return;
      }

      const sx = (projected.x * 0.5 + 0.5) * width;
      const sy = (-projected.y * 0.5 + 0.5) * height;
      if (sx < 25 || sx > width - 25 || sy < 45 || sy > height - 75) {
        el.style.display = "none";
        return;
      }

      const isClean = state.cleanedCrime.has(t.id);
      const isActive = idx === state.activeIdx;
      const rlu = isClean ? t.rluClean : t.rluInit;
      const cls = "floating-callout" + (isActive ? " active" : "") + (isClean ? " clean" : "");
      const html = `<span class="fc-title"><span class="fc-pre">EVIDENCE </span>#${t.id}<span class="fc-name">: ${t.shortLabel} (${dist.toFixed(1)}m)</span></span><span class="fc-rlu">${rlu} RLU ${isClean ? "PASS ✓" : "BIOHAZARD !"}</span>`;
      // only touch the DOM when something changed, and keep the label inside the viewport
      if (el.className !== cls) { el.className = cls; el._w = 0; }
      if (el._html !== html) { el.innerHTML = html; el._html = html; el._w = 0; }
      el.style.display = "flex";
      if (!el._w) el._w = el.offsetWidth;
      const half = el._w / 2;
      el.style.left = Math.min(Math.max(sx, half + 4), width - half - 4) + "px";
      el.style.top = sy + "px";
    });
  }

  // ==================== ANIMATION LOOP ====================
  function animateLoop() {
    requestAnimationFrame(animateLoop);

    // Keyboard / Walk-Pad Continuous Movement
    const moveSpeed = 0.065;
    const turnSpeed = 0.032;
    if (state.keys["ArrowLeft"] || state.keys["KeyQ"]) state.targetYaw += turnSpeed;
    if (state.keys["ArrowRight"] || state.keys["KeyE"]) state.targetYaw -= turnSpeed;

    let forward = 0, strafe = 0;
    if (state.keys["KeyW"] || state.keys["ArrowUp"]) forward += 1;
    if (state.keys["KeyS"] || state.keys["ArrowDown"]) forward -= 1;
    if (state.keys["KeyA"]) strafe -= 1;
    if (state.keys["KeyD"]) strafe += 1;

    if (forward !== 0 || strafe !== 0) {
      if (state.simMode === "crime3d") {
        const fx = -Math.sin(state.yaw);
        const fz = -Math.cos(state.yaw);
        const rx = Math.cos(state.yaw);
        const rz = -Math.sin(state.yaw);
        state.targetX = Math.max(-3.3, Math.min(3.3, state.targetX + (fx * forward + rx * strafe) * moveSpeed));
        state.targetZ = Math.max(-4.1, Math.min(4.6, state.targetZ + (fz * forward + rz * strafe) * moveSpeed));
      } else {
        state.panX = Math.max(-120, Math.min(120, state.panX - strafe * 3.2));
        state.panY = Math.max(-80, Math.min(80, state.panY + forward * 3.2));
        apply2DStageTransform();
      }
    }

    if (state.simMode === "crime3d" && renderer && scene && camera) {
      state.camX += (state.targetX - state.camX) * 0.14;
      state.camZ += (state.targetZ - state.camZ) * 0.14;
      state.yaw += (state.targetYaw - state.yaw) * 0.18;
      state.pitch += (state.targetPitch - state.pitch) * 0.18;

      camera.position.set(state.camX, state.camY, state.camZ);
      camera.rotation.y = state.yaw;
      camera.rotation.x = state.pitch;

      // Animate 3D Spray Mist if active
      if (sprayBurstFrames > 0 && sprayParticles && sprayTargetVec) {
        sprayBurstFrames--;
        sprayParticles.visible = true;
        const posAttr = sprayParticles.geometry.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
          const t = Math.random();
          const px = state.camX + (sprayTargetVec.x - state.camX) * t + (Math.random() - 0.5) * 0.45;
          const py = (state.camY - 0.35) + (sprayTargetVec.y - (state.camY - 0.35)) * t + (Math.random() - 0.5) * 0.35;
          const pz = state.camZ + (sprayTargetVec.z - state.camZ) * t + (Math.random() - 0.5) * 0.45;
          posAttr.setXYZ(i, px, py, pz);
        }
        posAttr.needsUpdate = true;
        if (sprayBurstFrames === 0) sprayParticles.visible = false;
      }

      renderer.render(scene, camera);
      updateFloating3DLabels();
      drawRoomRadar();

      const posEl = document.getElementById("hud-pos-text");
      if (posEl) posEl.textContent = `POS: (${state.camX.toFixed(1)}m, ${state.camZ.toFixed(1)}m)`;
    }
  }

  // ==================== 2D HOSPITAL ROOM & PHOTO VISOR RENDERING ====================
  function apply2DStageTransform() {
    const stage = document.getElementById("photo-world-stage");
    if (stage) {
      stage.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
    }
    const posEl = document.getElementById("hud-pos-text");
    if (posEl && state.simMode !== "crime3d") {
      posEl.textContent = `WALK POS: (${(state.panX / 40).toFixed(1)}m, ${(state.panY / 40).toFixed(1)}m) • ZOOM: ${state.zoom.toFixed(2)}x`;
    }
    if (window.mcLayoutPins) window.mcLayoutPins();
  }

  function render2DHotspots() {
    const container = document.getElementById("photo-hotspots-layer");
    if (!container) return;
    container.innerHTML = "";
    if (state.simMode !== "hospital" && state.simMode !== "photovisor") return;

    const tasks = getActiveTaskList();
    const cleanSet = getActiveCleanSet();

    tasks.forEach((t, idx) => {
      const isClean = cleanSet.has(t.id);
      const isActive = idx === state.activeIdx;
      const rlu = isClean ? t.rluClean : t.rluInit;

      const pin = document.createElement("button");
      pin.className = "photo-hotspot" + (isActive ? " active" : "") + (isClean ? " clean" : "");
      pin.style.left = t.visX + "%";
      pin.style.top = t.visY + "%";
      pin.innerHTML = `<span class="ph-badge">#${t.id}<span class="ph-name"> ${t.shortLabel}</span></span><span class="ph-rlu">${rlu} RLU ${isClean ? "PASS ✓" : ""}</span>`;
      pin.onclick = (e) => {
        e.stopPropagation();
        window.selectTask(idx, true);
        window.triggerCleanAction();
      };
      container.appendChild(pin);
    });
    if (window.mcLayoutPins) window.mcLayoutPins(true);
  }

  // ==================== MAIN UI & TASK CONTROLLER ====================
  window.selectTask = function (idx, moveCamera) {
    clearTimeout(state.actionTimer);
    const tasks = getActiveTaskList();
    const cleanSet = getActiveCleanSet();
    state.activeIdx = Math.max(0, Math.min(tasks.length - 1, idx));
    const task = tasks[state.activeIdx];
    state.curRlu = cleanSet.has(task.id) ? task.rluClean : task.rluInit;

    if (moveCamera) {
      if (state.simMode === "crime3d" && task.standPos3d) {
        state.targetX = task.standPos3d.x;
        state.targetZ = task.standPos3d.z;
        state.targetYaw = task.standPos3d.yaw;
        state.targetPitch = task.standPos3d.pitch;
        state.foundCrime.add(task.id);
      } else if (state.simMode === "hospital" || state.simMode === "photovisor") {
        state.panX = (50 - task.visX) * 2.2;
        state.panY = (52 - task.visY) * 1.8;
        state.zoom = 1.18;
        apply2DStageTransform();
      }
    }
    playSound("click");
    syncThreeStainsAndMarkers();
    updateAllUI();
  };

  window.triggerCleanAction = function () {
    clearTimeout(state.actionTimer);
    const tasks = getActiveTaskList();
    const cleanSet = getActiveCleanSet();
    const task = tasks[state.activeIdx];
    if (!task) return;

    playSound("spray");
    const leftHand = document.getElementById("left-hand-wrap");
    const rightHand = document.getElementById("right-hand-wrap");
    const sprayCone = document.getElementById("svg-spray-cone");
    if (leftHand) leftHand.classList.add("spraying");
    if (rightHand) rightHand.classList.add("spraying");
    if (sprayCone) sprayCone.setAttribute("opacity", "0.96");

    if (state.simMode === "crime3d" && task.pos3d) {
      sprayTargetVec = new THREE.Vector3(task.pos3d.x, task.pos3d.y + 0.15, task.pos3d.z);
      sprayBurstFrames = 24;
    }

    const banner = document.getElementById("sim-status-banner");
    if (banner) {
      banner.textContent = `💦 SPRAYING & SANITIZING: ${task.title} (${task.rluInit} RLU → ${task.rluClean} RLU)...`;
    }

    state.actionTimer = setTimeout(() => {
      cleanSet.add(task.id);
      if (state.simMode === "crime3d") state.foundCrime.add(task.id);
      state.curRlu = task.rluClean;
      if (leftHand) leftHand.classList.remove("spraying");
      if (rightHand) rightHand.classList.remove("spraying");
      if (sprayCone) sprayCone.setAttribute("opacity", "0.45");
      playSound("pass");
      syncThreeStainsAndMarkers();
      if (banner) {
        banner.textContent = `✓ REMEDIATED: ${task.shortLabel} verified at ${task.rluClean} RLU PASS (${cleanSet.size}/8 completed)!`;
      }
      updateAllUI();
    }, 550);
  };

  window.toggleUVMode = function () {
    state.uvOn = !state.uvOn;
    playSound("click");
    syncThreeStainsAndMarkers();
    updateAllUI();
  };

  window.toggleSoundMode = function () {
    state.soundOn = !state.soundOn;
    updateAllUI();
  };

  window.resetSimulator = function () {
    clearTimeout(state.actionTimer);
    if (state.simMode === "hospital") {
      state.cleanedHospital.clear();
    } else {
      state.cleanedCrime.clear();
      state.foundCrime = new Set([1, 2, 3]);
    }
    state.activeIdx = 0;
    const tasks = getActiveTaskList();
    state.curRlu = tasks[0].rluInit;
    state.targetX = -0.2;
    state.targetZ = 4.3;
    state.targetYaw = 0.0;
    state.targetPitch = -0.14;
    state.panX = 0;
    state.panY = 0;
    state.zoom = 1.0;
    apply2DStageTransform();
    syncThreeStainsAndMarkers();
    const banner = document.getElementById("sim-status-banner");
    if (banner) {
      banner.textContent = "↺ Scene reset: All 8 biohazard hotspots restored to initial RLU contamination levels.";
    }
    updateAllUI();
  };

  window.nudgeWalk = function (act) {
    if (state.simMode === "crime3d") {
      const fx = -Math.sin(state.yaw);
      const fz = -Math.cos(state.yaw);
      const rx = Math.cos(state.yaw);
      const rz = -Math.sin(state.yaw);
      if (act === "W") { state.targetX += fx * 0.75; state.targetZ += fz * 0.75; }
      if (act === "S") { state.targetX -= fx * 0.75; state.targetZ -= fz * 0.75; }
      if (act === "A") { state.targetX -= rx * 0.65; state.targetZ -= rz * 0.65; }
      if (act === "D") { state.targetX += rx * 0.65; state.targetZ += rz * 0.65; }
      if (act === "TL") { state.targetYaw += 0.38; }
      if (act === "TR") { state.targetYaw -= 0.38; }
      state.targetX = Math.max(-3.3, Math.min(3.3, state.targetX));
      state.targetZ = Math.max(-4.1, Math.min(4.6, state.targetZ));
    } else {
      if (act === "W") state.panY = Math.min(80, state.panY + 24);
      if (act === "S") state.panY = Math.max(-80, state.panY - 24);
      if (act === "A" || act === "TL") state.panX = Math.min(120, state.panX + 28);
      if (act === "D" || act === "TR") state.panX = Math.max(-120, state.panX - 28);
      apply2DStageTransform();
    }
  };

  window.setSimMode = function (mode) {
    clearTimeout(state.actionTimer);
    state.simMode = mode;
    state.activeIdx = 0;
    const modeBanner = document.getElementById("sim-status-banner");
    if (modeBanner) {
      modeBanner.textContent = {
        crime3d: "CRIME SCENE BIOHAZARD LAB — Walk in 360° with W/A/S/D, click floor to walk, or click any Evidence Marker (#1–#8) to clean!",
        hospital: "HOSPITAL PATIENT ROOM — Click any RLU hotspot or pick a step on the right. With UV on, each surface's glow fades as you clean it.",
        photovisor: "FORENSIC UV PHOTO VISOR — Toggle the blacklight and click any evidence hotspot to remediate it.",
        booth: "LIVE EVENT BOOTH — Concept view of a multi-trainee VR session."
      }[mode] || modeBanner.textContent;
    }
    const tasks = getActiveTaskList();
    const cleanSet = getActiveCleanSet();
    state.curRlu = cleanSet.has(tasks[0].id) ? tasks[0].rluClean : tasks[0].rluInit;
    state.panX = 0; state.panY = 0; state.zoom = 1.0;
    apply2DStageTransform();
    syncThreeStainsAndMarkers();
    updateAllUI();
    if (mode === "crime3d" && renderer && camera) {
      const mount = document.getElementById("three-crime-mount");
      if (mount) {
        renderer.setSize(mount.clientWidth || 760, mount.clientHeight || 520);
        camera.aspect = (mount.clientWidth || 760) / (mount.clientHeight || 520);
        camera.updateProjectionMatrix();
      }
    }
  };

  window.setNavTab = function (tab) {
    state.navTab = tab;
    playSound("click");
    updateAllUI();
    if (tab === "vr" && state.simMode === "crime3d" && renderer && camera) {
      setTimeout(() => {
        const mount = document.getElementById("three-crime-mount");
        if (mount) {
          renderer.setSize(mount.clientWidth || 760, mount.clientHeight || 520);
          camera.aspect = (mount.clientWidth || 760) / (mount.clientHeight || 520);
          camera.updateProjectionMatrix();
        }
      }, 30);
    }
  };

  function updateAllUI() {
    // 1. Top Nav Tabs active state
    document.querySelectorAll("[data-nav-tab]").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-nav-tab") === state.navTab);
    });
    document.querySelectorAll(".page-section").forEach((sec) => {
      sec.style.display = sec.id === "section-" + state.navTab ? "block" : "none";
    });

    // 2. Sim Sub-Mode Buttons
    document.querySelectorAll("[data-sim-mode]").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-sim-mode") === state.simMode);
    });

    const threeMount = document.getElementById("three-crime-mount");
    const calloutsLayer = document.getElementById("floating-callouts-layer");
    const photoStage = document.getElementById("photo-world-stage");
    const boothStage = document.getElementById("booth-arena-stage");
    const handsLayer = document.getElementById("hands-layer");
    const radarBox = document.getElementById("radar-hud-box");

    if (threeMount) threeMount.style.display = state.simMode === "crime3d" ? "block" : "none";
    if (calloutsLayer) calloutsLayer.style.display = state.simMode === "crime3d" ? "block" : "none";
    if (radarBox) radarBox.style.display = state.simMode === "crime3d" ? "flex" : "none";
    if (photoStage) {
      photoStage.style.display = (state.simMode === "hospital" || state.simMode === "photovisor") ? "block" : "none";
      const bg = document.getElementById("photo-room-bg");
      if (bg) {
        if (state.simMode === "hospital") {
          bg.style.backgroundImage = state.uvOn
            ? "url('./photos/room-uv-clean.jpg')"
            : "url('./vr-room-pov-base.png')";
        } else {
          bg.style.backgroundImage = state.uvOn
            ? "url('./crime-scene-uv-blacklight.png')"
            : "url('./crime-scene-trauma-room.png')";
        }
      }
      const uvOverlay = document.getElementById("photo-uv-overlay");
      if (uvOverlay) uvOverlay.style.opacity = state.uvOn && state.simMode !== "hospital" ? "1" : "0";
      const residue = document.getElementById("photo-uv-residue");
      if (residue) {
        residue.style.opacity = state.simMode === "hospital" && state.uvOn ? "1" : "0";
        residue.querySelectorAll(".uv-layer").forEach((layer) => {
          layer.classList.toggle("gone", state.cleanedHospital.has(Number(layer.dataset.task)));
        });
      }
      render2DHotspots();
    }
    if (boothStage) boothStage.style.display = state.simMode === "booth" ? "grid" : "none";
    if (handsLayer) handsLayer.style.display = state.simMode === "booth" ? "none" : "block";

    // 3. HUD & Active Task Sidebar
    const tasks = getActiveTaskList();
    const cleanSet = getActiveCleanSet();
    const task = tasks[state.activeIdx] || tasks[0];
    const isClean = cleanSet.has(task.id);
    state.curRlu = isClean ? task.rluClean : task.rluInit;
    const pass = state.curRlu <= 50;

    const rluText = document.getElementById("hud-rlu-text");
    if (rluText) {
      rluText.textContent = `${state.curRlu} RLU (${pass ? "PASS ✓" : "BIOHAZARD"})`;
      rluText.style.color = pass ? "#4ade80" : "#f87171";
    }
    const rluSub = document.getElementById("hud-rlu-sub");
    if (rluSub) {
      rluSub.textContent = state.simMode === "crime3d"
        ? `EVIDENCE FOUND: ${state.foundCrime.size}/8 • CLEANED: ${cleanSet.size}/8`
        : `STEPS COMPLETED: ${cleanSet.size}/8 • TARGET: ≤25 RLU`;
    }
    const rluBar = document.getElementById("hud-rlu-bar");
    if (rluBar) {
      rluBar.style.width = Math.min(100, Math.max(8, (state.curRlu / 2480) * 100)) + "%";
      rluBar.style.background = pass ? "#22c55e" : "#ef4444";
    }
    const lcdNum = document.getElementById("lcd-num");
    if (lcdNum) {
      lcdNum.textContent = state.curRlu;
      lcdNum.style.color = pass ? "#4ade80" : "#f87171";
    }
    const lcdPass = document.getElementById("lcd-status");
    if (lcdPass) {
      lcdPass.textContent = pass ? "RLU PASS ✓" : "RLU HIGH !";
      lcdPass.style.color = pass ? "#4ade80" : "#fca5a5";
    }

    // Action Bar Buttons
    const execBtn = document.getElementById("exec-btn");
    if (execBtn) {
      execBtn.textContent = isClean
        ? `✓ Cleaned: ${task.shortLabel} (${task.rluClean} RLU PASS)`
        : `▶ Spray & Clean: ${task.shortLabel} (#${task.id} • ${task.rluInit} → ${task.rluClean} RLU)`;
    }
    const uvBtn = document.getElementById("uv-btn");
    if (uvBtn) {
      uvBtn.textContent = `👁 UV Blacklight: ${state.uvOn ? "ON" : "OFF"}`;
      uvBtn.classList.toggle("off", !state.uvOn);
    }
    const soundBtn = document.getElementById("sound-btn");
    if (soundBtn) {
      soundBtn.textContent = state.soundOn ? "🔊" : "🔇";
    }

    // Right Sidebar Task Info
    const badgeEl = document.getElementById("task-badge");
    if (badgeEl) {
      badgeEl.textContent = state.simMode === "hospital"
        ? `Active VR Task ${state.activeIdx + 1} of 8`
        : `Forensic Evidence #${state.activeIdx + 1} of 8`;
    }
    const clearEl = document.getElementById("task-clearance");
    if (clearEl) clearEl.textContent = `Clearance: ${task.clearance}`;
    const titleEl = document.getElementById("task-title");
    if (titleEl) titleEl.textContent = task.title;
    const toolEl = document.getElementById("task-tool");
    if (toolEl) toolEl.textContent = `Active VR Tool: ${task.tool}`;
    const descEl = document.getElementById("task-desc");
    if (descEl) descEl.textContent = task.desc;
    const protoEl = document.getElementById("task-protocol");
    if (protoEl) protoEl.textContent = task.protocol;

    // 8-Step List
    const listHeader = document.getElementById("step-list-header");
    if (listHeader) {
      listHeader.textContent = state.simMode === "hospital"
        ? "8-STEP HOSPITAL TERMINAL CLEAN SEQUENCE (CLICK ANY STEP)"
        : "8 CRIME-SCENE BIOHAZARDS (CLICK ANY TO WALK THERE IN 3D)";
    }
    const stepList = document.getElementById("step-list");
    if (stepList) {
      stepList.innerHTML = "";
      tasks.forEach((t, idx) => {
        const done = cleanSet.has(t.id);
        const active = idx === state.activeIdx;
        const btn = document.createElement("button");
        btn.className = "step-item" + (active ? " active" : "") + (done ? " done" : "");
        btn.innerHTML = `<span>${done ? "✅ " : active ? "⚠️ " : "• "}${t.title}</span><span class="step-arrow">${done ? t.rluClean + " RLU ✓" : "→"}</span>`;
        btn.onclick = () => window.selectTask(idx, true);
        stepList.appendChild(btn);
      });
    }
  }

  // ==================== COURSE MODULES & QUIZ RENDERER ====================
  function buildCourseSections() {
    Object.entries(window.COURSE_MODULES).forEach(([key, mod]) => {
      const container = document.getElementById("module-content-" + key);
      if (!container) return;
      let html = `
        <div class="module-hero">
          <span class="module-badge">${mod.badge}</span>
          <h2>${mod.title}</h2>
          <p>${mod.subtitle}</p>
        </div>
        <div class="module-grid">
      `;
      mod.cards.forEach((c) => {
        html += `
          <div class="module-card">
            <div class="mc-tag">${c.tag}</div>
            <h3>${c.title}</h3>
            <p>${c.body}</p>
            <ul>${c.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
          </div>
        `;
      });
      html += `</div>`;

      if (key === "spills") {
        html += `
          <div class="interactive-calc-card">
            <h3>🧪 Interactive Chlorine Bleach Dilution & Contact Time Calculator</h3>
            <p>Calculate exact sodium hypochlorite (5.25%–6% household bleach) and water volumes for OSHA Bloodborne Pathogen spills:</p>
            <div class="calc-row">
              <label>Target Total Volume (mL): <input type="number" id="bleach-vol" value="1000" min="100" step="100" oninput="window.updateBleachCalc()" /></label>
              <label>Dilution Ratio:
                <select id="bleach-ratio" onchange="window.updateBleachCalc()">
                  <option value="10">1:10 Large blood spill / porous (~5,000 ppm)</option>
                  <option value="100">1:100 Small spill, non-porous (~500 ppm)</option>
                </select>
              </label>
              <div class="calc-output" id="bleach-result">Mix <strong>100 mL Bleach</strong> + <strong>900 mL Water</strong> (5,000 ppm active chlorine • Discard unused mix after 24 hrs)</div>
            </div>
            <p class="calc-note">Assumes 5.25–6% household bleach. Concentrated (8.25%) bleach changes the ratio — follow the product label. Never mix bleach with ammonia or acids.</p>
          </div>
        `;
      }

      if (key === "qa") {
        html += `
          <div class="interactive-calc-card">
            <h3>🔬 Interactive ATP Luminometer RLU Clearance Evaluator</h3>
            <p>Enter a surface swab reading (RLU) to evaluate forensic & clinical release status:</p>
            <div class="calc-row">
              <label>Measured Swab Reading (RLU): <input type="number" id="qa-rlu-input" value="18" min="0" max="5000" oninput="window.updateQaCalc()" /></label>
              <div class="calc-output" id="qa-rlu-result" style="color:#4ade80;"><strong>18 RLU → STRICT FORENSIC & ICU PASS (≤25 RLU)</strong> • Safe to release room.</div>
            </div>
          </div>
        `;
      }

      container.innerHTML = html;
    });
  }

  window.updateBleachCalc = function () {
    const vol = parseFloat(document.getElementById("bleach-vol")?.value || "1000");
    const ratio = parseInt(document.getElementById("bleach-ratio")?.value || "10", 10);
    const bleach = Math.round(vol / ratio);
    const water = Math.max(0, Math.round(vol - bleach));
    const ppm = ratio === 10 ? "5,000 ppm" : "500 ppm";
    const out = document.getElementById("bleach-result");
    if (out) {
      out.innerHTML = `Mix <strong>${bleach} mL Bleach</strong> + <strong>${water} mL Water</strong> (${ppm} active chlorine • Discard unused mix after 24 hrs)`;
    }
  };

  window.updateQaCalc = function () {
    const rlu = parseInt(document.getElementById("qa-rlu-input")?.value || "0", 10);
    const out = document.getElementById("qa-rlu-result");
    if (!out) return;
    if (rlu <= 25) {
      out.style.color = "#4ade80";
      out.innerHTML = `<strong>${rlu} RLU → STRICT FORENSIC & ICU PASS (≤25 RLU)</strong> • Quantitative clearance achieved.`;
    } else if (rlu <= 250) {
      out.style.color = "#facc15";
      out.innerHTML = `<strong>${rlu} RLU → MARGINAL / GENERAL INPATIENT ZONE (26–250 RLU)</strong> • Re-wipe high-touch forensic or isolation surfaces.`;
    } else {
      out.style.color = "#f87171";
      out.innerHTML = `<strong>${rlu} RLU → BIOHAZARD FAIL (>250 RLU)</strong> • Active organic soil/biofilm present. Perform enzymatic scrub + disinfection.`;
    }
  };

  window.renderQuiz = function () {
    const container = document.getElementById("quiz-questions-mount");
    if (!container) return;
    let html = "";
    window.QUIZ_QUESTIONS.forEach((item, qIdx) => {
      const chosen = state.quizAnswers[qIdx];
      html += `<div class="quiz-card"><div class="quiz-q">${item.q}</div>${item.img ? `<img class="quiz-img" src="${item.img}" loading="lazy" alt="Photo for question ${qIdx + 1}" data-lightbox="${item.img}" data-cap="Question ${qIdx + 1} photo" />` : ""}<div class="quiz-opts">`;
      item.opts.forEach((opt, oIdx) => {
        let cls = "quiz-opt";
        if (chosen === oIdx) cls += " selected";
        if (state.quizSubmitted) {
          if (oIdx === item.ans) cls += " correct";
          else if (chosen === oIdx && chosen !== item.ans) cls += " wrong";
        }
        html += `<button class="${cls}" onclick="window.pickQuizAnswer(${qIdx}, ${oIdx})">${opt}</button>`;
      });
      html += `</div>`;
      if (state.quizSubmitted) {
        const isRight = chosen === item.ans;
        html += `<div class="quiz-exp ${isRight ? "ok" : "err"}">${isRight ? "✅ Correct: " : "❌ Protocol Rationale: "}${item.exp}</div>`;
      }
      html += `</div>`;
    });
    container.innerHTML = html;

    const scoreBox = document.getElementById("quiz-score-banner");
    if (scoreBox) {
      if (!state.quizSubmitted) {
        scoreBox.innerHTML = `Answered ${Object.keys(state.quizAnswers).length} of ${window.QUIZ_QUESTIONS.length} questions. Click <strong>Grade Practice Exam</strong> when ready.`;
      } else {
        let correct = 0;
        window.QUIZ_QUESTIONS.forEach((it, i) => {
          if (state.quizAnswers[i] === it.ans) correct++;
        });
        const pct = Math.round((correct / window.QUIZ_QUESTIONS.length) * 100);
        scoreBox.innerHTML = `<strong>EXAM SCORE: ${correct}/${window.QUIZ_QUESTIONS.length} (${pct}%) — ${pct >= 80 ? "✅ PASSED — PRACTICE EXAM (not an accredited certification)" : "⚠️ REVIEW MISSED PROTOCOLS & RETAKE"}</strong>`;
      }
    }
  };

  window.pickQuizAnswer = function (qIdx, oIdx) {
    state.quizAnswers[qIdx] = oIdx;
    playSound("click");
    window.renderQuiz();
  };

  window.submitQuizExam = function () {
    state.quizSubmitted = true;
    playSound("pass");
    window.renderQuiz();
  };

  window.resetQuizExam = function () {
    state.quizAnswers = {};
    state.quizSubmitted = false;
    window.renderQuiz();
  };

  // ==================== INITIALIZATION ====================
  window.addEventListener("DOMContentLoaded", () => {
    buildCourseSections();
    window.renderQuiz();
    initThreeRoom();
    updateAllUI();
    animateLoop();

    window.addEventListener("keydown", (e) => {
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "SELECT")) return;
      state.keys[e.code] = true;
      if (e.code === "Space" && state.navTab === "vr") {
        e.preventDefault();
        window.triggerCleanAction();
      }
    });
    window.addEventListener("keyup", (e) => {
      state.keys[e.code] = false;
    });
    window.addEventListener("resize", () => {
      if (!renderer || !camera) return;
      const mount = document.getElementById("three-crime-mount");
      if (mount && mount.clientWidth > 0 && mount.clientHeight > 0) {
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
      }
    });
  });
})();
