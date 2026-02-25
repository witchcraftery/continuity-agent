# Continuity Agent v2 — Bioluminescent Design Document
*2026-02-25*

## Overview

A full evolution of `continuity-agent-C-bioluminescent.html` into a voice-first, audio-reactive, agent-connectable experience. The AI has a physical presence — a cellular orb behind frosted glass — and the entire visual system responds to the emotional and cognitive state of the conversation.

**Output file:** `continuity-agent-C-v2-bioluminescent.html`

---

## The Premise

Behind the frosted glass lives the AI — embodied as a slow-moving cellular orb. Everything in front of the glass is an effect of that intelligence: the Lissajous processing form, the content cards, the agent's voice. The glass is the boundary between the intelligence (behind) and the interaction (in front). The user's space is warm, clear, and lit by what's on the other side.

---

## Layer Stack (back → front)

```
z-index  Element            Renderer     Purpose
──────────────────────────────────────────────────────────
  0      #bg-gradient       CSS div      Emotively animated radial gradient
  1      #orb-canvas        Canvas 2D    The AI's cellular body
  2      #frost             CSS div      Frosted glass — blur + grain
  3      #lissajous-canvas  Canvas 2D    Audio-reactive processing/voice form
  4      #zone2 / #zone3    DOM          Content cards, shelf
  5      #trigger-bar       DOM          Scenario buttons
```

---

## Section 1: Background Gradient (Layer 0)

Full-viewport CSS `div`. Two overlapping radial gradients composited:

```css
background:
  radial-gradient(ellipse 70% 60% at var(--g1x) var(--g1y), var(--g1) 0%, transparent 70%),
  radial-gradient(ellipse 50% 80% at var(--g2x) var(--g2y), var(--g2) 0%, transparent 60%),
  var(--bg);
```

GSAP slowly morphs color and position custom properties over 12–20s transitions (never sudden).

### Emotional Palettes

| Mood | `--g1` | `--g2` | Character |
|---|---|---|---|
| `resting` | `rgba(12,8,20,0.9)` | `rgba(20,14,8,0.8)` | Deep void, minimal |
| `engaged` | `rgba(40,20,8,0.7)` | `rgba(8,12,32,0.6)` | Warm dark + cool depth |
| `excited` | `rgba(60,30,8,0.6)` | `rgba(30,8,50,0.5)` | Amber + violet |
| `thinking` | `rgba(8,12,28,0.8)` | `rgba(20,10,4,0.7)` | Cool, receded |

Driven by `ContinuityAgent.setState()`.

---

## Section 2: The Orb (Layer 1)

Full-viewport Canvas 2D (`#orb-canvas`), rendered behind the frost layer.

### Structure

The orb is ~55% viewport width at rest, ranging 45–65% based on emotional state.

**Outer shell (cellular membrane):**
- Radial gradient: `rgba(232,160,48,0.06)` at rim → `transparent` at center
- Catches background light, barely luminous, gives the "liquid cell wall" quality

**Inner orb (the body):**
- Radial gradient: `#080810` at core → `rgba(14,12,20,0.7)` at edge
- Semi-transparent — background gradient colors bleed through via compositing

**Depth glow:**
- Soft amber bloom around shell edge, `rgba(232,160,48,0.04)` at rest
- Intensifies to `rgba(232,160,48,0.12)` when AI speaks

### Motion — The "Pacing" Behavior

The orb drifts on a slow elliptical orbit using irrational period ratios to prevent perfect repetition:

```javascript
const t = Date.now() / 1000;
const x = cx + Math.sin(t / 11.3) * orbitW + Math.sin(t / 7.7) * orbitW * 0.3;
const y = cy + Math.cos(t / 14.1) * orbitH + Math.cos(t / 9.2) * orbitH * 0.2;
```

**Z-depth illusion** (approaching/receding):
- Scale oscillates between 0.90–1.08 on a separate ~14s period
- When scale > 1.0: CSS `filter: blur(0px)` on canvas (orb closer = clearer)
- When scale < 0.95: CSS `filter: blur(4px)` on canvas (orb farther = softer)
- Transition: `filter` animates smoothly via GSAP

### Orb Emotional States

| State | Behavior |
|---|---|
| `idle` | Slow drift, dim membrane, 18s orbit cycle |
| `listening` | Orbit tightens slightly, membrane brightens at rim |
| `thinking` | Orbit slows, depth-pulses (in/out oscillation), membrane dims |
| `speaking` | Orbit expands, membrane glows amber, approaches glass (scale up) |
| `excited` | Orbit slightly faster, membrane warmer, scale peaks higher |

---

## Section 3: Frosted Glass (Layer 2)

Full-viewport CSS `div`, pointer-events none, non-interactive.

```css
#frost {
  position: fixed;
  inset: 0;
  backdrop-filter: blur(32px) saturate(120%) brightness(0.85);
  -webkit-backdrop-filter: blur(32px) saturate(120%) brightness(0.85);
  z-index: 2;
  pointer-events: none;
}
```

SVG `feTurbulence` grain texture overlaid at 3% opacity (existing grain technique from Theme D, adapted).

The frost blur value subtly adjusts with orb state:
- `idle`: `blur(32px)` — maximum frosted
- `speaking`: `blur(24px)` — slightly clearer, AI presence closer
- `listening`: `blur(36px)` — deeper frost, AI recedes to listen

---

## Section 4: Audio-Reactive Lissajous (Layer 3)

The existing `#lissajous-canvas` is upgraded with Web Audio API and a state machine.

### Microphone Setup

```javascript
// Activates on first user interaction (no on-load permission prompt)
async function initMic() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioCtx = new AudioContext();
  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  source.connect(analyser);
  // Read analyser.getByteTimeDomainData() each animation frame
}
```

### AI Voice (Web Speech API)

`window.speechSynthesis.speak()` for now. When `ContinuityAgent.speak(text)` is called:
1. Browser TTS reads text aloud
2. A synthetic amplitude envelope (sin wave + noise) drives Lissajous as if reacting to real audio
3. When speech ends, state returns to `listening`

### Lissajous State Machine

| State | a:b ratio | Tail pts | Color | Glow |
|---|---|---|---|---|
| `idle` | 1:1 | 30 | amber 40% | none |
| `listening` | 1:1 | 20–30 | near-white 50% | none |
| `thinking` | 3:2 | 40 | amber 60% | subtle |
| `searching` | 5:4 | 35 | amber 70% | subtle |
| `building` | 4:3 | 38 | amber 65% | subtle |
| `speaking` | 2:1 | 60–80 | amber 90% | full |

**Ratio transitions:** GSAP-tweened over 800ms — the path morphs smoothly between shapes rather than snapping.

**Path deformation during `speaking`:**
Each point position nudged by amplitude:
```javascript
x += amplitude * Math.sin(i * 0.4) * 12;
y += amplitude * Math.cos(i * 0.3) * 8;
```
Organic waveform wobble — controlled, not chaotic.

**User speaking detection:**
- Amplitude above threshold → user is speaking
- Tail shortens to 20–25 pts, color shifts near-white, no glow
- Subtle positive bumps on path (you're being heard)

**AI speaking glow:**
```javascript
ctx.shadowBlur = 18;
ctx.shadowColor = 'rgba(232, 160, 48, 0.8)';
```

**Near-white for user, amber for AI** — the user is heard; the AI is the magic.

---

## Section 5: Agent API Surface

```javascript
window.ContinuityAgent = {
  // Drive TTS + speaking visual state
  speak(text, emotion = 'neutral') {},

  // Drive all visual states (orb + gradient + Lissajous)
  setState(state) {},
  // Valid states: 'idle' | 'listening' | 'thinking' |
  //               'searching' | 'building' | 'speaking' | 'excited'

  // Drop a content card into zone 2
  addContent(type, data) {},
  // type: 'image' | 'map' | 'note' | 'diagram' | 'custom'

  // Add a line to the persistent notepad
  appendNote(text) {},

  // Reset all content (existing clearAll)
  clearAll() {}
};
```

This is the door where a real agent (Claude API, OpenClaw, or any backend) plugs in. The canvas doesn't know or care what's on the other side.

---

## Section 6: Notepad Tool

A persistent content card that lives in zone 3 (shelf) and expands into zone 2.

- **Collapsed:** small shelf card, always present, labeled "Session Notes"
- **Expanded:** full panel in zone 2, contenteditable, line-by-line streaming
- **Auto-save:** writes to `localStorage` key `continuity-notes-YYYY-MM-DD` on every keystroke
- **Export CTA:** "Save as .md" button → generates `YYYY-MM-DD-session-notes.md` download
- **Agent writes:** `ContinuityAgent.appendNote(text)` streams a new line in with the existing `streamText()` engine
- **User writes:** direct contenteditable interaction

---

## Section 7: Container Spacing Fix

All content container headlines get more breathing room:

```css
/* Before */
.panel h2 { padding: 1rem 1.5rem 0.5rem; }

/* After */
.panel h2 { padding: 1.75rem 2.25rem 1rem; }
.notepad h2 { padding: 1.75rem 2.25rem 1rem; }
```

All `.panel` base padding increases from `1.5rem 2rem` to `2rem 2.5rem`.

---

## Technical Constraints

- Single HTML file, no build step, opens by double-click
- GSAP 3 (CDN) for all animation transitions
- Google Fonts: Syne variable (existing)
- Web Audio API — browser native, no CDN
- Web Speech API — browser native, no CDN
- No React, no framework
- `localStorage` for note persistence
- No backend required for this build (agent API surface is scaffolded, not wired)

---

## Success Criteria

Open the file. The space breathes. Something is behind the glass — present, organic, alive. Speak into the microphone and the Lissajous hears you. Trigger a scenario and the orb responds. The space feels inhabited, not void. Someone watching wants to lean closer.
