# Continuity Agent v2 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Evolve continuity-agent-C-bioluminescent.html into a living, audio-reactive, agent-connectable experience with an AI orb behind frosted glass, a Web Audio-driven Lissajous, and a persistent notepad tool.

**Architecture:** Mixed rendering — CSS radial gradient (Layer 0), Canvas 2D orb (Layer 1), CSS backdrop-filter frost (Layer 2), existing Canvas Lissajous upgraded with Web Audio API (Layer 3), DOM content zones (Layer 4). All layers driven by a shared `AgentState` machine. GSAP handles all inter-layer transitions. A `window.ContinuityAgent` API surface provides the plug-in point for a real agent.

**Tech Stack:** Vanilla HTML/CSS/JS, GSAP 3 (CDN), Google Fonts Syne (CDN), Web Audio API (native), Web Speech API (native), Canvas 2D (native), localStorage (native).

**Design doc:** `docs/plans/2026-02-25-continuity-agent-v2-design.md`
**Source file:** `continuity-agent-C-bioluminescent.html`
**Output file:** `continuity-agent-C-v2-bioluminescent.html`
**Working directory:** `/Users/witchcraftery-studio/Library/CloudStorage/GoogleDrive-nick@nickwichman.com/My Drive/_witchcraftery-dev/01_Dev-Projects/openclaw-projects/Continuity-Agent_conversational-canvas`

---

### Task 1: Scaffold v2 File + Update HTML Structure

**Files:**
- Create: `continuity-agent-C-v2-bioluminescent.html` (copy from C)
- Modify: HTML body structure

**Step 1: Copy source file**

```bash
cd "/Users/witchcraftery-studio/Library/CloudStorage/GoogleDrive-nick@nickwichman.com/My Drive/_witchcraftery-dev/01_Dev-Projects/openclaw-projects/Continuity-Agent_conversational-canvas"
cp "continuity-agent-C-bioluminescent.html" "continuity-agent-C-v2-bioluminescent.html"
```

**Step 2: Update `<title>` and add v2 layer HTML**

In `continuity-agent-C-v2-bioluminescent.html`:

Replace:
```html
<title>Continuity Agent — Bioluminescent Depths</title>
```
With:
```html
<title>Continuity Agent — Bioluminescent v2</title>
```

Replace the entire `<body>` opening (before `<div id="zone1">`) to add the new layer divs. Insert these elements as the FIRST children of `<body>`, before everything else:

```html
  <!-- LAYER 0: Emotional gradient background -->
  <div id="bg-gradient"></div>

  <!-- LAYER 1: Orb canvas — AI's cellular body -->
  <canvas id="orb-canvas"></canvas>

  <!-- LAYER 2: Frosted glass -->
  <div id="frost">
    <svg id="frost-grain" xmlns="http://www.w3.org/2000/svg"
         style="position:absolute;inset:0;width:100%;height:100%;opacity:0.04;pointer-events:none;">
      <filter id="frost-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#frost-noise)"/>
    </svg>
  </div>
```

**Step 3: Verify body structure is correct**

The body should now read, in order:
1. `#bg-gradient`
2. `#orb-canvas`
3. `#frost`
4. `#zone1` (with `#idle-mark` and `#thinking-form` / `#lissajous-canvas`)
5. `#zone2`
6. `#zone3`
7. `#trigger-bar`

**Step 4: Commit**

```bash
git add "continuity-agent-C-v2-bioluminescent.html"
git commit -m "feat: v2 scaffold — add bg-gradient, orb-canvas, frost layers to HTML"
```

---

### Task 2: CSS — Layer Stack, Gradient, Orb Canvas, Frost

**Files:**
- Modify: `continuity-agent-C-v2-bioluminescent.html` (CSS `<style>` block)

**Step 1: Update theme tokens — add v2 gradient color vars**

In the `:root` block, add after existing tokens:

```css
    /* ── V2 LAYER TOKENS ──────────────────────────────────────── */
    --g1: rgba(12,8,20,0.9);
    --g2: rgba(20,14,8,0.8);
    --g1x: 30%; --g1y: 40%;
    --g2x: 75%; --g2y: 65%;
    --frost-blur: 32px;
    --orb-blur: 0px;
    --orb-size: 55vw;
```

**Step 2: Add v2 layer CSS after the `/* ── THEME C OVERRIDES */` block**

```css
/* ── V2: LAYER STACK ─────────────────────────────────────────── */
#bg-gradient {
  position: fixed;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse 70% 60% at var(--g1x) var(--g1y), var(--g1) 0%, transparent 70%),
    radial-gradient(ellipse 50% 80% at var(--g2x) var(--g2y), var(--g2) 0%, transparent 60%),
    var(--bg);
  transition: background 0.3s ease;
}

#orb-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  filter: blur(var(--orb-blur));
  transition: filter 2s ease;
}

#frost {
  position: fixed;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  backdrop-filter: blur(var(--frost-blur)) saturate(120%) brightness(0.82);
  -webkit-backdrop-filter: blur(var(--frost-blur)) saturate(120%) brightness(0.82);
  overflow: hidden;
}

/* Ensure content zones sit above frost */
#zone1, #zone2, #zone3 { z-index: 10; }
#trigger-bar            { z-index: 20; }

/* ── V2: CONTAINER SPACING FIX ───────────────────────────────── */
.panel                  { padding: 2rem 2.5rem; }
.panel h2               { padding: 0 0 1rem 0; margin-bottom: 0.75rem; }
.notepad                { padding: 2rem 2.5rem; }
.notepad h2             { padding: 0 0 1rem 0; margin-bottom: 0.75rem; }
```

**Step 3: Verify in browser — open the file**

```bash
cp "continuity-agent-C-v2-bioluminescent.html" /tmp/continuity-agent/
```

Navigate to `http://localhost:8082/continuity-agent-C-v2-bioluminescent.html` (or open the /tmp copy). You should see:
- Background is still dark (gradient barely visible — intentional, it's just tokens at rest)
- Frosted glass overlaid — content should still be readable but with a slight blur behind the zones
- No orb yet (canvas is empty, that's Task 3)
- Trigger bar buttons should have slightly more space from content cards than v1

**Step 4: Commit**

```bash
git add "continuity-agent-C-v2-bioluminescent.html"
git commit -m "feat: v2 — CSS layer stack, gradient tokens, frost glass, spacing fixes"
```

---

### Task 3: The Orb — Canvas 2D Rendering + Orbital Motion

**Files:**
- Modify: `continuity-agent-C-v2-bioluminescent.html` (JS `<script>` block)

**Step 1: Size the orb canvas to full viewport**

Add this at the top of the `<script>` block, before all existing JS:

```javascript
// ── ORB CANVAS SETUP ─────────────────────────────────────────────
const orbCanvas = document.getElementById('orb-canvas');
const orbCtx    = orbCanvas.getContext('2d');

function resizeOrbCanvas() {
  orbCanvas.width  = window.innerWidth;
  orbCanvas.height = window.innerHeight;
}
resizeOrbCanvas();
window.addEventListener('resize', resizeOrbCanvas);
```

**Step 2: Add the orb draw function**

```javascript
// ── ORB STATE ─────────────────────────────────────────────────────
const orbState = {
  energy:     0,     // 0–1, drives glow and motion speed
  approaching: 0,   // 0–1, drives scale and blur
};

function drawOrb(timestamp) {
  const W = orbCanvas.width;
  const H = orbCanvas.height;
  orbCtx.clearRect(0, 0, W, H);

  const t   = timestamp / 1000;
  const cx  = W / 2;
  const cy  = H / 2;

  // Orbital drift — irrational periods prevent perfect repetition
  const orbitW  = W * 0.08;
  const orbitH  = H * 0.06;
  const ox = cx + Math.sin(t / 11.3) * orbitW + Math.sin(t / 7.7)  * orbitW * 0.3;
  const oy = cy + Math.cos(t / 14.1) * orbitH + Math.cos(t / 9.2)  * orbitH * 0.2;

  // Z-depth — scale oscillates with separate period
  const depthCycle  = (Math.sin(t / 13.7) + 1) / 2;  // 0–1
  const approaching = depthCycle * 0.18 + orbState.energy * 0.08;
  orbState.approaching = approaching;
  const scale = 0.90 + approaching * 0.28;

  // Update orb canvas blur (closer = clearer)
  const blurPx = Math.round((1 - approaching) * 6);
  orbCanvas.style.filter = `blur(${blurPx}px)`;

  // Base orb radius
  const baseR = Math.min(W, H) * 0.275 * scale;

  // ── OUTER SHELL (cellular membrane) ──────────────────────────
  const glowAlpha = 0.04 + orbState.energy * 0.10;
  const shellGrad = orbCtx.createRadialGradient(ox, oy, baseR * 0.7, ox, oy, baseR * 1.1);
  shellGrad.addColorStop(0,   `rgba(232,160,48,0)`);
  shellGrad.addColorStop(0.6, `rgba(232,160,48,${glowAlpha * 0.5})`);
  shellGrad.addColorStop(1,   `rgba(232,160,48,${glowAlpha})`);
  orbCtx.beginPath();
  orbCtx.arc(ox, oy, baseR * 1.1, 0, Math.PI * 2);
  orbCtx.fillStyle = shellGrad;
  orbCtx.fill();

  // ── INNER ORB (dark semi-transparent body) ────────────────────
  const innerGrad = orbCtx.createRadialGradient(
    ox - baseR * 0.2, oy - baseR * 0.2, 0,
    ox, oy, baseR
  );
  innerGrad.addColorStop(0,   'rgba(8,8,16,0.88)');
  innerGrad.addColorStop(0.6, 'rgba(12,10,20,0.75)');
  innerGrad.addColorStop(1,   'rgba(18,14,28,0.50)');
  orbCtx.beginPath();
  orbCtx.arc(ox, oy, baseR, 0, Math.PI * 2);
  orbCtx.fillStyle = innerGrad;
  orbCtx.fill();

  // ── DEPTH GLOW ring ──────────────────────────────────────────
  const ringAlpha = 0.03 + orbState.energy * 0.08;
  const ringGrad  = orbCtx.createRadialGradient(ox, oy, baseR * 0.85, ox, oy, baseR * 1.05);
  ringGrad.addColorStop(0,   `rgba(232,160,48,${ringAlpha})`);
  ringGrad.addColorStop(1,   'rgba(232,160,48,0)');
  orbCtx.beginPath();
  orbCtx.arc(ox, oy, baseR * 1.05, 0, Math.PI * 2);
  orbCtx.fillStyle = ringGrad;
  orbCtx.fill();

  requestAnimationFrame(drawOrb);
}

requestAnimationFrame(drawOrb);
```

**Step 3: Verify in browser**

Open the file. You should see:
- A large dark semi-transparent orb drifting slowly at center
- It subtly grows and shrinks (z-depth oscillation)
- The canvas blur changes slightly as it "approaches" (may be subtle)
- The frosted glass layer sits in front — the orb should appear softened behind it

**Step 4: Commit**

```bash
git add "continuity-agent-C-v2-bioluminescent.html"
git commit -m "feat: v2 — cellular orb with orbital drift, z-depth blur illusion, membrane glow"
```

---

### Task 4: Background Gradient — Emotional State Animation

**Files:**
- Modify: `continuity-agent-C-v2-bioluminescent.html` (JS block)

**Step 1: Add gradient state machine**

After the orb code, add:

```javascript
// ── GRADIENT STATE MACHINE ────────────────────────────────────────
const GRADIENT_PALETTES = {
  idle: {
    g1: 'rgba(12,8,20,0.9)',  g1x: '30%', g1y: '40%',
    g2: 'rgba(20,14,8,0.8)',  g2x: '75%', g2y: '65%',
    frost: '32px'
  },
  listening: {
    g1: 'rgba(20,12,32,0.85)', g1x: '35%', g1y: '45%',
    g2: 'rgba(28,16,8,0.75)', g2x: '70%', g2y: '60%',
    frost: '36px'
  },
  thinking: {
    g1: 'rgba(8,12,28,0.92)',  g1x: '25%', g1y: '35%',
    g2: 'rgba(20,10,4,0.80)', g2x: '80%', g2y: '70%',
    frost: '38px'
  },
  searching: {
    g1: 'rgba(16,10,28,0.88)', g1x: '40%', g1y: '38%',
    g2: 'rgba(24,14,6,0.78)', g2x: '68%', g2y: '62%',
    frost: '34px'
  },
  building: {
    g1: 'rgba(18,10,24,0.86)', g1x: '32%', g1y: '42%',
    g2: 'rgba(22,14,6,0.76)', g2x: '72%', g2y: '58%',
    frost: '34px'
  },
  speaking: {
    g1: 'rgba(40,20,8,0.75)',  g1x: '38%', g1y: '42%',
    g2: 'rgba(8,12,32,0.65)', g2x: '72%', g2y: '62%',
    frost: '24px'
  },
  excited: {
    g1: 'rgba(60,30,8,0.65)',  g1x: '42%', g1y: '44%',
    g2: 'rgba(30,8,50,0.55)', g2x: '68%', g2y: '58%',
    frost: '20px'
  }
};

const bgEl    = document.getElementById('bg-gradient');
const frostEl = document.getElementById('frost');
let currentGradientState = 'idle';

function applyGradientState(stateName, durationS = 2) {
  const p = GRADIENT_PALETTES[stateName] || GRADIENT_PALETTES.idle;
  currentGradientState = stateName;

  gsap.to(bgEl, {
    duration: durationS,
    ease: 'power1.inOut',
    '--g1x': p.g1x, '--g1y': p.g1y,
    '--g2x': p.g2x, '--g2y': p.g2y,
  });

  // Animate frost blur via inline style (CSS var transition handles it)
  gsap.to(frostEl, {
    duration: durationS,
    ease: 'power1.inOut',
    '--frost-blur': p.frost
  });

  // Note: color stops can't tween directly via GSAP CSS vars without a plugin.
  // We use a cross-fade technique: update inline style directly.
  bgEl.style.setProperty('--g1', p.g1);
  bgEl.style.setProperty('--g2', p.g2);

  // Orb energy
  const energyMap = { idle:0, listening:0.1, thinking:0.2, searching:0.3,
                      building:0.3, speaking:0.7, excited:0.9 };
  gsap.to(orbState, { energy: energyMap[stateName] || 0, duration: durationS });
}

// Initialize
applyGradientState('idle');
```

**Note on CSS custom property animation with GSAP:**
GSAP can't tween CSS custom properties containing color values without the CSSPlugin registered with `gsap.registerProperty()`. Since we can't use a build step, the color stops update instantly (via `setProperty`) while position values tween smoothly. This is acceptable — position drift is the primary motion, color is secondary.

**Step 2: Register GSAP CSS vars for position tweening**

Add this right after the GSAP script tag loads, before other JS:

```javascript
// Register custom properties for GSAP tweening
if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
  // GSAP can tween CSS vars containing numeric/percent values
  gsap.config({ trialWarn: false });
}
```

**Step 3: Verify**

In browser console run:
```javascript
applyGradientState('speaking', 2);
```
Expected: gradient shifts warmer (amber), frost lightens slightly, orb energy increases.

Then run:
```javascript
applyGradientState('idle', 3);
```
Expected: returns to dark cool rest state.

**Step 4: Commit**

```bash
git add "continuity-agent-C-v2-bioluminescent.html"
git commit -m "feat: v2 — emotional gradient state machine with frost blur response"
```

---

### Task 5: Web Audio API — Microphone Input + Amplitude Analysis

**Files:**
- Modify: `continuity-agent-C-v2-bioluminescent.html` (JS block)

**Step 1: Add audio engine**

```javascript
// ── WEB AUDIO ENGINE ──────────────────────────────────────────────
const AudioEngine = (() => {
  let audioCtx = null;
  let analyser  = null;
  let dataArray = null;
  let micActive = false;
  let userAmplitude = 0;   // 0–1, smoothed
  let aiAmplitude   = 0;   // 0–1, synthetic
  let aiSpeakTween  = null;

  async function initMic() {
    if (micActive) return;
    try {
      const stream  = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      audioCtx      = new (window.AudioContext || window.webkitAudioContext)();
      const source  = audioCtx.createMediaStreamSource(stream);
      analyser       = audioCtx.createAnalyser();
      analyser.fftSize      = 256;
      analyser.smoothingTimeConstant = 0.7;
      dataArray      = new Uint8Array(analyser.frequencyBinCount);
      source.connect(analyser);
      micActive = true;
      console.log('[AudioEngine] Mic active');
    } catch (e) {
      console.warn('[AudioEngine] Mic unavailable:', e.message);
    }
  }

  function getUserAmplitude() {
    if (!analyser) return 0;
    analyser.getByteTimeDomainData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const v = (dataArray[i] - 128) / 128;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / dataArray.length);
    // Smooth with lerp
    userAmplitude = userAmplitude * 0.8 + Math.min(rms * 4, 1) * 0.2;
    return userAmplitude;
  }

  // Synthetic AI amplitude envelope — drives Lissajous when speaking
  function startAISpeaking(durationMs) {
    aiAmplitude = 0;
    if (aiSpeakTween) aiSpeakTween.kill();
    // Ramp up, sustain with noise, ramp down
    aiSpeakTween = gsap.to({ v: 0 }, {
      v: 1,
      duration: durationMs / 1000,
      ease: 'none',
      onUpdate: function() {
        const progress = this.progress();
        // Attack → sustain → decay envelope
        let env;
        if (progress < 0.1)      env = progress / 0.1;
        else if (progress < 0.85) env = 0.6 + Math.sin(Date.now() / 80) * 0.3 + Math.random() * 0.1;
        else                       env = (1 - progress) / 0.15;
        aiAmplitude = Math.max(0, Math.min(1, env));
      },
      onComplete: () => { aiAmplitude = 0; }
    });
  }

  function stopAISpeaking() {
    if (aiSpeakTween) aiSpeakTween.kill();
    gsap.to({ _: 0 }, { _: 1, duration: 0.3,
      onUpdate: function() { aiAmplitude *= 0.85; },
      onComplete: () => { aiAmplitude = 0; }
    });
  }

  return { initMic, getUserAmplitude, startAISpeaking, stopAISpeaking,
           get userAmp() { return userAmplitude; },
           get aiAmp()   { return aiAmplitude; } };
})();

// Init mic on first user interaction
document.addEventListener('click', () => AudioEngine.initMic(), { once: true });
document.addEventListener('keydown', () => AudioEngine.initMic(), { once: true });
```

**Step 2: Verify (no mic needed)**

In browser console:
```javascript
AudioEngine.startAISpeaking(3000);
// Watch: AudioEngine.aiAmp should vary between 0 and 1 over 3 seconds
setInterval(() => console.log(AudioEngine.aiAmp.toFixed(3)), 100);
```

**Step 3: Commit**

```bash
git add "continuity-agent-C-v2-bioluminescent.html"
git commit -m "feat: v2 — Web Audio API mic input + synthetic AI amplitude envelope"
```

---

### Task 6: Upgrade Lissajous — State Machine + Audio Reactivity

**Files:**
- Modify: `continuity-agent-C-v2-bioluminescent.html` (JS block)

**Step 1: Replace the existing `drawLissajous()` function entirely**

Find the existing Lissajous canvas setup (variables `lissCanvas`, `lissCtx`, etc.) and the `drawLissajous()` function. Replace the ENTIRE block with this upgraded version:

```javascript
// ── LISSAJOUS v2 — STATE MACHINE + AUDIO REACTIVE ────────────────
const lissCanvas = document.getElementById('lissajous-canvas');
const lissCtx    = lissCanvas.getContext('2d');
const LISS_CX    = lissCanvas.width  / 2;
const LISS_CY    = lissCanvas.height / 2;

// Lissajous state configs
const LISS_STATES = {
  idle:      { a: 1, b: 1, A: 60, B: 48, tail: 30, color: [232,160,48],  alpha: 0.4, glow: false, speed: 0.012 },
  listening: { a: 1, b: 1, A: 58, B: 46, tail: 25, color: [240,235,220], alpha: 0.5, glow: false, speed: 0.010 },
  thinking:  { a: 3, b: 2, A: 68, B: 50, tail: 40, color: [232,160,48],  alpha: 0.6, glow: true,  speed: 0.018 },
  searching: { a: 5, b: 4, A: 65, B: 48, tail: 35, color: [232,160,48],  alpha: 0.7, glow: true,  speed: 0.022 },
  building:  { a: 4, b: 3, A: 62, B: 50, tail: 38, color: [232,160,48],  alpha: 0.65,glow: true,  speed: 0.020 },
  speaking:  { a: 2, b: 1, A: 70, B: 52, tail: 70, color: [232,160,48],  alpha: 0.9, glow: true,  speed: 0.016 },
  excited:   { a: 3, b: 2, A: 72, B: 54, tail: 80, color: [248,180,60],  alpha: 1.0, glow: true,  speed: 0.024 },
};

// Current interpolated values (tweened by GSAP)
const lissConfig = { ...LISS_STATES.idle, tailLive: 30 };
let lissT = 0;
const trail = [];

function setLissajousState(stateName, durationS = 0.8) {
  const target = LISS_STATES[stateName] || LISS_STATES.idle;
  gsap.to(lissConfig, {
    a: target.a, b: target.b,
    A: target.A, B: target.B,
    tailLive: target.tail,
    alpha: target.alpha,
    speed: target.speed,
    duration: durationS,
    ease: 'power2.inOut'
  });
  lissConfig.color  = target.color;
  lissConfig.glow   = target.glow;
}

function drawLissajous() {
  lissCtx.clearRect(0, 0, lissCanvas.width, lissCanvas.height);

  lissT += lissConfig.speed;

  // Get amplitude sources
  const aiAmp   = AudioEngine.aiAmp;
  const userAmp = AudioEngine.getUserAmplitude();
  const isSpeaking = aiAmp > 0.05;
  const isUserSpeaking = userAmp > 0.04 && !isSpeaking;

  // Parametric Lissajous position
  const phase = Math.PI / 2;
  let x = LISS_CX + lissConfig.A * Math.sin(lissConfig.a * lissT + phase);
  let y = LISS_CY + lissConfig.B * Math.sin(lissConfig.b * lissT);

  // Path deformation during AI speaking — organic waveform wobble
  if (isSpeaking) {
    const t = lissT;
    x += aiAmp * Math.sin(t * 3.7) * 14;
    y += aiAmp * Math.cos(t * 2.9) * 9;
  }

  // Subtle user-speaking bumps
  if (isUserSpeaking) {
    x += userAmp * Math.sin(lissT * 5.1) * 6;
    y += userAmp * Math.cos(lissT * 4.3) * 4;
  }

  trail.push({ x, y });
  const maxTail = Math.round(lissConfig.tailLive + (isSpeaking ? aiAmp * 40 : 0));
  while (trail.length > maxTail) trail.shift();

  // Determine color: near-white for user, amber for AI
  const [r, g, b] = isUserSpeaking ? [240, 235, 220] : lissConfig.color;

  // Draw trail
  for (let i = 0; i < trail.length; i++) {
    const pt       = trail[i];
    const progress = i / trail.length;
    const alpha    = progress * progress * lissConfig.alpha;
    const radius   = 0.8 + progress * 2.8 + (isSpeaking ? aiAmp * progress * 1.5 : 0);

    lissCtx.beginPath();
    lissCtx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
    lissCtx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
    lissCtx.fill();
  }

  // Head dot with conditional glow
  if (lissConfig.glow && isSpeaking) {
    lissCtx.shadowBlur  = 12 + aiAmp * 14;
    lissCtx.shadowColor = `rgba(${r},${g},${b},0.85)`;
  } else {
    lissCtx.shadowBlur  = 0;
    lissCtx.shadowColor = 'transparent';
  }

  const headR = 2.5 + (isSpeaking ? aiAmp * 2 : 0);
  lissCtx.beginPath();
  lissCtx.arc(x, y, headR, 0, Math.PI * 2);
  lissCtx.fillStyle = `rgba(${r},${g},${b},${0.8 + aiAmp * 0.2})`;
  lissCtx.fill();
  lissCtx.shadowBlur = 0;

  requestAnimationFrame(drawLissajous);
}

drawLissajous();
```

**Step 2: Verify Lissajous state transitions in console**

```javascript
setLissajousState('thinking');
// Path should morph from circle to figure-eight over 800ms

setLissajousState('searching');
// Should shift to tighter, more complex pattern

setLissajousState('idle');
// Returns to slow circle
```

**Step 3: Commit**

```bash
git add "continuity-agent-C-v2-bioluminescent.html"
git commit -m "feat: v2 — Lissajous state machine with ratio morphing, audio deformation, glow"
```

---

### Task 7: Agent API Surface — `window.ContinuityAgent`

**Files:**
- Modify: `continuity-agent-C-v2-bioluminescent.html` (JS block)

**Step 1: Add the Agent API**

After the Lissajous code, add:

```javascript
// ── AGENT API SURFACE ─────────────────────────────────────────────
// This is the plug-in door. A real agent (Claude API, OpenClaw, etc.)
// calls these methods to drive the entire visual experience.
window.ContinuityAgent = {

  // Drive all visual layers simultaneously
  setState(state) {
    applyGradientState(state, 2);
    setLissajousState(state, 0.8);
    // Orb energy is set inside applyGradientState via orbState.energy
    console.log('[ContinuityAgent] State:', state);
  },

  // Text-to-speech + speaking visual state
  speak(text, emotion = 'neutral') {
    // Estimate duration from text length (avg ~150 wpm, ~2.5 chars/100ms)
    const estDurationMs = Math.max(1500, text.length * 45);

    this.setState('speaking');
    AudioEngine.startAISpeaking(estDurationMs);

    // Web Speech API
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate   = 0.92;
    utt.pitch  = 0.95;
    utt.volume = 1;

    // Pick a voice — prefer a natural-sounding one if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes('Samantha') || v.name.includes('Daniel') ||
      v.name.includes('Karen')    || v.name.includes('Moira')
    );
    if (preferred) utt.voice = preferred;

    utt.onend = () => {
      AudioEngine.stopAISpeaking();
      this.setState('listening');
    };

    window.speechSynthesis.cancel(); // clear queue
    window.speechSynthesis.speak(utt);

    return new Promise(resolve => { utt.onend = () => {
      AudioEngine.stopAISpeaking();
      this.setState('listening');
      resolve();
    }; });
  },

  // Drop a content card into zone 2
  // type: 'image' | 'map' | 'note' | 'diagram' | 'custom'
  addContent(type, data) {
    const zone2 = document.getElementById('zone2');
    zone2.classList.add('active');
    this.setState('thinking');

    const panel = document.createElement('div');
    panel.className = 'panel';

    if (type === 'note' || type === 'custom') {
      panel.innerHTML = `<h2>${data.title || 'Note'}</h2>
        <div style="font-size:0.9rem;color:var(--text);line-height:1.8;">${data.body || ''}</div>`;
    } else {
      panel.innerHTML = `<h2>${data.title || type}</h2>
        <div style="color:var(--text-dim);font-size:0.85rem;">${data.body || ''}</div>`;
    }

    zone2.appendChild(panel);
    birth(panel).then(() => {
      float(panel);
      this.setState('idle');
    });
  },

  // Add a line to the persistent notepad
  appendNote(text) {
    NotepadTool.appendLine(text);
  },

  // Reset all content
  clearAll() {
    clearAll();
    this.setState('idle');
  }
};

// Preload voices (browsers need a trigger)
window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
```

**Step 2: Verify in console**

```javascript
ContinuityAgent.setState('thinking');
// Lissajous morphs to 3:2, gradient shifts cool, orb dims

ContinuityAgent.speak("Creating that for you. Give me just a moment.");
// Browser should speak the text
// Lissajous should glow and deform
// Orb should brighten and approach

ContinuityAgent.addContent('note', { title: 'Idea', body: 'The orb reacts to voice.' });
// A content card should birth into zone 2
```

**Step 3: Commit**

```bash
git add "continuity-agent-C-v2-bioluminescent.html"
git commit -m "feat: v2 — ContinuityAgent API surface: setState, speak (TTS), addContent"
```

---

### Task 8: Notepad Tool — Persistent Notes + Markdown Export

**Files:**
- Modify: `continuity-agent-C-v2-bioluminescent.html` (JS block + HTML)

**Step 1: Add notepad shelf card HTML**

In the HTML, inside `<div id="zone3">`, add at the start:

```html
  <div id="notepad-shelf-card" class="shelf-card live" style="cursor:pointer;">
    <div class="card-label">📝 Session Notes</div>
    <div class="card-sub" id="notepad-line-count">0 lines</div>
  </div>
```

**Step 2: Add NotepadTool JS module**

After the ContinuityAgent block, add:

```javascript
// ── NOTEPAD TOOL ──────────────────────────────────────────────────
const NotepadTool = (() => {
  const STORAGE_KEY = `continuity-notes-${new Date().toISOString().slice(0,10)}`;
  let lines  = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  let panelEl = null;
  let isOpen  = false;

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    const countEl = document.getElementById('notepad-line-count');
    if (countEl) countEl.textContent = `${lines.length} line${lines.length !== 1 ? 's' : ''}`;
  }

  function buildPanel() {
    const zone2 = document.getElementById('zone2');
    panelEl = document.createElement('div');
    panelEl.className = 'notepad';
    panelEl.id = 'notepad-panel';

    panelEl.innerHTML = `
      <h2 id="notepad-title">Session Notes
        <button id="notepad-export" style="float:right;background:none;border:1px solid rgba(255,255,255,0.12);
          border-radius:1rem;padding:0.25rem 0.75rem;color:var(--text-dim);font-family:var(--font);
          font-size:0.65rem;cursor:pointer;transition:color 200ms ease;">Save as .md</button>
      </h2>
      <div id="notepad-lines" contenteditable="true"
           style="outline:none;min-height:80px;font-size:0.88rem;line-height:1.9;color:var(--text);">
        ${lines.map(l => `<div>${l}</div>`).join('')}
      </div>
      <span class="cursor-blink"></span>
    `;

    zone2.appendChild(panelEl);

    // Sync edits back to storage
    const linesEl = panelEl.querySelector('#notepad-lines');
    linesEl.addEventListener('input', () => {
      lines = [...linesEl.querySelectorAll('div')].map(d => d.textContent);
      if (!lines.length) lines = [linesEl.textContent];
      save();
    });

    // Export button
    panelEl.querySelector('#notepad-export').addEventListener('click', exportMarkdown);

    return panelEl;
  }

  function open() {
    if (isOpen) return;
    isOpen = true;

    const zone2 = document.getElementById('zone2');
    zone2.classList.add('active');

    if (!panelEl) buildPanel();

    gsap.set(panelEl, { transformOrigin: 'bottom center' });
    gsap.fromTo(panelEl,
      { opacity: 0, filter: 'blur(8px)', scaleY: 0.05, y: 120 },
      { opacity: 1, filter: 'blur(0px)', scaleY: 1,    y: 0,
        duration: 0.6, ease: 'power3.out' }
    );
    float(panelEl);

    // Weight animation on title
    const title = panelEl.querySelector('h2');
    title.classList.add('focused');
    setTimeout(() => title.classList.remove('focused'), 2000);

    ContinuityAgent.setState('thinking');
    setTimeout(() => ContinuityAgent.setState('idle'), 1000);
  }

  function close() {
    if (!isOpen || !panelEl) return;
    isOpen = false;

    gsap.set(panelEl, { transformOrigin: 'bottom center' });
    gsap.to(panelEl, {
      scaleY: 0.05, y: 120, opacity: 0, filter: 'blur(8px)',
      duration: 0.45, ease: 'power2.in',
      onComplete: () => { panelEl.remove(); panelEl = null; }
    });

    // Saved glow on shelf card
    const shelfCard = document.getElementById('notepad-shelf-card');
    if (shelfCard) {
      gsap.to(shelfCard, { opacity: 1, boxShadow: '0 0 16px var(--accent)', duration: 0.3 });
      setTimeout(() => gsap.to(shelfCard, { opacity: 0.3, boxShadow: 'none', duration: 0.8 }), 800);
    }
  }

  function appendLine(text) {
    lines.push(text);
    save();

    if (!isOpen) open();

    // Stream line into panel if open
    setTimeout(async () => {
      if (!panelEl) return;
      const linesEl = panelEl.querySelector('#notepad-lines');
      if (!linesEl) return;

      const lineEl = document.createElement('div');
      linesEl.appendChild(lineEl);
      gsap.fromTo(lineEl, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3 });
      await streamText(lineEl, text, 28);
    }, 100);
  }

  function exportMarkdown() {
    const date  = new Date().toISOString().slice(0,10);
    const md    = `# Session Notes — ${date}\n\n` + lines.map(l => `- ${l}`).join('\n');
    const blob  = new Blob([md], { type: 'text/markdown' });
    const url   = URL.createObjectURL(blob);
    const a     = document.createElement('a');
    a.href      = url;
    a.download  = `${date}-session-notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Shelf card toggle
  document.addEventListener('DOMContentLoaded', () => {});
  setTimeout(() => {
    const shelfCard = document.getElementById('notepad-shelf-card');
    if (shelfCard) shelfCard.addEventListener('click', () => isOpen ? close() : open());
    save(); // update line count display on load
  }, 100);

  return { open, close, appendLine, exportMarkdown };
})();
```

**Step 3: Verify**

- Click "Session Notes" shelf card — notepad should expand from zone 3 upward
- Type in the notepad — content persists on refresh (localStorage)
- Click "Save as .md" — a markdown file should download
- Call `ContinuityAgent.appendNote('Transformers use self-attention')` in console — line should stream in

**Step 4: Commit**

```bash
git add "continuity-agent-C-v2-bioluminescent.html"
git commit -m "feat: v2 — NotepadTool with localStorage persistence, streaming append, .md export"
```

---

### Task 9: Wire State Machine to Existing Scenarios

**Files:**
- Modify: `continuity-agent-C-v2-bioluminescent.html` (JS block)

**Step 1: Update scenario1 to use ContinuityAgent.setState**

Find `async function scenario1()` and add state calls at key moments:

```javascript
async function scenario1() {
  const zone2 = document.getElementById('zone2');
  const zone3 = document.getElementById('zone3');
  zone2.classList.add('active');

  ContinuityAgent.setState('thinking');          // ← ADD
  agentSpeech('Creating that for you...');
  await delay(400);
  await thinkingSequence('Imagining...');

  ContinuityAgent.setState('building');          // ← ADD
  const panel = document.createElement('div');
  // ... rest of existing scenario1 code unchanged ...
  await birth(panel);
  float(panel);

  // after image appears:
  ContinuityAgent.setState('idle');             // ← ADD
  // ... rest unchanged ...
}
```

**Step 2: Update scenario2 to use setState**

Find `async function scenario2()` and add:

```javascript
async function scenario2() {
  // ...
  ContinuityAgent.setState('thinking');          // ← ADD before speech
  agentSpeech('Searching North Portland...');
  await delay(400);

  ContinuityAgent.setState('searching');         // ← ADD before thinkingSequence
  await thinkingSequence('Searching Portland...');

  ContinuityAgent.setState('building');          // ← ADD while map builds
  // ... rest unchanged until locations appear, then:
  ContinuityAgent.setState('idle');             // ← ADD after cards appear
  agentSpeech('Here are three options near you.');
}
```

**Step 3: Update scenario3 to use setState**

```javascript
async function scenario3() {
  // ...
  ContinuityAgent.setState('building');          // ← ADD — building the diagram
  const diagPanel = document.createElement('div');
  // ... birth/float ...
  ContinuityAgent.setState('speaking');          // ← ADD before streaming speech
  // ... streamText ...
  ContinuityAgent.setState('idle');             // ← ADD after speech settles
  // ... notepad expansion ...
}
```

**Step 4: Update clearAll to reset state**

Find the `async function clearAll()` and add at the end:

```javascript
async function clearAll() {
  // ... existing code ...
  ContinuityAgent.setState('idle');
}
```

**Step 5: Verify all three scenarios**

Run each scenario (keyboard 1/2/3) and observe:
- Gradient should shift between warm/cool based on state
- Lissajous path should morph between ratios at key moments
- Orb energy should increase during 'building'/'speaking', recede during 'idle'

**Step 6: Commit**

```bash
git add "continuity-agent-C-v2-bioluminescent.html"
git commit -m "feat: v2 — wire state machine to all three scenarios"
```

---

### Task 10: Polish Pass + Copy to Preview

**Files:**
- Modify: `continuity-agent-C-v2-bioluminescent.html`

**Step 1: Add idle breathing to the gradient**

After `applyGradientState('idle')` call at the bottom of JS, add a slow ambient pulse that runs independently of state:

```javascript
// ── AMBIENT GRADIENT PULSE (always running, very slow) ────────────
(function ambientPulse() {
  const dur = 18 + Math.random() * 8; // 18-26s
  gsap.to(bgEl, {
    '--g1x': `${28 + Math.random() * 8}%`,
    '--g1y': `${38 + Math.random() * 8}%`,
    '--g2x': `${70 + Math.random() * 10}%`,
    '--g2y': `${60 + Math.random() * 8}%`,
    duration: dur,
    ease: 'sine.inOut',
    onComplete: ambientPulse
  });
})();
```

**Step 2: Fix the lissajous canvas size (currently hardcoded 180x140)**

The lissajous canvas is small and centered. Make it larger for the v2 experience:

Find the canvas HTML:
```html
<canvas id="lissajous-canvas" width="180" height="140" ...>
```
Replace with:
```html
<canvas id="lissajous-canvas" width="280" height="220"
        style="display:block;"></canvas>
```

Also update the JS constants at the top of the Lissajous section:
```javascript
const LISS_CX = lissCanvas.width  / 2;  // now 140
const LISS_CY = lissCanvas.height / 2;  // now 110
```

**Step 3: Copy to preview location**

```bash
cp "continuity-agent-C-v2-bioluminescent.html" /tmp/continuity-agent/
```

Verify at `http://localhost:8082/continuity-agent-C-v2-bioluminescent.html`

**Step 4: Final QA checklist**

Open in browser and check:
- [ ] Background gradient is visible but not distracting
- [ ] Orb is present, drifting slowly, clearly behind the frosted glass
- [ ] Frosted glass creates depth — you sense something behind it
- [ ] Lissajous is centered, larger than v1, animating
- [ ] Click trigger 1 — Lissajous morphs through states, gradient shifts
- [ ] Scenario 1 full flow works (corgi → shelf save)
- [ ] Scenario 2 full flow works (map → pins → location select)
- [ ] Scenario 3 full flow works (diagram → note streaming → notepad collapse)
- [ ] "Session Notes" shelf card opens/closes notepad
- [ ] Notepad content persists on page refresh
- [ ] "Save as .md" downloads a markdown file
- [ ] `ContinuityAgent.speak("Hello")` in console triggers TTS + visual state
- [ ] Escape / × resets cleanly, state returns to idle
- [ ] No animation jank on any loop
- [ ] Container headline text has comfortable padding from panel edges

**Step 5: Final commit**

```bash
git add "continuity-agent-C-v2-bioluminescent.html"
git commit -m "feat: v2 complete — ambient gradient pulse, enlarged Lissajous, final polish"
```
