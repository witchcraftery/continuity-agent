# Continuity Agent UI — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build three self-contained single-page HTML demos of the Continuity Agent interface — each with a distinct visual personality but a shared interaction engine.

**Architecture:** One master HTML file (Theme A) is built first as the complete reference implementation. Themes C and D are created by duplicating and replacing the theme token block, font CDN link, and thinking-form SVG/animation. All scenario logic, zone layout, and lifecycle functions remain identical across all three files.

**Tech Stack:** Vanilla HTML/CSS/JS, GSAP 3 (CDN), Google Fonts variable fonts (Fraunces / Syne / Cormorant Garamond), SVG for thinking forms and illustrations, no build step.

**Design doc:** `docs/plans/2026-02-25-continuity-agent-design.md`
**Source spec:** `Continuity-Agent-UI-Prompt.md`

---

## Phase 1: Theme A — "Late Evening" (Master Reference)

Build the complete, fully-working file. This becomes the source of truth that C and D are derived from.

**Output file:** `continuity-agent-A-late-evening.html`

---

### Task 1: HTML Skeleton + CDN Wiring

**Files:**
- Create: `continuity-agent-A-late-evening.html`

**Step 1: Create the file with this exact boilerplate**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Continuity Agent — Late Evening</title>

  <!-- THEME A FONTS: Fraunces variable (wght 100-900, opsz, WONK) -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&display=swap" rel="stylesheet" />

  <!-- GSAP 3 -->
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>

  <style>
    /* ── THEME TOKENS (A: Late Evening) ──────────────────────── */
    :root {
      --bg:         #1e1812;
      --canvas:     #26211a;
      --accent:     #c4622d;
      --text:       #ede8df;
      --text-dim:   #7a6f62;
      --font:       'Fraunces', serif;
      --wght-base:  300;
      --wght-em:    500;
      --birth-ms:   450;
      --float-amp:  -5px;
      --float-dur:  6s;
      --think-dur:  2500;  /* ms on screen */
      --speech-dur: 3000;  /* ms speech holds */
      --wght-ms:    800;   /* weight anim ms */
    }
    /* ── END THEME TOKENS ─────────────────────────────────────── */
  </style>
</head>
<body>
  <!-- ZONES -->
  <div id="zone1"></div>
  <div id="zone2"></div>
  <div id="zone3"></div>

  <!-- TRIGGER BAR -->
  <div id="trigger-bar">
    <button class="trigger" data-scenario="1">
      <em>"Show me a corgi riding a unicycle at the circus"</em>
    </button>
    <button class="trigger" data-scenario="2">
      <em>"Where can I get my glasses fixed in North Portland?"</em>
    </button>
    <button class="trigger" data-scenario="3">
      <em>"Tell me about transformer architectures"</em>
    </button>
    <button id="reset-btn">×</button>
  </div>

  <script>
    // engine goes here
  </script>
</body>
</html>
```

**Step 2: Open in browser, verify**
- Background should be `#1e1812` (deep warm dark)
- No font flash (Fraunces loading from CDN)
- Three buttons visible at bottom

**Step 3: Commit**
```bash
git add "continuity-agent-A-late-evening.html"
git commit -m "feat: scaffold Theme A HTML with CDN wiring and zone skeleton"
```

---

### Task 2: CSS — Layout, Zones, Typography, Trigger Bar

**Files:**
- Modify: `continuity-agent-A-late-evening.html` (expand the `<style>` block)

**Step 1: Replace the `<style>` block content after the theme tokens with:**

```css
/* ── RESET + BASE ─────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  width: 100%; height: 100%;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font);
  font-weight: var(--wght-base);
  font-variation-settings: 'wght' var(--wght-base);
  line-height: 1.7;
  overflow: hidden;
}

/* ── THREE ZONES ──────────────────────────────────────────────── */
#zone1, #zone2, #zone3 {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  width: min(900px, 92vw);
}

#zone1 {
  top: 0;
  height: 38vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

#zone2 {
  top: 38vh;
  height: 46vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

#zone3 {
  bottom: 72px; /* above trigger bar */
  height: 10vh;
  display: flex;
  align-items: center;
  gap: 1rem;
  overflow-x: auto;
  scrollbar-width: none;
  padding: 0 1rem;
}
#zone3::-webkit-scrollbar { display: none; }

/* Canvas background glow on zone2 */
#zone2::before {
  content: '';
  position: absolute;
  inset: -2rem;
  background: var(--canvas);
  border-radius: 1.5rem;
  opacity: 0;
  transition: opacity 600ms ease;
  z-index: -1;
}
#zone2.active::before { opacity: 1; }

/* ── AGENT SPEECH ─────────────────────────────────────────────── */
.agent-speech {
  position: fixed;
  top: 36vh;
  left: 50%;
  transform: translateX(-50%);
  font-style: italic;
  font-weight: 300;
  font-variation-settings: 'wght' 300;
  font-size: clamp(0.9rem, 1.5vw, 1.1rem);
  color: var(--text-dim);
  text-align: center;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  z-index: 100;
}

/* ── ZONE 2 CONTENT PANELS ────────────────────────────────────── */
.panel {
  background: var(--canvas);
  border-radius: 1rem;
  padding: 1.5rem 2rem;
  width: 100%;
  max-width: 680px;
  opacity: 0;
  filter: blur(12px);
}

.panel-caption {
  font-size: 0.85rem;
  color: var(--text-dim);
  text-align: center;
  margin-top: 0.75rem;
  font-style: italic;
  opacity: 0;
  font-variation-settings: 'wght' 300;
}

.panel h2 {
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  font-variation-settings: 'wght' var(--wght-base);
  transition: font-variation-settings calc(var(--wght-ms) * 1ms) cubic-bezier(0.16, 1, 0.3, 1);
  margin-bottom: 0.5rem;
  color: var(--text);
}
.panel h2.focused {
  font-variation-settings: 'wght' var(--wght-em);
}

/* ── ZONE 3 SHELF CARDS ───────────────────────────────────────── */
.shelf-card {
  flex-shrink: 0;
  background: var(--canvas);
  border-radius: 0.75rem;
  padding: 0.6rem 0.9rem;
  min-width: 120px;
  max-width: 180px;
  opacity: 0;
  filter: blur(8px);
  cursor: pointer;
  transition: opacity 300ms ease;
}
.shelf-card.live { opacity: 0.3; }
.shelf-card.focused { opacity: 1 !important; }

.shelf-card .card-label {
  font-size: 0.75rem;
  font-variation-settings: 'wght' 400;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.shelf-card .card-sub {
  font-size: 0.65rem;
  color: var(--text-dim);
  margin-top: 0.2rem;
}

/* ── LOCATION MAP ─────────────────────────────────────────────── */
.map-container {
  position: relative;
  width: 100%;
  height: 280px;
  border-radius: 0.75rem;
  overflow: hidden;
  background: #2a2018;
}

.map-pin {
  position: absolute;
  width: 12px; height: 12px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0;
  filter: blur(4px);
  transform: scale(0.9);
  cursor: pointer;
  transition: opacity 300ms ease;
}
.map-pin::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1.5px solid var(--accent);
  opacity: 0.4;
  animation: pin-pulse 2s ease-in-out infinite;
}
@keyframes pin-pulse {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50%       { transform: scale(1.3); opacity: 0.1; }
}
.map-pin.dim { opacity: 0.3 !important; }
.map-pin.sel { transform: scale(1.2) !important; opacity: 1 !important; }

/* ── NOTEPAD ──────────────────────────────────────────────────── */
.notepad {
  background: var(--canvas);
  border-radius: 1rem;
  padding: 1.5rem 2rem;
  width: 100%;
  max-width: 680px;
  opacity: 0;
  filter: blur(8px);
  transform: translateY(20px) scaleY(0.6);
  transform-origin: bottom center;
  overflow: hidden;
}

.notepad-line {
  font-size: 0.9rem;
  color: var(--text);
  font-variation-settings: 'wght' 300;
  opacity: 0;
  transform: translateY(8px);
  margin-bottom: 0.4rem;
}

.cursor-blink {
  display: inline-block;
  width: 1px; height: 1em;
  background: var(--accent);
  vertical-align: text-bottom;
  animation: blink 1s step-end infinite;
  margin-left: 2px;
}
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

/* ── TRIGGER BAR ──────────────────────────────────────────────── */
#trigger-bar {
  position: fixed;
  bottom: 0;
  left: 0; right: 0;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 0 2rem;
  background: linear-gradient(to top, var(--bg) 60%, transparent);
  z-index: 200;
}

.trigger {
  background: none;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 2rem;
  padding: 0.45rem 1.1rem;
  color: var(--text-dim);
  font-family: var(--font);
  font-size: 0.7rem;
  font-variation-settings: 'wght' 300;
  cursor: pointer;
  transition: color 300ms ease, border-color 300ms ease;
  white-space: nowrap;
}
.trigger:hover {
  color: var(--text);
  border-color: rgba(255,255,255,0.2);
}
.trigger em { font-style: italic; }

#reset-btn {
  background: none;
  border: none;
  color: var(--text-dim);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.4rem 0.6rem;
  line-height: 1;
  transition: color 200ms ease;
  font-family: sans-serif;
}
#reset-btn:hover { color: var(--text); }

/* ── THINKING FORM WRAPPER ────────────────────────────────────── */
#thinking-form {
  opacity: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
#thinking-label {
  font-style: italic;
  font-size: 0.85rem;
  color: var(--text-dim);
  font-variation-settings: 'wght' 300;
}
```

**Step 2: Verify in browser**
- Three zones visible (no colored backgrounds yet — that's fine)
- Trigger bar at bottom with 3 italic buttons + × reset
- Background deep warm dark, text off-white

**Step 3: Commit**
```bash
git add "continuity-agent-A-late-evening.html"
git commit -m "feat: Theme A — full CSS layout, zones, typography, trigger bar"
```

---

### Task 3: Thinking Form — Lemniscate SVG + GSAP Breathe

**Files:**
- Modify: `continuity-agent-A-late-evening.html` (add SVG to `#zone1`, add JS)

**Step 1: Add the thinking form HTML inside `#zone1`**

```html
<div id="zone1">
  <div id="thinking-form">
    <svg id="lemniscate" width="160" height="80" viewBox="-80 -40 160 80" fill="none"
         xmlns="http://www.w3.org/2000/svg">
      <!-- Lemniscate of Bernoulli parametric path -->
      <!-- a=60: x = a*cos(t)/(1+sin²(t)), y = a*sin(t)*cos(t)/(1+sin²(t)) -->
      <path id="lemni-path" stroke="var(--accent)" stroke-width="1.5"
            stroke-opacity="0.5" stroke-linecap="round" fill="none"
            d="M 60,0 C 60,33 33,40 0,0 C -33,-40 -60,-33 -60,0 C -60,33 -33,40 0,0 C 33,-40 60,-33 60,0 Z"/>
    </svg>
    <span id="thinking-label">Thinking...</span>
  </div>
</div>
```

**Step 2: Add GSAP breathe animation to the JS `<script>` block**

```javascript
// ── THINKING FORM ────────────────────────────────────────────────
const thinkingForm = document.getElementById('thinking-form');
const lemniPath    = document.getElementById('lemni-path');
const thinkLabel   = document.getElementById('thinking-label');

// Infinite breathe: scale 0.92 ↔ 1.08, never exactly repeating
gsap.to('#lemniscate', {
  scaleX: 1.08, scaleY: 0.94,
  duration: 3.5,
  ease: 'sine.inOut',
  yoyo: true,
  repeat: -1,
  transformOrigin: 'center center'
});
// Slight drift offset so it doesn't feel mechanical
gsap.to('#lemniscate', {
  scaleX: 0.96, scaleY: 1.06,
  duration: 4.2,
  ease: 'sine.inOut',
  yoyo: true,
  repeat: -1,
  delay: 1.4,
  transformOrigin: 'center center'
});
```

**Step 3: Verify**
- Open browser, manually set `thinkingForm.style.opacity = 1` in console
- Lemniscate should be breathing continuously, never snapping
- No jank on loop

**Step 4: Commit**
```bash
git add "continuity-agent-A-late-evening.html"
git commit -m "feat: Theme A — lemniscate thinking form with GSAP breathe"
```

---

### Task 4: Element Lifecycle Engine (birth / float / death)

**Files:**
- Modify: `continuity-agent-A-late-evening.html` (JS block)

**Step 1: Add lifecycle utility functions**

```javascript
// ── LIFECYCLE: birth / float / death ────────────────────────────
const BIRTH_MS = parseInt(getComputedStyle(document.documentElement)
                   .getPropertyValue('--birth-ms')) || 450;

function birth(el, delay = 0) {
  return new Promise(resolve => {
    gsap.fromTo(el,
      { opacity: 0, filter: 'blur(12px)', scale: 0.95 },
      {
        opacity: 1, filter: 'blur(0px)', scale: 1,
        duration: BIRTH_MS / 1000,
        delay: delay / 1000,
        ease: 'power3.out',
        onComplete: resolve
      }
    );
  });
}

function float(el) {
  const amp   = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--float-amp')
  ) || -5;
  const durS  = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--float-dur')
  ) || 6;
  gsap.to(el, {
    y: amp,
    duration: durS / 2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1
  });
}

function death(el, delay = 0) {
  return new Promise(resolve => {
    gsap.to(el, {
      opacity: 0,
      y: '-=28',
      filter: 'blur(6px)',
      duration: 0.5,
      delay: delay / 1000,
      ease: 'power2.inOut',
      onComplete: () => {
        el.remove();
        resolve();
      }
    });
  });
}

// Kill all floating tweens and death-dissolve all zone2/zone3 children
async function clearAll() {
  const zone2 = document.getElementById('zone2');
  const zone3 = document.getElementById('zone3');
  const speech = document.querySelectorAll('.agent-speech');
  zone2.classList.remove('active');

  const els = [
    ...zone2.children,
    ...zone3.children,
    ...speech
  ];
  const promises = els.map((el, i) => death(el, i * 80));
  await Promise.all(promises);
}
```

**Step 2: Verify in console**
```javascript
// Paste this into browser console to test:
const testEl = document.createElement('div');
testEl.style.cssText = 'width:200px;height:80px;background:#c4622d;border-radius:8px;';
document.getElementById('zone2').appendChild(testEl);
birth(testEl).then(() => { float(testEl); });
// Should blur-to-clarity in, then float gently
setTimeout(() => death(testEl), 3000);
// Should drift up and dissolve
```
Expected: birth works, float loops, death drifts up and removes element.

**Step 3: Commit**
```bash
git add "continuity-agent-A-late-evening.html"
git commit -m "feat: Theme A — birth/float/death lifecycle engine"
```

---

### Task 5: Agent Speech Utility + Show/Hide Thinking Form

**Files:**
- Modify: `continuity-agent-A-late-evening.html` (JS block)

**Step 1: Add speech and thinking form helpers**

```javascript
// ── AGENT SPEECH ─────────────────────────────────────────────────
const SPEECH_DUR = parseInt(
  getComputedStyle(document.documentElement).getPropertyValue('--speech-dur')
) || 3000;

function agentSpeech(text) {
  // Remove any existing speech
  document.querySelectorAll('.agent-speech').forEach(el => el.remove());

  const el = document.createElement('div');
  el.className = 'agent-speech';
  el.textContent = text;
  document.body.appendChild(el);

  gsap.fromTo(el,
    { opacity: 0, y: 8 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
  );

  return new Promise(resolve => {
    setTimeout(() => {
      gsap.to(el, {
        opacity: 0, y: -8, duration: 0.4, ease: 'power2.in',
        onComplete: () => { el.remove(); resolve(); }
      });
    }, SPEECH_DUR);
  });
}

// ── THINKING FORM SHOW / HIDE ─────────────────────────────────────
const THINK_DUR = parseInt(
  getComputedStyle(document.documentElement).getPropertyValue('--think-dur')
) || 2500;

function showThinking(label = 'Thinking...') {
  thinkLabel.textContent = label;
  return new Promise(resolve => {
    gsap.to(thinkingForm, {
      opacity: 1, duration: 0.6, ease: 'power2.out',
      onComplete: resolve
    });
  });
}

function hideThinking() {
  return new Promise(resolve => {
    gsap.to(thinkingForm, {
      opacity: 0,
      y: '-=20',
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        gsap.set(thinkingForm, { y: 0 });
        resolve();
      }
    });
  });
}

async function thinkingSequence(label) {
  await showThinking(label);
  await delay(THINK_DUR);
  await hideThinking();
}

// ── UTILITY ───────────────────────────────────────────────────────
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

**Step 2: Verify in console**
```javascript
agentSpeech('Searching North Portland...');
// Should fade in italic text near zone2, hold, then fade out
```
```javascript
await thinkingSequence('Imagining...');
// Lemniscate should fade in, hold, drift up and out
```

**Step 3: Commit**
```bash
git add "continuity-agent-A-late-evening.html"
git commit -m "feat: Theme A — agent speech utility and thinking form show/hide"
```

---

### Task 6: Scenario 1 — Image Generation

**Files:**
- Modify: `continuity-agent-A-late-evening.html` (JS block)

**Step 1: Add the SVG corgi illustration helper**

```javascript
// ── SVG ILLUSTRATION: Corgi on Unicycle ──────────────────────────
// Warm, minimal, stylized — suggests the scene without being literal
function makeCorgSVG() {
  return `<svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg"
           style="width:100%;height:auto;display:block;border-radius:0.5rem;">
    <rect width="400" height="280" fill="#2a1f14" rx="8"/>
    <!-- Big top ring (circus tent suggestion) -->
    <ellipse cx="200" cy="60" rx="130" ry="18" fill="none"
             stroke="#c4622d" stroke-width="1" stroke-opacity="0.3"/>
    <ellipse cx="200" cy="60" rx="90" ry="12" fill="none"
             stroke="#c4622d" stroke-width="0.8" stroke-opacity="0.2"/>
    <!-- Unicycle wheel -->
    <circle cx="200" cy="220" r="42" fill="none"
            stroke="#ede8df" stroke-width="1.5" stroke-opacity="0.6"/>
    <circle cx="200" cy="220" r="4" fill="#c4622d" fill-opacity="0.8"/>
    <!-- Spokes -->
    <line x1="200" y1="178" x2="200" y2="262" stroke="#ede8df" stroke-width="0.8" stroke-opacity="0.3"/>
    <line x1="158" y1="220" x2="242" y2="220" stroke="#ede8df" stroke-width="0.8" stroke-opacity="0.3"/>
    <line x1="170" y1="190" x2="230" y2="250" stroke="#ede8df" stroke-width="0.8" stroke-opacity="0.2"/>
    <line x1="230" y1="190" x2="170" y2="250" stroke="#ede8df" stroke-width="0.8" stroke-opacity="0.2"/>
    <!-- Seat post -->
    <line x1="200" y1="178" x2="200" y2="150" stroke="#ede8df" stroke-width="2" stroke-opacity="0.5"/>
    <!-- Corgi body suggestion (warm rounded form) -->
    <ellipse cx="200" cy="135" rx="28" ry="18" fill="#c4622d" fill-opacity="0.5"/>
    <!-- Corgi head -->
    <circle cx="200" cy="112" r="16" fill="#c4622d" fill-opacity="0.6"/>
    <!-- Ears (signature corgi triangles) -->
    <polygon points="188,100 180,82 196,96" fill="#c4622d" fill-opacity="0.7"/>
    <polygon points="212,100 220,82 204,96" fill="#c4622d" fill-opacity="0.7"/>
    <!-- Eyes -->
    <circle cx="194" cy="110" r="2.5" fill="#1e1812"/>
    <circle cx="206" cy="110" r="2.5" fill="#1e1812"/>
    <circle cx="195" cy="109" r="0.8" fill="#ede8df" fill-opacity="0.6"/>
    <circle cx="207" cy="109" r="0.8" fill="#ede8df" fill-opacity="0.6"/>
    <!-- Snout -->
    <ellipse cx="200" cy="117" rx="6" ry="4" fill="#b5622d" fill-opacity="0.5"/>
    <!-- Arms out for balance -->
    <line x1="172" y1="135" x2="148" y2="148" stroke="#ede8df" stroke-width="2" stroke-opacity="0.4" stroke-linecap="round"/>
    <line x1="228" y1="135" x2="252" y2="148" stroke="#ede8df" stroke-width="2" stroke-opacity="0.4" stroke-linecap="round"/>
    <!-- Ground line -->
    <line x1="80" y1="262" x2="320" y2="262" stroke="#ede8df" stroke-width="0.5" stroke-opacity="0.15"/>
    <!-- Spotlight rays -->
    <line x1="200" y1="0"  x2="100" y2="280" stroke="#ede8df" stroke-width="0.5" stroke-opacity="0.05"/>
    <line x1="200" y1="0"  x2="200" y2="280" stroke="#ede8df" stroke-width="0.5" stroke-opacity="0.08"/>
    <line x1="200" y1="0"  x2="300" y2="280" stroke="#ede8df" stroke-width="0.5" stroke-opacity="0.05"/>
  </svg>`;
}
```

**Step 2: Add Scenario 1 runner**

```javascript
// ── SCENARIO 1: Image Generation ────────────────────────────────
async function scenario1() {
  const zone2 = document.getElementById('zone2');
  const zone3 = document.getElementById('zone3');
  zone2.classList.add('active');

  // 1. Agent speech
  agentSpeech('Creating that for you...');
  await delay(400);

  // 2. Thinking form
  await thinkingSequence('Imagining...');

  // 3. Image panel arrives via birth
  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.innerHTML = `
    <div id="corgi-img">${makeCorgSVG()}</div>
  `;
  zone2.appendChild(panel);
  await birth(panel);
  float(panel);

  // Weight animation on next headline if present
  await delay(200);

  // 4. Caption fades in 300ms after image
  const caption = document.createElement('div');
  caption.className = 'panel-caption';
  caption.textContent = 'A corgi who joined the circus.';
  panel.appendChild(caption);
  await birth(caption, 300);

  // 5. Agent speech
  await delay(200);
  agentSpeech('Here\'s your corgi. Three months of training, apparently.');

  // 6. Caption dims
  await delay(3000);
  gsap.to(caption, { opacity: 0.5, duration: 0.6 });

  // 7. Save affordance appears
  const saveBtn = document.createElement('button');
  saveBtn.className = 'trigger';
  saveBtn.style.marginTop = '0.5rem';
  saveBtn.innerHTML = '<em>Save to shelf</em>';
  panel.appendChild(saveBtn);
  await birth(saveBtn, 200);

  saveBtn.addEventListener('click', () => saveToShelf(panel, 'Corgi Circus', zone3));
}

async function saveToShelf(panel, label, zone3) {
  // Scale down panel into zone3
  gsap.to(panel, {
    scale: 0.15,
    opacity: 0,
    duration: 0.5,
    ease: 'power2.inOut',
    onComplete: () => panel.remove()
  });

  await delay(300);

  const card = document.createElement('div');
  card.className = 'shelf-card';
  card.innerHTML = `
    <div class="card-label">${label}</div>
    <div class="card-sub">Saved just now</div>
  `;
  zone3.appendChild(card);

  // Birth at 30% opacity
  gsap.fromTo(card,
    { opacity: 0, filter: 'blur(8px)', scale: 0.9 },
    { opacity: 0.3, filter: 'blur(0px)', scale: 1,
      duration: 0.4, ease: 'power3.out',
      onComplete: () => card.classList.add('live') }
  );

  agentSpeech('Saved.');

  card.addEventListener('click', () => {
    gsap.to(card, { opacity: 1, duration: 0.3 });
  });
}
```

**Step 3: Wire button + keyboard**
```javascript
// ── TRIGGER WIRING ────────────────────────────────────────────────
let running = false;

document.querySelectorAll('.trigger[data-scenario]').forEach(btn => {
  btn.addEventListener('click', async () => {
    if (running) return;
    running = true;
    await clearAll();
    const n = btn.dataset.scenario;
    if (n === '1') await scenario1();
    if (n === '2') await scenario2();
    if (n === '3') await scenario3();
    running = false;
  });
});

document.addEventListener('keydown', async (e) => {
  if (running) return;
  if (e.key === '1') { running = true; await clearAll(); await scenario1(); running = false; }
  if (e.key === '2') { running = true; await clearAll(); await scenario2(); running = false; }
  if (e.key === '3') { running = true; await clearAll(); await scenario3(); running = false; }
  if (e.key === 'Escape') { await clearAll(); running = false; }
});

document.getElementById('reset-btn').addEventListener('click', async () => {
  await clearAll();
  running = false;
});
```

**Step 4: Test Scenario 1 in browser**
- Click button 1 or press `1`
- Agent speech appears → lemniscate shows + "Imagining..." → dissolves → corgi SVG births in → floats → caption fades in → speech again → save button appears → clicking save migrates to shelf card

**Step 5: Commit**
```bash
git add "continuity-agent-A-late-evening.html"
git commit -m "feat: Theme A — Scenario 1 image generation with corgi SVG and shelf save"
```

---

### Task 7: Scenario 2 — Location Search

**Files:**
- Modify: `continuity-agent-A-late-evening.html` (JS block)

**Step 1: Add map SVG builder**

```javascript
// ── SVG MAP: North Portland streets (stylized, warm-toned) ───────
function makeMapSVG() {
  return `<svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg"
           style="width:100%;height:auto;display:block;">
    <rect width="600" height="280" fill="#221a10"/>
    <!-- Street grid (muted warm) -->
    <!-- Horizontals -->
    <line x1="0" y1="70"  x2="600" y2="70"  stroke="#3d3020" stroke-width="6"/>
    <line x1="0" y1="140" x2="600" y2="140" stroke="#3d3020" stroke-width="10"/>
    <line x1="0" y1="200" x2="600" y2="200" stroke="#3d3020" stroke-width="6"/>
    <line x1="0" y1="250" x2="600" y2="250" stroke="#3d3020" stroke-width="4"/>
    <!-- Verticals -->
    <line x1="80"  y1="0" x2="80"  y2="280" stroke="#3d3020" stroke-width="4"/>
    <line x1="180" y1="0" x2="180" y2="280" stroke="#3d3020" stroke-width="8"/>
    <line x1="320" y1="0" x2="320" y2="280" stroke="#3d3020" stroke-width="6"/>
    <line x1="440" y1="0" x2="440" y2="280" stroke="#3d3020" stroke-width="4"/>
    <line x1="540" y1="0" x2="540" y2="280" stroke="#3d3020" stroke-width="4"/>
    <!-- Diagonal (Burnside-like) -->
    <line x1="0" y1="180" x2="600" y2="80"  stroke="#3d3020" stroke-width="7"/>
    <!-- Block fills -->
    <rect x="85"  y="75"  width="90"  height="60"  fill="#2a2015" rx="2"/>
    <rect x="85"  y="145" width="90"  height="50"  fill="#2a2015" rx="2"/>
    <rect x="185" y="75"  width="130" height="60"  fill="#2a2015" rx="2"/>
    <rect x="185" y="145" width="130" height="50"  fill="#2a2015" rx="2"/>
    <rect x="325" y="75"  width="110" height="60"  fill="#2a2015" rx="2"/>
    <rect x="325" y="145" width="110" height="50"  fill="#2a2015" rx="2"/>
    <rect x="445" y="75"  width="90"  height="120" fill="#2a2015" rx="2"/>
    <!-- Street labels (very faint) -->
    <text x="190" y="135" fill="#5a4a35" font-size="9" font-family="sans-serif">N Mississippi Ave</text>
    <text x="325" y="135" fill="#5a4a35" font-size="9" font-family="sans-serif">N Williams Ave</text>
    <text x="20"  y="138" fill="#5a4a35" font-size="9" font-family="sans-serif">N Fremont St</text>
  </svg>`;
}
```

**Step 2: Add Scenario 2 runner**

```javascript
// ── SCENARIO 2: Location Search ──────────────────────────────────
const LOCATIONS = [
  { name: 'Pearl Vision', dist: '0.4 mi', stars: 4.2, hours: 'Open until 6pm',
    x: '28%', y: '38%' },
  { name: 'Northwest Eye Care', dist: '0.8 mi', stars: 4.5, hours: 'Open until 7pm',
    x: '52%', y: '55%' },
  { name: 'Vision Works NoPo', dist: '1.1 mi', stars: 3.9, hours: 'Open until 5:30pm',
    x: '72%', y: '35%' },
];

async function scenario2() {
  const zone2 = document.getElementById('zone2');
  const zone3 = document.getElementById('zone3');
  zone2.classList.add('active');

  // 1. Agent speech
  agentSpeech('Searching North Portland...');
  await delay(400);

  // 2. Thinking
  await thinkingSequence('Searching Portland...');

  // 3. Map panel
  const mapPanel = document.createElement('div');
  mapPanel.className = 'panel';
  mapPanel.style.padding = '0';
  mapPanel.style.overflow = 'hidden';
  mapPanel.innerHTML = `<div class="map-container">${makeMapSVG()}</div>`;
  zone2.appendChild(mapPanel);
  await birth(mapPanel);

  // 4. Three pins — staggered birth
  const mapContainer = mapPanel.querySelector('.map-container');
  const pinEls = [];

  for (let i = 0; i < LOCATIONS.length; i++) {
    const loc = LOCATIONS[i];
    const pin = document.createElement('div');
    pin.className = 'map-pin';
    pin.style.left = loc.x;
    pin.style.top  = loc.y;
    pin.dataset.idx = i;
    mapContainer.appendChild(pin);
    await birth(pin, i * 200);
    pinEls.push(pin);
  }

  // 5. Three shelf cards — staggered
  const cardEls = [];
  for (let i = 0; i < LOCATIONS.length; i++) {
    const loc = LOCATIONS[i];
    const stars = '● '.repeat(Math.round(loc.stars)).trim() +
                  (loc.stars % 1 >= 0.5 ? '◐' : '');
    const card = document.createElement('div');
    card.className = 'shelf-card';
    card.dataset.idx = i;
    card.innerHTML = `
      <div class="card-label">${loc.name}</div>
      <div class="card-sub">${loc.dist} · ${loc.stars}★</div>
    `;
    zone3.appendChild(card);

    gsap.fromTo(card,
      { opacity: 0, filter: 'blur(8px)', scale: 0.9 },
      { opacity: 0.3, filter: 'blur(0px)', scale: 1,
        duration: 0.4, delay: i * 0.15, ease: 'power3.out',
        onComplete: () => card.classList.add('live') }
    );
    cardEls.push(card);
  }

  // 6. Agent speech
  agentSpeech('Here are three options near you.');

  // 7. Pin + card interaction
  function selectLocation(idx) {
    pinEls.forEach((p, i) => {
      p.classList.toggle('dim', i !== idx);
      p.classList.toggle('sel', i === idx);
    });
    cardEls.forEach((c, i) => {
      c.style.opacity = i === idx ? '1' : '0.2';
    });

    const loc = LOCATIONS[idx];
    agentSpeech(`${loc.name} — ${loc.stars} stars. ${loc.hours}.`);
  }

  pinEls.forEach((pin) => {
    pin.addEventListener('click', () => selectLocation(parseInt(pin.dataset.idx)));
  });
  cardEls.forEach((card) => {
    card.addEventListener('click', () => selectLocation(parseInt(card.dataset.idx)));
  });
}
```

**Step 3: Test**
- Press `2` — agent speech → lemniscate "Searching Portland..." → map births in → pins stagger in with pulse → shelf cards appear → click pin: others dim, card brightens, speech updates

**Step 4: Commit**
```bash
git add "continuity-agent-A-late-evening.html"
git commit -m "feat: Theme A — Scenario 2 location search with map, pins, shelf cards"
```

---

### Task 8: Scenario 3 — On-the-fly Note (Transformer Architecture)

**Files:**
- Modify: `continuity-agent-A-late-evening.html` (JS block)

**Step 1: Add architecture diagram SVG builder**

```javascript
// ── SVG: Transformer Architecture Diagram ────────────────────────
function makeTransformerSVG() {
  const box = (x, y, w, h, label, sub = '') => `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6"
          fill="${sub ? '#362b1e' : '#2a2015'}"
          stroke="var(--accent)" stroke-width="0.8" stroke-opacity="0.4"/>
    <text x="${x + w/2}" y="${y + h/2 - (sub ? 5 : 0)}"
          text-anchor="middle" dominant-baseline="middle"
          fill="#ede8df" font-size="10" font-family="sans-serif"
          font-weight="300">${label}</text>
    ${sub ? `<text x="${x + w/2}" y="${y + h/2 + 10}"
          text-anchor="middle" dominant-baseline="middle"
          fill="#7a6f62" font-size="8" font-family="sans-serif">×${sub}</text>` : ''}`;

  const arrow = (x1, y1, x2, y2) => `
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
          stroke="#7a6f62" stroke-width="0.8" stroke-opacity="0.6"
          marker-end="url(#arr)"/>`;

  return `<svg viewBox="0 0 560 300" xmlns="http://www.w3.org/2000/svg"
           style="width:100%;height:auto;display:block;">
    <defs>
      <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="#7a6f62" fill-opacity="0.6"/>
      </marker>
    </defs>
    <rect width="560" height="300" fill="#221a10" rx="8"/>

    <!-- Input -->
    ${box(20, 130, 80, 40, 'Input')}
    ${arrow(100, 150, 130, 150)}

    <!-- Embedding -->
    ${box(130, 120, 80, 60, 'Embed', '+')}
    ${arrow(210, 150, 240, 150)}

    <!-- N× Encoder block -->
    <rect x="240" y="60" width="120" height="180" rx="8"
          fill="none" stroke="var(--accent)" stroke-width="0.8" stroke-opacity="0.25"
          stroke-dasharray="4 3"/>
    <text x="300" y="52" text-anchor="middle"
          fill="#7a6f62" font-size="8" font-family="sans-serif">N× Encoder</text>
    ${box(255, 75, 90, 36, 'Multi-Head', 'Attn')}
    ${box(255, 122, 90, 30, 'Add & Norm')}
    ${box(255, 163, 90, 36, 'Feed', 'Forward')}
    ${box(255, 210, 90, 30, 'Add & Norm')}
    ${arrow(300, 111, 300, 122)}
    ${arrow(300, 152, 300, 163)}
    ${arrow(300, 199, 300, 210)}
    ${arrow(360, 150, 390, 150)}

    <!-- Output Linear -->
    ${box(390, 120, 80, 60, 'Linear +', 'Softmax')}
    ${arrow(470, 150, 500, 150)}

    <!-- Output -->
    ${box(500, 130, 60, 40, 'Output')}
  </svg>`;
}
```

**Step 2: Add streaming text helper**

```javascript
// ── TEXT STREAMER ─────────────────────────────────────────────────
async function streamText(container, text, msPerChar = 18) {
  container.textContent = '';
  for (const char of text) {
    container.textContent += char;
    await delay(msPerChar);
  }
}
```

**Step 3: Add Scenario 3 runner**

```javascript
// ── SCENARIO 3: On-the-fly Note ───────────────────────────────────
const NOTE_LINES = [
  'Transformers use self-attention',
  'Replace RNNs — parallel processing',
  '2017 — Vaswani et al.',
  '"Attention Is All You Need"',
];

async function scenario3() {
  const zone2 = document.getElementById('zone2');
  const zone3 = document.getElementById('zone3');
  zone2.classList.add('active');

  // 1. Architecture diagram births in (no thinking form — arrives directly)
  const diagPanel = document.createElement('div');
  diagPanel.className = 'panel';
  diagPanel.style.padding = '0';
  diagPanel.innerHTML = `
    <div id="diag-wrap" style="border-radius:0.75rem;overflow:hidden;">
      ${makeTransformerSVG()}
    </div>
    <h2 id="diag-title" style="padding:1rem 1.5rem 0.5rem;">Transformer Architecture</h2>
  `;
  zone2.appendChild(diagPanel);
  await birth(diagPanel);
  float(diagPanel);

  // Weight animation on title
  const title = diagPanel.querySelector('#diag-title');
  await delay(300);
  title.classList.add('focused');
  await delay(2000);
  title.classList.remove('focused');

  // 2. Agent speech streams in (character by character)
  const speechEl = document.createElement('div');
  speechEl.className = 'agent-speech';
  speechEl.style.whiteSpace = 'normal';
  speechEl.style.maxWidth = '580px';
  speechEl.style.textAlign = 'center';
  document.body.appendChild(speechEl);
  gsap.to(speechEl, { opacity: 1, duration: 0.4 });

  const speechText = 'Transformer architectures, introduced in 2017, replaced recurrent networks with attention mechanisms...';
  await streamText(speechEl, speechText, 22);
  await delay(1200);
  gsap.to(speechEl, { opacity: 0, y: -8, duration: 0.4,
    onComplete: () => speechEl.remove() });

  // 3. "Note it" trigger appears in shelf
  await delay(400);
  const noteShelfCard = document.createElement('div');
  noteShelfCard.className = 'shelf-card';
  noteShelfCard.innerHTML = `
    <div class="card-label">📝 Take note</div>
    <div class="card-sub">Tap to expand</div>
  `;
  zone3.appendChild(noteShelfCard);
  gsap.fromTo(noteShelfCard,
    { opacity: 0, filter: 'blur(8px)', scale: 0.9 },
    { opacity: 0.3, filter: 'blur(0px)', scale: 1,
      duration: 0.4, ease: 'power3.out' }
  );

  // 4. Trigger second phase on note card click OR second button
  const expandNote = async () => {
    noteShelfCard.removeEventListener('click', expandNote);

    // Diagram dims
    gsap.to(diagPanel, { opacity: 0.4, duration: 0.5 });

    // Notepad expands from zone3 up into zone2
    const notepad = document.createElement('div');
    notepad.className = 'notepad';
    zone2.appendChild(notepad);

    notepad.innerHTML = `
      <h2 id="note-title" style="margin-bottom:1rem;">Notes</h2>
      <div id="note-lines"></div>
      <span class="cursor-blink"></span>
    `;

    const noteTitle = notepad.querySelector('#note-title');
    const noteLines = notepad.querySelector('#note-lines');

    gsap.fromTo(notepad,
      { opacity: 0, filter: 'blur(8px)', scaleY: 0.6, y: 40 },
      { opacity: 1, filter: 'blur(0px)', scaleY: 1, y: 0,
        duration: 0.5, ease: 'power3.out' }
    );
    noteTitle.classList.add('focused');

    await delay(500);

    // Lines stream in one by one
    for (const line of NOTE_LINES) {
      const lineEl = document.createElement('div');
      lineEl.className = 'notepad-line';
      noteLines.appendChild(lineEl);
      gsap.to(lineEl, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
      await streamText(lineEl, line, 28);
      await delay(300);
    }

    notepad.querySelector('.cursor-blink').remove();

    await delay(600);
    noteTitle.classList.remove('focused');

    // 5. Done trigger
    const doneBtn = document.createElement('button');
    doneBtn.className = 'trigger';
    doneBtn.style.marginTop = '1rem';
    doneBtn.innerHTML = '<em>Okay, done.</em>';
    notepad.appendChild(doneBtn);
    gsap.fromTo(doneBtn, { opacity: 0 }, { opacity: 1, duration: 0.4 });

    doneBtn.addEventListener('click', async () => {
      // Notepad shrinks back to zone3
      gsap.to(notepad, {
        scaleY: 0.6, y: 40, opacity: 0, filter: 'blur(8px)',
        duration: 0.4, ease: 'power2.in',
        onComplete: () => notepad.remove()
      });

      await delay(200);

      // Saved glow on shelf card
      gsap.to(noteShelfCard, { opacity: 1, duration: 0.3 });
      gsap.to(noteShelfCard, { boxShadow: `0 0 16px var(--accent)`, duration: 0.3 });
      await delay(600);
      gsap.to(noteShelfCard, { boxShadow: 'none', opacity: 0.3, duration: 0.8 });

      // Diagram restores
      gsap.to(diagPanel, { opacity: 1, duration: 0.6 });

      agentSpeech('Note saved. Continuing...');
    });
  };

  noteShelfCard.addEventListener('click', expandNote);
  // Also auto-expand after 3s for demo flow
  setTimeout(expandNote, 3000);
}
```

**Step 4: Test Scenario 3 in browser**
- Press `3` — diagram births in with weight animation on title → speech streams character-by-character → note card appears in shelf → click card or wait 3s → notepad expands → lines stream in → "Okay, done." → notepad collapses → diagram restores

**Step 5: Commit**
```bash
git add "continuity-agent-A-late-evening.html"
git commit -m "feat: Theme A — Scenario 3 transformer note with streaming text and notepad"
```

---

### Task 9: Theme A — Polish Pass

**Files:**
- Modify: `continuity-agent-A-late-evening.html`

**Step 1: Add idle/default state — faint accent glyph at center**

In `#zone1` HTML, before `#thinking-form`, add:
```html
<div id="idle-mark">
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="10" stroke="var(--accent)"
            stroke-width="0.8" stroke-opacity="0.25"/>
    <circle cx="14" cy="14" r="2.5" fill="var(--accent)" fill-opacity="0.3"/>
  </svg>
</div>
```

In CSS:
```css
#idle-mark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: opacity 600ms ease;
}
```

In JS, hide `#idle-mark` when thinking form shows, restore when hidden:
```javascript
// In showThinking():
gsap.to('#idle-mark', { opacity: 0, duration: 0.3 });

// In hideThinking() onComplete:
gsap.to('#idle-mark', { opacity: 1, duration: 0.6, delay: 0.5 });
```

**Step 2: Voice-priority dimming stub**
When any scenario starts, add a subtle dim to active zone2 content during "listening" (triggered by spacebar for demo):
```javascript
document.addEventListener('keydown', (e) => {
  if (e.key === ' ' && !e.repeat) {
    document.querySelectorAll('#zone2 .panel, #zone2 .notepad').forEach(el => {
      gsap.to(el, { opacity: 0.3, duration: 0.3 });
    });
  }
});
document.addEventListener('keyup', (e) => {
  if (e.key === ' ') {
    document.querySelectorAll('#zone2 .panel, #zone2 .notepad').forEach(el => {
      gsap.to(el, { opacity: 1, duration: 0.4 });
    });
  }
});
```

**Step 3: Final browser QA checklist**
- [ ] Default state: deep warm dark, faint accent mark, three trigger buttons — nothing else
- [ ] Scenario 1: all 8 spec steps play correctly, save to shelf works
- [ ] Scenario 2: map births, pins stagger, shelf cards appear, selection interaction works
- [ ] Scenario 3: diagram births, speech streams, notepad expands and collapses
- [ ] Reset (Escape / ×): all elements death-dissolve correctly
- [ ] No animation jank or pop on any loop
- [ ] Keyboard 1/2/3/Escape all work
- [ ] Font weight animation visible on Scenario 3 diagram title
- [ ] Fraunces renders correctly (not fallback serif)

**Step 4: Commit**
```bash
git add "continuity-agent-A-late-evening.html"
git commit -m "feat: Theme A — polish pass, idle mark, voice-priority stub, QA pass"
```

---

## Phase 2: Theme C — "Bioluminescent Depths"

**Output file:** `continuity-agent-C-bioluminescent.html`

---

### Task 10: Duplicate A → C, Apply Theme Tokens

**Step 1: Copy the file**
```bash
cp "continuity-agent-A-late-evening.html" "continuity-agent-C-bioluminescent.html"
```

**Step 2: Replace font CDN link**

Find:
```html
<title>Continuity Agent — Late Evening</title>
...
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&display=swap" rel="stylesheet" />
```

Replace with:
```html
<title>Continuity Agent — Bioluminescent Depths</title>
...
<!-- THEME C FONTS: Syne variable (wght 400-800) -->
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400..800&display=swap" rel="stylesheet" />
```

**Step 3: Replace theme token block**

Find the entire `/* ── THEME TOKENS (A: Late Evening) ──── */` block, replace with:

```css
/* ── THEME TOKENS (C: Bioluminescent Depths) ─────────────────── */
:root {
  --bg:         #0d0d0f;
  --canvas:     #121218;
  --accent:     #e8a030;
  --text:       #f0ead8;
  --text-dim:   #5a5245;
  --font:       'Syne', sans-serif;
  --wght-base:  400;
  --wght-em:    600;
  --birth-ms:   250;
  --float-amp:  -4px;
  --float-dur:  5s;
  --think-dur:  2000;
  --speech-dur: 2500;
  --wght-ms:    600;
}
/* ── END THEME TOKENS ─────────────────────────────────────────── */
```

**Step 4: Verify in browser**
- Background should be near-black `#0d0d0f`
- Syne font loading
- Accent is amber-gold `#e8a030`

**Step 5: Commit**
```bash
git add "continuity-agent-C-bioluminescent.html"
git commit -m "feat: Theme C — token swap, Syne font, bioluminescent palette"
```

---

### Task 11: Theme C — Lissajous Thinking Form

**Files:**
- Modify: `continuity-agent-C-bioluminescent.html`

**Step 1: Replace the lemniscate SVG + GSAP block**

Find `<div id="thinking-form">` in the HTML, replace with:

```html
<div id="thinking-form">
  <canvas id="lissajous-canvas" width="180" height="140"
          style="display:block;"></canvas>
  <span id="thinking-label">Thinking...</span>
</div>
```

**Step 2: Replace the lemniscate GSAP code in the `<script>` block**

Remove the two `gsap.to('#lemniscate', ...)` calls and replace with:

```javascript
// ── THEME C: Lissajous dot-trail thinking form ───────────────────
const lissCanvas  = document.getElementById('lissajous-canvas');
const lissCtx     = lissCanvas.getContext('2d');
const CX = lissCanvas.width  / 2;
const CY = lissCanvas.height / 2;
const A  = 72, B = 52; // amplitudes
const a  = 3,  b = 2;  // frequency ratio
let   lissT = 0;
const TRAIL_LENGTH = 40;
const trail = [];
let   lissRAF;

function drawLissajous() {
  lissCtx.clearRect(0, 0, lissCanvas.width, lissCanvas.height);

  // Advance parametric t
  lissT += 0.018;
  const x = CX + A * Math.sin(a * lissT + Math.PI / 2);
  const y = CY + B * Math.sin(b * lissT);
  trail.push({ x, y, age: 0 });
  if (trail.length > TRAIL_LENGTH) trail.shift();

  // Draw fading trail
  for (let i = 0; i < trail.length; i++) {
    const pt      = trail[i];
    const progress = i / trail.length;        // 0 (oldest) → 1 (newest)
    const alpha    = progress * progress * 0.7;
    const radius   = 1 + progress * 2.5;
    lissCtx.beginPath();
    lissCtx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
    lissCtx.fillStyle = `rgba(232, 160, 48, ${alpha})`;
    lissCtx.fill();
  }

  // Bright head dot
  lissCtx.beginPath();
  lissCtx.arc(x, y, 3.5, 0, Math.PI * 2);
  lissCtx.fillStyle = 'rgba(232, 160, 48, 0.9)';
  lissCtx.fill();

  lissRAF = requestAnimationFrame(drawLissajous);
}

// Start looping immediately (canvas is hidden until thinking form shown)
drawLissajous();
```

**Step 3: Verify**
- Set `thinkingForm.style.opacity = 1` in console
- Should see amber dot leaving a fading trail tracing a 3:2 Lissajous curve
- Perfectly looping, no seam

**Step 4: Commit**
```bash
git add "continuity-agent-C-bioluminescent.html"
git commit -m "feat: Theme C — Lissajous canvas dot-trail thinking form"
```

---

### Task 12: Theme C — QA Pass

**Files:**
- Modify: `continuity-agent-C-bioluminescent.html`

**Step 1: Full browser QA checklist**
- [ ] Background `#0d0d0f`, accent amber-gold, Syne font rendering
- [ ] Lissajous dot-trail looping perfectly in thinking form
- [ ] All three scenarios play correctly with C timing (faster births, shorter think)
- [ ] Weight animation visible (Syne 400→600)
- [ ] Shelf cards, pins, notepad all work
- [ ] Reset works

**Step 2: Commit**
```bash
git add "continuity-agent-C-bioluminescent.html"
git commit -m "feat: Theme C — QA pass complete"
```

---

## Phase 3: Theme D — "Warm Film"

**Output file:** `continuity-agent-D-warm-film.html`

---

### Task 13: Duplicate A → D, Apply Theme Tokens + Grain

**Step 1: Copy the file**
```bash
cp "continuity-agent-A-late-evening.html" "continuity-agent-D-warm-film.html"
```

**Step 2: Replace font CDN + title**

```html
<title>Continuity Agent — Warm Film</title>
...
<!-- THEME D FONTS: Cormorant Garamond variable (wght 300-700) -->
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&display=swap" rel="stylesheet" />
```

**Step 3: Replace theme token block**

```css
/* ── THEME TOKENS (D: Warm Film) ─────────────────────────────── */
:root {
  --bg:         #1a1510;
  --canvas:     #221c14;
  --accent:     #d4925a;
  --text:       #f2e8d5;
  --text-dim:   #6b5e4e;
  --font:       'Cormorant Garamond', serif;
  --wght-base:  300;
  --wght-em:    500;
  --birth-ms:   400;
  --float-amp:  -6px;
  --float-dur:  7s;
  --think-dur:  3000;
  --speech-dur: 4000;
  --wght-ms:    1200;
}
/* ── END THEME TOKENS ─────────────────────────────────────────── */
```

**Step 4: Add SVG grain texture overlay to the `<body>` (after zones, before trigger bar)**

```html
<!-- FILM GRAIN OVERLAY -->
<svg id="grain" style="position:fixed;inset:0;width:100%;height:100%;
     pointer-events:none;z-index:1;opacity:0.025;" xmlns="http://www.w3.org/2000/svg">
  <filter id="noise">
    <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4"
                  stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#noise)" opacity="1"/>
</svg>
```

**Step 5: Verify in browser**
- Background `#1a1510`, Cormorant Garamond rendering
- Subtle static grain visible (very faint, should feel analogue not distracting)
- Accent is burnt sienna `#d4925a`

**Step 6: Commit**
```bash
git add "continuity-agent-D-warm-film.html"
git commit -m "feat: Theme D — token swap, Cormorant font, film grain overlay"
```

---

### Task 14: Theme D — Rotating Ellipse Thinking Form

**Files:**
- Modify: `continuity-agent-D-warm-film.html`

**Step 1: Replace thinking form HTML**

```html
<div id="thinking-form">
  <svg id="rotating-ellipse" width="160" height="80"
       viewBox="-80 -40 160 80" fill="none"
       xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="0" cy="0" rx="64" ry="28"
             stroke="var(--accent)"
             stroke-width="1"
             stroke-opacity="0.45"
             stroke-dasharray="4 8"
             fill="none"/>
    <!-- Inner faint ellipse for depth -->
    <ellipse cx="0" cy="0" rx="40" ry="16"
             stroke="var(--accent)"
             stroke-width="0.5"
             stroke-opacity="0.2"
             fill="none"/>
  </svg>
  <span id="thinking-label">Thinking...</span>
</div>
```

**Step 2: Replace lemniscate GSAP code with ellipse rotation**

```javascript
// ── THEME D: Rotating dashed ellipse thinking form ───────────────
// Slow coin-spin rotation — never fully stops, never speeds up
gsap.to('#rotating-ellipse', {
  rotationY: 360,
  duration: 4,
  ease: 'none',
  repeat: -1,
  transformOrigin: 'center center',
  transformPerspective: 600
});
// Counter-rotate inner ellipse slightly differently for depth
gsap.to('#rotating-ellipse ellipse:nth-child(2)', {
  rotationY: -360,
  duration: 6.5,
  ease: 'none',
  repeat: -1,
  transformOrigin: 'center center',
  transformPerspective: 600
});
// Subtle scale breathe
gsap.to('#rotating-ellipse', {
  scaleX: 1.06, scaleY: 0.96,
  duration: 3.8,
  ease: 'sine.inOut',
  yoyo: true,
  repeat: -1,
  transformOrigin: 'center center'
});
```

**Step 3: Verify**
- Set `thinkingForm.style.opacity = 1` in console
- Dashed ellipse should slowly rotate on its Y-axis (coin-spinning effect)
- Subtle scale breathe overlaid — feels like it will never stop

**Step 4: Commit**
```bash
git add "continuity-agent-D-warm-film.html"
git commit -m "feat: Theme D — rotating dashed ellipse thinking form"
```

---

### Task 15: Theme D — QA Pass

**Files:**
- Modify: `continuity-agent-D-warm-film.html`

**Step 1: Full browser QA checklist**
- [ ] Background `#1a1510`, grain texture visible but subtle, Cormorant rendering
- [ ] Ellipse rotation smooth, no pop on loop
- [ ] All three scenarios play with D timing (slower births, longer think, longer speech)
- [ ] Weight animation noticeably slow and luxurious (1200ms) — Cormorant shines here
- [ ] All three scenarios work correctly
- [ ] Reset works

**Step 2: Adjust Cormorant font sizes** (Cormorant renders smaller than Fraunces — bump base font-size)

In CSS, add after theme tokens:
```css
/* Cormorant optical size correction */
body { font-size: 112%; }
.trigger { font-size: 0.75rem; }
```

**Step 3: Final commit**
```bash
git add "continuity-agent-D-warm-film.html"
git commit -m "feat: Theme D — QA pass, Cormorant size correction, all scenarios verified"
```

---

## Final QA: Cross-Theme Parity Check

Open all three files side-by-side and verify:

| Check | A | C | D |
|-------|---|---|---|
| Default empty state feels intentional | ✓ | ✓ | ✓ |
| Thinking form loops without seam | ✓ | ✓ | ✓ |
| Scenario 1 corgi illustration warm-toned | ✓ | ✓ | ✓ |
| Scenario 2 map styled to palette | ✓ | ✓ | ✓ |
| Scenario 3 weight animation distinct per font | ✓ | ✓ | ✓ |
| Reset clears everything cleanly | ✓ | ✓ | ✓ |
| No lorem ipsum anywhere | ✓ | ✓ | ✓ |
| Keyboard 1/2/3/Escape works | ✓ | ✓ | ✓ |

```bash
git add .
git commit -m "feat: all three Continuity Agent themes complete and verified"
```
