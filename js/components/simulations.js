// ShikshaSetu Interactive Science Simulations Engine
// Delivers specific, topic-tailored animations with interactive controls

window.ShikshaSimulations = {
  currentAnimId: null,
  activeSim: null,

  // Initialize simulation in a given container element
  init: function(simId, containerEl) {
    this.destroy();
    this.activeSim = simId;
    containerEl.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = "sim-container bg-slate-900 text-white rounded-xl overflow-hidden shadow-2xl border border-slate-700 relative";
    containerEl.appendChild(wrapper);

    switch(simId) {
      case "solar_system":
        this.renderSolarSystem(wrapper);
        break;
      case "water_cycle":
        this.renderWaterCycle(wrapper);
        break;
      case "photosynthesis":
        this.renderPhotosynthesis(wrapper);
        break;
      case "states_of_matter":
        this.renderStatesOfMatter(wrapper);
        break;
      case "electric_circuit":
        this.renderElectricCircuit(wrapper);
        break;
      case "digestive_system":
        this.renderDigestiveSystem(wrapper);
        break;
      case "plant_cell":
        this.renderPlantCell(wrapper);
        break;
      case "light_reflection":
        this.renderLightReflection(wrapper);
        break;
      case "atom_structure":
        this.renderAtomStructure(wrapper);
        break;
      case "motion_force":
        this.renderMotionForce(wrapper);
        break;
      case "acid_base":
        this.renderAcidBase(wrapper);
        break;
      default:
        this.renderSolarSystem(wrapper);
    }
  },

  destroy: function() {
    if (this.currentAnimId) {
      cancelAnimationFrame(this.currentAnimId);
      this.currentAnimId = null;
    }
    this.activeSim = null;
  },

  // -------------------------------------------------------------------------
  // 1. SOLAR SYSTEM SIMULATION (Class 5 Ch 1, Class 6 Ch 16, etc.)
  // -------------------------------------------------------------------------
  renderSolarSystem: function(container) {
    container.innerHTML = `
      <div class="p-3 bg-slate-800/90 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div class="flex items-center gap-2 font-bold text-amber-400">
          <i data-lucide="sun" class="w-5 h-5"></i>
          <span>The Solar System (सूर्यमाला)</span>
        </div>
        <div class="flex items-center gap-3">
          <label class="flex items-center gap-1 text-xs text-slate-300">
            Speed:
            <input type="range" id="sim-speed" min="0.2" max="3" step="0.2" value="1" class="w-20 accent-amber-500">
          </label>
          <button id="sim-pause-btn" class="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded text-xs transition">Pause</button>
          <button id="sim-reset-btn" class="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs transition">Reset</button>
        </div>
      </div>
      <div class="relative w-full h-[380px] bg-black overflow-hidden flex items-center justify-center">
        <canvas id="sim-canvas" width="700" height="380" class="w-full h-full block"></canvas>
        <div id="planet-info-box" class="absolute bottom-2 left-2 right-2 md:right-auto md:w-80 bg-slate-900/90 backdrop-blur border border-amber-500/40 p-2.5 rounded-lg text-xs hidden shadow-xl pointer-events-none">
          <h4 id="planet-name" class="font-bold text-amber-400 text-sm"></h4>
          <p id="planet-desc" class="text-slate-300 mt-0.5 leading-relaxed"></p>
        </div>
      </div>
      <div class="p-2.5 bg-slate-800/80 text-[11px] text-slate-300 border-t border-slate-700 flex flex-wrap justify-between items-center">
        <span>Click on any planet to explore its orbit & Balbharti facts</span>
        <span class="text-amber-300 font-medium">8 Planets in Keplerian Orbits</span>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    const canvas = container.querySelector("#sim-canvas");
    const ctx = canvas.getContext("2d");
    const speedSlider = container.querySelector("#sim-speed");
    const pauseBtn = container.querySelector("#sim-pause-btn");
    const resetBtn = container.querySelector("#sim-reset-btn");
    const infoBox = container.querySelector("#planet-info-box");
    const pName = container.querySelector("#planet-name");
    const pDesc = container.querySelector("#planet-desc");

    let isPaused = false;
    let speed = 1;
    let selectedPlanet = null;

    speedSlider.addEventListener("input", (e) => speed = parseFloat(e.target.value));
    pauseBtn.addEventListener("click", () => {
      isPaused = !isPaused;
      pauseBtn.textContent = isPaused ? "Play" : "Pause";
    });
    resetBtn.addEventListener("click", () => {
      planets.forEach(p => p.angle = Math.random() * Math.PI * 2);
      selectedPlanet = null;
      infoBox.classList.add("hidden");
    });

    const planets = [
      { name: "Mercury (बुध)", radius: 3, dist: 40, speed: 0.04, color: "#a3a3a3", desc: "Closest planet to Sun; extreme day/night temperatures (-180°C to 430°C). No atmosphere." },
      { name: "Venus (शुक्र)", radius: 5, dist: 65, speed: 0.025, color: "#f59e0b", desc: "Hottest planet due to runaway greenhouse effect of thick CO2 atmosphere; rotates East to West." },
      { name: "Earth (पृथ्वी)", radius: 6, dist: 95, speed: 0.018, color: "#38bdf8", hasMoon: true, desc: "Our home planet! Liquid water, protective atmosphere, 21% oxygen, and 1 natural satellite (Moon)." },
      { name: "Mars (मंगळ)", radius: 4, dist: 130, speed: 0.012, color: "#ef4444", desc: "The Red Planet due to iron oxide soil. ISRO Mangalyaan orbited Mars in 2014!" },
      { name: "Jupiter (गुरू)", radius: 13, dist: 180, speed: 0.007, color: "#eab308", desc: "Largest planet in solar system; Great Red Spot storm; 79+ moons; strong gravitational pull." },
      { name: "Saturn (शनी)", radius: 11, dist: 230, speed: 0.005, color: "#fde047", hasRings: true, desc: "Spectacular ring system made of billions of ice, dust, and rock chunks. Lowest density among planets." },
      { name: "Uranus (युरेनस)", radius: 8, dist: 280, speed: 0.003, color: "#67e8f9", desc: "Ice giant planet with tilted rotational axis of 98°, rotating almost on its side." },
      { name: "Neptune (नेपच्यून)", radius: 8, dist: 325, speed: 0.002, color: "#3b82f6", desc: "Farthest planet, deep blue hue from methane gas; experiences strongest supersonic winds (2,000 km/h)." }
    ];

    planets.forEach(p => p.angle = Math.random() * Math.PI * 2);

    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      let hit = null;
      for (let p of planets) {
        const px = cx + Math.cos(p.angle) * p.dist;
        const py = cy + Math.sin(p.angle) * p.dist * 0.55; // perspective tilt
        const distSq = (clickX - px) ** 2 + (clickY - py) ** 2;
        if (distSq < (p.radius + 10) ** 2) {
          hit = p;
          break;
        }
      }

      if (hit) {
        selectedPlanet = hit;
        pName.textContent = hit.name;
        pDesc.textContent = hit.desc;
        infoBox.classList.remove("hidden");
      } else {
        selectedPlanet = null;
        infoBox.classList.add("hidden");
      }
    });

    // Star background
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * 700,
      y: Math.random() * 380,
      size: Math.random() * 1.5,
      alpha: Math.random() * 0.8 + 0.2
    }));

    const animate = () => {
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      stars.forEach(s => {
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      });

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw Sun
      const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 32);
      grad.addColorStop(0, "#fff7ed");
      grad.addColorStop(0.3, "#facc15");
      grad.addColorStop(0.7, "#ea580c");
      grad.addColorStop(1, "rgba(234, 88, 12, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 30, 0, Math.PI * 2);
      ctx.fill();

      // Sun core
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fill();

      // Draw Orbit tracks
      planets.forEach(p => {
        ctx.strokeStyle = p === selectedPlanet ? "rgba(251, 191, 36, 0.7)" : "rgba(255, 255, 255, 0.12)";
        ctx.lineWidth = p === selectedPlanet ? 1.5 : 1;
        ctx.beginPath();
        ctx.ellipse(cx, cy, p.dist, p.dist * 0.55, 0, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Draw Planets
      planets.forEach(p => {
        if (!isPaused) {
          p.angle += p.speed * speed;
        }
        const px = cx + Math.cos(p.angle) * p.dist;
        const py = cy + Math.sin(p.angle) * p.dist * 0.55;

        // Saturn Rings
        if (p.hasRings) {
          ctx.strokeStyle = "rgba(253, 224, 71, 0.6)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(px, py, p.radius * 2.2, p.radius * 0.8, -0.2, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Body
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Earth's moon
        if (p.hasMoon) {
          const mDist = 12;
          const mAngle = p.angle * 6;
          const mx = px + Math.cos(mAngle) * mDist;
          const my = py + Math.sin(mAngle) * mDist * 0.6;
          ctx.fillStyle = "#cbd5e1";
          ctx.beginPath();
          ctx.arc(mx, my, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Selection highlight ring
        if (p === selectedPlanet) {
          ctx.strokeStyle = "#fbbf24";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(px, py, p.radius + 6, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      this.currentAnimId = requestAnimationFrame(animate);
    };

    animate();
  },

  // -------------------------------------------------------------------------
  // 2. WATER CYCLE SIMULATION (Class 5 Ch 3, Class 6 Ch 1)
  // -------------------------------------------------------------------------
  renderWaterCycle: function(container) {
    container.innerHTML = `
      <div class="p-3 bg-slate-800/90 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div class="flex items-center gap-2 font-bold text-sky-400">
          <i data-lucide="cloud-rain" class="w-5 h-5"></i>
          <span>The Water Cycle (जलचक्र प्रयोगशाळा)</span>
        </div>
        <div class="flex items-center gap-3">
          <label class="flex items-center gap-1 text-xs text-slate-300">
            Sun Heat:
            <input type="range" id="heat-slider" min="1" max="5" value="3" class="w-20 accent-amber-500">
          </label>
          <label class="flex items-center gap-1 text-xs text-slate-300">
            Rain Rate:
            <input type="range" id="rain-slider" min="1" max="5" value="3" class="w-20 accent-sky-500">
          </label>
        </div>
      </div>
      <div class="relative w-full h-[380px] bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-200 overflow-hidden">
        <canvas id="sim-canvas" width="700" height="380" class="w-full h-full block"></canvas>
      </div>
      <div class="p-2.5 bg-slate-800 text-[11px] text-slate-300 border-t border-slate-700 flex flex-wrap justify-between items-center">
        <span class="flex items-center gap-2">
          <span class="inline-block w-2.5 h-2.5 rounded-full bg-amber-400"></span> 1. Evaporation
          <span class="inline-block w-2.5 h-2.5 rounded-full bg-slate-300 ml-2"></span> 2. Condensation
          <span class="inline-block w-2.5 h-2.5 rounded-full bg-sky-500 ml-2"></span> 3. Precipitation
          <span class="inline-block w-2.5 h-2.5 rounded-full bg-blue-600 ml-2"></span> 4. Runoff
        </span>
        <span class="text-amber-300 font-medium">Balbharti Class 5 & 6 EVS</span>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    const canvas = container.querySelector("#sim-canvas");
    const ctx = canvas.getContext("2d");
    const heatSlider = container.querySelector("#heat-slider");
    const rainSlider = container.querySelector("#rain-slider");

    let heatLevel = 3;
    let rainLevel = 3;
    heatSlider.addEventListener("input", (e) => heatLevel = parseInt(e.target.value));
    rainSlider.addEventListener("input", (e) => rainLevel = parseInt(e.target.value));

    // Vapor particles
    const vapors = Array.from({ length: 35 }, () => ({
      x: 100 + Math.random() * 200,
      y: 280 + Math.random() * 60,
      speed: 0.8 + Math.random() * 1.2,
      opacity: Math.random() * 0.7 + 0.3
    }));

    // Rain particles
    const raindrops = Array.from({ length: 70 }, () => ({
      x: 420 + Math.random() * 240,
      y: 120 + Math.random() * 180,
      speed: 4 + Math.random() * 4,
      length: 8 + Math.random() * 6
    }));

    let waveTick = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      waveTick += 0.05;

      // 1. Sky & Sun
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sun
      const sunGrad = ctx.createRadialGradient(80, 70, 10, 80, 70, 50 * (heatLevel / 3));
      sunGrad.addColorStop(0, "#fef08a");
      sunGrad.addColorStop(0.4, "#facc15");
      sunGrad.addColorStop(1, "rgba(250, 204, 21, 0)");
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(80, 70, 50 * (heatLevel / 3), 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(80, 70, 22, 0, Math.PI * 2);
      ctx.fill();

      // Sun rays
      ctx.strokeStyle = "rgba(251, 191, 36, 0.4)";
      ctx.lineWidth = 2;
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
        ctx.beginPath();
        ctx.moveTo(80 + Math.cos(a) * 28, 70 + Math.sin(a) * 28);
        ctx.lineTo(80 + Math.cos(a) * 44, 70 + Math.sin(a) * 44);
        ctx.stroke();
      }

      // 2. Mountains & Landscape
      ctx.fillStyle = "#15803d";
      ctx.beginPath();
      ctx.moveTo(350, 380);
      ctx.lineTo(460, 180);
      ctx.lineTo(540, 240);
      ctx.lineTo(620, 150);
      ctx.lineTo(700, 380);
      ctx.closePath();
      ctx.fill();

      // Mountain Snowcap
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.moveTo(620, 150);
      ctx.lineTo(595, 190);
      ctx.lineTo(645, 190);
      ctx.closePath();
      ctx.fill();

      // 3. Ocean / Lake Body
      ctx.fillStyle = "#0284c7";
      ctx.beginPath();
      ctx.moveTo(0, 280);
      for (let x = 0; x <= 360; x += 10) {
        const y = 280 + Math.sin(x * 0.05 + waveTick) * 4;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(360, 380);
      ctx.lineTo(0, 380);
      ctx.closePath();
      ctx.fill();

      // River stream
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(560, 250);
      ctx.quadraticCurveTo(480, 310, 350, 320);
      ctx.stroke();

      // 4. Clouds (Condensation)
      ctx.fillStyle = "#e2e8f0";
      const drawCloud = (cx, cy, s) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 25 * s, 0, Math.PI * 2);
        ctx.arc(cx + 25 * s, cy - 10 * s, 30 * s, 0, Math.PI * 2);
        ctx.arc(cx + 55 * s, cy, 25 * s, 0, Math.PI * 2);
        ctx.arc(cx + 35 * s, cy + 12 * s, 25 * s, 0, Math.PI * 2);
        ctx.fill();
      };
      drawCloud(240, 90, 0.9);
      drawCloud(460, 80, 1.2);
      drawCloud(560, 95, 1.1);

      // 5. Evaporating Vapor (rising particles)
      vapors.forEach(v => {
        v.y -= v.speed * (heatLevel / 2.5);
        if (v.y < 90) {
          v.y = 280 + Math.random() * 40;
          v.x = 80 + Math.random() * 220;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${v.opacity})`;
        ctx.beginPath();
        ctx.arc(v.x, v.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // 6. Precipitation (Raindrops)
      ctx.strokeStyle = "rgba(14, 165, 233, 0.8)";
      ctx.lineWidth = 2;
      raindrops.forEach(r => {
        r.y += r.speed * (rainLevel / 2.5);
        if (r.y > 330) {
          r.y = 110 + Math.random() * 30;
          r.x = 420 + Math.random() * 250;
        }
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x - 2, r.y + r.length);
        ctx.stroke();
      });

      // Labels on Canvas
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText("1. Evaporation (बाष्पीभवन)", 100, 230);
      ctx.fillText("2. Condensation (संघनन)", 250, 60);
      ctx.fillText("3. Precipitation (पर्जन्य / पाऊस)", 470, 150);
      ctx.fillText("4. River Runoff (नद्या व भूजल)", 360, 360);

      this.currentAnimId = requestAnimationFrame(animate);
    };

    animate();
  },

  // -------------------------------------------------------------------------
  // 3. PHOTOSYNTHESIS & STOMATA (Class 6 Ch 2, Class 7 Ch 4)
  // -------------------------------------------------------------------------
  renderPhotosynthesis: function(container) {
    container.innerHTML = `
      <div class="p-3 bg-slate-800/90 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div class="flex items-center gap-2 font-bold text-emerald-400">
          <i data-lucide="leaf" class="w-5 h-5"></i>
          <span>Photosynthesis & Chloroplast (प्रकाशसंश्लेषण)</span>
        </div>
        <div class="flex items-center gap-3">
          <label class="flex items-center gap-1 text-xs text-slate-300">
            Light Power:
            <input type="range" id="light-slider" min="1" max="5" value="3" class="w-20 accent-emerald-500">
          </label>
          <button id="stomata-btn" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold">Stomata: OPEN</button>
        </div>
      </div>
      <div class="relative w-full h-[380px] bg-slate-950 overflow-hidden">
        <canvas id="sim-canvas" width="700" height="380" class="w-full h-full block"></canvas>
      </div>
      <div class="p-2.5 bg-slate-800 text-[11px] text-slate-300 border-t border-slate-700 flex flex-wrap justify-between items-center">
        <span class="font-mono text-emerald-300">6 CO₂ + 6 H₂O + Sunlight ⟶ C₆H₁₂O₆ (Glucose) + 6 O₂ ↑</span>
        <span class="text-amber-300 font-medium">Balbharti Class 7 Science Ch 4</span>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    const canvas = container.querySelector("#sim-canvas");
    const ctx = canvas.getContext("2d");
    const lightSlider = container.querySelector("#light-slider");
    const stomataBtn = container.querySelector("#stomata-btn");

    let lightPower = 3;
    let stomataOpen = true;

    lightSlider.addEventListener("input", (e) => lightPower = parseInt(e.target.value));
    stomataBtn.addEventListener("click", () => {
      stomataOpen = !stomataOpen;
      stomataBtn.textContent = stomataOpen ? "Stomata: OPEN" : "Stomata: CLOSED";
      stomataBtn.className = stomataOpen ? "px-2.5 py-1 bg-emerald-600 text-white rounded text-xs font-semibold" : "px-2.5 py-1 bg-rose-600 text-white rounded text-xs font-semibold";
    });

    // Photon packets from sun
    const photons = Array.from({ length: 25 }, () => ({
      x: 60 + Math.random() * 80,
      y: 40 + Math.random() * 60,
      targetX: 350 + (Math.random() - 0.5) * 200,
      targetY: 200 + (Math.random() - 0.5) * 120,
      progress: Math.random()
    }));

    // Oxygen bubbles produced
    const o2Bubbles = Array.from({ length: 20 }, () => ({
      x: 350 + (Math.random() - 0.5) * 160,
      y: 200 + (Math.random() - 0.5) * 80,
      speed: 1 + Math.random() * 1.5
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sun in top left
      const sunG = ctx.createRadialGradient(70, 70, 5, 70, 70, 45);
      sunG.addColorStop(0, "#fef08a");
      sunG.addColorStop(0.5, "#eab308");
      sunG.addColorStop(1, "rgba(234, 179, 8, 0)");
      ctx.fillStyle = sunG;
      ctx.beginPath();
      ctx.arc(70, 70, 45, 0, Math.PI * 2);
      ctx.fill();

      // Leaf cross section / Chloroplast outline
      ctx.fillStyle = "#064e3b";
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(370, 210, 220, 120, -0.05, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Thylakoid grana stacks (Chlorophyll discs)
      const grana = [
        { x: 260, y: 190 }, { x: 320, y: 170 }, { x: 370, y: 220 },
        { x: 420, y: 180 }, { x: 470, y: 210 }
      ];
      grana.forEach(g => {
        ctx.fillStyle = "#059669";
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.ellipse(g.x, g.y + i * 9, 20, 6, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#34d399";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Stomata pore on bottom edge
      ctx.fillStyle = stomataOpen ? "#0f172a" : "#047857";
      ctx.beginPath();
      ctx.ellipse(370, 325, stomataOpen ? 16 : 4, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#34d399";
      ctx.stroke();
      ctx.fillStyle = "#a7f3d0";
      ctx.font = "11px sans-serif";
      ctx.fillText(stomataOpen ? "Stoma Pore (CO₂ in / O₂ out)" : "Stoma Closed", 300, 360);

      // Photons animation
      photons.forEach(p => {
        p.progress += 0.015 * lightPower;
        if (p.progress >= 1) p.progress = 0;
        const curX = 70 + (p.targetX - 70) * p.progress;
        const curY = 70 + (p.targetY - 70) * p.progress;

        ctx.fillStyle = "#facc15";
        ctx.beginPath();
        ctx.arc(curX, curY, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Oxygen bubbles rising out
      if (stomataOpen) {
        o2Bubbles.forEach(b => {
          b.y -= b.speed * (lightPower / 2);
          if (b.y < 60) {
            b.y = 220 + (Math.random() - 0.5) * 60;
            b.x = 350 + (Math.random() - 0.5) * 160;
          }
          ctx.fillStyle = "rgba(56, 189, 248, 0.8)";
          ctx.beginPath();
          ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#bae6fd";
          ctx.font = "9px sans-serif";
          ctx.fillText("O₂", b.x + 6, b.y + 3);
        });
      }

      // Diagram callouts
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText("Sunlight Energy (सौर ऊर्जा)", 80, 140);
      ctx.fillText("Chloroplast Organelle (हरितलवक)", 260, 130);
      ctx.fillStyle = "#fed7aa";
      ctx.fillText("C₆H₁₂O₆ (Glucose / अन्ननिर्मिती)", 380, 275);
      ctx.fillStyle = "#93c5fd";
      ctx.fillText("H₂O Absorbed from Roots", 170, 270);

      this.currentAnimId = requestAnimationFrame(animate);
    };

    animate();
  },

  // -------------------------------------------------------------------------
  // 4. STATES OF MATTER & MOLECULAR KINETICS (Class 6 Ch 5, Class 8 Ch 6)
  // -------------------------------------------------------------------------
  renderStatesOfMatter: function(container) {
    container.innerHTML = `
      <div class="p-3 bg-slate-800/90 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div class="flex items-center gap-2 font-bold text-amber-400">
          <i data-lucide="layers" class="w-5 h-5"></i>
          <span>States of Matter & Molecular Motion (द्रव्याच्या अवस्था)</span>
        </div>
        <div class="flex items-center gap-2">
          <button id="btn-solid" class="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold">Solid (स्थायू)</button>
          <button id="btn-liquid" class="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-semibold">Liquid (द्रव)</button>
          <button id="btn-gas" class="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-semibold">Gas (वायू)</button>
        </div>
      </div>
      <div class="relative w-full h-[380px] bg-slate-950 flex flex-col items-center justify-center">
        <canvas id="sim-canvas" width="480" height="300" class="border-2 border-slate-700 rounded-lg bg-slate-900 shadow-inner"></canvas>
        <div class="w-full max-w-md px-4 mt-2 flex items-center justify-between text-xs text-slate-300">
          <span>Cold (-20°C)</span>
          <input type="range" id="temp-slider" min="-20" max="150" value="0" class="w-56 accent-amber-500">
          <span>Hot (150°C)</span>
        </div>
      </div>
      <div class="p-2.5 bg-slate-800 text-[11px] text-slate-300 border-t border-slate-700 flex flex-wrap justify-between items-center">
        <span id="matter-status-text" class="text-amber-300 font-semibold">Solid State: Tightly packed particles vibrating in fixed lattice positions.</span>
        <span class="text-slate-400">Balbharti Science Ch 5</span>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    const canvas = container.querySelector("#sim-canvas");
    const ctx = canvas.getContext("2d");
    const tempSlider = container.querySelector("#temp-slider");
    const btnSolid = container.querySelector("#btn-solid");
    const btnLiquid = container.querySelector("#btn-liquid");
    const btnGas = container.querySelector("#btn-gas");
    const statusText = container.querySelector("#matter-status-text");

    let state = "solid"; // "solid", "liquid", "gas"
    let temp = 0;

    const updateButtons = () => {
      btnSolid.className = state === "solid" ? "px-2.5 py-1 bg-blue-600 text-white rounded text-xs font-semibold" : "px-2.5 py-1 bg-slate-700 text-white rounded text-xs font-semibold";
      btnLiquid.className = state === "liquid" ? "px-2.5 py-1 bg-blue-600 text-white rounded text-xs font-semibold" : "px-2.5 py-1 bg-slate-700 text-white rounded text-xs font-semibold";
      btnGas.className = state === "gas" ? "px-2.5 py-1 bg-blue-600 text-white rounded text-xs font-semibold" : "px-2.5 py-1 bg-slate-700 text-white rounded text-xs font-semibold";

      if (state === "solid") {
        statusText.textContent = "Solid State: Rigid fixed shape & volume; particles vibrate about mean positions.";
      } else if (state === "liquid") {
        statusText.textContent = "Liquid State: Definite volume, takes container shape; particles slide and flow freely.";
      } else {
        statusText.textContent = "Gas State: No definite shape or volume; particles move with high random kinetic velocities.";
      }
    };

    btnSolid.addEventListener("click", () => { state = "solid"; temp = -10; tempSlider.value = -10; initParticles(); updateButtons(); });
    btnLiquid.addEventListener("click", () => { state = "liquid"; temp = 40; tempSlider.value = 40; initParticles(); updateButtons(); });
    btnGas.addEventListener("click", () => { state = "gas"; temp = 110; tempSlider.value = 110; initParticles(); updateButtons(); });

    tempSlider.addEventListener("input", (e) => {
      temp = parseInt(e.target.value);
      if (temp <= 0 && state !== "solid") { state = "solid"; updateButtons(); }
      else if (temp > 0 && temp <= 100 && state !== "liquid") { state = "liquid"; updateButtons(); }
      else if (temp > 100 && state !== "gas") { state = "gas"; updateButtons(); }
    });

    let particles = [];
    const initParticles = () => {
      particles = [];
      const rows = 6;
      const cols = 8;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          particles.push({
            originX: 130 + c * 28,
            originY: 100 + r * 28,
            x: 130 + c * 28,
            y: 100 + r * 28,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            radius: 8
          });
        }
      }
    };
    initParticles();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Temperature display
      ctx.fillStyle = temp > 80 ? "#ef4444" : (temp > 0 ? "#38bdf8" : "#93c5fd");
      ctx.font = "bold 14px sans-serif";
      ctx.fillText(`Temperature: ${temp}°C`, 15, 25);

      const kineticEnergy = Math.max(0.5, (temp + 30) / 25);

      particles.forEach(p => {
        if (state === "solid") {
          // Vibration around origin
          p.x = p.originX + (Math.random() - 0.5) * kineticEnergy * 1.5;
          p.y = p.originY + (Math.random() - 0.5) * kineticEnergy * 1.5;
          ctx.fillStyle = "#60a5fa";
        } else if (state === "liquid") {
          // Sloshing at bottom of container
          p.x += p.vx * (kineticEnergy * 0.8);
          p.y += p.vy * (kineticEnergy * 0.8);

          // Liquid boundaries (bottom half)
          if (p.x < 30 || p.x > canvas.width - 30) p.vx *= -1;
          if (p.y < 120 || p.y > canvas.height - 25) p.vy *= -1;
          ctx.fillStyle = "#38bdf8";
        } else {
          // Gas: flying all over container
          p.x += p.vx * (kineticEnergy * 1.8);
          p.y += p.vy * (kineticEnergy * 1.8);

          if (p.x < 20 || p.x > canvas.width - 20) p.vx *= -1;
          if (p.y < 20 || p.y > canvas.height - 20) p.vy *= -1;
          ctx.fillStyle = "#f59e0b";
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.stroke();
      });

      this.currentAnimId = requestAnimationFrame(animate);
    };

    animate();
  },

  // -------------------------------------------------------------------------
  // 5. ELECTRIC CIRCUIT & CURRENT FLOW (Class 7 Ch 8, Class 8 Ch 4)
  // -------------------------------------------------------------------------
  renderElectricCircuit: function(container) {
    container.innerHTML = `
      <div class="p-3 bg-slate-800/90 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div class="flex items-center gap-2 font-bold text-amber-400">
          <i data-lucide="zap" class="w-5 h-5"></i>
          <span>Electric Circuit Simulator (विद्युत परिपथ प्रयोगशाळा)</span>
        </div>
        <div class="flex items-center gap-3">
          <label class="flex items-center gap-1 text-xs text-slate-300">
            Voltage:
            <input type="range" id="volt-slider" min="1.5" max="12" step="1.5" value="6" class="w-20 accent-amber-500">
            <span id="volt-val" class="font-mono text-amber-400">6V</span>
          </label>
          <button id="switch-btn" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-xs">Switch: CLOSED (ON)</button>
        </div>
      </div>
      <div class="relative w-full h-[380px] bg-slate-950 flex items-center justify-center overflow-hidden">
        <canvas id="sim-canvas" width="680" height="360" class="w-full h-full block"></canvas>
      </div>
      <div class="p-2.5 bg-slate-800 text-[11px] text-slate-300 border-t border-slate-700 flex flex-wrap justify-between items-center">
        <span class="font-mono text-sky-300">Ohm's Law: I = V / R | Flow of electrons from negative to positive pole</span>
        <span class="text-amber-300 font-medium">Balbharti Class 8 Science Ch 4</span>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    const canvas = container.querySelector("#sim-canvas");
    const ctx = canvas.getContext("2d");
    const switchBtn = container.querySelector("#switch-btn");
    const voltSlider = container.querySelector("#volt-slider");
    const voltVal = container.querySelector("#volt-val");

    let isClosed = true;
    let voltage = 6;

    switchBtn.addEventListener("click", () => {
      isClosed = !isClosed;
      switchBtn.textContent = isClosed ? "Switch: CLOSED (ON)" : "Switch: OPEN (OFF)";
      switchBtn.className = isClosed ? "px-3 py-1 bg-emerald-600 text-white rounded font-bold text-xs" : "px-3 py-1 bg-rose-600 text-white rounded font-bold text-xs";
    });

    voltSlider.addEventListener("input", (e) => {
      voltage = parseFloat(e.target.value);
      voltVal.textContent = `${voltage}V`;
    });

    // Electrons along rectangular loop
    // Loop vertices: (140, 80) -> (540, 80) -> (540, 280) -> (140, 280) -> back
    const loopLength = 2 * (400 + 200);
    const electronCount = 28;
    const electrons = Array.from({ length: electronCount }, (_, i) => ({
      dist: (i / electronCount) * loopLength
    }));

    const getLoopPoint = (d) => {
      d = d % loopLength;
      if (d < 400) return { x: 140 + d, y: 80 }; // top wire
      d -= 400;
      if (d < 200) return { x: 540, y: 80 + d }; // right wire
      d -= 200;
      if (d < 400) return { x: 540 - d, y: 280 }; // bottom wire
      d -= 400;
      return { x: 140, y: 280 - d }; // left wire
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Copper Wire Path
      ctx.strokeStyle = "#ca8a04";
      ctx.lineWidth = 6;
      ctx.lineJoin = "round";
      ctx.strokeRect(140, 80, 400, 200);

      // 2. Battery at Left (140, 180)
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(115, 140, 50, 80);
      ctx.fillStyle = "#dc2626"; // Positive pole (+)
      ctx.fillRect(130, 125, 20, 15);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("+", 135, 155);
      ctx.fillText("-", 137, 210);
      ctx.fillStyle = "#fbbf24";
      ctx.fillText(`${voltage}V Cell`, 70, 185);

      // 3. Switch on Top Wire (340, 80)
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(310, 65, 60, 30); // switch gap
      ctx.strokeStyle = isClosed ? "#10b981" : "#ef4444";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(315, 80);
      ctx.lineTo(isClosed ? 365 : 355, isClosed ? 80 : 55);
      ctx.stroke();
      ctx.fillStyle = "#ffffff";
      ctx.fillText(isClosed ? "Key ON" : "Key OFF", 320, 50);

      // 4. Light Bulb on Right Wire (540, 180)
      const bulbGlowRadius = isClosed ? 20 + voltage * 5 : 0;
      if (bulbGlowRadius > 0) {
        const bg = ctx.createRadialGradient(540, 180, 5, 540, 180, bulbGlowRadius);
        bg.addColorStop(0, "rgba(254, 240, 138, 1)");
        bg.addColorStop(0.5, "rgba(234, 179, 8, 0.4)");
        bg.addColorStop(1, "rgba(234, 179, 8, 0)");
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(540, 180, bulbGlowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Glass bulb
      ctx.fillStyle = isClosed ? "#fef08a" : "rgba(148, 163, 184, 0.3)";
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(540, 180, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Filament
      ctx.strokeStyle = isClosed ? "#f97316" : "#64748b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(534, 192);
      ctx.lineTo(538, 175);
      ctx.lineTo(542, 175);
      ctx.lineTo(546, 192);
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("Bulb (दिवा)", 575, 185);

      // 5. Flowing Electrons (if switch closed)
      if (isClosed) {
        const currentSpeed = (voltage / 6) * 2;
        electrons.forEach(e => {
          e.dist += currentSpeed;
          const pos = getLoopPoint(e.dist);
          ctx.fillStyle = "#38bdf8";
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      this.currentAnimId = requestAnimationFrame(animate);
    };

    animate();
  },

  // -------------------------------------------------------------------------
  // 6. HUMAN DIGESTIVE & PERISTALSIS SYSTEM (Class 6 Ch 8, Class 7 Ch 12)
  // -------------------------------------------------------------------------
  renderDigestiveSystem: function(container) {
    container.innerHTML = `
      <div class="p-3 bg-slate-800/90 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div class="flex items-center gap-2 font-bold text-rose-400">
          <i data-lucide="heart" class="w-5 h-5"></i>
          <span>Human Digestive System & Peristalsis (पचनसंस्था)</span>
        </div>
        <button id="digestion-start-btn" class="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold text-xs transition">Swallow Food Bolus (घास गिळा)</button>
      </div>
      <div class="relative w-full h-[380px] bg-slate-950 flex items-center justify-center">
        <canvas id="sim-canvas" width="600" height="370" class="w-full h-full block"></canvas>
      </div>
      <div class="p-2.5 bg-slate-800 text-[11px] text-slate-300 border-t border-slate-700 flex flex-wrap justify-between items-center">
        <span id="digestion-stage-text" class="text-rose-300 font-semibold">Click 'Swallow Food Bolus' to follow digestion from Mouth to Stomach and Intestines.</span>
        <span class="text-slate-400">Balbharti Science Ch 12</span>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    const canvas = container.querySelector("#sim-canvas");
    const ctx = canvas.getContext("2d");
    const startBtn = container.querySelector("#digestion-start-btn");
    const stageText = container.querySelector("#digestion-stage-text");

    let foodProgress = 0; // 0 to 1
    let isSwallowing = false;

    startBtn.addEventListener("click", () => {
      foodProgress = 0;
      isSwallowing = true;
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = 300;

      // 1. Mouth / Oral Cavity
      ctx.fillStyle = "#f43f5e";
      ctx.beginPath();
      ctx.arc(cx, 50, 22, 0, Math.PI * 2);
      ctx.fill();

      // 2. Esophagus (अन्ननलिका)
      ctx.strokeStyle = "#fda4af";
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(cx, 65);
      ctx.lineTo(cx, 160);
      ctx.stroke();

      // 3. Stomach (जठर) - J-shaped organ
      ctx.fillStyle = "#e11d48";
      ctx.beginPath();
      ctx.ellipse(cx + 25, 190, 42, 28, 0.4, 0, Math.PI * 2);
      ctx.fill();

      // 4. Liver (यकृत - Bile producer)
      ctx.fillStyle = "#991b1b";
      ctx.beginPath();
      ctx.moveTo(cx - 70, 160);
      ctx.lineTo(cx - 10, 160);
      ctx.lineTo(cx - 40, 205);
      ctx.closePath();
      ctx.fill();

      // 5. Small Intestine (लहान आतडे) - coils
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(cx, 260, 30, 0, Math.PI);
      ctx.arc(cx + 10, 265, 25, Math.PI, 0);
      ctx.arc(cx, 275, 20, 0, Math.PI);
      ctx.stroke();

      // 6. Large Intestine (मोठे आतडे) - frame
      ctx.strokeStyle = "#a16207";
      ctx.lineWidth = 16;
      ctx.beginPath();
      ctx.moveTo(cx - 55, 310);
      ctx.lineTo(cx - 55, 230);
      ctx.lineTo(cx + 55, 230);
      ctx.lineTo(cx + 55, 310);
      ctx.stroke();

      // Labels
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("Mouth (तोंड - Amylase)", cx + 35, 45);
      ctx.fillText("Esophagus (अन्ननलिका - Peristalsis)", cx + 25, 110);
      ctx.fillText("Liver (यकृत - Bile)", cx - 145, 180);
      ctx.fillText("Stomach (जठर - Pepsin + HCl)", cx + 75, 195);
      ctx.fillText("Small Intestine (लहान आतडे)", cx + 75, 265);
      ctx.fillText("Large Intestine (मोठे आतडे)", cx - 165, 275);

      // Animated Food Bolus
      if (isSwallowing) {
        foodProgress += 0.006;
        let fx = cx;
        let fy = 50;

        if (foodProgress < 0.3) {
          // Mouth to Esophagus
          fy = 50 + (foodProgress / 0.3) * 110;
          stageText.textContent = "Stage 1: Esophagus muscles contract in rhythmic peristalsis waves!";
        } else if (foodProgress < 0.6) {
          // Stomach churning
          fx = cx + 25 + Math.sin(foodProgress * 30) * 8;
          fy = 190;
          stageText.textContent = "Stage 2: Stomach churns food with Hydrochloric Acid (HCl) and Pepsin to break proteins!";
        } else if (foodProgress < 0.9) {
          // Small Intestine
          fx = cx + Math.sin(foodProgress * 25) * 20;
          fy = 240 + ((foodProgress - 0.6) / 0.3) * 45;
          stageText.textContent = "Stage 3: Small intestine villi absorb broken glucose, amino acids & fatty acids into bloodstream!";
        } else if (foodProgress < 1.0) {
          // Large Intestine
          fx = cx + 45;
          fy = 280 + ((foodProgress - 0.9) / 0.1) * 30;
          stageText.textContent = "Stage 4: Large intestine reabsorbs water & minerals, passing undigested residue.";
        } else {
          isSwallowing = false;
          stageText.textContent = "Digestion complete! Nutrients absorbed for cellular energy.";
        }

        ctx.fillStyle = "#facc15";
        ctx.beginPath();
        ctx.arc(fx, fy, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ea580c";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      this.currentAnimId = requestAnimationFrame(animate);
    };

    animate();
  },

  // -------------------------------------------------------------------------
  // 7. PLANT CELL STRUCTURE (Class 7 Ch 11, Class 8 Ch 10)
  // -------------------------------------------------------------------------
  renderPlantCell: function(container) {
    container.innerHTML = `
      <div class="p-3 bg-slate-800/90 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div class="flex items-center gap-2 font-bold text-emerald-400">
          <i data-lucide="maximize" class="w-5 h-5"></i>
          <span>Interactive Plant Cell (वनस्पती पेशीरचना)</span>
        </div>
        <span class="text-xs text-slate-300">Click any organelle to inspect its function</span>
      </div>
      <div class="relative w-full h-[380px] bg-slate-950 flex items-center justify-center">
        <canvas id="sim-canvas" width="650" height="360" class="w-full h-full block cursor-pointer"></canvas>
        <div id="cell-info" class="absolute bottom-2 left-2 right-2 bg-slate-900/95 border border-emerald-500/50 p-2.5 rounded-lg text-xs shadow-xl text-slate-200">
          <strong class="text-emerald-400 text-sm">Click an organelle above</strong>: Explore Nucleus, Cell Wall, Chloroplast, Mitochondria, and Central Vacuole!
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    const canvas = container.querySelector("#sim-canvas");
    const ctx = canvas.getContext("2d");
    const infoBox = container.querySelector("#cell-info");

    const organelles = [
      { id: "wall", name: "Cell Wall (पेशीभित्तीका)", desc: "Rigid outer layer composed of cellulose; provides mechanical support, turgidity, and protection.", x: 325, y: 175, radius: 155, isOutline: true },
      { id: "vacuole", name: "Central Vacuole (मोठी रिक्तिका)", desc: "Stores cell sap, water, and minerals; maintains turgor pressure against the cell wall.", x: 260, y: 175, radius: 60, color: "rgba(56, 189, 248, 0.4)" },
      { id: "nucleus", name: "Nucleus (केंद्रक)", desc: "The control center of the cell containing genetic DNA chromosomes and nucleolus.", x: 420, y: 140, radius: 36, color: "#9333ea" },
      { id: "mito", name: "Mitochondrion (तंतुकणिका)", desc: "Powerhouse of the cell! Conducts cellular respiration to synthesize energy-rich ATP molecules.", x: 410, y: 240, radius: 24, color: "#f97316" },
      { id: "chloro", name: "Chloroplast (हरितलवक)", desc: "Contains chlorophyll pigments that absorb solar photons to manufacture food via photosynthesis.", x: 230, y: 100, radius: 22, color: "#10b981" }
    ];

    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      let match = null;
      for (let o of organelles) {
        const d = Math.hypot(x - o.x, y - o.y);
        if (d <= o.radius) {
          match = o;
          break;
        }
      }

      if (match) {
        infoBox.innerHTML = `<strong class="text-emerald-400 text-sm">${match.name}</strong>: ${match.desc}`;
      } else {
        infoBox.innerHTML = `<strong class="text-emerald-400 text-sm">Cytoplasm (पेशीद्रव्य)</strong>: Jelly-like fluid matrix holding all cellular organelles and enzymes.`;
      }
    });

    let pulse = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pulse += 0.03;

      const cx = 325;
      const cy = 175;

      // 1. Rigid Hexagonal Cell Wall
      ctx.strokeStyle = "#047857";
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.roundRect(cx - 200, cy - 130, 400, 260, 40);
      ctx.stroke();

      // Cell Membrane
      ctx.strokeStyle = "#34d399";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(cx - 192, cy - 122, 384, 244, 34);
      ctx.stroke();
      ctx.fillStyle = "rgba(6, 78, 59, 0.5)";
      ctx.fill();

      // 2. Large Central Vacuole
      ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(260, 175, 75, 55, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("Central Vacuole", 215, 175);

      // 3. Nucleus with Nucleolus
      ctx.fillStyle = "#7e22ce";
      ctx.beginPath();
      ctx.arc(420, 140, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#c084fc";
      ctx.beginPath();
      ctx.arc(420, 140, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.fillText("Nucleus", 400, 143);

      // 4. Mitochondria (pulsing)
      const mitoScale = 1 + Math.sin(pulse) * 0.05;
      ctx.fillStyle = "#ea580c";
      ctx.beginPath();
      ctx.ellipse(410, 240, 26 * mitoScale, 14 * mitoScale, 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.fillText("Mitochondria", 375, 243);

      // 5. Chloroplasts
      ctx.fillStyle = "#059669";
      ctx.beginPath();
      ctx.ellipse(230, 95, 26, 14, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.fillText("Chloroplast", 195, 98);

      this.currentAnimId = requestAnimationFrame(animate);
    };

    animate();
  },

  // -------------------------------------------------------------------------
  // 8. REFLECTION & REFRACTION OF LIGHT (Class 6 Ch 14, Class 8 Ch 16)
  // -------------------------------------------------------------------------
  renderLightReflection: function(container) {
    container.innerHTML = `
      <div class="p-3 bg-slate-800/90 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div class="flex items-center gap-2 font-bold text-amber-400">
          <i data-lucide="sun" class="w-5 h-5"></i>
          <span>Laws of Reflection of Light (प्रकाशाचे परावर्तन)</span>
        </div>
        <div class="flex items-center gap-3">
          <label class="flex items-center gap-1 text-xs text-slate-300">
            Angle of Incidence (i):
            <input type="range" id="incident-slider" min="10" max="80" value="45" class="w-24 accent-amber-500">
            <span id="angle-val" class="font-mono text-amber-400 font-bold">45°</span>
          </label>
        </div>
      </div>
      <div class="relative w-full h-[380px] bg-slate-950 flex items-center justify-center">
        <canvas id="sim-canvas" width="650" height="360" class="w-full h-full block"></canvas>
      </div>
      <div class="p-2.5 bg-slate-800 text-[11px] text-slate-300 border-t border-slate-700 flex flex-wrap justify-between items-center">
        <span class="font-mono text-amber-300">First Law of Reflection: Angle of Incidence (∠i) = Angle of Reflection (∠r)</span>
        <span class="text-slate-400">Balbharti Science Ch 16</span>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    const canvas = container.querySelector("#sim-canvas");
    const ctx = canvas.getContext("2d");
    const angleSlider = container.querySelector("#incident-slider");
    const angleVal = container.querySelector("#angle-val");

    let angleDeg = 45;
    angleSlider.addEventListener("input", (e) => {
      angleDeg = parseInt(e.target.value);
      angleVal.textContent = `${angleDeg}°`;
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = 325;
      const cy = 250;

      // 1. Plane Mirror Surface
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(100, cy);
      ctx.lineTo(550, cy);
      ctx.stroke();

      // Mirror back hatching lines
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 1.5;
      for (let x = 110; x <= 540; x += 15) {
        ctx.beginPath();
        ctx.moveTo(x, cy);
        ctx.lineTo(x - 10, cy + 12);
        ctx.stroke();
      }
      ctx.fillStyle = "#94a3b8";
      ctx.font = "12px sans-serif";
      ctx.fillText("Plane Mirror (सपाट आरसा)", 410, cy + 28);

      // 2. Normal Line (स्तंभिका)
      ctx.strokeStyle = "#38bdf8";
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx, 50);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#38bdf8";
      ctx.fillText("Normal (स्तंभिका)", cx - 25, 40);

      // 3. Incident Ray (आपती किरण)
      const rad = (angleDeg * Math.PI) / 180;
      const rayLen = 220;
      const ix = cx - Math.sin(rad) * rayLen;
      const iy = cy - Math.cos(rad) * rayLen;

      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(ix, iy);
      ctx.lineTo(cx, cy);
      ctx.stroke();

      // Incident arrow
      const midIx = (ix + cx) / 2;
      const midIy = (iy + cy) / 2;
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(midIx, midIy, 4, 0, Math.PI * 2);
      ctx.fill();

      // 4. Reflected Ray (परावर्तित किरण)
      const rx = cx + Math.sin(rad) * rayLen;
      const ry = cy - Math.cos(rad) * rayLen;

      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(rx, ry);
      ctx.stroke();

      // 5. Protractor Angle Arcs
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 60, -Math.PI / 2 - rad, -Math.PI / 2);
      ctx.stroke();
      ctx.fillStyle = "#facc15";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText(`i = ${angleDeg}°`, cx - 55, cy - 70);

      ctx.strokeStyle = "#22c55e";
      ctx.beginPath();
      ctx.arc(cx, cy, 60, -Math.PI / 2, -Math.PI / 2 + rad);
      ctx.stroke();
      ctx.fillStyle = "#22c55e";
      ctx.fillText(`r = ${angleDeg}°`, cx + 25, cy - 70);

      // Point of Incidence
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText("Point of Incidence (आपतन बिंदू O)", cx - 80, cy - 10);

      this.currentAnimId = requestAnimationFrame(animate);
    };

    animate();
  },

  // -------------------------------------------------------------------------
  // 9. ATOM STRUCTURE & ELECTRON CONFIGURATION (Class 8 Ch 5)
  // -------------------------------------------------------------------------
  renderAtomStructure: function(container) {
    container.innerHTML = `
      <div class="p-3 bg-slate-800/90 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div class="flex items-center gap-2 font-bold text-sky-400">
          <i data-lucide="disc" class="w-5 h-5"></i>
          <span>Bohr's Atomic Model (अणूचे अंतरंग)</span>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs text-slate-300">Choose Element:</label>
          <select id="element-select" class="bg-slate-700 text-white rounded px-2.5 py-1 text-xs border border-slate-600">
            <option value="H">Hydrogen (Z=1, A=1)</option>
            <option value="C">Carbon (Z=6, A=12)</option>
            <option value="O">Oxygen (Z=8, A=16)</option>
            <option value="Na" selected>Sodium (Z=11, A=23)</option>
            <option value="Cl">Chlorine (Z=17, A=35)</option>
          </select>
        </div>
      </div>
      <div class="relative w-full h-[380px] bg-slate-950 flex items-center justify-center">
        <canvas id="sim-canvas" width="650" height="360" class="w-full h-full block"></canvas>
      </div>
      <div class="p-2.5 bg-slate-800 text-[11px] text-slate-300 border-t border-slate-700 flex flex-wrap justify-between items-center">
        <span id="config-text" class="text-sky-300 font-mono">Sodium: 11 Protons, 12 Neutrons | Configuration: K=2, L=8, M=1</span>
        <span class="text-amber-300 font-medium">Bohr Formula: 2n²</span>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    const canvas = container.querySelector("#sim-canvas");
    const ctx = canvas.getContext("2d");
    const elemSelect = container.querySelector("#element-select");
    const configText = container.querySelector("#config-text");

    const elements = {
      H: { name: "Hydrogen", p: 1, n: 0, shells: [1], label: "K=1" },
      C: { name: "Carbon", p: 6, n: 6, shells: [2, 4], label: "K=2, L=4" },
      O: { name: "Oxygen", p: 8, n: 8, shells: [2, 6], label: "K=2, L=6" },
      Na: { name: "Sodium", p: 11, n: 12, shells: [2, 8, 1], label: "K=2, L=8, M=1" },
      Cl: { name: "Chlorine", p: 17, n: 18, shells: [2, 8, 7], label: "K=2, L=8, M=7" }
    };

    let curElem = elements.Na;

    elemSelect.addEventListener("change", (e) => {
      curElem = elements[e.target.value];
      configText.textContent = `${curElem.name}: ${curElem.p} Protons, ${curElem.n} Neutrons | Shells: ${curElem.label}`;
    });

    let angle = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      angle += 0.02;

      const cx = 325;
      const cy = 180;

      // Nucleus
      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.arc(cx, cy, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px sans-serif";
      ctx.fillText(`p⁺: ${curElem.p}`, cx - 12, cy - 4);
      ctx.fillText(`n⁰: ${curElem.n}`, cx - 12, cy + 10);

      // Shells (K, L, M)
      const shellRadii = [60, 105, 145];
      const shellNames = ["K Shell (n=1)", "L Shell (n=2)", "M Shell (n=3)"];

      curElem.shells.forEach((electronCount, sIdx) => {
        const sr = shellRadii[sIdx];

        // Orbit ring
        ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, sr, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "#94a3b8";
        ctx.font = "10px sans-serif";
        ctx.fillText(shellNames[sIdx], cx + sr - 15, cy - 10);

        // Orbiting electrons
        for (let i = 0; i < electronCount; i++) {
          const ea = angle * (sIdx % 2 === 0 ? 1 : -1) + (i / electronCount) * Math.PI * 2;
          const ex = cx + Math.cos(ea) * sr;
          const ey = cy + Math.sin(ea) * sr;

          ctx.fillStyle = "#38bdf8";
          ctx.beginPath();
          ctx.arc(ex, ey, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 9px sans-serif";
          ctx.fillText("e⁻", ex - 4, ey + 3);
        }
      });

      this.currentAnimId = requestAnimationFrame(animate);
    };

    animate();
  },

  // -------------------------------------------------------------------------
  // 10. NEWTON'S FORCE & MOTION (Class 6 Ch 9, Class 7 Ch 7, Class 8 Ch 3)
  // -------------------------------------------------------------------------
  renderMotionForce: function(container) {
    container.innerHTML = `
      <div class="p-3 bg-slate-800/90 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div class="flex items-center gap-2 font-bold text-amber-400">
          <i data-lucide="activity" class="w-5 h-5"></i>
          <span>Newton's Laws of Motion & Force (बल व गती)</span>
        </div>
        <div class="flex items-center gap-3">
          <label class="flex items-center gap-1 text-xs text-slate-300">
            Mass (m):
            <input type="range" id="mass-slider" min="1" max="10" value="5" class="w-16 accent-amber-500">
            <span id="mass-val" class="font-mono text-amber-400">5kg</span>
          </label>
          <label class="flex items-center gap-1 text-xs text-slate-300">
            Force (F):
            <input type="range" id="force-slider" min="0" max="50" value="20" class="w-16 accent-emerald-500">
            <span id="force-val" class="font-mono text-emerald-400">20N</span>
          </label>
        </div>
      </div>
      <div class="relative w-full h-[380px] bg-slate-950 flex items-center justify-center">
        <canvas id="sim-canvas" width="650" height="360" class="w-full h-full block"></canvas>
      </div>
      <div class="p-2.5 bg-slate-800 text-[11px] text-slate-300 border-t border-slate-700 flex flex-wrap justify-between items-center">
        <span id="motion-calc" class="font-mono text-emerald-300">a = F / m = 20 N / 5 kg = 4.0 m/s²</span>
        <span class="text-slate-400">Newton's 2nd Law (F = ma)</span>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    const canvas = container.querySelector("#sim-canvas");
    const ctx = canvas.getContext("2d");
    const massSlider = container.querySelector("#mass-slider");
    const forceSlider = container.querySelector("#force-slider");
    const massVal = container.querySelector("#mass-val");
    const forceVal = container.querySelector("#force-val");
    const motionCalc = container.querySelector("#motion-calc");

    let mass = 5;
    let force = 20;
    let cartX = 80;
    let cartVelocity = 0;

    const updateCalc = () => {
      const a = (force / mass).toFixed(2);
      motionCalc.textContent = `a = F / m = ${force} N / ${mass} kg = ${a} m/s²`;
    };

    massSlider.addEventListener("input", (e) => {
      mass = parseInt(e.target.value);
      massVal.textContent = `${mass}kg`;
      updateCalc();
    });

    forceSlider.addEventListener("input", (e) => {
      force = parseInt(e.target.value);
      forceVal.textContent = `${force}N`;
      updateCalc();
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const trackY = 240;

      // Track
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, trackY);
      ctx.lineTo(canvas.width, trackY);
      ctx.stroke();

      // Acceleration update
      const accel = (force / mass) * 0.05;
      cartVelocity += accel;
      cartVelocity *= 0.98; // friction dampening
      cartX += cartVelocity;
      if (cartX > canvas.width - 120) {
        cartX = 40;
        cartVelocity = 0;
      }

      // Draw Cart Body
      ctx.fillStyle = "#3b82f6";
      ctx.fillRect(cartX, trackY - 50, 90, 40);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText(`${mass} kg`, cartX + 30, trackY - 26);

      // Wheels
      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cartX + 20, trackY - 8, 10, 0, Math.PI * 2);
      ctx.arc(cartX + 70, trackY - 8, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Force Vector Arrow
      if (force > 0) {
        const arrowLen = force * 2.5;
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cartX + 90, trackY - 30);
        ctx.lineTo(cartX + 90 + arrowLen, trackY - 30);
        ctx.stroke();
        // Arrowhead
        ctx.fillStyle = "#10b981";
        ctx.beginPath();
        ctx.moveTo(cartX + 90 + arrowLen + 10, trackY - 30);
        ctx.lineTo(cartX + 90 + arrowLen, trackY - 36);
        ctx.lineTo(cartX + 90 + arrowLen, trackY - 24);
        ctx.closePath();
        ctx.fill();
        ctx.fillText(`F = ${force} N`, cartX + 95, trackY - 40);
      }

      this.currentAnimId = requestAnimationFrame(animate);
    };

    animate();
  },

  // -------------------------------------------------------------------------
  // 11. ACID-BASE & LITMUS INDICATOR LAB (Class 8 Ch 12)
  // -------------------------------------------------------------------------
  renderAcidBase: function(container) {
    container.innerHTML = `
      <div class="p-3 bg-slate-800/90 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div class="flex items-center gap-2 font-bold text-rose-400">
          <i data-lucide="droplet" class="w-5 h-5"></i>
          <span>Acid, Base & Litmus Indicator Lab (आम्ल व आम्लारी)</span>
        </div>
        <div class="flex items-center gap-3">
          <label class="flex items-center gap-1 text-xs text-slate-300">
            pH Value:
            <input type="range" id="ph-slider" min="1" max="14" value="7" class="w-24 accent-purple-500">
            <span id="ph-val" class="font-mono text-purple-300 font-bold">pH 7 (Neutral)</span>
          </label>
        </div>
      </div>
      <div class="relative w-full h-[380px] bg-slate-950 flex items-center justify-center">
        <canvas id="sim-canvas" width="650" height="360" class="w-full h-full block"></canvas>
      </div>
      <div class="p-2.5 bg-slate-800 text-[11px] text-slate-300 border-t border-slate-700 flex flex-wrap justify-between items-center">
        <span id="litmus-feedback" class="font-semibold text-emerald-300">pH 7 (Pure Water): Neutral - No color change on litmus paper.</span>
        <span class="text-slate-400">Balbharti Science Ch 12</span>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    const canvas = container.querySelector("#sim-canvas");
    const ctx = canvas.getContext("2d");
    const phSlider = container.querySelector("#ph-slider");
    const phVal = container.querySelector("#ph-val");
    const litmusFeedback = container.querySelector("#litmus-feedback");

    let pH = 7;

    const getLiquidColor = (val) => {
      if (val < 4) return "rgba(239, 68, 68, 0.75)"; // Strong acid: Red
      if (val < 7) return "rgba(249, 115, 22, 0.75)"; // Weak acid: Orange
      if (val === 7) return "rgba(34, 197, 94, 0.75)"; // Neutral: Green
      if (val < 11) return "rgba(59, 130, 246, 0.75)"; // Weak base: Blue
      return "rgba(168, 85, 247, 0.75)"; // Strong base: Violet
    };

    phSlider.addEventListener("input", (e) => {
      pH = parseInt(e.target.value);
      if (pH < 7) {
        phVal.textContent = `pH ${pH} (Acidic - आम्ल)`;
        litmusFeedback.textContent = `Acidic Solution: Turns Blue Litmus strip RED! Excess H⁺ ions present.`;
      } else if (pH === 7) {
        phVal.textContent = `pH 7 (Neutral - उदासीन)`;
        litmusFeedback.textContent = `Neutral Solution: No color change on litmus. [H⁺] = [OH⁻].`;
      } else {
        phVal.textContent = `pH ${pH} (Basic - आम्लारी)`;
        litmusFeedback.textContent = `Basic Solution: Turns Red Litmus strip BLUE! Excess OH⁻ ions present.`;
      }
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bx = 220;
      const by = 120;
      const bw = 200;
      const bh = 190;

      // 1. Glass Beaker
      ctx.fillStyle = getLiquidColor(pH);
      ctx.fillRect(bx + 6, by + 50, bw - 12, bh - 55);

      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 5;
      ctx.strokeRect(bx, by, bw, bh);

      // Beaker measurement graduation ticks
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      for (let y = by + 40; y < by + bh - 10; y += 30) {
        ctx.beginPath();
        ctx.moveTo(bx + 5, y);
        ctx.lineTo(bx + 25, y);
        ctx.stroke();
      }

      // 2. Litmus Strip 1 (Blue Litmus Test)
      const strip1Color = pH < 7 ? "#ef4444" : "#3b82f6";
      ctx.fillStyle = strip1Color;
      ctx.fillRect(bx + 40, by + 10, 24, 110);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("Blue Strip", bx + 22, by - 5);

      // Litmus Strip 2 (Red Litmus Test)
      const strip2Color = pH > 7 ? "#3b82f6" : "#ef4444";
      ctx.fillStyle = strip2Color;
      ctx.fillRect(bx + 130, by + 10, 24, 110);
      ctx.fillStyle = "#ffffff";
      ctx.fillText("Red Strip", bx + 115, by - 5);

      // pH Rainbow scale indicator bar
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText("pH Scale Reference:", 460, 110);
      ctx.fillStyle = "#ef4444"; ctx.fillRect(460, 125, 140, 14); ctx.fillStyle = "#ffffff"; ctx.font = "10px sans-serif"; ctx.fillText("1-3: Strong Acid (HCl)", 465, 136);
      ctx.fillStyle = "#f97316"; ctx.fillRect(460, 145, 140, 14); ctx.fillStyle = "#ffffff"; ctx.fillText("4-6: Weak Acid (Lemon)", 465, 156);
      ctx.fillStyle = "#22c55e"; ctx.fillRect(460, 165, 140, 14); ctx.fillStyle = "#ffffff"; ctx.fillText("7: Neutral (Water)", 465, 176);
      ctx.fillStyle = "#3b82f6"; ctx.fillRect(460, 185, 140, 14); ctx.fillStyle = "#ffffff"; ctx.fillText("8-10: Weak Base (Soap)", 465, 196);
      ctx.fillStyle = "#a855f7"; ctx.fillRect(460, 205, 140, 14); ctx.fillStyle = "#ffffff"; ctx.fillText("11-14: Strong Base (NaOH)", 465, 216);

      this.currentAnimId = requestAnimationFrame(animate);
    };

    animate();
  }
};
