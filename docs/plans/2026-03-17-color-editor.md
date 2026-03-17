# Color Editor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a centered two-swatch color editor below the state pills that lets the user live-edit each state's two gradient blob colors and opacities, with auto-save to localStorage.

**Architecture:** A `#color-editor` fixed div sits below `#state-bar`. A `ColorEditor` IIFE module in `bioluminescent.js` owns all logic: syncing pickers to the active state, live-applying color changes directly to CSS vars, and persisting overrides to localStorage. No new dependencies.

**Tech Stack:** Vanilla JS, native `input[type="color"]` + `input[type="range"]`, localStorage, existing GSAP + CSS var infrastructure.

---

### Task 1: Add HTML structure

**Files:**
- Modify: `continuity-agent-C-v2-bioluminescent.html` (after `#state-bar` div, ~line 80)

**Step 1: Add the color editor div**

Insert this block immediately after the closing `</div>` of `#state-bar`:

```html
<!-- COLOR EDITOR — live palette tuning for active state -->
<div id="color-editor">
  <div class="ce-group">
    <input type="color" id="picker-g1" title="Primary color" />
    <input type="range" id="alpha-g1" class="alpha-slider" min="0" max="100" step="1" value="78" />
    <span class="ce-pct" id="pct-g1">78%</span>
    <span class="ce-val" id="val-g1">rgba(71,35,45,0.78)</span>
  </div>
  <span class="ce-sep">·</span>
  <div class="ce-group">
    <input type="color" id="picker-g2" title="Secondary color" />
    <input type="range" id="alpha-g2" class="alpha-slider" min="0" max="100" step="1" value="80" />
    <span class="ce-pct" id="pct-g2">80%</span>
    <span class="ce-val" id="val-g2">rgba(18,71,73,0.80)</span>
  </div>
</div>
```

**Step 2: Verify**

Open `http://localhost:8082/continuity-agent-C-v2-bioluminescent.html` — the raw unstyled inputs should appear somewhere on the page (ugly but present).

**Step 3: Commit**

```bash
git add continuity-agent-C-v2-bioluminescent.html
git commit -m "feat(color-editor): add HTML structure"
```

---

### Task 2: Add CSS styles

**Files:**
- Modify: `css/bioluminescent.css` (append to end of file)

**Step 1: Append these styles**

```css
/* ── COLOR EDITOR ─────────────────────────────────────────────── */
#color-editor {
  position: fixed;
  top: 106px;                   /* 68px trigger-bar + ~36px state-bar + 2px gap */
  left: 50%;
  transform: translateX(-50%);
  z-index: 198;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.3rem 1rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 2rem;
}

.ce-group {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

/* Native color swatch — styled as a small rounded square */
#color-editor input[type="color"] {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 4px;
  padding: 0;
  cursor: pointer;
  background: none;
  flex-shrink: 0;
}
#color-editor input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; border-radius: 3px; }
#color-editor input[type="color"]::-webkit-color-swatch        { border: none; border-radius: 3px; }

/* Opacity slider */
.alpha-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 52px;
  height: 2px;
  border-radius: 1px;
  background: rgba(255,255,255,0.18);
  outline: none;
  cursor: pointer;
  flex-shrink: 0;
}
.alpha-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--text-dim);
  cursor: pointer;
}

/* Percentage label */
.ce-pct {
  font-size: 0.55rem;
  color: var(--text-dim);
  font-family: var(--font);
  min-width: 2.4ch;
  text-align: right;
}

/* Full rgba value — selectable for copy-paste to Claude */
.ce-val {
  font-size: 0.5rem;
  color: var(--text-dim);
  font-family: 'SF Mono', 'Fira Code', monospace;
  opacity: 0.55;
  white-space: nowrap;
  user-select: all;           /* single click selects whole value */
  cursor: text;
}

.ce-sep {
  color: var(--text-dim);
  opacity: 0.3;
  font-size: 0.75rem;
  flex-shrink: 0;
}
```

**Step 2: Verify**

Reload the page. The color editor should appear as a compact pill centered below the state bar. The color squares show their colors, the sliders are thin, the rgba text is small and dimmed.

**Step 3: Commit**

```bash
git add css/bioluminescent.css
git commit -m "feat(color-editor): add CSS styles"
```

---

### Task 3: Add ColorEditor JS module

**Files:**
- Modify: `js/bioluminescent.js` (append before the final `gsap.set('#idle-mark', ...)` line)

**Step 1: Append the ColorEditor IIFE**

Add this block just before the `// ── INITIAL STATE` comment at the bottom of `bioluminescent.js`:

```js
// ── COLOR EDITOR ──────────────────────────────────────────────────
const ColorEditor = (() => {
  const STORAGE_KEY = 'continuity-palette-overrides';

  // ── Persist / restore ────────────────────────────────────────
  function loadOverrides() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch { return {}; }
  }
  function saveOverrides(overrides) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  }

  // Apply any saved overrides into GRADIENT_PALETTES before first render
  function applyStoredOverrides() {
    const overrides = loadOverrides();
    for (const [state, vals] of Object.entries(overrides)) {
      if (GRADIENT_PALETTES[state]) {
        if (vals.g1) GRADIENT_PALETTES[state].g1 = vals.g1;
        if (vals.g2) GRADIENT_PALETTES[state].g2 = vals.g2;
      }
    }
  }

  // ── rgba ↔ hex+alpha helpers ─────────────────────────────────
  function parseRgba(rgba) {
    const m = rgba.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/);
    if (!m) return { hex: '#888888', alpha: 0.8 };
    const [, r, g, b, a] = m;
    const hex = '#' + [r, g, b].map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
    return { hex, alpha: a !== undefined ? parseFloat(a) : 1 };
  }

  function buildRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha.toFixed(2)})`;
  }

  // ── Sync UI to a named state ─────────────────────────────────
  function syncToState(stateName) {
    const p = GRADIENT_PALETTES[stateName];
    if (!p) return;

    const { hex: hex1, alpha: a1 } = parseRgba(p.g1);
    const { hex: hex2, alpha: a2 } = parseRgba(p.g2);

    document.getElementById('picker-g1').value = hex1;
    document.getElementById('alpha-g1').value  = Math.round(a1 * 100);
    document.getElementById('pct-g1').textContent = Math.round(a1 * 100) + '%';
    document.getElementById('val-g1').textContent = p.g1;

    document.getElementById('picker-g2').value = hex2;
    document.getElementById('alpha-g2').value  = Math.round(a2 * 100);
    document.getElementById('pct-g2').textContent = Math.round(a2 * 100) + '%';
    document.getElementById('val-g2').textContent = p.g2;
  }

  // ── Apply picker changes live ────────────────────────────────
  function applyChange(stateName) {
    const hex1 = document.getElementById('picker-g1').value;
    const a1   = parseInt(document.getElementById('alpha-g1').value) / 100;
    const hex2 = document.getElementById('picker-g2').value;
    const a2   = parseInt(document.getElementById('alpha-g2').value) / 100;

    const newG1 = buildRgba(hex1, a1);
    const newG2 = buildRgba(hex2, a2);

    // Mutate live palette so setState() picks up the new values
    GRADIENT_PALETTES[stateName].g1 = newG1;
    GRADIENT_PALETTES[stateName].g2 = newG2;

    // Instant CSS var update — no tween delay
    bgEl.style.setProperty('--g1', newG1);
    bgEl.style.setProperty('--g2', newG2);

    // Update percentage labels and rgba display
    document.getElementById('pct-g1').textContent = Math.round(a1 * 100) + '%';
    document.getElementById('val-g1').textContent = newG1;
    document.getElementById('pct-g2').textContent = Math.round(a2 * 100) + '%';
    document.getElementById('val-g2').textContent = newG2;

    // Persist
    const overrides = loadOverrides();
    overrides[stateName] = { g1: newG1, g2: newG2 };
    saveOverrides(overrides);
  }

  // ── Init ────────────────────────────────────────────────────
  function init() {
    applyStoredOverrides();

    // Wire all four controls to applyChange
    ['picker-g1', 'alpha-g1', 'picker-g2', 'alpha-g2'].forEach(id => {
      document.getElementById(id).addEventListener('input', () => {
        const active = document.querySelector('.state-btn.active');
        if (active) applyChange(active.dataset.state);
      });
    });

    // Sync pickers whenever a state pill is clicked
    document.querySelectorAll('.state-btn').forEach(btn => {
      btn.addEventListener('click', () => syncToState(btn.dataset.state));
    });

    // Prime with idle on load
    syncToState('idle');
  }

  return { init, syncToState };
})();

ColorEditor.init();
```

**Step 2: Verify in browser console**

Open DevTools console and run:
```js
ColorEditor.syncToState('thinking')
```
Expected: both swatches update to the thinking state's colors, % labels update, rgba text updates.

Then click the "speaking" state pill — swatches should snap to speaking's cranberry + cyan.

Then drag an opacity slider — gradient should update live, rgba text should update.

**Step 3: Verify localStorage persistence**

Change a color on the "idle" state, then hard-refresh the page (Cmd+Shift+R). The idle gradient should show your custom color, not the default.

**Step 4: Commit**

```bash
git add js/bioluminescent.js
git commit -m "feat(color-editor): add ColorEditor module with live editing and localStorage persistence"
```

---

### Task 4: Final wiring check + push

**Step 1: Full smoke test**

- [ ] Click each of the 7 state pills — swatches update each time
- [ ] Drag color picker — gradient background updates instantly
- [ ] Drag opacity slider — gradient updates, % label updates, rgba text updates
- [ ] Hard-refresh — customized state colors persist
- [ ] Click a `.ce-val` rgba text — entire value selects (for copy-paste)

**Step 2: Push**

```bash
git push origin master
```
