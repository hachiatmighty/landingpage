// Fully synthesized soundtrack. No samples, no audio files, no plugins:
// every sound below is built from oscillators, noise and filters, sample by sample.
// Usage: node synth.js out.wav
const fs = require('fs');
const TL = require('./timeline.js');

const SR = 48000;
const N = Math.round(TL.DURATION * SR);
const { BEAT, BAR } = TL;
const TAU = Math.PI * 2;

// ---------- utils ----------
let seed = 1337;
const rnd = () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const noise = () => rnd() * 2 - 1;
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const S = (t) => Math.round(t * SR);

function polyblep(t, dt) {
  if (t < dt) { t /= dt; return t + t - t * t - 1; }
  if (t > 1 - dt) { t = (t - 1) / dt; return t * t + t + t + 1; }
  return 0;
}

// Cytomic/TPT state-variable filter
class SVF {
  constructor() { this.ic1 = 0; this.ic2 = 0; }
  run(x, fc, q) {
    const g = Math.tan(Math.PI * clamp(fc, 10, SR * 0.45) / SR);
    const k = 1 / q;
    const a1 = 1 / (1 + g * (g + k)), a2 = g * a1, a3 = g * a2;
    const v3 = x - this.ic2;
    const v1 = a1 * this.ic1 + a2 * v3;
    const v2 = this.ic2 + a2 * this.ic1 + a3 * v3;
    this.ic1 = 2 * v1 - this.ic1; this.ic2 = 2 * v2 - this.ic2;
    this.lp = v2; this.bp = v1; this.hp = x - k * v1 - v2;
    return v2;
  }
}

function bus() { return { L: new Float32Array(N), R: new Float32Array(N) }; }
function add(b, i, l, r) { if (i >= 0 && i < N) { b.L[i] += l; b.R[i] += r === undefined ? l : r; } }
const panLR = (p) => [Math.cos((p + 1) * Math.PI / 4), Math.sin((p + 1) * Math.PI / 4)];

// sidechain envelope from the kick grid
const duck = new Float32Array(N).fill(0);
for (const k of TL.kicks) {
  const s = S(k);
  for (let i = 0; i < S(0.3); i++) {
    const t = i / SR;
    const atk = Math.min(1, t / 0.003);
    const v = atk * Math.pow(Math.max(0, 1 - t / 0.3), 2.2);
    if (s + i < N) duck[s + i] = Math.max(duck[s + i], v);
  }
}
const sc = (i, depth) => 1 - depth * duck[i];

// ---------- buses ----------
const B = {
  kick: bus(), clap: bus(), hat: bus(), snare: bus(), bass: bus(), stab: bus(), pad: bus(),
  arp: bus(), lead: bus(), fx: bus(), impact: bus(), final: bus(),
};
const revSend = bus();
const dlySend = bus();

// ---------- instruments ----------
function kick(t0, vel = 1, big = false) {
  const s0 = S(t0), len = S(big ? 1.4 : 0.42);
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const f = (big ? 38 : 46) + 120 * Math.exp(-t / 0.032) + 380 * Math.exp(-t / 0.0035);
    ph += f / SR;
    const env = big ? Math.exp(-t / 0.55) : (t < 0.06 ? 1 : Math.exp(-(t - 0.06) / 0.14));
    let v = Math.sin(TAU * ph) * env;
    v += noise() * Math.exp(-t / 0.0025) * 0.35; // click
    v = Math.tanh(v * 1.8) * vel;
    add(B.kick, s0 + i, v, v);
  }
}

function clap(t0, vel = 1) {
  const s0 = S(t0), len = S(0.45);
  const f = new SVF(), f2 = new SVF();
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    let env = 0;
    for (let k = 0; k < 3; k++) { const tk = t - k * 0.009; if (tk >= 0) env = Math.max(env, Math.exp(-tk / 0.006)); }
    if (t >= 0.018) env = Math.max(env, 0.8 * Math.exp(-(t - 0.018) / 0.11));
    const n = noise();
    f.run(n, 1300, 1.4);
    f2.run(n, 2600, 2.0);
    const body = Math.sin(TAU * 210 * t) * Math.exp(-t / 0.03) * 0.5;
    const v = (f.bp * 1.6 + f2.bp * 0.8 + body) * env * vel;
    add(B.clap, s0 + i, v * 0.95, v * 1.05);
    add(revSend, s0 + i, v * 0.35, v * 0.35);
  }
}

function snare(t0, vel, pitch) {
  const s0 = S(t0), len = S(0.25);
  const f = new SVF();
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    ph += (pitch * (1 + 0.6 * Math.exp(-t / 0.01))) / SR;
    const tone = Math.sin(TAU * ph) * Math.exp(-t / 0.05);
    f.run(noise(), 3500 + pitch * 4, 0.8);
    const nz = (f.hp * 0.6 + f.bp) * Math.exp(-t / 0.09);
    const v = (tone * 0.7 + nz) * vel;
    add(B.snare, s0 + i, v, v);
    add(revSend, s0 + i, v * 0.25, v * 0.25);
  }
}

const HAT_F = [205.3, 304.4, 369.6, 522.7, 540.0, 800.0].map((x) => x * 1.7);
function hat(t0, vel, open, pan) {
  const s0 = S(t0), len = S(open ? 0.3 : 0.06);
  const f = new SVF(), f2 = new SVF();
  const [gl, gr] = panLR(pan);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    let m = 0;
    for (const hf of HAT_F) m += ((hf * t) % 1) < 0.5 ? 1 : -1;
    const src = m / 6 * 0.6 + noise() * 0.7;
    f.run(src, 7500, 0.9);
    f2.run(f.hp, 14000, 0.7);
    const env = open ? Math.exp(-t / 0.11) : Math.exp(-t / 0.018);
    const v = (f.hp - f2.hp * 0.3) * env * vel;
    add(B.hat, s0 + i, v * gl, v * gr);
  }
}

function bassNote(t0, dur, midi, vel = 1) {
  const s0 = S(t0), len = S(dur + 0.03);
  const fr = mtof(midi);
  const f = new SVF();
  let p1 = 0, p2 = 0.37, ps = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const dt1 = fr * 1.004 / SR, dt2 = fr * 0.996 / SR;
    p1 += dt1; if (p1 >= 1) p1 -= 1;
    p2 += dt2; if (p2 >= 1) p2 -= 1;
    ps += fr / SR;
    const saw = (2 * p1 - 1 - polyblep(p1, dt1)) + (2 * p2 - 1 - polyblep(p2, dt2));
    const cut = 180 + 1700 * Math.exp(-t / 0.045);
    f.run(saw * 0.5, cut, 1.6);
    const env = Math.min(1, t / 0.002) * (t > dur ? Math.exp(-(t - dur) / 0.008) : 1);
    const sub = Math.sin(TAU * ps) * 0.9;
    const v = Math.tanh((f.lp * 0.9 + sub) * 1.4) * env * vel;
    add(B.bass, s0 + i, v, v);
  }
}

// supersaw voice set; writes to bus with optional reverb send
function supersaw(target, t0, dur, notes, opts) {
  const { cutoff, cutEnv = 0, cutDecay = 0.1, release = 0.08, attack = 0.003, gain = 0.1,
    detune = 0.22, voices = 7, send = 0.3, dsend = 0, q = 0.9, scDepth = 0 } = opts;
  const s0 = S(t0), len = S(dur + release * 5);
  for (const m of notes) {
    const vs = [];
    for (let v = 0; v < voices; v++) {
      const d = voices === 1 ? 0 : (v / (voices - 1) * 2 - 1);
      vs.push({ f: mtof(m + d * detune), p: rnd(), pan: d * 0.85 });
    }
    const fL = new SVF(), fR = new SVF();
    for (let i = 0; i < len; i++) {
      const t = i / SR;
      let l = 0, r = 0;
      for (const o of vs) {
        const dt = o.f / SR; o.p += dt; if (o.p >= 1) o.p -= 1;
        const s = 2 * o.p - 1 - polyblep(o.p, dt);
        l += s * (1 - o.pan) * 0.5; r += s * (1 + o.pan) * 0.5;
      }
      const c = typeof cutoff === 'function' ? cutoff(t0 + t) : cutoff;
      const fc = c + cutEnv * Math.exp(-t / cutDecay);
      fL.run(l, fc, q); fR.run(r, fc, q);
      const env = Math.min(1, t / attack) * (t > dur ? Math.exp(-(t - dur) / release) : 1);
      const g = env * gain / Math.sqrt(voices) * (scDepth ? sc(s0 + i, scDepth) : 1);
      const L = fL.lp * g, R = fR.lp * g;
      add(target, s0 + i, L, R);
      if (send) add(revSend, s0 + i, L * send, R * send);
      if (dsend) add(dlySend, s0 + i, L * dsend, R * dsend);
    }
  }
}

function pluck(t0, midi, vel, cutoff) {
  const s0 = S(t0), len = S(0.32);
  const fr = mtof(midi);
  const f = new SVF();
  let p = 0, p2 = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const dt = fr / SR; p += dt; if (p >= 1) p -= 1;
    p2 += fr * 2.003 / SR; if (p2 >= 1) p2 -= 1;
    const sq = (p < 0.5 ? 1 : -1) * 0.5 + (2 * p - 1 - polyblep(p, dt)) * 0.5 + Math.sin(TAU * p2) * 0.2;
    f.run(sq, cutoff * (0.35 + 0.65 * Math.exp(-t / 0.05)), 1.8);
    const env = Math.min(1, t / 0.002) * Math.exp(-t / 0.085);
    const v = f.lp * env * vel * sc(s0 + i, 0.35);
    add(B.arp, s0 + i, v, v);
    add(dlySend, s0 + i, v * 0.55, v * 0.55);
    add(revSend, s0 + i, v * 0.2, v * 0.2);
  }
}

function leadNote(t0, dur, midi, prevMidi, vel) {
  const s0 = S(t0), len = S(dur + 0.15);
  const f = new SVF();
  let p1 = rnd(), p2 = rnd();
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const glide = prevMidi == null ? midi : midi + (prevMidi - midi) * Math.exp(-t / 0.018);
    const vib = 0.12 * Math.sin(TAU * 5.5 * t) * Math.min(1, t / 0.2);
    const fr = mtof(glide + vib);
    const d1 = fr * 1.006 / SR, d2 = fr * 0.994 / SR;
    p1 += d1; if (p1 >= 1) p1 -= 1; p2 += d2; if (p2 >= 1) p2 -= 1;
    const s = (2 * p1 - 1 - polyblep(p1, d1)) + (2 * p2 - 1 - polyblep(p2, d2));
    f.run(s, 1800 + 2600 * Math.exp(-t / 0.12), 1.2);
    const env = Math.min(1, t / 0.006) * (t > dur ? Math.exp(-(t - dur) / 0.04) : 1) * (0.8 + 0.2 * Math.exp(-t / 0.1));
    const v = f.lp * env * vel * sc(s0 + i, 0.3);
    add(B.lead, s0 + i, v * 0.9, v * 1.1);
    add(dlySend, s0 + i, v * 0.35, v * 0.35);
    add(revSend, s0 + i, v * 0.3, v * 0.3);
  }
}

function blip(t0, freq, vel) {
  const s0 = S(t0), len = S(0.25);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const f = freq * (1 + 0.5 * Math.exp(-t / 0.004));
    const v = Math.sin(TAU * f * t + 1.5 * Math.sin(TAU * f * 2 * t) * Math.exp(-t / 0.02)) * Math.exp(-t / 0.05) * vel;
    add(B.fx, s0 + i, v, v);
    add(revSend, s0 + i, v * 0.4, v * 0.4);
    add(dlySend, s0 + i, v * 0.3, v * 0.3);
  }
}

// noise sweep that *ends* exactly on `tEnd`
function whoosh(tEnd, dur, f0, f1, vel, panFrom = -0.8, panTo = 0.8) {
  const s0 = S(tEnd - dur), len = S(dur);
  const f = new SVF();
  for (let i = 0; i < len; i++) {
    const u = i / len;
    const fc = f0 * Math.pow(f1 / f0, u * u);
    f.run(noise(), fc, 2.5);
    const env = Math.pow(u, 2.2) * (1 - Math.pow(u, 40));
    const [gl, gr] = panLR(panFrom + (panTo - panFrom) * u);
    const v = f.bp * env * vel;
    add(B.fx, s0 + i, v * gl, v * gr);
    add(revSend, s0 + i, v * 0.3 * gl, v * 0.3 * gr);
  }
}

function crash(t0, vel, decay) {
  const s0 = S(t0), len = S(decay * 4);
  const fL = new SVF(), fR = new SVF();
  const partials = [];
  for (let k = 0; k < 14; k++) partials.push({ f: 3000 + rnd() * 6000, p: rnd() });
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    let m = 0;
    for (const pt of partials) { pt.p += pt.f / SR; if (pt.p >= 1) pt.p -= 1; m += pt.p < 0.5 ? 1 : -1; }
    m /= 14;
    fL.run(noise() * 0.8 + m * 0.4, 5000, 0.7);
    fR.run(noise() * 0.8 + m * 0.4, 5200, 0.7);
    const env = Math.exp(-t / decay) * Math.min(1, t / 0.001);
    add(B.impact, s0 + i, fL.hp * env * vel, fR.hp * env * vel);
    add(revSend, s0 + i, fL.hp * env * vel * 0.3, fR.hp * env * vel * 0.3);
  }
}

function subBoom(t0, vel, len_s) {
  const s0 = S(t0), len = S(len_s);
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    ph += (30 + 40 * Math.exp(-t / 0.25)) / SR;
    const v = Math.tanh(Math.sin(TAU * ph) * 1.5) * Math.exp(-t / (len_s * 0.4)) * vel;
    add(B.impact, s0 + i, v, v);
  }
}

// rising noise + optional pitched riser, ending at tEnd
function riser(tStart, tEnd, vel, pitched) {
  const s0 = S(tStart), len = S(tEnd - tStart);
  const fL = new SVF(), fR = new SVF();
  let p = 0, p2 = 0.5;
  for (let i = 0; i < len; i++) {
    const u = i / len;
    const fc = 300 * Math.pow(30, u);
    fL.run(noise(), fc, 1.5); fR.run(noise(), fc * 1.07, 1.5);
    let l = fL.bp, r = fR.bp;
    if (pitched) {
      const fr = mtof(52 + 24 * u * u);
      const d = fr / SR; p += d; if (p >= 1) p -= 1; p2 += d * 1.01; if (p2 >= 1) p2 -= 1;
      const s = (2 * p - 1 - polyblep(p, d)) * 0.25;
      const s2 = (2 * p2 - 1 - polyblep(p2, d * 1.01)) * 0.25;
      l += s; r += s2;
    }
    const env = Math.pow(u, 2.5);
    add(B.fx, s0 + i, l * env * vel, r * env * vel);
    add(revSend, s0 + i, l * env * vel * 0.4, r * env * vel * 0.4);
  }
}

function bell(t0, midi, vel, decay) {
  const s0 = S(t0), len = S(decay * 5);
  const fr = mtof(midi);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const mod = Math.sin(TAU * fr * 3.5 * t) * 2.2 * Math.exp(-t / (decay * 0.3));
    const v = Math.sin(TAU * fr * t + mod) * Math.exp(-t / decay) * vel;
    add(B.final, s0 + i, v * 0.8, v * 1.2);
    add(revSend, s0 + i, v * 0.5, v * 0.5);
    add(dlySend, s0 + i, v * 0.3, v * 0.3);
  }
}

// ---------- arrangement ----------
const sixteenth = BEAT / 4;
const swingOff = (k) => (k % 2 === 1 ? sixteenth * 0.06 : 0);

// intro: blips on each beat (the dot pulses), filtered arp, riser + reverse swell into the drop
for (let b = 0; b < 4; b++) blip(TL.ticks[b], [1760, 1318.5, 1568, 2093][b], 0.35);
riser(0.0, BAR, 0.5, false);
whoosh(BAR, BEAT * 1.5, 200, 9000, 0.6, -0.3, 0.3);

// drums bars 1..6
for (const k of TL.kicks) kick(k, 1, k === 8 * BAR);
for (const c of TL.claps) clap(c, 0.9);
for (let bar = 1; bar <= 6; bar++) {
  for (let k = 0; k < 16; k++) {
    const t = bar * BAR + k * sixteenth + swingOff(k);
    const off = k % 4 === 2;
    if (off) hat(t, 0.55, true, 0.15);
    else hat(t, k % 4 === 0 ? 0.22 : 0.32 + 0.1 * ((k * 7) % 3) / 2, false, -0.25 + 0.5 * ((k * 5) % 4) / 3);
  }
}
// build: closed hats 16ths in first half, snare roll with rising pitch & velocity
for (let k = 0; k < 8; k++) hat(7 * BAR + k * sixteenth, 0.3, false, 0.2);
TL.snares.forEach((t, i) => snare(t, 0.35 + 0.6 * (i / TL.snares.length), 200 + i * 14));
riser(7 * BAR, 7 * BAR + 3.5 * BEAT, 0.9, true);

// transition whooshes landing on cuts
for (const w of TL.whooshes) if (w !== 7 * BAR) whoosh(w, BEAT * 0.75, 400, 7000, 0.28);

// bass: rolling 16ths off the kick, bars 1..6, then build pedals 8ths
for (let bar = 1; bar <= 6; bar++) {
  const root = TL.BASS[bar];
  for (let b = 0; b < 4; b++)
    for (let k = 1; k < 4; k++) {
      const t = bar * BAR + b * BEAT + k * sixteenth;
      bassNote(t, sixteenth * 0.8, root + (k === 3 && b % 2 === 1 ? 12 : 0), k === 2 ? 1 : 0.8);
    }
}
for (let k = 0; k < 7; k++) bassNote(7 * BAR + k * BEAT / 2, BEAT * 0.4, TL.BASS[7] + (k % 2) * 12, 0.85);

// stabs: syncopated supersaw chords, bars 1..6
const STAB = [0, 3, 6, 10, 12];
for (let bar = 1; bar <= 6; bar++) {
  const ch = TL.CHORDS[bar];
  for (const k of STAB) {
    const t = bar * BAR + k * sixteenth;
    const dur = k === 12 ? sixteenth * 3 : sixteenth * 1.2;
    supersaw(B.stab, t, dur, ch.concat([ch[0] + 12]), { cutoff: 1400, cutEnv: 5200, cutDecay: 0.08, release: 0.06, gain: 0.11, send: 0.35, scDepth: 0.3 });
  }
}

// pad: sustained, deeply sidechained for the pump; filter opens through the intro
for (let bar = 0; bar <= 7; bar++) {
  const intro = bar === 0;
  supersaw(B.pad, bar * BAR, BAR - 0.01, TL.CHORDS[bar].map((m) => m - 12),
    { cutoff: intro ? (t) => 250 + 1800 * Math.pow(t / BAR, 2) : (bar === 7 ? (t) => 1500 + 5000 * Math.pow((t - 7 * BAR) / BAR, 2) : 2200),
      attack: intro ? 0.4 : 0.01, release: 0.05, gain: intro ? 0.09 : 0.075, detune: 0.18, voices: 5, send: 0.5, scDepth: intro ? 0 : 0.85 });
}

// arp: 16th plucks through chord tones, bars 0..7
const ARP = [0, 1, 2, 3, 4, 3, 2, 1, 0, 2, 4, 2, 3, 1, 4, 3];
for (let bar = 0; bar <= 7; bar++) {
  const ch = TL.CHORDS[bar];
  const tones = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[3] + 12, ch[1] + 24];
  for (let k = 0; k < 16; k++) {
    if (bar === 7 && k >= 14) break; // leave the gap clean
    const t = bar * BAR + k * sixteenth;
    const cut = bar === 0 ? 400 + 3500 * Math.pow(k / 16, 2) : bar === 7 ? 2500 + 6000 * (k / 16) : 3200 + (k % 4 === 0 ? 1500 : 0);
    pluck(t, tones[ARP[k]], (k % 4 === 0 ? 0.32 : 0.22) * (bar === 0 ? 0.9 : 1), cut);
  }
}

// lead hook over bars 5..6 (eighths)
const HOOK = [[76, 74, 72, 74, 76, 79, 76, 72], [77, 76, 72, 77, 81, 79, 77, 76]];
let prev = null;
HOOK.forEach((line, li) => line.forEach((m, k) => {
  const t = (5 + li) * BAR + k * BEAT / 2;
  leadNote(t, BEAT / 2 * 0.85, m, prev, 0.17); prev = m;
}));

// impacts
for (const t of TL.impacts) { crash(t, 0.55, t === 8 * BAR ? 0.9 : 0.6); subBoom(t, 0.75, t === 8 * BAR ? 1.6 : 0.9); }

// finale: big chord, bell sparkle
supersaw(B.final, 8 * BAR, 1.15, TL.CHORDS[8], { cutoff: (t) => 900 + 5200 * Math.exp(-(t - 8 * BAR) / 0.5), release: 0.35, gain: 0.16, send: 0.7, dsend: 0.1, detune: 0.25 });
bell(8 * BAR, 93, 0.12, 0.6);
bell(8 * BAR + BEAT * 0.5, 88, 0.08, 0.5);
bell(8 * BAR + BEAT * 1.0, 84, 0.06, 0.5);
bell(8 * BAR + BEAT * 1.5, 81, 0.05, 0.6);

// ---------- effects ----------
function freeverb(inp, room = 0.86, damp = 0.28) {
  const scale = SR / 44100;
  const combT = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617];
  const apT = [556, 441, 341, 225];
  const out = bus();
  for (const [ch, spread] of [['L', 0], ['R', 23]]) {
    const combs = combT.map((t) => ({ buf: new Float32Array(Math.round((t + spread) * scale)), i: 0, fs: 0 }));
    const aps = apT.map((t) => ({ buf: new Float32Array(Math.round((t + spread) * scale)), i: 0 }));
    const x = inp[ch], y = out[ch];
    // 25ms predelay
    const pd = Math.round(0.025 * SR);
    for (let n = 0; n < N; n++) {
      const xi = (n >= pd ? x[n - pd] : 0) * 0.015;
      let s = 0;
      for (const c of combs) {
        const o = c.buf[c.i];
        c.fs = o * (1 - damp) + c.fs * damp;
        c.buf[c.i] = xi + c.fs * room;
        if (++c.i >= c.buf.length) c.i = 0;
        s += o;
      }
      for (const a of aps) {
        const o = a.buf[a.i];
        a.buf[a.i] = s + o * 0.5;
        if (++a.i >= a.buf.length) a.i = 0;
        s = o - s;
      }
      y[n] = s;
    }
  }
  return out;
}

function pingpong(inp, time, fb) {
  const d = Math.round(time * SR);
  const out = bus();
  const bl = new Float32Array(d), br = new Float32Array(d);
  let lpL = 0, lpR = 0, j = 0;
  for (let n = 0; n < N; n++) {
    const ol = bl[j], or = br[j];
    lpL += (ol - lpL) * 0.35; lpR += (or - lpR) * 0.35;
    const mono = (inp.L[n] + inp.R[n]) * 0.5;
    bl[j] = mono + lpR * fb;
    br[j] = lpL * fb;
    if (++j >= d) j = 0;
    out.L[n] = ol; out.R[n] = or;
  }
  return out;
}

const dly = pingpong(dlySend, BEAT * 0.75, 0.42);
for (let n = 0; n < N; n++) { revSend.L[n] += dly.L[n] * 0.3; revSend.R[n] += dly.R[n] * 0.3; }
const rev = freeverb(revSend);

// ---------- mix ----------
const LEVEL = { kick: 0.66, clap: 0.45, hat: 0.55, snare: 0.5, bass: 0.27, stab: 1.25, pad: 1.0, arp: 0.85,
  lead: 0.75, fx: 0.55, impact: 0.85, final: 1.0 };
const mixL = new Float32Array(N), mixR = new Float32Array(N);
for (const k in B) {
  const g = LEVEL[k]; const b = B[k];
  let pk = 0, rms = 0;
  for (let n = 0; n < N; n++) { mixL[n] += b.L[n] * g; mixR[n] += b.R[n] * g; pk = Math.max(pk, Math.abs(b.L[n] * g)); rms += (b.L[n] * g) ** 2; }
  console.log(k.padEnd(8), 'peak', pk.toFixed(3), 'rms', Math.sqrt(rms / N).toFixed(4));
}
const REV = 0.55, DLY = 0.35;
for (let n = 0; n < N; n++) {
  const rd = sc(n, 0.4);
  mixL[n] += (rev.L[n] * REV) * rd + dly.L[n] * DLY;
  mixR[n] += (rev.R[n] * REV) * rd + dly.R[n] * DLY;
}

// gap before the final hit: hard stop, then the hit re-enters on its own
const gapA = S(7 * BAR + 3.5 * BEAT), gapB = S(8 * BAR);
for (let n = gapA; n < gapB; n++) {
  const g = Math.max(0, 1 - (n - gapA) / S(0.006));
  mixL[n] *= g; mixR[n] *= g;
}
// tail fade to silence at 15s
const fA = S(TL.DURATION - 0.9);
for (let n = fA; n < N; n++) { const u = (n - fA) / (N - fA); const g = 0.5 + 0.5 * Math.cos(Math.PI * u); mixL[n] *= g; mixR[n] *= g; }

// DC / rumble high-pass, glue saturation, normalize
let hpL = 0, hpR = 0, xL = 0, xR = 0;
const a = Math.exp(-TAU * 22 / SR);
for (let n = 0; n < N; n++) {
  hpL = a * (hpL + mixL[n] - xL); xL = mixL[n]; mixL[n] = hpL;
  hpR = a * (hpR + mixR[n] - xR); xR = mixR[n]; mixR[n] = hpR;
}
let peak = 0;
for (let n = 0; n < N; n++) peak = Math.max(peak, Math.abs(mixL[n]), Math.abs(mixR[n]));
const pre = 1.25 / peak;
peak = 0;
for (let n = 0; n < N; n++) {
  mixL[n] = Math.tanh(mixL[n] * pre); mixR[n] = Math.tanh(mixR[n] * pre);
  peak = Math.max(peak, Math.abs(mixL[n]), Math.abs(mixR[n]));
}
const post = 0.95 / peak;
let rmsT = 0;
for (let n = 0; n < N; n++) { mixL[n] *= post; mixR[n] *= post; rmsT += mixL[n] ** 2; }
console.log('master rms dBFS', (20 * Math.log10(Math.sqrt(rmsT / N))).toFixed(1));

// ---------- write wav ----------
const out = Buffer.alloc(44 + N * 4);
out.write('RIFF', 0); out.writeUInt32LE(36 + N * 4, 4); out.write('WAVE', 8);
out.write('fmt ', 12); out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(2, 22);
out.writeUInt32LE(SR, 24); out.writeUInt32LE(SR * 4, 28); out.writeUInt16LE(4, 32); out.writeUInt16LE(16, 34);
out.write('data', 36); out.writeUInt32LE(N * 4, 40);
for (let n = 0; n < N; n++) {
  const d = () => (rnd() - rnd()) / 32768;
  out.writeInt16LE(Math.round(clamp(mixL[n] + d(), -1, 1) * 32767), 44 + n * 4);
  out.writeInt16LE(Math.round(clamp(mixR[n] + d(), -1, 1) * 32767), 46 + n * 4);
}
fs.writeFileSync(process.argv[2] || 'soundtrack.wav', out);
console.log('wrote', N, 'samples');
