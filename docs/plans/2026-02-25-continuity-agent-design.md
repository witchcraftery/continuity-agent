# Continuity Agent UI — Design Document
*2026-02-25*

## Overview

Three self-contained single-page HTML demos of the Continuity Agent interface, each sharing a common scenario engine but expressing a distinct visual and emotional personality. Based on the full spec in `Continuity-Agent-UI-Prompt.md`.

---

## Deliverables

| File | Theme | Personality |
|------|-------|-------------|
| `continuity-agent-A-late-evening.html` | Late Evening | Warm, patient, literary — closest to spec |
| `continuity-agent-C-bioluminescent.html` | Bioluminescent Depths | Liquid, amber-lit, atmospheric |
| `continuity-agent-D-warm-film.html` | Warm Film | Analogue, grainy, exposed slowly |

---

## Architecture

### Shared Engine (identical across all three files)

1. **CSS custom properties at `:root`** — all visual rules reference theme tokens only (`--bg`, `--canvas`, `--accent`, `--text`, `--text-dim`). Swapping the token block is all that changes between themes.
2. **Zone system** — three absolutely-positioned layers:
   - Zone 1 (Transcendent): center, agent presence / thinking form
   - Zone 2 (Conversation): main content area, default empty
   - Zone 3 (Ephemeral Shelf): bottom strip, 30% opacity cards
3. **Scenario runner** — JS state machine sequencing steps via `async/await` + GSAP timelines
4. **Element lifecycle functions**:
   - `birth(el)` — blur-to-clarity, scale 95%→100%, opacity 0→1, 300–500ms ease-out
   - `float(el)` — ambient vertical drift 0→-5px loop, 6s cycle, infinite
   - `death(el)` — drift up 20–30px + opacity 0, 400–600ms ease-in-out
5. **Trigger bar** — three minimal italic buttons + keyboard `1`/`2`/`3` shortcuts + `Escape` to reset
6. **Font-weight animation** — CSS `transition: font-variation-settings` on Zone 2 headlines, no JS required

### CDN Dependencies
- **GSAP 3** (cdn.jsdelivr.net) — timeline sequencing, physics-quality easing
- **Google Fonts** — variable font loading per theme

---

## Typography

| Theme | Font | Variable Axes | Weight Range |
|-------|------|--------------|--------------|
| A — Late Evening | Fraunces | wght, opsz, WONK, SOFT | 100–900 |
| C — Bioluminescent | Syne | wght | 400–800 |
| D — Warm Film | Cormorant Garamond | wght | 300–700 |

### Variable Weight Animation Mechanic
- Zone 2 headlines render at base weight
- On birth: weight animates base → emphasis over 800ms with `font-variation-settings: 'wght' X`
- After 2s: breathes back to base over 1.2s
- On hover/focus: instant weight jump, releases on blur
- CSS only: `transition: font-variation-settings 800ms cubic-bezier(0.16, 1, 0.3, 1)`

---

## Per-Theme Visual Specs

### A — Late Evening
```css
--bg:       #1e1812;   /* deep charcoal, red in its bones */
--canvas:   #26211a;   /* worn paper held to a lamp */
--accent:   #c4622d;   /* rust */
--text:     #ede8df;   /* inside of an envelope */
--text-dim: #7a6f62;
```
- **Thinking form:** SVG lemniscate (∞), single continuous stroke, 1.5px, rust at 50% opacity, GSAP scale breathe on 3.5s cycle
- **Font weights:** Fraunces 300 base → 500 emphasis
- **Animation character:** most patient — long eases, generous pauses

### C — Bioluminescent Depths
```css
--bg:       #0d0d0f;   /* inkwell, barely warm */
--canvas:   #121218;
--accent:   #e8a030;   /* amber-gold */
--text:     #f0ead8;
--text-dim: #5a5245;
```
- **Thinking form:** closed Lissajous curve (a:b = 3:2), traced by a moving dot leaving a fading amber trail (1.5s dissipation) — a glowing organism drawing itself in the dark
- **Font weights:** Syne 400 base → 600 emphasis
- **Animation character:** fluid, liquid — elements surface rather than appear

### D — Warm Film
```css
--bg:       #1a1510;   /* darkroom amber-black */
--canvas:   #221c14;   /* developed paper */
--accent:   #d4925a;   /* burnt sienna */
--text:     #f2e8d5;   /* aged paper */
--text-dim: #6b5e4e;
```
- **Background texture:** SVG `feTurbulence` noise filter at 2% opacity — static grain
- **Thinking form:** slowly rotating ellipse, dashed SVG stroke (dash:4 gap:8), burnt sienna at 45% opacity — like a coin slowing to rest, never stopping
- **Font weights:** Cormorant Garamond 300 base → 500 emphasis
- **Animation character:** most analogue — entries bloom outward, weight animations are slowest

---

## Scenario Choreography

All three scenarios follow the spec in `Continuity-Agent-UI-Prompt.md` exactly. Per-theme deltas:

| | A — Late Evening | C — Bioluminescent | D — Warm Film |
|---|---|---|---|
| Birth speed | 450ms | 250ms | 400ms |
| Float amplitude | 0→-5px / 6s | 0→-4px / 5s | 0→-6px / 7s |
| Thinking form on-screen | 2.5s | 2.0s | 3.0s |
| Agent speech hold | 3.0s | 2.5s | 4.0s |
| Weight anim duration | 800ms | 600ms | 1200ms |

### Scenario 1: Image Generation
Trigger key `1` / button "Show me a corgi riding a unicycle at the circus"
- Agent speech → Zone 1 thinking form → Zone 2 image (SVG illustration, warm-styled) + caption → ambient float → save to Zone 3 shelf

### Scenario 2: Location Search
Trigger key `2` / button "Where can I get my glasses fixed in North Portland?"
- Agent speech → Zone 1 thinking form → Zone 2 map (CSS/SVG, muted warm tones) → 3 staggered pins → Zone 3 location cards → pin hover interaction

### Scenario 3: On-the-fly Note
Trigger key `3` / button "Tell me about transformer architectures"
- Zone 2 architecture diagram (minimal SVG) → streaming agent speech → notepad expands from Zone 3 into Zone 2 → line-by-line text dictation → collapses back → diagram restores

---

## Hard Constraints (from spec)
- Single HTML file per theme, no build step, opens by double-click
- No React, Vue, or heavy frameworks
- All animations loop perfectly — no jank, no pop, no seam
- Default state is near-empty — the empty state is the design
- All text is the exact scenario text from the spec — no lorem ipsum
- Keyboard shortcuts 1/2/3 trigger scenarios, Escape resets
- Minimum viewport: 1280px wide desktop

---

## Success Criteria

Someone watching any of the three demos wants to lean closer. The interface feels like there is something on the other side that genuinely wants to help — and is quietly pleased to be doing so.
