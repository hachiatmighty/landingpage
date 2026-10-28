// Shared musical timeline: the synth and the renderer both read this, so every
// visual cut is derived from the exact same beat grid the audio is built on.
// 144 BPM -> 1 beat = 25 frames @ 60fps, 1 bar = 100 frames. 9 bars = 900 frames = 15.000s.
(function (root) {
  const BPM = 144;
  const FPS = 60;
  const BEAT = 60 / BPM;            // 0.41666 s
  const BAR = BEAT * 4;             // 1.66666 s
  const BARS = 9;
  const DURATION = BAR * BARS;      // 15 s
  const FRAMES_PER_BEAT = BEAT * FPS; // 25

  // Bar map:
  // 0 intro | 1 title drop | 2 form | 3 particles | 4 type | 5 tunnel | 6 principles | 7 build | 8 finale
  const SECTIONS = ['INTRO', 'TITLE', 'FORM', 'PARTICLES', 'TYPE', 'DEPTH', 'PRINCIPLES', 'BUILD', 'FINALE'];

  const kicks = [];
  const claps = [];
  const snares = [];   // build roll
  const ticks = [];    // intro beat blips
  const impacts = [];  // big downbeat hits
  const whooshes = []; // transition whoosh: time of the cut it lands on

  for (let bar = 1; bar <= 6; bar++)
    for (let b = 0; b < 4; b++) kicks.push((bar * 4 + b) * BEAT);
  // build bar: kick on first three beats, then let go
  for (let b = 0; b < 3; b++) kicks.push((7 * 4 + b) * BEAT);
  kicks.push(8 * BAR);

  for (let bar = 1; bar <= 6; bar++) { claps.push((bar * 4 + 1) * BEAT); claps.push((bar * 4 + 3) * BEAT); }
  for (let b = 0; b < 4; b++) ticks.push(b * BEAT);

  // snare roll across bar 7: 8ths, 8ths, 16ths, 32nds (first half of beat 4), then silence
  const s7 = 7 * BAR;
  for (let i = 0; i < 4; i++) snares.push(s7 + i * BEAT / 2);
  for (let i = 0; i < 4; i++) snares.push(s7 + 2 * BEAT + i * BEAT / 4);
  for (let i = 0; i < 4; i++) snares.push(s7 + 3 * BEAT + i * BEAT / 8);

  impacts.push(1 * BAR, 8 * BAR);
  for (const bar of [2, 3, 4, 5, 6, 7]) whooshes.push(bar * BAR);

  // chord per bar (midi), bass root per bar
  const CHORDS = [
    [57, 60, 64, 69], // Am (intro)
    [57, 60, 64, 69], // Am
    [53, 57, 60, 65], // F
    [55, 60, 64, 67], // C
    [55, 59, 62, 67], // G
    [57, 60, 64, 69], // Am
    [53, 57, 60, 65], // F
    [56, 59, 64, 68], // E (dominant, build)
    [45, 52, 57, 59, 60, 64, 69, 76], // Am(add9) final
  ];
  const BASS = [33, 33, 29, 36, 31, 33, 29, 28, 33];

  const TL = { BPM, FPS, BEAT, BAR, BARS, DURATION, FRAMES_PER_BEAT, SECTIONS,
    kicks, claps, snares, ticks, impacts, whooshes, CHORDS, BASS };
  if (typeof module !== 'undefined') module.exports = TL; else root.TL = TL;
})(this);
