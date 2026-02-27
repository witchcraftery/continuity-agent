# Continuity Agent — Conversational Canvas

> *An interface that does not ask to be used. It simply is — warm, still, and present — like a room that someone who loves you prepared before you arrived.*

---

## What This Is

Continuity Agent is a **voice-first AI operating system interface** — a proof of feeling more than a proof of concept. It is not a dashboard. Not a control panel. Not a feed. It is a canvas that breathes. It receives you. It places what it finds into space with the care of someone who understands that *how* a thing arrives matters as much as the thing itself.

The emotional ancestor of this interface is the OS1 from the film *Her* — a warm form at the center of a dark field, a system that communicates not through icons and menus but through voice and presence. Continuity Agent is what comes *after* that — more alive, more personal, more capable of genuine co-creation.

**This repository is the visual surface layer:** a self-contained HTML canvas demonstrating the interface language, animation system, and interaction physics of the full Continuity Agent ecosystem.

---

## What's Been Built

The current deliverable is a single, zero-dependency HTML file:

**`continuity-agent-C-v2-bioluminescent.html`**

A fully animated, interactive canvas demonstrating the complete interface system with three live scenarios. No build step. No npm. No framework. Open it in any modern browser — or serve it locally — and it runs.

### The Three Demonstration Scenarios

| Trigger | What Happens |
|---------|-------------|
| *"Show me a corgi riding a unicycle at the circus"* | Agent thinks → SVG illustration born into Zone 2 → caption fades in → save to shelf |
| *"Where can I get my glasses fixed in North Portland?"* | Map panel animates in → 3 location pins arrive with staggered birth → location cards populate the shelf |
| *"Tell me about transformer architectures"* | Architecture diagram born into Zone 2 → agent speech streams in → notepad shelf card appears → expandable live note-taking |

---

## The Interface Language

### The Three Zones

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│           ZONE 1 · TRANSCENDENT (center)               │
│     The agent's thinking form lives here.              │
│     A Lissajous figure — breathing, patient.           │
│     Activates when the agent is working.               │
│                                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│           ZONE 2 · CONVERSATION (middle)               │
│     Main content: images, maps, diagrams, notes.       │
│     Default state: empty. Not a placeholder.           │
│     The empty state IS the design.                     │
│                                                        │
├────────────────────────────────────────────────────────┤
│  ZONE 3 · EPHEMERAL SHELF (bottom strip)               │
│  ┌──────┐ ┌──────────┐ ┌──────┐ ┌───────────┐         │
│  │ 📝   │ │Pearl     │ │NW Eye│ │  Corgi    │         │
│  │Notes │ │Vision    │ │Care  │ │  Circus   │         │
│  └──────┘ └──────────┘ └──────┘ └───────────┘         │
└────────────────────────────────────────────────────────┘
```

**Zone 1** is the agent's face. It appears only for moments that deserve full presence — the thinking form breathing through uncertainty, a looping Lissajous that communicates *held, not kept.* When it clears, it dissolves entirely. The space returns to silence.

**Zone 2** is where content lives. Images, maps, diagrams, notes — all appear here, entered via blur-to-clarity. The zone's default state is *nothing.* Not a waiting grid. Not a placeholder. Nothing. Silence is design.

**Zone 3** is the ephemeral shelf — a horizontal strip of small, persistent cards. Items saved here remain accessible. Click to promote to Zone 2. This is session memory made tangible.

### Element Lifecycle — Birth, Float, Death

Every piece of content the agent places on the canvas follows the same physics:

**Birth — blur-to-clarity:**
Nothing arrives from nothing. Every element enters already present but unseen — soft-blurred at near-zero opacity, scaling from 95% — and resolves into sharp focus over 400–500ms. This is the interface's fingerprint.

**Float — ambient presence:**
While visible, every element breathes. A subtle vertical drift on a 6-second loop. No element is perfectly still. The canvas is alive.

**Death — directional exit:**
Zone 2 panels drift upward and dissolve (smoke). Zone 3 shelf cards slide gently downward and fade (settling). Context determines direction.

### The Gradient State Machine

The background is not static. It is a living gradient that shifts across seven named states — each a different emotional register of the agent:

| State | Character |
|-------|-----------|
| `idle` | Cranberry/teal at rest — deep, still |
| `listening` | Slightly lifted, leaning forward |
| `thinking` | Pulls into purple undertones — introspective |
| `searching` | Warm, active, scanning |
| `building` | Focused — saturation pulled in |
| `speaking` | Opens up — frost lifts, gradients breathe |
| `excited` | Most luminous — gradients brighten, frost thins |

The palette is cranberry (`rgba(71,35,45,0.78)`) over soft teal (`rgba(18,71,73,0.80)`), separated by a frost layer at `brightness(1.44)` — luminous, not transparent.

---

## Technical Architecture

### The Constraint Is the Feature

The entire interface runs as **one self-contained HTML file**. This is not a limitation — it is a design principle. The constraint forces economy, intentionality, and portability. Any browser. Any device. No setup.

```
Dependencies (CDN only):
├── GSAP 3.12.5          — all animation (tweens, timelines, ticker)
└── Syne variable font   — Google Fonts (wght 400–800)

Zero build step. Zero npm. Zero local imports.
```

### The RAF Shim

GSAP relies on `requestAnimationFrame`. In headless environments (Puppeteer, background tabs, preview servers), the browser throttles RAF to near-zero — freezing all animations silently. The RAF shim, injected before GSAP loads, solves this:

1. Immediately replaces `window.requestAnimationFrame` with a reliable `setTimeout(16)` fallback (~60fps in any environment)
2. Probes native RAF in the background
3. If native RAF fires ≥4 times within 150ms (a genuine focused browser), promotes to native for smoother rendering
4. Otherwise stays on `setTimeout` indefinitely

This is what separates an interface that *looks alive* from one that freezes silently and shows you a dark card.

### Animation System

All animations use GSAP 3. Key patterns:

```javascript
// Birth: blur-to-clarity with upward slide
gsap.fromTo(el,
  { opacity: 0, filter: 'blur(12px)', scale: 0.95, y: 18 },
  { opacity: 1, filter: 'blur(0px)', scale: 1, y: 0,
    duration: 0.45, ease: 'power3.out',
    onComplete: () => {
      gsap.set(el, { clearProps: 'opacity,filter' });
      el.classList.add('live');  // CSS class takes ownership
    }
  }
);

// Death: drift up and dissolve
gsap.to(el, { opacity: 0, y: '-=28', filter: 'blur(6px)',
  duration: 0.5, ease: 'power2.inOut',
  onComplete: () => el.remove()
});

// Shelf card death: slide down and settle
gsap.to(el, { opacity: 0, y: '+=20', filter: 'blur(4px)', scale: 0.92,
  duration: 0.45, ease: 'power2.in',
  onComplete: () => el.remove()
});
```

The `clearProps` → `classList.add('live')` pattern is critical: GSAP inline styles have higher specificity than CSS classes. After the birth animation, we hand opacity ownership back to CSS so interactive states (hover, focused, dimmed) can work as designed.

---

## Running Locally

```bash
# Serve from any directory
python3 -m http.server 8082
# Then open: http://localhost:8082/continuity-agent-C-v2-bioluminescent.html

# Or just open the file directly — it works without a server too
open continuity-agent-C-v2-bioluminescent.html
```

**Scenario controls:**
- Click the trigger buttons at the top of the screen
- Or press `1`, `2`, `3` on the keyboard
- Press `Escape` or click `×` to reset
- Press and hold `Space` to temporarily dim Zone 2 content (simulates the user speaking)

---

## The Bigger Vision

This canvas is the *face* of a larger ecosystem. The full Continuity Agent is a voice-first AI OS with:

**The Conversational Canvas** (this repository)
The visual surface — the space where AI output becomes tangible. Three zones. Cinematic animations. Content that arrives with intention and leaves like smoke.

**The Voice Pipeline** *(coming)*
Real-time microphone input → Whisper transcription → LLM reasoning → canvas commands. The agent listens. The canvas responds.

**The Continuity Layer** *(coming)*
Session memory, context threading, and the archive backend. What you discussed this morning is still present this afternoon. Not as a chat history — as *ambient context*.

**The AI Decision Engine** *(coming)*
The logic that decides *when* to show something, *what* to show, and *when to leave the space empty*. Not every thought deserves a visual. The ones that do arrive with care.

### Content Types Designed (Not Yet Wired)

The interface is designed to receive any content type the AI chooses to surface:

- **Images** — AI-generated or retrieved, born into Zone 2
- **Maps** — Location search results as interactive geographic context
- **Diagrams** — Architecture, flows, concepts — designed artifacts, not screenshots
- **Notes** — On-the-fly dictation, expanding from shelf to full Zone 2 notepad
- **Videos** — Inline, muted by default, voice-pauseable
- **Web cards** — Article previews with AI-readable summaries
- **Code** — Syntax-highlighted, with streaming typewriter entry

---

## Repository Structure

```
.
├── continuity-agent-C-v2-bioluminescent.html   # ← The canvas. The thing.
│
├── continuity-agent-A-late-evening.html        # Theme A: warm amber (v1 prototype)
├── continuity-agent-C-bioluminescent.html      # Theme C: bioluminescent (v1 prototype)
├── continuity-agent-D-warm-film.html           # Theme D: warm film (v1 prototype)
│
├── Continuity-Agent-UI-Prompt.md               # The generative design prompt
├── conversational-canvas-architecture.md       # Full system architecture spec
├── Prompt-prompt.md                            # Meta-prompt for generating UI prompts
│
├── docs/plans/
│   ├── 2026-02-25-continuity-agent-design.md           # v1 design decisions
│   ├── 2026-02-25-continuity-agent-implementation.md   # v1 build plan
│   ├── 2026-02-25-continuity-agent-v2-design.md        # v2 design decisions
│   └── 2026-02-25-continuity-agent-v2-implementation.md # v2 build plan
│
└── .claude/
    └── launch.json     # Preview server configs (ports 8081–8083)
```

---

## Design Philosophy

*"You are not building a UI. You are building a feeling."*

The test of this interface is not whether it works. It is whether someone watching it wants to lean closer. Whether they reach for the microphone. Whether they feel, even for a moment, that there is something on the other side of the screen that genuinely wants to help them — and is quietly pleased to be doing so.

Every animation decision, every color choice, every timing curve exists in service of that feeling. The blur-to-clarity birth isn't a transition — it's the moment of arrival. The ambient float isn't an idle animation — it's the proof that something is alive. The empty default state isn't emptiness — it's readiness.

---

## Commit History (This Session's Arc)

The v2 canvas was built across multiple sessions with an iterative, conversation-driven development process. Key milestones:

```
1ab6dcd  chore: gitignore, launch config, v2 implementation plan
803abb0  fix: scenario3 shelf card .live class (invisible "Take note" card)
2ff86ae  fix: RAF shim rewrite — the root cause of all frozen animations
a882d9d  fix: shelf card text visibility — clearProps + opacity + text-dim
d98cf2b  fix: clearAll() NodeList.map() TypeError blocking all scenarios
458672e  feat: trigger bar to top, shelf to bottom, directional card animations
7c6fc23  fix: preserve persistent notepad shelf card across clearAll()
5392148  feat: cranberry/teal palette + luminous frost at brightness(1.44)
a92cdb8  fix: +10% brightness pass on all gradient states
0bd1812  fix: +15% brightness, −25% saturation on all gradient states
e015172  fix: +20% brightness pass
...      (gradient refinement, layout restructuring, animation polish)
f35308d  fix: initial RAF shim for headless preview environments
```

---

*Built with obsessive care. Zero regrets about the corgi.*
