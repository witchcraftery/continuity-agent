// ═══════════════════════════════════════════════════════════════════
// bioluminescent.js — Continuity Agent v2 — Theme C
// ═══════════════════════════════════════════════════════════════════

// ── GSAP BACKGROUND-TAB KEEPALIVE ────────────────────────────────
// GSAP 3 pauses its ticker when document.hidden = true. This keeps
// animations running in preview environments and when tabs are backgrounded.
setInterval(() => { if (document.hidden) gsap.ticker.tick(); }, 16);

// ── ORB CANVAS SETUP ─────────────────────────────────────────────
const orbCanvas = document.getElementById('orb-canvas');
const orbCtx    = orbCanvas.getContext('2d');

function resizeOrbCanvas() {
  orbCanvas.width  = window.innerWidth;
  orbCanvas.height = window.innerHeight;
}
resizeOrbCanvas();
window.addEventListener('resize', resizeOrbCanvas);

// ── ORB STATE ─────────────────────────────────────────────────────
const orbState = {
  energy:      0,    // 0–1, drives glow and motion speed
  approaching: 0,    // 0–1, drives scale and blur
};

// ── BACKGROUND PAUSE STATE ────────────────────────────────────────
let bgPaused        = false; // master pause flag for all background animation
let orbLoopLive     = true;  // false when drawOrb self-terminates due to pause
let lissLoopLive    = true;  // false when drawLissajous self-terminates
let ambientPulseLive = true; // false when ambientPulse self-terminates
let pausedAt        = 0;     // timestamp (ms) when we froze, for orb resume offset
let orbTimeOffset   = 0;     // cumulative ms subtracted from RAF timestamp so orb resumes without jumping

function drawOrb(timestamp) {
  const W = orbCanvas.width;
  const H = orbCanvas.height;
  orbCtx.clearRect(0, 0, W, H);

  const t   = (timestamp - orbTimeOffset) / 1000;
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

  // ── OUTER SHELL (corona / eclipse rim) ───────────────────────
  const glowAlpha = 0.04 + orbState.energy * 0.10;
  const shellGrad = orbCtx.createRadialGradient(ox, oy, baseR * 0.7, ox, oy, baseR * 1.1);
  shellGrad.addColorStop(0,   `rgba(200,205,210,0)`);
  shellGrad.addColorStop(0.6, `rgba(200,205,210,${glowAlpha * 0.5})`);
  shellGrad.addColorStop(1,   `rgba(200,205,210,${glowAlpha})`);
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
  ringGrad.addColorStop(0,   `rgba(200,205,210,${ringAlpha})`);
  ringGrad.addColorStop(1,   'rgba(200,205,210,0)');
  orbCtx.beginPath();
  orbCtx.arc(ox, oy, baseR * 1.05, 0, Math.PI * 2);
  orbCtx.fillStyle = ringGrad;
  orbCtx.fill();

  if (!bgPaused) { requestAnimationFrame(drawOrb); }
  else           { orbLoopLive = false; pausedAt = timestamp; }
}

requestAnimationFrame(drawOrb);

// ── GRADIENT STATE MACHINE ────────────────────────────────────────
const GRADIENT_PALETTES = {
  idle: {
    g1: 'rgba(71,35,45,0.78)',  g1x: '30%', g1y: '40%',  // cranberry base
    g2: 'rgba(18,71,73,0.80)',  g2x: '75%', g2y: '65%',  // teal base
    frost: '32px'
  },
  listening: {
    g1: 'rgba(174,255,232,0.85)', g1x: '35%', g1y: '45%',  // mint/seafoam eclipse rim
    g2: 'rgba(190,175,135,0.80)', g2x: '70%', g2y: '60%',  // sandy backlit warmth
    frost: '36px'
  },
  thinking: {
    g1: 'rgba(58,34,68,0.82)',  g1x: '25%', g1y: '35%',  // cranberry → mauve/plum (cool shift)
    g2: 'rgba(16,80,88,0.82)',  g2x: '80%', g2y: '70%',  // teal → deeper cool
    frost: '38px'
  },
  searching: {
    g1: 'rgba(88,42,55,0.80)',  g1x: '40%', g1y: '38%',  // cranberry bright
    g2: 'rgba(24,90,92,0.80)',  g2x: '68%', g2y: '62%',  // teal bright
    frost: '34px'
  },
  building: {
    g1: 'rgba(84,40,52,0.78)',  g1x: '32%', g1y: '42%',  // cranberry medium
    g2: 'rgba(22,80,82,0.76)',  g2x: '72%', g2y: '58%',  // teal medium
    frost: '34px'
  },
  speaking: {
    g1: 'rgba(115,48,58,0.72)', g1x: '38%', g1y: '42%',  // vivid warm cranberry
    g2: 'rgba(18,78,96,0.64)',  g2x: '72%', g2y: '62%',  // teal → warmer cyan
    frost: '24px'
  },
  excited: {
    g1: 'rgba(140,55,68,0.65)', g1x: '42%', g1y: '44%',  // peak vivid cranberry
    g2: 'rgba(22,98,105,0.58)', g2x: '68%', g2y: '58%',  // peak vivid teal
    frost: '20px'
  }
};

const bgEl    = document.getElementById('bg-gradient');
const frostEl = document.getElementById('frost');
let currentGradientState = 'idle';

function applyGradientState(stateName, durationS = 2) {
  const p = GRADIENT_PALETTES[stateName] || GRADIENT_PALETTES.idle;
  currentGradientState = stateName;

  // When paused, snap instantly so state pills are useful for color comparison
  const dur = bgPaused ? 0 : durationS;

  // Tween (or snap) position vars
  gsap.to(bgEl, {
    duration: dur,
    ease: 'power1.inOut',
    '--g1x': p.g1x, '--g1y': p.g1y,
    '--g2x': p.g2x, '--g2y': p.g2y,
  });

  // Tween (or snap) frost blur
  gsap.to(frostEl, {
    duration: dur,
    ease: 'power1.inOut',
    '--frost-blur': p.frost
  });

  // Color stops can't tween via GSAP CSS vars without plugin — update instantly
  bgEl.style.setProperty('--g1', p.g1);
  bgEl.style.setProperty('--g2', p.g2);

  // Orb energy
  const energyMap = {
    idle: 0, listening: 0.1, thinking: 0.2, searching: 0.3,
    building: 0.3, speaking: 0.7, excited: 0.9
  };
  gsap.to(orbState, { energy: energyMap[stateName] ?? 0, duration: dur });
}

// Initialize gradient
applyGradientState('idle');

// ── AMBIENT GRADIENT PULSE (always running, very slow) ────────────
function ambientPulse() {
  const dur = 18 + Math.random() * 8; // 18–26s
  gsap.to(bgEl, {
    '--g1x': `${28 + Math.random() * 8}%`,
    '--g1y': `${38 + Math.random() * 8}%`,
    '--g2x': `${70 + Math.random() * 10}%`,
    '--g2y': `${60 + Math.random() * 8}%`,
    duration: dur,
    ease: 'sine.inOut',
    onComplete: () => { if (!bgPaused) ambientPulse(); else ambientPulseLive = false; }
  });
}
ambientPulse();

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
    userAmplitude = userAmplitude * 0.8 + Math.min(rms * 4, 1) * 0.2;
    return userAmplitude;
  }

  function startAISpeaking(durationMs) {
    aiAmplitude = 0;
    if (aiSpeakTween) aiSpeakTween.kill();
    aiSpeakTween = gsap.to({ v: 0 }, {
      v: 1,
      duration: durationMs / 1000,
      ease: 'none',
      onUpdate: function() {
        const progress = this.progress();
        let env;
        if (progress < 0.1)       env = progress / 0.1;
        else if (progress < 0.85) env = 0.6 + Math.sin(Date.now() / 80) * 0.3 + Math.random() * 0.1;
        else                       env = (1 - progress) / 0.15;
        aiAmplitude = Math.max(0, Math.min(1, env));
      },
      onComplete: () => { aiAmplitude = 0; }
    });
  }

  function stopAISpeaking() {
    if (aiSpeakTween) aiSpeakTween.kill();
    const fade = { v: aiAmplitude };
    gsap.to(fade, { v: 0, duration: 0.3, onUpdate: () => { aiAmplitude = fade.v; } });
  }

  return {
    initMic,
    getUserAmplitude,
    startAISpeaking,
    stopAISpeaking,
    get userAmp() { return userAmplitude; },
    get aiAmp()   { return aiAmplitude; }
  };
})();

// Init mic on first user interaction
document.addEventListener('click', () => AudioEngine.initMic(), { once: true });
document.addEventListener('keydown', () => AudioEngine.initMic(), { once: true });

// ── THINKING FORM ────────────────────────────────────────────────
const thinkingForm = document.getElementById('thinking-form');
const thinkLabel   = document.getElementById('thinking-label');

// ── LISSAJOUS v2 — STATE MACHINE + AUDIO REACTIVE ────────────────
const lissCanvas = document.getElementById('lissajous-canvas');
const lissCtx    = lissCanvas.getContext('2d');
const LISS_CX    = lissCanvas.width  / 2;
const LISS_CY    = lissCanvas.height / 2;

// Lissajous state configs
const LISS_STATES = {
  idle:      { a: 1, b: 1, A: 60, B: 48, tail: 30, color: [228,228,228],  alpha: 0.4, glow: false, speed: 0.012 },
  listening: { a: 1, b: 1, A: 58, B: 46, tail: 25, color: [232,232,232],  alpha: 0.5, glow: false, speed: 0.010 },
  thinking:  { a: 3, b: 2, A: 68, B: 50, tail: 40, color: [228,228,228],  alpha: 0.6, glow: true,  speed: 0.018 },
  searching: { a: 5, b: 4, A: 65, B: 48, tail: 35, color: [228,228,228],  alpha: 0.7, glow: true,  speed: 0.022 },
  building:  { a: 4, b: 3, A: 62, B: 50, tail: 38, color: [228,228,228],  alpha: 0.65,glow: true,  speed: 0.020 },
  speaking:  { a: 2, b: 1, A: 70, B: 52, tail: 70, color: [228,228,228],  alpha: 0.9, glow: true,  speed: 0.016 },
  excited:   { a: 3, b: 2, A: 72, B: 54, tail: 80, color: [245,245,245],  alpha: 1.0, glow: true,  speed: 0.024 },
};

// Current interpolated values (tweened by GSAP)
const lissConfig = {
  a: 1, b: 1, A: 60, B: 48,
  tailLive: 30, alpha: 0.4, speed: 0.012,
  color: [228,228,228], glow: false
};
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
  lissConfig.color = target.color;
  lissConfig.glow  = target.glow;
}

function drawLissajous() {
  lissCtx.clearRect(0, 0, lissCanvas.width, lissCanvas.height);

  lissT += lissConfig.speed;

  // Get amplitude sources
  const aiAmp   = AudioEngine.aiAmp;
  const userAmp = AudioEngine.getUserAmplitude();
  const isSpeaking     = aiAmp > 0.05;
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

  // Color: near-white for user speaking, state color for AI
  const [r, g, b] = isUserSpeaking ? [235, 235, 235] : lissConfig.color;

  // Draw trail (comet-tail dot cloud)
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

  if (!bgPaused) { requestAnimationFrame(drawLissajous); }
  else           { lissLoopLive = false; }
}

drawLissajous();

// ── AGENT API SURFACE ─────────────────────────────────────────────
// Plug-in door: a real agent (Claude API, OpenClaw, etc.) calls these
// methods to drive the entire visual + audio experience.
window.ContinuityAgent = {

  // Drive all visual layers simultaneously
  setState(state) {
    applyGradientState(state, 2);
    setLissajousState(state, 0.8);
    console.log('[ContinuityAgent] State:', state);
  },

  // Text-to-speech + speaking visual state
  speak(text, emotion = 'neutral') {
    const estDurationMs = Math.max(1500, text.length * 45);

    this.setState('speaking');
    AudioEngine.startAISpeaking(estDurationMs);

    const utt = new SpeechSynthesisUtterance(text);
    utt.rate   = 0.92;
    utt.pitch  = 0.95;
    utt.volume = 1;

    // Prefer a natural-sounding voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes('Samantha') || v.name.includes('Daniel') ||
      v.name.includes('Karen')    || v.name.includes('Moira')
    );
    if (preferred) utt.voice = preferred;

    window.speechSynthesis.cancel(); // clear any queued speech

    return new Promise(resolve => {
      utt.onend = () => {
        AudioEngine.stopAISpeaking();
        this.setState('listening');
        resolve();
      };
      window.speechSynthesis.speak(utt);
    });
  },

  // Drop a content card into zone 2
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
      this.setState('idle');
    });
  },

  // Add a line to the persistent notepad
  appendNote(text) {
    if (typeof NotepadTool !== 'undefined') {
      NotepadTool.appendLine(text);
    }
  },

  // Reset all content
  clearAll() {
    clearAll();
    this.setState('idle');
  }
};

// Preload voices (browsers need a trigger to populate the list)
window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();

// ── LIFECYCLE: birth / float / death ────────────────────────────
const BIRTH_MS = parseInt(getComputedStyle(document.documentElement)
                   .getPropertyValue('--birth-ms')) || 450;

function birth(el, delay = 0) {
  return new Promise(resolve => {
    gsap.fromTo(el,
      { opacity: 0, filter: 'blur(10px)', scale: 0.97, y: 22 },
      {
        opacity: 1, filter: 'blur(0px)', scale: 1, y: 0,
        duration: BIRTH_MS / 1000,
        delay: delay / 1000,
        ease: 'power3.out',
        onComplete: resolve
      }
    );
  });
}

function float(el) {
  const amp  = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--float-amp')
  ) || -5;
  const durS = parseFloat(
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
      y: '+=28',
      duration: 0.45,
      delay: delay / 1000,
      ease: 'power2.in',
      onComplete: () => { el.remove(); resolve(); }
    });
  });
}

// Shelf-card exit: slides gently downward and fades out
function deathDown(el, delay = 0) {
  return new Promise(resolve => {
    gsap.to(el, {
      opacity: 0,
      y: '+=20',
      duration: 0.45,
      delay: delay / 1000,
      ease: 'power2.in',
      onComplete: () => { el.remove(); resolve(); }
    });
  });
}

// Kill all floating tweens and death-dissolve all zone2/zone3 children
async function clearAll() {
  const zone2 = document.getElementById('zone2');
  const zone3 = document.getElementById('zone3');
  const speech = document.querySelectorAll('.agent-speech');
  zone2.classList.remove('active');

  // Preserve the persistent notepad shelf card — only remove dynamically added zone3 children
  const zone3Kids = [...zone3.children].filter(el => el.id !== 'notepad-shelf-card');

  const promises = [
    ...[...zone2.children].map((el, i) => death(el, i * 80)),
    ...zone3Kids.map((el, i) => deathDown(el, i * 60)),
    ...[...speech].map(el => death(el, 0))
  ];
  await Promise.all(promises);
  ContinuityAgent.setState('idle');
}

// ── UTILITY ───────────────────────────────────────────────────────
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── AGENT SPEECH ─────────────────────────────────────────────────
const SPEECH_DUR = parseInt(
  getComputedStyle(document.documentElement).getPropertyValue('--speech-dur')
) || 3000;

function agentSpeech(text) {
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
  gsap.to('#idle-mark', { opacity: 0, duration: 0.3 });
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
      opacity: 0.3,        // return to ambient glow, not fully hidden
      y: '-=12',
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        gsap.set(thinkingForm, { y: 0 });
        gsap.to('#idle-mark', { opacity: 1, duration: 0.6, delay: 0.3 });
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

// ── TEXT STREAMER ─────────────────────────────────────────────────
async function streamText(container, text, msPerChar = 18) {
  container.textContent = '';
  for (const char of text) {
    container.textContent += char;
    await delay(msPerChar);
  }
}

// ── NOTEPAD TOOL ──────────────────────────────────────────────────
const NotepadTool = (() => {
  const STORAGE_KEY = `continuity-notes-${new Date().toISOString().slice(0,10)}`;
  let lines   = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
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

    // Sync edits to storage
    const linesEl = panelEl.querySelector('#notepad-lines');
    linesEl.addEventListener('input', () => {
      const divs = [...linesEl.querySelectorAll('div')].map(d => d.textContent);
      lines = divs.length ? divs : [linesEl.textContent];
      save();
    });

    panelEl.querySelector('#notepad-export').addEventListener('click', exportMarkdown);
    return panelEl;
  }

  function open() {
    if (isOpen) return;
    isOpen = true;

    const zone2 = document.getElementById('zone2');
    zone2.classList.add('active');

    if (!panelEl) buildPanel();

    gsap.fromTo(panelEl,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
    );
    const title = panelEl.querySelector('h2');
    title.classList.add('focused');
    setTimeout(() => title.classList.remove('focused'), 2000);

    if (window.ContinuityAgent) {
      window.ContinuityAgent.setState('thinking');
      setTimeout(() => window.ContinuityAgent.setState('idle'), 1000);
    }
  }

  function close() {
    if (!isOpen || !panelEl) return;
    isOpen = false;

    gsap.to(panelEl, {
      opacity: 0, y: '+=40',
      duration: 0.4, ease: 'power2.in',
      onComplete: () => { panelEl.remove(); panelEl = null; }
    });

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

    setTimeout(() => {
      if (!panelEl) return;
      const linesEl = panelEl.querySelector('#notepad-lines');
      if (!linesEl) return;
      const lineEl = document.createElement('div');
      linesEl.appendChild(lineEl);
      gsap.fromTo(lineEl, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3 });
      if (typeof streamText === 'function') {
        streamText(lineEl, text, 28);
      } else {
        lineEl.textContent = text;
      }
    }, 100);
  }

  function exportMarkdown() {
    const date = new Date().toISOString().slice(0,10);
    const md   = `# Session Notes — ${date}\n\n` + lines.map(l => `- ${l}`).join('\n');
    const blob = new Blob([md], { type: 'text/markdown' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${date}-session-notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Wire shelf card toggle after DOM ready
  setTimeout(() => {
    const shelfCard = document.getElementById('notepad-shelf-card');
    if (shelfCard) shelfCard.addEventListener('click', () => isOpen ? close() : open());
    save(); // update line count display on load
  }, 100);

  return { open, close, appendLine, exportMarkdown };
})();

// ── EMOTION STATE HUD WIRING ──────────────────────────────────────
document.querySelectorAll('.state-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.state-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    ContinuityAgent.setState(btn.dataset.state);
  });
});

// ── BACKGROUND PAUSE BUTTON ───────────────────────────────────────
// Freezes all background animation so state colors can be inspected
// and adjusted in DevTools without GSAP/RAF constantly overwriting values.
const pauseBgBtn = document.getElementById('pause-bg-btn');
pauseBgBtn.addEventListener('click', () => {
  bgPaused = !bgPaused;
  pauseBgBtn.textContent = bgPaused ? '▶' : '⏸';
  pauseBgBtn.classList.toggle('paused', bgPaused);
  pauseBgBtn.title = bgPaused ? 'Resume background' : 'Freeze background';

  if (bgPaused) {
    // Kill active gradient tweens so they stop fighting DevTools
    gsap.killTweensOf(bgEl);
    gsap.killTweensOf(frostEl);
    // RAF loops self-terminate on their next frame via the bgPaused check
  } else {
    // Compensate for paused duration so the orb resumes position without a jump
    orbTimeOffset += performance.now() - pausedAt;
    // Restart loops that have self-terminated
    if (!orbLoopLive)      { orbLoopLive      = true; requestAnimationFrame(drawOrb); }
    if (!lissLoopLive)     { lissLoopLive     = true; requestAnimationFrame(drawLissajous); }
    if (!ambientPulseLive) { ambientPulseLive = true; ambientPulse(); }
    // Resume gradient tweening from current state
    applyGradientState(currentGradientState);
  }
});

// ── UNIVERSAL CARD SYSTEM ─────────────────────────────────────────
// A card is the single atomic unit of the canvas. It can contain
// any content: markdown, raw HTML, SVGs, maps, embedded tools, etc.
// The AI (or scenario) calls createCard() and gets back a live DOM
// element with birth/minimize/dismiss already wired up.

function renderMarkdown(md) {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm,  '<h2>$1</h2>')
    .replace(/^# (.+)$/gm,   '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,    '<em>$1</em>')
    .replace(/`(.+?)`/g,      '<code>$1</code>')
    .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>(\n|$))+/g, s => `<ul>${s}</ul>`)
    .split(/\n\n+/)
    .map(block => block.startsWith('<') ? block : `<p>${block.replace(/\n/g,' ')}</p>`)
    .join('\n');
}

// dismissCard: glide the card downward and fade out, then remove
function dismissCard(el) {
  return new Promise(resolve => {
    gsap.to(el, {
      opacity: 0, y: '+=32',
      duration: 0.42, ease: 'power2.in',
      onComplete: () => { el.remove(); resolve(); }
    });
  });
}

// minimizeCard: shrink card down into a new shelf card
function minimizeCard(cardEl, title) {
  const zone3 = document.getElementById('zone3');

  // Animate the main card away (slide down + fade)
  gsap.to(cardEl, {
    opacity: 0, y: '+=36',
    duration: 0.38, ease: 'power2.in',
    onComplete: () => {
      cardEl.remove();

      // Birth a shelf card in zone3
      const shelfCard = document.createElement('div');
      shelfCard.className = 'shelf-card';
      shelfCard.innerHTML = `
        <div class="card-label">${title || 'Card'}</div>
        <div class="card-sub">Minimized · tap to expand</div>
      `;
      zone3.appendChild(shelfCard);

      gsap.fromTo(shelfCard,
        { opacity: 0, filter: 'blur(8px)', scale: 0.88, y: 12 },
        { opacity: 1, filter: 'blur(0px)', scale: 1, y: 0,
          duration: 0.35, ease: 'power3.out',
          onComplete: () => {
            gsap.set(shelfCard, { clearProps: 'opacity,filter' });
            shelfCard.classList.add('live');
          }
        }
      );
    }
  });
}

// createCard — the universal factory
// config: {
//   title       : string             — shown in card header
//   content     : string             — HTML or markdown string
//   contentType : 'html'|'markdown'  — default 'html'
//   minimizable : bool               — show minimize button (default true)
//   zone2       : Element            — target zone (defaults to #zone2)
// }
// Returns a Promise that resolves to the card Element once birth animation completes.
function createCard({ title = '', content = '', contentType = 'html', minimizable = true, zone2 } = {}) {
  const zone = zone2 || document.getElementById('zone2');
  zone.classList.add('active');

  const el = document.createElement('div');
  el.className = 'card';

  const bodyHTML = contentType === 'markdown' ? renderMarkdown(content) : content;

  el.innerHTML = `
    <div class="card-header">
      <span class="card-title">${title}</span>
      <div class="card-controls">
        ${minimizable
          ? `<button class="card-btn card-minimize" title="Minimize to shelf">⌄</button>`
          : ''}
        <button class="card-btn card-close" title="Dismiss">×</button>
      </div>
    </div>
    <div class="card-content">${bodyHTML}</div>
  `;

  zone.appendChild(el);

  if (minimizable) {
    el.querySelector('.card-minimize').addEventListener('click', () => minimizeCard(el, title));
  }
  el.querySelector('.card-close').addEventListener('click', () => dismissCard(el));

  return birth(el).then(() => el);
}

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
  if (e.key === ' ' && !e.repeat) {
    document.querySelectorAll('#zone2 .panel, #zone2 .notepad').forEach(el => {
      gsap.to(el, { opacity: 0.3, duration: 0.3 });
    });
  }
  if (running && e.key !== 'Escape' && e.key !== ' ') return;
  if (e.key === '1') { running = true; await clearAll(); await scenario1(); running = false; }
  if (e.key === '2') { running = true; await clearAll(); await scenario2(); running = false; }
  if (e.key === '3') { running = true; await clearAll(); await scenario3(); running = false; }
  if (e.key === 'Escape') { await clearAll(); running = false; }
});

document.addEventListener('keyup', (e) => {
  if (e.key === ' ') {
    document.querySelectorAll('#zone2 .panel, #zone2 .notepad').forEach(el => {
      gsap.to(el, { opacity: 1, duration: 0.4 });
    });
  }
});

document.getElementById('reset-btn').addEventListener('click', async () => {
  await clearAll();
  running = false;
});

// ── SVG ILLUSTRATION: Corgi on Unicycle ──────────────────────────
function makeCorgSVG() {
  return `<svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg"
           style="width:100%;height:auto;display:block;border-radius:0.5rem;">
    <rect width="400" height="280" fill="#2a1f14" rx="8"/>
    <ellipse cx="200" cy="60" rx="130" ry="18" fill="none"
             stroke="#c4622d" stroke-width="1" stroke-opacity="0.3"/>
    <ellipse cx="200" cy="60" rx="90" ry="12" fill="none"
             stroke="#c4622d" stroke-width="0.8" stroke-opacity="0.2"/>
    <circle cx="200" cy="220" r="42" fill="none"
            stroke="#ede8df" stroke-width="1.5" stroke-opacity="0.6"/>
    <circle cx="200" cy="220" r="4" fill="#c4622d" fill-opacity="0.8"/>
    <line x1="200" y1="178" x2="200" y2="262" stroke="#ede8df" stroke-width="0.8" stroke-opacity="0.3"/>
    <line x1="158" y1="220" x2="242" y2="220" stroke="#ede8df" stroke-width="0.8" stroke-opacity="0.3"/>
    <line x1="170" y1="190" x2="230" y2="250" stroke="#ede8df" stroke-width="0.8" stroke-opacity="0.2"/>
    <line x1="230" y1="190" x2="170" y2="250" stroke="#ede8df" stroke-width="0.8" stroke-opacity="0.2"/>
    <line x1="200" y1="178" x2="200" y2="150" stroke="#ede8df" stroke-width="2" stroke-opacity="0.5"/>
    <ellipse cx="200" cy="135" rx="28" ry="18" fill="#c4622d" fill-opacity="0.5"/>
    <circle cx="200" cy="112" r="16" fill="#c4622d" fill-opacity="0.6"/>
    <polygon points="188,100 180,82 196,96" fill="#c4622d" fill-opacity="0.7"/>
    <polygon points="212,100 220,82 204,96" fill="#c4622d" fill-opacity="0.7"/>
    <circle cx="194" cy="110" r="2.5" fill="#1e1812"/>
    <circle cx="206" cy="110" r="2.5" fill="#1e1812"/>
    <circle cx="195" cy="109" r="0.8" fill="#ede8df" fill-opacity="0.6"/>
    <circle cx="207" cy="109" r="0.8" fill="#ede8df" fill-opacity="0.6"/>
    <ellipse cx="200" cy="117" rx="6" ry="4" fill="#b5622d" fill-opacity="0.5"/>
    <line x1="172" y1="135" x2="148" y2="148" stroke="#ede8df" stroke-width="2" stroke-opacity="0.4" stroke-linecap="round"/>
    <line x1="228" y1="135" x2="252" y2="148" stroke="#ede8df" stroke-width="2" stroke-opacity="0.4" stroke-linecap="round"/>
    <line x1="80" y1="262" x2="320" y2="262" stroke="#ede8df" stroke-width="0.5" stroke-opacity="0.15"/>
    <line x1="200" y1="0"  x2="100" y2="280" stroke="#ede8df" stroke-width="0.5" stroke-opacity="0.05"/>
    <line x1="200" y1="0"  x2="200" y2="280" stroke="#ede8df" stroke-width="0.5" stroke-opacity="0.08"/>
    <line x1="200" y1="0"  x2="300" y2="280" stroke="#ede8df" stroke-width="0.5" stroke-opacity="0.05"/>
  </svg>`;
}

// ── SCENARIO 1: Image Generation ────────────────────────────────
async function scenario1() {
  const zone2 = document.getElementById('zone2');
  const zone3 = document.getElementById('zone3');
  zone2.classList.add('active');

  ContinuityAgent.setState('thinking');
  agentSpeech('Creating that for you...');
  await delay(400);
  await thinkingSequence('Imagining...');

  ContinuityAgent.setState('building');
  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.innerHTML = `<div id="corgi-img">${makeCorgSVG()}</div>`;
  zone2.appendChild(panel);
  await birth(panel);

  const caption = document.createElement('div');
  caption.className = 'panel-caption';
  caption.textContent = 'A corgi who joined the circus.';
  panel.appendChild(caption);
  await birth(caption, 300);

  ContinuityAgent.setState('idle');
  await delay(200);
  agentSpeech("Here's your corgi. Three months of training, apparently.");

  await delay(3000);
  gsap.to(caption, { opacity: 0.5, duration: 0.6 });

  const saveBtn = document.createElement('button');
  saveBtn.className = 'trigger';
  saveBtn.style.marginTop = '0.5rem';
  saveBtn.innerHTML = '<em>Save to shelf</em>';
  panel.appendChild(saveBtn);
  await birth(saveBtn, 200);

  saveBtn.addEventListener('click', () => saveToShelf(panel, 'Corgi Circus', zone3));
}

async function saveToShelf(panel, label, zone3) {
  gsap.to(panel, {
    opacity: 0,
    y: '+=40',
    duration: 0.5,
    ease: 'power2.in',
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

  gsap.fromTo(card,
    { opacity: 0, filter: 'blur(8px)', scale: 0.9, y: 18 },
    { opacity: 1, filter: 'blur(0px)', scale: 1, y: 0,
      duration: 0.4, ease: 'power3.out',
      onComplete: () => {
        gsap.set(card, { clearProps: 'opacity,filter' });
        card.classList.add('live');
      } }
  );

  agentSpeech('Saved.');

  card.addEventListener('click', () => {
    gsap.to(card, { opacity: 1, duration: 0.3 });
  });
}

// ── SVG MAP: North Portland streets ─────────────────────────────
function makeMapSVG() {
  return `<svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg"
           style="width:100%;height:auto;display:block;">
    <rect width="600" height="280" fill="#221a10"/>
    <line x1="0" y1="70"  x2="600" y2="70"  stroke="#3d3020" stroke-width="6"/>
    <line x1="0" y1="140" x2="600" y2="140" stroke="#3d3020" stroke-width="10"/>
    <line x1="0" y1="200" x2="600" y2="200" stroke="#3d3020" stroke-width="6"/>
    <line x1="0" y1="250" x2="600" y2="250" stroke="#3d3020" stroke-width="4"/>
    <line x1="80"  y1="0" x2="80"  y2="280" stroke="#3d3020" stroke-width="4"/>
    <line x1="180" y1="0" x2="180" y2="280" stroke="#3d3020" stroke-width="8"/>
    <line x1="320" y1="0" x2="320" y2="280" stroke="#3d3020" stroke-width="6"/>
    <line x1="440" y1="0" x2="440" y2="280" stroke="#3d3020" stroke-width="4"/>
    <line x1="540" y1="0" x2="540" y2="280" stroke="#3d3020" stroke-width="4"/>
    <line x1="0" y1="180" x2="600" y2="80"  stroke="#3d3020" stroke-width="7"/>
    <rect x="85"  y="75"  width="90"  height="60"  fill="#2a2015" rx="2"/>
    <rect x="85"  y="145" width="90"  height="50"  fill="#2a2015" rx="2"/>
    <rect x="185" y="75"  width="130" height="60"  fill="#2a2015" rx="2"/>
    <rect x="185" y="145" width="130" height="50"  fill="#2a2015" rx="2"/>
    <rect x="325" y="75"  width="110" height="60"  fill="#2a2015" rx="2"/>
    <rect x="325" y="145" width="110" height="50"  fill="#2a2015" rx="2"/>
    <rect x="445" y="75"  width="90"  height="120" fill="#2a2015" rx="2"/>
    <text x="190" y="135" fill="#5a4a35" font-size="9" font-family="sans-serif">N Mississippi Ave</text>
    <text x="325" y="135" fill="#5a4a35" font-size="9" font-family="sans-serif">N Williams Ave</text>
    <text x="20"  y="138" fill="#5a4a35" font-size="9" font-family="sans-serif">N Fremont St</text>
  </svg>`;
}

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

  ContinuityAgent.setState('thinking');
  agentSpeech('Searching North Portland...');
  await delay(400);
  ContinuityAgent.setState('searching');
  await thinkingSequence('Searching Portland...');

  const mapPanel = document.createElement('div');
  mapPanel.className = 'panel';
  mapPanel.style.padding = '0';
  mapPanel.style.overflow = 'hidden';
  mapPanel.innerHTML = `<div class="map-container">${makeMapSVG()}</div>`;
  zone2.appendChild(mapPanel);
  ContinuityAgent.setState('building');
  await birth(mapPanel);

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

  const cardEls = [];
  for (let i = 0; i < LOCATIONS.length; i++) {
    const loc = LOCATIONS[i];
    const card = document.createElement('div');
    card.className = 'shelf-card';
    card.dataset.idx = i;
    card.innerHTML = `
      <div class="card-label">${loc.name}</div>
      <div class="card-sub">${loc.dist} · ${loc.stars}★</div>
    `;
    zone3.appendChild(card);

    gsap.fromTo(card,
      { opacity: 0, filter: 'blur(8px)', scale: 0.9, y: 18 },
      { opacity: 1, filter: 'blur(0px)', scale: 1, y: 0,
        duration: 0.4, delay: i * 0.15, ease: 'power3.out',
        onComplete: () => {
          gsap.set(card, { clearProps: 'opacity,filter' });
          card.classList.add('live');
        } }
    );
    cardEls.push(card);
  }

  ContinuityAgent.setState('idle');
  agentSpeech('Here are three options near you.');

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

  pinEls.forEach(pin => {
    pin.addEventListener('click', () => selectLocation(parseInt(pin.dataset.idx)));
  });
  cardEls.forEach(card => {
    card.addEventListener('click', () => selectLocation(parseInt(card.dataset.idx)));
  });
}

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
    ${box(20, 130, 80, 40, 'Input')}
    ${arrow(100, 150, 130, 150)}
    ${box(130, 120, 80, 60, 'Embed', '+')}
    ${arrow(210, 150, 240, 150)}
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
    ${box(390, 120, 80, 60, 'Linear +', 'Softmax')}
    ${arrow(470, 150, 500, 150)}
    ${box(500, 130, 60, 40, 'Output')}
  </svg>`;
}

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

  ContinuityAgent.setState('building');
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

  const title = diagPanel.querySelector('#diag-title');
  await delay(300);
  title.classList.add('focused');
  await delay(2000);
  title.classList.remove('focused');

  ContinuityAgent.setState('speaking');
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

  ContinuityAgent.setState('idle');
  await delay(400);

  const noteShelfCard = document.createElement('div');
  noteShelfCard.className = 'shelf-card';
  noteShelfCard.innerHTML = `
    <div class="card-label">📝 Take note</div>
    <div class="card-sub">Tap to expand</div>
  `;
  zone3.appendChild(noteShelfCard);
  gsap.fromTo(noteShelfCard,
    { opacity: 0, filter: 'blur(8px)', scale: 0.9, y: 18 },
    { opacity: 1, filter: 'blur(0px)', scale: 1, y: 0,
      duration: 0.4, ease: 'power3.out',
      onComplete: () => { gsap.set(noteShelfCard, { clearProps: 'opacity,filter' }); noteShelfCard.classList.add('live'); } }
  );

  let noteExpanded = false;
  const expandNote = async () => {
    if (noteExpanded) return;
    noteExpanded = true;
    noteShelfCard.removeEventListener('click', expandNote);

    gsap.to(diagPanel, { opacity: 0.4, duration: 0.5 });

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
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
    );
    noteTitle.classList.add('focused');

    await delay(500);

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

    const doneBtn = document.createElement('button');
    doneBtn.className = 'trigger';
    doneBtn.style.marginTop = '1rem';
    doneBtn.innerHTML = '<em>Okay, done.</em>';
    notepad.appendChild(doneBtn);
    gsap.fromTo(doneBtn, { opacity: 0 }, { opacity: 1, duration: 0.4 });

    doneBtn.addEventListener('click', async () => {
      gsap.to(notepad, {
        opacity: 0, y: '+=40',
        duration: 0.4, ease: 'power2.in',
        onComplete: () => notepad.remove()
      });

      await delay(200);

      gsap.to(noteShelfCard, { opacity: 1, duration: 0.3 });
      gsap.to(noteShelfCard, { boxShadow: '0 0 16px var(--accent)', duration: 0.3 });
      await delay(600);
      gsap.to(noteShelfCard, { boxShadow: 'none', opacity: 0.3, duration: 0.8 });

      gsap.to(diagPanel, { opacity: 1, duration: 0.6 });
      agentSpeech('Note saved. Continuing...');
    });
  };

  noteShelfCard.addEventListener('click', expandNote);
  setTimeout(expandNote, 3000);
}

// ── COLOR EDITOR ──────────────────────────────────────────────────
const ColorEditor = (() => {
  const STORAGE_KEY = 'continuity-palette-overrides';

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

  // Parse rgba(r,g,b,a) → { hex: '#rrggbb', alpha: 0.78 }
  function parseRgba(rgba) {
    const m = rgba.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/);
    if (!m) return { hex: '#888888', alpha: 0.8 };
    const [, r, g, b, a] = m;
    const hex = '#' + [r, g, b].map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
    return { hex, alpha: a !== undefined ? parseFloat(a) : 1 };
  }

  // Build rgba(r,g,b,alpha) from hex string + alpha float
  function buildRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha.toFixed(2)})`;
  }

  // Sync the two pickers + sliders to a named state's current palette values
  function syncToState(stateName) {
    const p = GRADIENT_PALETTES[stateName];
    if (!p) return;

    const { hex: hex1, alpha: a1 } = parseRgba(p.g1);
    const { hex: hex2, alpha: a2 } = parseRgba(p.g2);

    document.getElementById('picker-g1').value          = hex1;
    document.getElementById('alpha-g1').value           = Math.round(a1 * 100);
    document.getElementById('pct-g1').textContent       = Math.round(a1 * 100) + '%';
    document.getElementById('val-g1').textContent       = p.g1;

    document.getElementById('picker-g2').value          = hex2;
    document.getElementById('alpha-g2').value           = Math.round(a2 * 100);
    document.getElementById('pct-g2').textContent       = Math.round(a2 * 100) + '%';
    document.getElementById('val-g2').textContent       = p.g2;
  }

  // Read both pickers, apply to live gradient instantly, persist
  function applyChange(stateName) {
    const hex1 = document.getElementById('picker-g1').value;
    const a1   = parseInt(document.getElementById('alpha-g1').value) / 100;
    const hex2 = document.getElementById('picker-g2').value;
    const a2   = parseInt(document.getElementById('alpha-g2').value) / 100;

    const newG1 = buildRgba(hex1, a1);
    const newG2 = buildRgba(hex2, a2);

    // Mutate live palette so future setState() calls use the new colors
    GRADIENT_PALETTES[stateName].g1 = newG1;
    GRADIENT_PALETTES[stateName].g2 = newG2;

    // Instant CSS var update — bypass GSAP tween for live feel
    bgEl.style.setProperty('--g1', newG1);
    bgEl.style.setProperty('--g2', newG2);

    // Update labels
    document.getElementById('pct-g1').textContent = Math.round(a1 * 100) + '%';
    document.getElementById('val-g1').textContent = newG1;
    document.getElementById('pct-g2').textContent = Math.round(a2 * 100) + '%';
    document.getElementById('val-g2').textContent = newG2;

    // Persist to localStorage
    const overrides = loadOverrides();
    overrides[stateName] = { g1: newG1, g2: newG2 };
    saveOverrides(overrides);
  }

  function init() {
    applyStoredOverrides();

    // Wire all four controls — 'input' fires on every drag tick
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

// ── INITIAL STATE ─────────────────────────────────────────────────
// Ensure idle mark is visible on load (thinking form is already opacity:0.3 from CSS)
gsap.set('#idle-mark', { opacity: 1 });
