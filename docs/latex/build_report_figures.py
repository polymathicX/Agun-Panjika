"""Build compact vector charts for the LaTeX reports from committed results."""

from __future__ import annotations

import json
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "web/public/data"
OUT = Path(__file__).resolve().parent / "figures"


def main() -> None:
    OUT.mkdir(exist_ok=True)
    plt.rcParams.update({
        "font.family": ["Arial", "DejaVu Sans", "sans-serif"],
        "font.size": 10,
        "axes.spines.top": False,
        "axes.spines.right": False,
        "axes.linewidth": 0.8,
        "legend.frameon": False,
        "pdf.fonttype": 42,
    })
    validation = json.loads((DATA / "validation.json").read_text(encoding="utf-8"))
    summary = {row["model"]: row for row in validation["summary"]}
    rows = [summary[key] for key in ("prd_4.4x", "naive", "monthly", "negbin", "gbm", "ensemble")]
    labels = ["Fixed 4.4× factor", "Factor fitted within fold", "Monthly factors",
              "Negative binomial", "Bagged LightGBM", "Shipped ensemble"]
    fig, ax = plt.subplots(figsize=(6.5, 2.65))
    fig.subplots_adjust(left=.33, right=.965, top=.98, bottom=.19)
    values = [row["mae_week"] for row in rows]
    bars = ax.barh(labels, values, color=["#CFCECE"] * 5 + ["#0F4D92"],
                   edgecolor="#536575", linewidth=.6, height=.63)
    ax.invert_yaxis()
    ax.set_xlim(0, 70)
    ax.set_xlabel("National weekly MAE (detections)", fontsize=10)
    ax.xaxis.grid(True, color="#E5EBEF", linewidth=.6)
    ax.set_axisbelow(True)
    for bar, value in zip(bars, values, strict=True):
        ax.text(value + .8, bar.get_y() + bar.get_height() / 2, f"{value:.1f}",
                va="center", fontsize=10)
    fig.savefig(OUT / "model-comparison.pdf", metadata={"CreationDate": None, "ModDate": None})
    plt.close(fig)

    partner = json.loads((DATA / "partner.json").read_text(encoding="utf-8"))
    rows = sorted(partner["annual"], key=lambda row: row["y"])
    fig, ax = plt.subplots(figsize=(6.5, 2.85))
    fig.subplots_adjust(left=.11, right=.98, top=.83, bottom=.16)
    for key, label, color, style in [
        ("ba_km2", "ESA burned area", "#42949E", "-"),
        ("harm", "Harmonized detections", "#0F4D92", "-"),
        ("stitched", "Raw stitched detections", "#767676", "--"),
    ]:
        ref = [r[key] for r in rows if 2012 <= r["y"] <= 2024]
        mean = sum(ref) / len(ref)
        ax.plot([r["y"] for r in rows], [r[key] / mean for r in rows],
                color=color, linestyle=style, linewidth=1.6, label=label)
    for year in (2012, 2019):
        ax.axvline(year, color="#AAB8C3", linestyle=":", linewidth=1)
    ax.set_xlim(2003, 2024)
    ax.set_xticks([2003, 2006, 2009, 2012, 2015, 2018, 2021, 2024])
    ax.set_ylabel("Normalized annual activity", fontsize=10)
    ax.yaxis.grid(True, color="#E5EBEF", linewidth=.6)
    ax.set_axisbelow(True)
    fig.legend(*ax.get_legend_handles_labels(), loc="upper center", ncol=3,
               bbox_to_anchor=(.52, 1.01), fontsize=8.6, columnspacing=1.1, handlelength=2)
    fig.savefig(OUT / "continuity-crosscheck.pdf", metadata={"CreationDate": None, "ModDate": None})
    plt.close(fig)
    print("LaTeX report figures generated from validation.json and partner.json.")


if __name__ == "__main__":
    main()
