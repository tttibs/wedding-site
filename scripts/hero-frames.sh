#!/bin/sh
# Regenerates the hero scroll-scrub frames from the source film.
# Usage: sh scripts/hero-frames.sh [path/to/video.mp4]
# Output: site/invite/hero/d/ (desktop), site/invite/hero/m/ (portrait, square),
#         site/invite/hero/still.jpg and still-square.jpg
# After regenerating, update HERO.desktop.count / HERO.mobile.count in site/invite/invite.js
# and bump RT_VERSION so browsers fetch the new frames.
set -e
SRC="${1:-assets/hero/source/Romantic Candlelit Wedding Table Setting.mp4}"
START=2          # seconds trimmed from the start of the film
OUT=site/invite/hero
rm -rf "$OUT/d" "$OUT/m"
mkdir -p "$OUT/d" "$OUT/m"

# Desktop: every source frame, full composition, native 1728 wide
ffmpeg -v error -ss "$START" -i "$SRC" -an \
  -vf "scale=1728:-2:flags=lanczos" \
  -c:v libwebp -quality 66 -compression_level 6 -start_number 1 "$OUT/d/%03d.webp"

# Mobile (portrait screens): every second frame, a centred square crop, 1200x1200
ffmpeg -v error -ss "$START" -i "$SRC" -an \
  -vf "select='not(mod(n\,2))',crop=ih:ih:(iw-ih)/2:0,scale=1200:1200:flags=lanczos" \
  -fps_mode vfr -c:v libwebp -quality 66 -compression_level 6 -start_number 1 "$OUT/m/%03d.webp"

# Still: the first frame, for reduced motion and first paint
ffmpeg -v error -y -ss "$START" -i "$SRC" -an -frames:v 1 \
  -vf "scale=1728:-2:flags=lanczos" -q:v 3 "$OUT/still.jpg"
ffmpeg -v error -y -ss "$START" -i "$SRC" -an -frames:v 1 \
  -vf "crop=ih:ih:(iw-ih)/2:0,scale=1200:1200:flags=lanczos" -q:v 3 "$OUT/still-square.jpg"

echo "desktop: $(ls "$OUT/d" | wc -l) frames, $(du -sh "$OUT/d" | cut -f1)"
echo "mobile:  $(ls "$OUT/m" | wc -l) frames, $(du -sh "$OUT/m" | cut -f1)"
