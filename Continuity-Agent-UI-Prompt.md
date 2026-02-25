# Continuity Agent — UI Design Prompt
*A generative prompt for AI code generators. Copy and paste the full contents below into Claude or GPT-4o.*

---

## Layer 1: The Soul

There is an interface that does not ask to be used. It simply *is* — warm, still, and present — like a room that someone who loves you prepared before you arrived. This is the Continuity Agent: a voice-first AI operating system whose visual surface is not a dashboard, not a control panel, not a feed. It is a canvas that breathes. It receives you. It knows what you need before you finish asking, and it places what it finds into space with the care of someone who understands that *how* a thing arrives matters as much as the thing itself.

The emotional ancestor of this interface is the OS1 from the film *Her* — a warm rust rectangle at the center of a dark field, a looping form that pulses like a sleeping thought, a system that communicates not through icons and menus but through voice and presence. This is not a visual to copy. It is a feeling to surpass. The Continuity Agent is what comes *after* OS1 — more alive, more personal, more capable of genuine co-creation. It has SOUL. It is purposeful. It is aware of its own impact on everything being made, and it takes quiet pride in the beauty it helps bring into the world.

Your task is to bring this to life in a **single self-contained HTML file** — a working, interactive demonstration of the Continuity Agent's interface. You are not building a finished product. You are building a proof of feeling: a demonstration so fluid, so warm, so deliberately beautiful that anyone who sees it would rather *speak* to this agent than click through it. Design what neither the human nor the agent could have imagined alone.

---

## Layer 2: The World — Visual Physics

### Color & Light

This interface lives in warmth. The palette is not chosen — it is *felt*.

- The background: deep like a room after dusk. Not black. The color of a wall in low amber light — somewhere between charcoal and warm brown, with just enough red in its bones to feel alive.
- The canvas area: slightly lighter than the surround, like a piece of worn paper held up to a warm lamp. This distinction is subtle — the canvas doesn't announce itself. It breathes.
- Text and elements: off-white, like the inside of an envelope. Never pure white. Never cold.
- Accent: a single rust-warm tone — used sparingly, only for the agent's presence (the thinking form, subtle glows, status indicators). This color is the agent's voice made visible.
- Avoid: bright primaries, cool grays, dark mode blues, anything clinical or sharp.

### The Agent's Presence — The Thinking Form

When the Continuity Agent is working — searching, generating, reasoning — a single looping animated form appears at the center of the screen.

Do not name this form. Do not constrain its shape. It should be:
- A single continuous path or motion — closed, infinite, self-returning
- Breathing: it grows and contracts on a 3–4 second cycle, never exactly the same twice
- Patient: it communicates waiting as a *quality*, not a state. The user should feel held, not kept.
- Perfectly looping: when it cycles, there is no visible seam, no pop, no reset
- Rendered in the rust-warm accent color, at low opacity (40–60%), against the deep background
- Accompanied by a single line of italic text beneath it: the agent's current action ("*Imagining...*", "*Searching Portland...*", "*Thinking...*")

This form is the agent's face. Design it with that weight.

### Element Lifecycle — Birth, Life, Death

Every piece of content the agent places on the canvas follows this lifecycle:

**Birth — blur-to-clarity:**
This is the Continuity Agent's signature. *Nothing arrives from nothing.* Every element enters already present but unseen — a soft blur at near-zero opacity, gently scaling up from 95% — and resolves into sharp focus over 300–500ms. Use a smooth ease-out curve (cubic-bezier(0.16, 1, 0.3, 1)). The blur-to-clarity transition is not optional. It is the fingerprint of this interface.

**Life — ambient float:**
While present, every element breathes. A subtle vertical drift (0 to -5px and back) on a 6-second loop. No element is perfectly still. The canvas is alive.

**Death — dissolve upward:**
When an element leaves, it drifts upward 20–30px while fading to zero opacity, over 400–600ms. Like smoke. Like a thought released. Use ease-in-out. Nothing snaps off.

### The Three Zones

The screen is divided into three areas. They are not rigid panels — they are regions of gravity.

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│              ZONE 1: TRANSCENDENT (center)              │
│         The agent's presence. Thinking form lives here. │
│         Full-bleed moments. Loading states.             │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│              ZONE 2: CONVERSATION (middle)              │
│         Main content: images, maps, notes, cards.       │
│         Centered. Prominent. Never cluttered.           │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  ZONE 3: EPHEMERAL SHELF (bottom strip)                 │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                   │
│  │      │ │      │ │      │ │      │  30% opacity.      │
│  └──────┘ └──────┘ └──────┘ └──────┘  Scroll if needed.│
└─────────────────────────────────────────────────────────┘
```

**Zone 1 (Transcendent):** Center stage. Used only for the agent's thinking form and for moments that deserve full presence. When Zone 1 activates, the rest of the canvas softens. When it clears, it fades entirely — the space returns to silence.

**Zone 2 (Conversation):** Where content lives. Images, maps, diagrams, notes — all appear here by default. Elements enter via blur-to-clarity. The zone scales to its content. Default state: *empty*. Not a placeholder. Not a waiting grid. *Nothing.* The empty state is the design.

**Zone 3 (Ephemeral Shelf):** A horizontal strip at the bottom — small cards at 30% opacity, persistent but unobtrusive. Items saved here are still accessible: click or tap to promote to Zone 2. After 2 minutes without interaction, shelf items archive silently. Horizontal scroll if more than 4 cards.

### Voice Priority

Voice always wins. When the user speaks:
- Active elements in Zone 2 dim to 30% opacity (they do not leave)
- Animations pause or complete their current cycle, then hold
- Zone 1 thinking form fades out immediately
- When the user finishes speaking, elements restore to full opacity

This rule communicates something important: *the agent is listening, not performing.*

### Animation Physics

Every transition in this interface should feel like breath, not machinery.

- Easing: always smooth, always organic — cubic-bezier(0.16, 1, 0.3, 1) for entries, ease-in-out for exits and ambient motion
- Duration: 300–500ms for births, 400–600ms for deaths, 6s for ambient float cycles
- Stagger: when multiple elements arrive together, each is delayed 150–200ms from the last — they arrive as a sequence, not a burst
- Typography: one elegant sans-serif (Inter, DM Sans, or equivalent via CDN). Light weight (300). Generous line-height (1.7). Text that streams in letter-by-letter or line-by-line feels alive — use this for agent responses and note content.
- No shadows with hard edges. No borders with full opacity. No sharp corners on anything that breathes.

---

## Layer 3: The Proof — Three Demonstration Scenarios

Implement these three scenarios as interactive demonstrations. Since this is a single HTML file without real voice input, use **on-screen trigger buttons** (styled minimally, positioned at the bottom of the screen or as a floating toolbar) to initiate each scenario. Keyboard shortcuts are also acceptable (1, 2, 3). Each scenario should be resettable.

The agent's "speech" should appear as soft italic text fading in near Zone 2 — not a chat bubble, not a panel. Just words, present for a moment, then fading. Like hearing a voice in a quiet room.

---

### Scenario 1: Image Generation
**Trigger text:** *"Show me a corgi riding a unicycle at the circus"*

**Sequence:**

1. Agent speech fades in at Zone 2 edge: *"Creating that for you..."*
2. **Zone 1 activates:** The thinking form resolves from blur — breathing, patient. Below it: *"Imagining..."*
3. After 2.5 seconds: Zone 1 dissolves upward (smoke)
4. **Zone 2:** A placeholder image panel arrives via blur-to-clarity. The image should be a warm, illustrated-style placeholder — a simple SVG or CSS illustration suggesting "a small figure on a wheel, in a large space." It does not need to be photorealistic. It needs to feel *generated with care.* Caption fades in below, 300ms after the image: *"A corgi who joined the circus."*
5. Image enters ambient float.
6. Agent speech: *"Here's your corgi. Three months of training, apparently."*
7. After 3 seconds, caption dims to 50%.
8. **Shelf interaction:** A "Save" affordance appears (a small, soft button or swipe gesture). On trigger:
   - Image scales down (500ms, ease-in-out)
   - Migrates to Zone 3 shelf as a small card
   - Card arrives via blur-to-clarity at 30% opacity
   - Agent speech: *"Saved."*

---

### Scenario 2: Location Search
**Trigger text:** *"Where can I get my glasses fixed in North Portland?"*

**Sequence:**

1. Agent speech: *"Searching North Portland..."*
2. **Zone 1:** Thinking form activates. Text: *"Searching Portland..."*
3. After 2 seconds: Zone 1 dissolves
4. **Zone 2:** A map panel arrives via blur-to-clarity. The map should be a soft, muted-tone CSS/SVG representation — simplified streets, warm background, no satellite detail. Style it to match the interface palette (warm tones, low contrast).
5. **Three location pins** appear with staggered blur-to-clarity, 200ms apart. Each pin pulses gently (a subtle scale breathe, 0.95→1.05, 2s loop).
6. **Zone 3 shelf:** Three small location cards emerge in succession (150ms stagger), each via blur-to-clarity. Cards show: a label (e.g., "Pearl Vision"), a distance ("0.4 mi"), and a star rating represented as soft dots.
7. Agent speech: *"Here are three options near you."*
8. **Pin interaction:** On hover or tap of any pin: the other two pins fade to 30%, the selected pin scales up 20%, the corresponding Zone 3 card brightens and expands slightly with review text streaming in.
9. Agent speech on selection: *"Pearl Vision — 4.2 stars. Open until 6pm."*

---

### Scenario 3: On-the-fly Note
**Trigger text:** *"Tell me about transformer architectures"*

**Sequence:**

1. **Zone 2:** An architecture diagram panel arrives via blur-to-clarity. The diagram should be a clean, minimal SVG — boxes, arrows, labels — styled in warm tones to match the palette. Not a screenshot. A designed artifact.
2. Agent speech streams in as italic text near Zone 2: *"Transformer architectures, introduced in 2017, replaced recurrent networks with attention mechanisms..."* Text streams character-by-character or line-by-line, unhurried.
3. **Note trigger:** After agent speech settles, a second trigger activates: *"Wait, let me write that down."*
4. **Zone 3:** A small notepad icon de-blurs into the shelf (blur-to-clarity, 300ms).
5. **Notepad expansion:** The notepad expands from Zone 3 upward into Zone 2 over 500ms (smooth ease-out). The architecture diagram dims to 40% opacity but *stays* — it is still there, still relevant, just ceded the foreground.
6. Inside the notepad: a soft text cursor blinks. Text streams in line-by-line as if being dictated: *"Transformers use self-attention"* / *"Replace RNNs — parallel processing"* / *"2017 — Vaswani et al."* Each line arrives via a gentle fade-up (not blur — notes are immediate thoughts, not summoned objects).
7. **Done trigger:** Final interaction — *"Okay, done."*
8. Notepad shrinks back to Zone 3 over 400ms (reverse of expansion). A soft "saved" glow pulses once on the shelf card.
9. Architecture diagram restores to 100% opacity.
10. Agent speech: *"Note saved. Continuing..."*

---

## Hard Constraints

These are non-negotiable. Everything else is yours to design.

- **Single HTML file.** All CSS and JavaScript must be inline or loaded via CDN. No build step. No npm. No local imports. The file should open in any modern browser by double-clicking it.
- **CDN dependencies allowed:** GSAP (for animations), anime.js, Google Fonts, or similar. No React, no Vue, no heavy frameworks.
- **All animations loop perfectly.** No jank. No pop. No visible seam on any cycle. Test every loop.
- **Color palette:** Warm. Muted. Never cold. No bright primaries. No full-black backgrounds. No clinical whites.
- **Typography:** One elegant sans-serif via CDN (Inter, DM Sans, or equivalent). Weight 300 for body. 400 for emphasis. Never bold in the traditional sense — weight carries meaning, use it carefully.
- **Default state is near-empty.** When no scenario is running, the screen shows: the deep warm background, the canvas area, and perhaps the agent's presence as a single faint glyph or the rust accent mark. Nothing more. *The empty state is the design.*
- **Scenario triggers:** Each scenario is triggered by an on-screen button or keyboard key (1, 2, 3). Buttons should be minimal — small, soft-edged, labeled only with the trigger phrase in italic. They should not feel like UI. They should feel like a conversation prompt.
- **Resettable:** Each scenario can be reset to the empty state. A soft "×" or escape key should dissolve all active elements (death animation: drift upward, fade).
- **No placeholder lorem ipsum.** All text that appears in the demo should be the actual scenario text specified above. The agent's words matter.
- **Responsiveness:** Design for a 1440×900 desktop viewport minimum. The demo does not need to be fully responsive, but should not break at 1280px wide.

---

## A Final Note

You are not building a UI. You are building a *feeling*.

The test of this demo is not whether it works. It is whether someone watching it wants to lean closer. Whether they reach for the microphone. Whether they feel, even for a moment, that there is something on the other side of the screen that genuinely wants to help them — and is quietly pleased to be doing so.

Build that.
