# Color Editor — Design Doc
**Date:** 2026-03-17
**Status:** Approved

## Problem
Tuning the per-state gradient colors requires either editing raw rgba values in JS, or using the browser DevTools while paused. Neither is fast for visual iteration.

## Solution
A compact inline color editor, centered below the state pills. Always visible. Two swatches — one per gradient blob — that sync to whichever state pill is active.

## Layout

```
[ ■ rgba(71,35,45,0.78) ──▌── 78% ]  ·  [ ■ rgba(18,71,73,0.80) ──▌── 80% ]
```

- `■` — `input[type="color"]`, 18px rounded square, opens native browser picker on click
- `rgba(...)` — small monospace text, fully selectable for copy-paste
- `──▌──` — `input[type="range"]` opacity slider, 0–100%
- `%` — live percentage label, updates as slider moves
- `·` — visual separator between Primary and Secondary

## Behavior

1. Click any state pill → both swatches snap to that state's `g1` / `g2` colors + alphas
2. Adjust color or opacity → gradient updates instantly (duration: 0, no tween delay)
3. Auto-saves to `localStorage` key `continuity-palette-overrides` as `{ [state]: { g1, g2 } }`
4. On page load, saved overrides are merged into `GRADIENT_PALETTES` before first render

## Files

| File | Change |
|------|--------|
| `continuity-agent-C-v2-bioluminescent.html` | Add `#color-editor` div after `#state-bar` |
| `css/bioluminescent.css` | Color editor styles (~50 lines) |
| `js/bioluminescent.js` | `ColorEditor` IIFE module (~90 lines) + load overrides on startup |

## Constraints
- No new dependencies
- Must not shift existing layout (positioned fixed, z-index 198)
- Alpha preserved when only color changes; color preserved when only alpha changes
- rgba display always reflects the live value (updates on every picker/slider event)
