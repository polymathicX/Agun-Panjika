"""Make a compact README preview from the actual globe recording, not a mockup."""
from pathlib import Path
import subprocess

import imageio_ffmpeg
from PIL import Image

root = Path(__file__).resolve().parents[2]
source = root / "docs/latex/build/submission/world-motion.webm"
target = Path(__file__).with_name("earth-motion.gif")
assert source.is_file(), "Run the presentation capture first; see docs/submission/README.md"
subprocess.run([
    imageio_ffmpeg.get_ffmpeg_exe(), "-hide_banner", "-loglevel", "error", "-y",
    "-ss", "1.7", "-t", "5", "-i", str(source),
    "-filter_complex",
    "fps=10,scale=800:-1:flags=lanczos,split[a][b];"
    "[a]palettegen=max_colors=96[p];[b][p]paletteuse=dither=bayer:bayer_scale=3",
    "-loop", "0", str(target),
], check=True)
with Image.open(target) as gif:
    assert gif.n_frames >= 45 and gif.width == 800
    duration = sum(gif.seek(i) or gif.info.get("duration", 0) for i in range(gif.n_frames))
    assert 4500 <= duration <= 5100
assert target.stat().st_size < 3_000_000, "Keep the optional preview small"
print(f"Actual globe preview: {duration / 1000:g}s, {target.stat().st_size:,} bytes")
