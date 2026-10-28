#!/usr/bin/env bash
# Builds showreel.mp4 from scratch: synthesize audio, render 900 frames, mux.
set -euo pipefail
cd "$(dirname "$0")"
WORK=${WORK:-./build}
mkdir -p "$WORK"
node synth.js "$WORK/soundtrack.wav"
node render.js video "$WORK/vid" "${WORKERS:-4}"
ffmpeg -y -loglevel error -f concat -safe 0 -i "$WORK/vid/segments.txt" -i "$WORK/soundtrack.wav" \
  -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -ar 48000 -movflags +faststart -t 15 showreel.mp4
echo "wrote $(pwd)/showreel.mp4"
