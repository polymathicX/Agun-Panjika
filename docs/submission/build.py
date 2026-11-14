"""Build the seven-slide PDF, report figures and a 29-second captioned demo.

Requires the local production preview on port 4173, XeLaTeX, matplotlib, PyMuPDF
and imageio-ffmpeg. Use --base URL for another preview address.
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

SOURCE = Path(__file__).resolve().parent
ROOT = SOURCE.parents[1]
BUILD = ROOT / "docs/latex/build/submission"
FIGURES = ROOT / "docs/latex/figures"
PUBLIC = ROOT / "web/public/demo"


def figures() -> None:
    FIGURES.mkdir(exist_ok=True)
    plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 13, "pdf.fonttype": 42,
                         "axes.spines.top": False, "axes.spines.right": False,
                         "axes.edgecolor": "#d4dfe6", "text.color": "#173047",
                         "axes.labelcolor": "#173047", "xtick.color": "#536575", "ytick.color": "#173047"})
    catalog = json.loads((ROOT / "web/public/data/global/catalog.json").read_text(encoding="utf-8"))
    areas = catalog["areas"]
    values = [-a["evaluation"]["improvement_pct"] for a in areas]
    fig, ax = plt.subplots(figsize=(8.6, 4.2), layout="constrained")
    colors = ["#245878" if x < 0 else "#bc4221" for x in values]
    ax.barh(range(4), values, color=colors, height=.58)
    ax.set_yticks(range(4), ["Bangladesh", "Nepal", "Chin, Myanmar", "Punjab & Haryana"])
    ax.invert_yaxis(); ax.axvline(0, color="#536575", lw=.8)
    ax.set_xlim(-43, 65); ax.set_xlabel("Change in weekly error versus a fitted factor (%)")
    ax.xaxis.grid(True, color="#d4dfe6", alpha=.6); ax.set_axisbelow(True)
    for i, value in enumerate(values):
        ax.text(value / 2 if value < 0 else value + 1, i,
                f"{abs(value):.1f}% {'lower' if value < 0 else 'higher'}",
                ha="center" if value < 0 else "left", va="center",
                color="white" if value < 0 else "#173047", fontsize=12, weight="bold")
    for suffix in ("pdf", "png"):
        fig.savefig(FIGURES / f"global-transfer.{suffix}", dpi=220, facecolor="white")
    plt.close(fig)

    doc = json.loads((ROOT / "web/public/data/national.json").read_text(encoding="utf-8"))
    years = np.arange(2003, 2026)
    raw = [sum(w.get("modis" if y < 2012 else "viirs", 0) for w in doc["weeks"] if w["y"] == y) for y in years]
    harmonized = [next(a["harm"] for a in doc["annual"] if a["y"] == y) for y in years]
    fig, ax = plt.subplots(figsize=(8.6, 4.2), layout="constrained")
    ax.plot(years, np.array(raw)/1000, color="#bc4221", lw=2.5, label="Raw sensor join")
    ax.plot(years, np.array(harmonized)/1000, color="#245878", lw=2.5, label="Harmonized record")
    ax.axvline(2012, color="#536575", ls="--", lw=1)
    ax.text(2012.2, ax.get_ylim()[1]*.95, "VIIRS begins", fontsize=12, va="top")
    ax.set_xticks([2003, 2008, 2012, 2018, 2024]); ax.set_ylabel("Thousand detections / year")
    ax.grid(axis="y", color="#d4dfe6", alpha=.6); ax.legend(frameon=False, loc="upper left", fontsize=12)
    for suffix in ("pdf", "png"):
        fig.savefig(FIGURES / f"sensor-story.{suffix}", dpi=220, facecolor="white")
    plt.close(fig)
    rows = []
    for a in areas:
        e=a["evaluation"]
        label=a['name_en'].replace('&', r'\&')
        rows.append(f"{label} & {e['models']['ensemble']['mae_week']:.1f} & "
                    f"{e['models']['naive']['mae_week']:.1f} & {e['coverage80']*100:.1f}\\% \\\\")
    (SOURCE / "numbers.tex").write_text("\\newcommand{\\CountryCount}{242}\n"
                                        "\\newcommand{\\CaseTableRows}{"+"\n".join(rows)+"}\n", encoding="utf-8")


def compile_slides(env: dict) -> None:
    import fitz
    executable = shutil.which("xelatex")
    if not executable:
        raise RuntimeError("XeLaTeX is required")
    for iteration in (1,2):
        result = subprocess.run([executable, "--disable-installer", "-interaction=nonstopmode", "-halt-on-error",
                                 "-output-directory="+str(BUILD), "slides.tex"], cwd=SOURCE,
                                env=env, capture_output=True, text=True, encoding="utf-8", errors="replace")
        (BUILD / f"slides-{iteration}.log.txt").write_text(result.stdout+result.stderr,encoding="utf-8")
        if result.returncode:
            raise RuntimeError("\n".join((result.stdout+result.stderr).splitlines()[-25:]))
    log=(BUILD / "slides.log").read_text(encoding="utf-8",errors="replace")
    issues=[line for line in log.splitlines() if "Overfull" in line or "Missing character:" in line]
    if issues:
        raise RuntimeError("\n".join(issues))
    pdf=fitz.open(BUILD / "slides.pdf")
    if len(pdf)!=7:
        raise RuntimeError(f"Demo must be seven slides; produced {len(pdf)}")
    for i,page in enumerate(pdf):
        page.get_pixmap(matrix=fitz.Matrix(1.4,1.4)).save(BUILD / f"slide-review-{i+1}.png")
    shutil.copyfile(BUILD / "slides.pdf", ROOT / "docs/pdf/GLOBAL_DEMO_SLIDES.pdf")
    shutil.copyfile(BUILD / "slides.pdf", PUBLIC / "agun-panjika-slides.pdf")


def movie(env: dict) -> None:
    import imageio_ffmpeg
    exe=imageio_ffmpeg.get_ffmpeg_exe()
    durations=[3,4,5,6,6,5]
    segments=[]
    for number,duration in enumerate(durations,1):
        destination=BUILD / f"segment-{number}.mp4"
        args=[exe,"-y","-loglevel","error","-loop","1","-i",str(BUILD/f"scene-{number}.png")]
        if number in (3,4):
            name="world" if number==3 else "experiment"
            meta=json.loads((BUILD/f"{name}-clip.json").read_text())
            r=meta["region"]
            args += ["-ss",str(meta["start"]),"-i",str(BUILD/f"{name}-motion.webm")]
            if number==3:
                region="scale=1120:760:force_original_aspect_ratio=decrease"
                overlay="overlay=730:(220+(760-overlay_h)/2)"
            else:
                crop=f"crop={int(r['width'])}:{int(r['height'])}:{int(r['x'])}:{int(r['y'])}"
                region=crop+",scale=1500:650:force_original_aspect_ratio=decrease"
                overlay="overlay=(1920-overlay_w)/2:(350+(650-overlay_h)/2)"
            args += ["-filter_complex",f"[1:v]{region}[motion];[0:v][motion]{overlay}[v]","-map","[v]"]
        args += ["-t",str(duration),"-r","30","-c:v","libx264","-preset","fast","-crf","19",
                 "-pix_fmt","yuv420p","-an",str(destination)]
        subprocess.run(args,check=True,env=env)
        segments.append(destination)
    listing=BUILD/"segments.txt"
    listing.write_text("\n".join("file '"+p.as_posix()+"'" for p in segments),encoding="utf-8")
    destination=PUBLIC/"agun-panjika-29s.mp4"
    subprocess.run([exe,"-y","-loglevel","error","-f","concat","-safe","0","-i",str(listing),"-c","copy",
                    "-t","29","-movflags","+faststart","-metadata","title=Agun Panjika - Team KUETaguns",
                    "-metadata","artist=KUETaguns","-metadata",
                    "comment=AI-assisted coding and demo assembly; actual app captures and NASA observations; no synthetic narrator.",
                    str(destination)],check=True,env=env)
    probe=subprocess.run([exe,"-i",str(destination)],capture_output=True,text=True,encoding="utf-8",errors="replace")
    if "Duration: 00:00:29.00" not in probe.stderr:
        raise RuntimeError("Unexpected demo duration: "+probe.stderr[-1200:])
    (PUBLIC/"demo-metadata.json").write_text(json.dumps({"duration_seconds":29,"slides":7,"team":"KUETaguns",
        "narration":"None; English captions","visuals":"Actual app captures and data plots; real interaction footage",
        "assistance":"AI-assisted coding, plotting, editorial work and assembly; no synthetic fire observations",
        "format":"1920x1080, H.264, 30 fps","sources":["NASA FIRMS / LANCE / ESDIS","Natural Earth",
        "Solar System Scope Earth/cloud textures, CC BY 4.0"]},indent=2),encoding="utf-8")


def main() -> None:
    args=argparse.ArgumentParser(description=__doc__)
    args.add_argument("--base",default="http://127.0.0.1:4173")
    args.add_argument("--no-capture",action="store_true")
    options=args.parse_args()
    BUILD.mkdir(parents=True,exist_ok=True); PUBLIC.mkdir(parents=True,exist_ok=True)
    env=os.environ.copy();key=next(k for k in env if k.lower()=="path")
    env[key]=os.pathsep.join(p for p in env[key].split(os.pathsep) if Path(p).is_dir())
    if not options.no_capture:
        subprocess.run(["node",str(SOURCE/"capture.mjs"),options.base],cwd=ROOT,env=env,check=True)
    figures();compile_slides(env)
    subprocess.run(["node",str(SOURCE/"capture.mjs"),options.base,"--storyboard"],cwd=ROOT,env=env,check=True)
    movie(env)
    print("Built seven-slide PDF and 29.00-second demo")


if __name__=="__main__":
    main()
