"""
Synthesize the v5 video's UI sound effects, one for every cue point.

Everything here is generated from scratch (no samples), so it can be used anywhere without a
licence. Run from the video/ folder:

    python3 scripts/make_audio.py

It writes 48 kHz mono WAVs to public/sfx/. Music is added separately, outside this project.
"""

import os
import wave

import numpy as np

SR = 48_000
OUT = os.path.join(os.path.dirname(__file__), "..", "public")
rng = np.random.default_rng(7)


def t(seconds):
    return np.arange(int(SR * seconds)) / SR


def write(path, audio, peak=0.9):
    audio = np.asarray(audio, dtype=np.float64)
    audio = audio / (np.max(np.abs(audio)) + 1e-9) * peak
    channels = 1 if audio.ndim == 1 else audio.shape[0]
    frames = audio if audio.ndim == 1 else audio.T.reshape(-1)
    full = os.path.join(OUT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with wave.open(full, "wb") as w:
        w.setnchannels(channels)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((frames * 32767).astype("<i2").tobytes())
    print("wrote", path, f"{len(audio if audio.ndim == 1 else audio[0]) / SR:.2f}s")


def lowpass(x, cutoff):
    """One-pole low-pass, run twice for a gentler 12 dB/oct slope."""
    a = np.exp(-2 * np.pi * cutoff / SR)
    for _ in range(2):
        y = np.empty_like(x)
        acc = 0.0
        for i, v in enumerate(x):
            acc = (1 - a) * v + a * acc
            y[i] = acc
        x = y
    return x


def fade_in(x, seconds):
    n = int(SR * seconds)
    x[:n] *= np.linspace(0, 1, n) ** 2
    return x


def reverb(x, seconds=1.6, mix=0.25):
    """A small room: convolve with decaying noise."""
    n = int(SR * seconds)
    ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 7, n))
    ir = lowpass(ir, 5000)
    size = len(x) + n
    nfft = 1 << (size - 1).bit_length()
    wet = np.fft.irfft(np.fft.rfft(x, nfft) * np.fft.rfft(ir, nfft), nfft)[:size]
    wet /= np.max(np.abs(wet)) + 1e-9
    dry = np.concatenate([x / (np.max(np.abs(x)) + 1e-9), np.zeros(n)])
    return (1 - mix) * dry + mix * wet


def bell(freq, seconds, decay, partials=((1, 1.0), (2.0, 0.35), (3.01, 0.12), (4.2, 0.05))):
    tt = t(seconds)
    tone = sum(amp * np.sin(2 * np.pi * freq * ratio * tt) * np.exp(-tt * decay * ratio**0.5) for ratio, amp in partials)
    return fade_in(tone, 0.004)


# ---------- UI effects ----------

def tick(freq=1350):
    """One soft notification tick: a short wooden knock at `freq`."""
    tt = t(0.12)
    body = np.sin(2 * np.pi * freq * tt) * np.exp(-tt * 60) + 0.4 * np.sin(2 * np.pi * 2 * freq * tt) * np.exp(-tt * 90)
    click = lowpass(rng.standard_normal(len(tt)) * np.exp(-tt * 400), 4000) * 0.3
    return reverb(fade_in(body + click, 0.001), 0.5, 0.15)


def tap():
    """A soft finger tap: a low thump with a little skin."""
    tt = t(0.12)
    thump = np.sin(2 * np.pi * 170 * tt * (1 - 0.3 * tt / 0.12)) * np.exp(-tt * 45)
    skin = lowpass(rng.standard_normal(len(tt)) * np.exp(-tt * 300), 2500) * 0.35
    return fade_in(thump + skin, 0.0015)


def key():
    """One soft key press, quieter and brighter than a tap."""
    tt = t(0.07)
    click = lowpass(rng.standard_normal(len(tt)) * np.exp(-tt * 220), 3200)
    body = 0.5 * np.sin(2 * np.pi * 420 * tt) * np.exp(-tt * 90)
    return fade_in(click + body, 0.001)


def whoosh(seconds=0.7):
    """Air moving past: band-limited noise that swells and sweeps up, for each camera pan."""
    n = int(SR * seconds)
    noise = rng.standard_normal(n)
    env = np.sin(np.linspace(0, np.pi, n)) ** 2
    lo = lowpass(noise, 900)
    hi = lowpass(noise, 2600) - lowpass(noise, 600)
    sweep = np.linspace(0, 1, n)
    return reverb((lo * (1 - sweep) + hi * sweep) * env, 0.6, 0.2)


def mail():
    """A gentle two-note mail chime."""
    a = bell(1318.5, 1.2, 4.5)  # E6
    b = bell(1975.5, 1.0, 5.0)  # B6
    out = np.zeros(int(SR * 1.3))
    out[: len(a)] += a
    start = int(SR * 0.09)
    out[start : start + len(b)] += 0.8 * b
    return reverb(out, 1.0, 0.25)


def warm_chime():
    """The reply landing: a soft, rolled major chord with a long tail."""
    notes = [523.25, 659.25, 783.99, 1046.5]  # C5 E5 G5 C6
    out = np.zeros(int(SR * 2.4))
    for i, f in enumerate(notes):
        b = bell(f, 2.2, 2.2) * (1.0 - 0.12 * i)
        s = int(SR * 0.045 * i)
        out[s : s + len(b)] += b
    return reverb(out, 1.8, 0.35)


if __name__ == "__main__":
    # one tick per notification, each a little higher (about a whole tone apart)
    for i, freq in enumerate([1350, 1515, 1700], start=1):
        write(f"sfx/tick-{i}.wav", tick(freq))
    write("sfx/tap.wav", tap())
    write("sfx/key.wav", key())
    write("sfx/whoosh.wav", whoosh())
    write("sfx/mail.wav", mail())
    write("sfx/warm-chime.wav", warm_chime())
