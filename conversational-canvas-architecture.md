# The Conversational Canvas: Architecture of the Whiteboard

**Vision:** A voice-first space where visuals breathe in and out, guided by conversation  
**Status:** Design Document — Implementation Roadmap  
**Date:** February 23, 2026

---

## 1. THE CORE RULES (The "Physics" of the Space)

### Rule 1: Voice is the Primary Interface
**Everything serves the conversation.** Visuals are seasoning, not the meal.

- User speaks → AI thinks → MAYBE shows something
- Never interrupt speech with visuals
- Visuals appear in the **pauses** between thoughts
- Default state: **Empty space** (not a blank canvas — *nothing*)

### Rule 2: Elements Have Lifecycles
**Birth → Life → Death (fade out)**

| Phase | Animation | Duration | Trigger |
|-------|-----------|----------|---------|
| **Birth** | Fade up from 0% opacity + subtle scale (0.95→1.0) | 300-500ms | AI decides to show |
| **Life** | Gentle ambient float (subtle, like breathing) | 2-30 seconds | While relevant |
| **Death** | Fade out + drift upward (like smoke) | 400-600ms | Topic changes OR user says "done"/"thanks"/"next" |

### Rule 3: The AI Controls the Space
**Two modes:**

**A. Active Decisions (Explicit)**
- AI says: "Let me show you" → element appears
- AI says: "Here's what I found" → element appears
- AI says: "I'll save this for later" → element fades but gets archived

**B. Automatic Management (Implicit)**
- New topic detected → old elements fade
- 5 seconds of silence → gentle pulse on current elements ("still here")
- 30 seconds of silence → elements fade to 20% opacity (ambient, not gone)
- User starts talking again → elements restore to 100%

### Rule 4: Content-Responsive Layout
**The space organizes itself based on what's being discussed.**

---

## 2. SCREEN REAL ESTATE ZONES

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    ZONE 1: TRANSCENDENT                     │
│              (Center, for moments that matter)              │
│                    *The "Her" loading zone*                 │
│          ┌───────────────────────────────┐                  │
│          │   ∞  (infinity animation)    │                  │
│          │   "Researching..."            │                  │
│          └───────────────────────────────┘                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    ZONE 2: CONVERSATION                     │
│         (Middle band, where the dialogue lives)             │
│                                                             │
│    ┌───────────────────────────────────────────────┐       │
│    │  User: "Show me a dog on a unicycle..."      │       │
│    └───────────────────────────────────────────────┘       │
│                            ↓                                │
│              ┌───────────────────────────┐                  │
│              │   [Image fades in]        │                  │
│              │   🐕 🚲 🎪                │                  │
│              │                           │                  │
│              └───────────────────────────┘                  │
│                            ↓                                │
│    ┌───────────────────────────────────────────────┐       │
│    │  AI: "Here's a corgi at the circus..."       │       │
│    └───────────────────────────────────────────────┘       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    ZONE 3: EPHEMERAL                        │
│            (Bottom strip, for supporting info)              │
│                                                             │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                   │
│  │Note  │  │Link  │  │Map   │  │Image │                   │
│  └──────┘  └──────┘  └──────┘  └──────┘                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Zone 1: Transcendent (Center)
**For:** Loading states, big moments, breath-taking visuals
**Behavior:** 
- Appears only for "moments"
- Infinity symbol animation while AI thinks
- Full-bleed images when something is *important*
- Fades completely when moment passes

### Zone 2: Conversation (Middle)
**For:** Main content, images, videos, responses to queries
**Behavior:**
- Content appears here by default
- Centered, prominent, but not overwhelming
- Scales based on content type:
  - Small: Icons, emojis, tiny notes
  - Medium: Images, maps, cards (default)
  - Large: Full diagrams, videos (when requested)

### Zone 3: Ephemeral (Bottom Strip)
**For:** Supporting elements, quick references, saved items
**Behavior:**
- Horizontal scroll if needed
- Small cards/thumbnails
- Persistent but dimmed (30% opacity)
- Click/tap to bring to Zone 2
- Auto-archive if not touched in 2 minutes

---

## 3. CONTENT TYPE RULES

### Images (Dog on Unicycle)

**Birth:**
1. AI generates/retrieves image
2. User sees: "Creating image..." (Zone 1, infinity symbol)
3. Image fades up in Zone 2 (center)
4. Caption fades in below: "A corgi at the circus"

**Life:**
- Image floats gently (subtle parallax with mouse movement)
- Caption stays for 3 seconds, then fades to 50%
- User can click to enlarge (fills Zone 1 momentarily)

**Death:**
- User says "next", "done", "thanks", or starts new topic
- Image drifts upward + fades out
- OR: Image shrinks and moves to Zone 3 (bottom strip) as "saved"

### Maps (Portland Glasses Repair)

**Birth:**
1. AI searches: "glasses repair North Portland"
2. Zone 1: "Searching Portland..."
3. Map fades up in Zone 2 (center, 60% of screen)
4. 3 pins appear with staggered animation (pin 1, 200ms, pin 2, 200ms, pin 3)

**Life:**
- Map is interactive (pan, zoom)
- Pins pulse gently (breathing effect)
- List of locations appears in Zone 3 (bottom strip)
- AI narrates: "Here are three options..."

**Death:**
- User says "let's go with option 2" or "navigate me there"
- Selected pin stays, others fade
- Map zooms to selected location
- Navigation UI takes over (if requested)
- OR: Everything fades, conversation continues

### Notes (On-the-fly Notepad)

**Birth:**
1. User says: "Wait, let me write that down"
2. Small notepad icon appears in Zone 3
3. User clicks icon OR says "create note"
4. Notepad expands from Zone 3 → Zone 2

**Life:**
- Minimalist text input
- Auto-saves every 5 seconds
- Can drag to reposition within Zone 2
- "Pin" button to keep it visible (otherwise fades after 1 minute)

**Death:**
- User says "save this" → note shrinks to Zone 3, saved to backend
- User says "I'm done" → note fades, auto-saved
- 2 minutes of silence → note fades to Zone 3 (ambient)

### Videos

**Birth:**
1. Zone 1: "Loading video..."
2. Video appears in Zone 2, muted, paused
3. Play button pulses gently (invitation)

**Life:**
- User clicks play OR says "play the video"
- Video expands to 80% of screen (overlaps zones)
- Subtitles appear at bottom if available
- Controls fade in on mouse movement

**Death:**
- Video ends → shrinks back to Zone 2 thumbnail
- User says "close" or clicks X → fades out
- Auto-pause if user starts talking (voice takes priority)

### iFrames (Websites, Articles)

**Birth:**
1. Zone 1: "Loading page..."
2. Website preview/card appears in Zone 2
3. NOT full iframe initially (security + performance)
4. "Open" button to expand to full iframe

**Life:**
- Card shows: favicon, title, description, thumbnail
- Click to expand to full browser-like view
- Can scroll, click links (opens in new "card")
- "Summarize" button (AI reads and gives TL;DR)

**Death:**
- "Close" or new topic → card fades
- Auto-bookmark to "today's research" in backend

---

## 4. ANIMATION SPECIFICATIONS

### The "Her" Loading State (Zone 1)

```css
/* Infinity Symbol Animation */
.infinity-loader {
  animation: pulse-breathe 3s ease-in-out infinite;
}

@keyframes pulse-breathe {
  0%, 100% { 
    opacity: 0.4; 
    transform: scale(0.95); 
  }
  50% { 
    opacity: 1; 
    transform: scale(1.05); 
  }
}

/* Color: Warm white on deep red background */
background: linear-gradient(135deg, #1a0000 0%, #4a0000 100%);
color: #fff5f5;
```

### Element Entry (Birth)

```css
.element-birth {
  animation: fade-up-scale 400ms cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fade-up-scale {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

### Ambient Float (Life)

```css
.element-float {
  animation: gentle-float 6s ease-in-out infinite;
}

@keyframes gentle-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
```

### Element Exit (Death)

```css
.element-death {
  animation: fade-up-out 500ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes fade-up-out {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-30px);
  }
}
```

### Progress/Thinking Indicators

**Dots (while AI thinks):**
```css
.thinking-dots span {
  animation: dot-pulse 1.4s ease-in-out infinite;
}
.thinking-dots span:nth-child(2) { animation-delay: 0.2s; }
.thinking-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes dot-pulse {
  0%, 100% { opacity: 0.2; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}
```

**Progress Bar (long-running tasks):**
- Thin line at top of screen
- Gradient: left (transparent) → right (white glow)
- Pulsing at the leading edge
- Disappears when complete

---

## 5. AI DECISION LOGIC (When to Show What)

### Trigger Matrix

| User Says | AI Action | Visual Response | Zone |
|-----------|-----------|-----------------|------|
| "Show me..." | Generate/retrieve | Image/video fades in | Zone 2 |
| "Where is..." | Search location | Map appears | Zone 2 |
| "Wait, let me write..." | Create note | Notepad expands | Zone 2 → 3 |
| "Tell me about..." | Research | "Searching..." (Zone 1), then article card | Zone 2 |
| "Create an image of..." | Generate AI image | Loading (Zone 1), then image | Zone 2 |
| "Save that" | Archive current | Element shrinks to Zone 3 | Zone 3 |
| "I'm done" / "Thanks" / "Next" | Clear space | All elements fade up-out | None |
| [Silence 5s] | Maintain | Elements pulse gently | Current zones |
| [Silence 30s] | Ambient mode | Elements dim to 20% | Current zones |
| [New topic detected] | Transition | Old fades, new appears | Zone swap |

### Topic Detection (Automatic Clear)

**How AI knows topic changed:**
1. **Explicit:** User says "okay but what about..." or "moving on..."
2. **Implicit:** 5+ new keywords not in previous 2 minutes
3. **Temporal:** 2+ minutes of silence, then new subject
4. **Semantic:** Vector similarity between current and previous < 0.6

**Result:** Current elements fade to Zone 3 (saved) or fade out (discarded based on importance)

---

## 6. BACKEND ORGANIZATION (The Archive)

### Saved Elements Structure

```json
{
  "session_id": "uuid",
  "timestamp": "2026-02-23T22:00:00Z",
  "conversation_thread": "glasses_repair_portland",
  "elements": [
    {
      "id": "elem_001",
      "type": "image",
      "content": "base64_or_url",
      "prompt": "corgi riding unicycle at circus",
      "zone_history": ["Zone 1 (loading)", "Zone 2 (displayed)"],
      "display_duration": 45,
      "saved_by": "user_explicit",
      "final_location": "Zone 3 → Archive"
    },
    {
      "id": "elem_002",
      "type": "map",
      "location": "North Portland, OR",
      "query": "glasses repair",
      "pins": [...],
      "selected_result": "Pearl Vision",
      "zone_history": ["Zone 2"],
      "saved_by": "topic_end",
      "final_location": "Archive ( today's research )"
    }
  ],
  "transcript_summary": "User asked about glasses repair...",
  "outcome": "Selected Pearl Vision, directions saved"
}
```

### Auto-Categorization

**Rules for saving:**
1. **Explicit save** ("save this") → Archive immediately
2. **Selection made** ("let's go with option 2") → Archive result
3. **Topic ends naturally** → Archive all elements (low priority)
4. **Dismissed** ("close", "done") → Discard unless explicit save

**Categories:**
- `today's_vision` (images, concepts)
- `today's_research` (articles, maps, queries)
- `today's_notes` (notepad content)
- `today's_actions` (selected options, decisions made)

---

## 7. VOICE PRIORITY SYSTEM

**The Golden Rule:** Voice always wins.

### Interrupt Behavior

| State | User Starts Talking | Result |
|-------|---------------------|--------|
| Image displayed | User speaks | Image dims to 30%, remains visible |
| Video playing | User speaks | Video pauses, remains visible |
| Animation running | User speaks | Animation completes, then listens |
| Loading state | User speaks | Loading continues (background), listens |

### Resume Behavior

| State | AI Finishes Response | Result |
|-------|---------------------|--------|
| Dimmed image | AI done talking | Image restores to 100% |
| Paused video | AI done talking | Video remains paused (user must resume) |
| Completed animation | — | Next element appears or space clears |

---

## 8. SPECIFIC EXAMPLES (End-to-End)

### Example 1: Dog on Unicycle

**Conversation:**
```
User: "Show me a corgi riding a unicycle at the circus"
AI: "Creating that for you..."
[Zone 1: Infinity symbol pulses, "Imagining..."]
[3 seconds pass]
[Zone 1 fades]
[Zone 2: Image fades up — corgi, unicycle, circus tent]
AI: "Here's a corgi who joined the circus. The training took 3 months."
User: "Haha, that's perfect. Can you make it wearing a top hat?"
AI: "Updating the image..."
[Zone 2: Current image fades up-out]
[Zone 1: Infinity symbol]
[3 seconds]
[Zone 2: New image fades up — corgi WITH top hat]
User: "Awesome. Save that one."
AI: "Saved!"
[Image shrinks, moves to Zone 3]
User: "Okay, back to work."
[Zone 3 image fades to 10% ambient]
[New topic begins, image eventually archives to "today's_vision"]
```

### Example 2: Portland Glasses Repair

**Conversation:**
```
User: "Where can I get my glasses fixed in North Portland?"
AI: "Searching North Portland opticians..."
[Zone 1: "Searching Portland..." + map outline appears]
[2 seconds]
[Zone 1 fades, Zone 2: Map of N. Portland with 3 pins]
AI: "Here are three options near you."
[Zone 3: Cards appear — Pearl Vision, LensCrafters,独立眼镜店]
User: "What's the rating on the first one?"
AI: "Pearl Vision has 4.2 stars..."
[Zone 2: Map zooms to Pearl Vision pin]
[Zone 3: Pearl Vision card expands with reviews]
User: "And how do I get there?"
AI: "Starting navigation..."
[Zone 2: Map switches to navigation mode]
[Zone 3: Directions list appears]
User: "Actually, save this for later."
AI: "Saved to today's errands."
[Map shrinks to Zone 3]
[Conversation continues on new topic]
[After 5 minutes, map archives to "today's_research"]
```

### Example 3: Quick Note During Research

**Conversation:**
```
User: "Tell me about transformer architectures"
AI: "Transformer architectures, introduced in 2017..."
[Zone 2: Diagram fades up — transformer architecture]
User: "Wait, let me write that down"
AI: "Opening notepad..."
[Zone 3: Notepad icon appears]
[User clicks icon OR says "create note"]
[Zone 3 → Zone 2: Notepad expands]
User: [types or dictates note]
AI: [waits silently]
User: "Okay, done"
AI: "Note saved. Continuing..."
[Zone 2: Notepad shrinks back to Zone 3]
[Diagram restores prominence in Zone 2]
```

---

## 9. TECHNICAL IMPLEMENTATION NOTES

### Frontend Stack
- **React** (component-based, perfect for element lifecycle)
- **Framer Motion** (React animation library — handles fade, scale, gestures)
- **Tailwind CSS** (utility-first, easy animation classes)
- **Zustand** (simple state management for zones/elements)

### Backend API Endpoints
```
POST /api/canvas/element        # Create new element
PUT  /api/canvas/element/:id    # Update element (move zones, etc.)
DELETE /api/canvas/element/:id  # Remove element
POST /api/canvas/session/end    # Archive session
GET  /api/canvas/archive        # Retrieve past sessions
```

### WebSocket Events
```javascript
// Server → Client
element:created    { id, type, content, zone, animation }
element:updated    { id, zone, position }
element:removed    { id, animation }
session:archived   { session_id, elements }

// Client → Server
element:interacted { id, action: 'click'|'drag'|'save' }
element:dismissed  { id }
user:spoke         { timestamp }
```

---

## 10. DECISIONS MADE (Summary)

| Decision | Choice |
|----------|--------|
| Primary interface | Voice (visuals secondary) |
| Default state | Empty space |
| Element entry | Fade up + scale |
| Element exit | Fade up-out (drift upward) |
| Layout | 3 zones (Transcendent, Conversation, Ephemeral) |
| AI control | Mixed (explicit triggers + implicit topic detection) |
| Animation style | Soft, organic, breathing |
| Loading state | "Her" style infinity symbol |
| Archive behavior | Auto-save important, discard ephemeral |
| Voice priority | Always wins — dims visuals, never removes |

---

## 11. NEXT STEPS

### Phase 1: Foundation (Week 1)
- [ ] Create React app with 3-zone layout
- [ ] Implement fade animations (Framer Motion)
- [ ] Connect to LilyOS voice pipeline
- [ ] Test with simple images

### Phase 2: Content Types (Week 2)
- [ ] Add map support
- [ ] Add notepad widget
- [ ] Add video player
- [ ] Add iframe cards

### Phase 3: Intelligence (Week 3)
- [ ] Implement topic detection
- [ ] Add AI decision logic (when to show what)
- [ ] Create archive backend
- [ ] Build retrieval system

### Phase 4: Polish (Week 4)
- [ ] Refine animations
- [ ] Add sound design (subtle UI sounds)
- [ ] Test all conversation flows
- [ ] Optimize performance

---

**Status:** Architecture complete. Ready to build the canvas.

**First milestone:** Empty React app with 3 zones + fade animations.
