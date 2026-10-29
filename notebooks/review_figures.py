"""Create review figures from committed JSON, without downloading data or retraining.

Run from the repository root: python notebooks/review_figures.py
Requires matplotlib. Outputs PNG, SVG and PDF under docs/review/figures/.
"""

from __future__ import annotations

import json
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "web" / "public" / "data"
OUT = ROOT / "docs" / "review" / "figures"


def save(fig: plt.Figure, name: str) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for extension in ("png", "svg", "pdf"):
        target = OUT / f"{name}.{extension}"
        fig.savefig(target, dpi=300, facecolor="white")
        if extension == "svg":
            lines = target.read_text(encoding="utf-8").splitlines()
            target.write_text("\n".join(line.rstrip() for line in lines) + "\n", encoding="utf-8")
    plt.close(fig)


def model_comparison() -> None:
    data = json.loads((DATA / "validation.json").read_text(encoding="utf-8"))
    models = ["prd_4.4x", "naive", "monthly", "negbin", "gbm", "ensemble"]
    labels = ["Fixed 4.4× factor", "Factor fitted within fold", "Monthly factors", "Negative binomial",
              "Bagged LightGBM", "Shipped ensemble"]
    summary = {row["model"]: row for row in data["summary"]}
    values = [summary[model]["mae_week"] for model in models]
    fig, ax = plt.subplots(figsize=(11, 5.5))
    fig.subplots_adjust(left=0.28, right=0.95, top=0.78, bottom=0.21)
    colors = ["#CFCECE"] * 5 + ["#0F4D92"]
    bars = ax.barh(labels, values, color=colors, edgecolor="#4D4D4D", linewidth=0.7, height=0.65)
    ax.invert_yaxis()
    ax.set_xlim(0, max(values) * 1.16)
    ax.set_xlabel("National weekly mean absolute error (detections); lower is better", fontsize=11)
    ax.xaxis.grid(True, color="#E8EBEF", linewidth=0.7)
    ax.set_axisbelow(True)
    for bar, value in zip(bars, values, strict=True):
        ax.text(value + 0.9, bar.get_y() + bar.get_height() / 2, f"{value:.1f}", va="center", fontsize=12)
    fig.text(0.04, 0.94, "Internal reconstruction benchmark", fontsize=20, weight="bold", color="#172A3A")
    years = data["years"]
    fig.text(0.04, 0.875, f"Leave-one-year-out comparison, {min(years)}–{max(years)}; mean across held-out years",
             fontsize=12, color="#4D4D4D")
    gain = (1 - summary["ensemble"]["mae_week"] / summary["naive"]["mae_week"]) * 100
    fig.text(0.04, 0.085, f"Ensemble: {gain:.2f}% lower MAE than the within-fold fitted factor.", fontsize=11)
    fig.text(0.04, 0.035, "Source: committed validation.json. Not a new training run or independent final holdout.",
             fontsize=10, color="#4D4D4D")
    save(fig, "model-comparison")


def continuity_comparison() -> None:
    data = json.loads((DATA / "partner.json").read_text(encoding="utf-8"))
    rows = sorted(data["annual"], key=lambda row: row["y"])
    years = [row["y"] for row in rows]
    fig, ax = plt.subplots(figsize=(11, 6))
    fig.subplots_adjust(left=0.09, right=0.97, top=0.69, bottom=0.23)
    for key, label, color, style in (
        ("ba_km2", "ESA burned area", "#42949E", "-"),
        ("harm", "Harmonized detections", "#0F4D92", "-"),
        ("stitched", "Raw stitched detections", "#767676", "--"),
    ):
        reference = [row[key] for row in rows if 2012 <= row["y"] <= 2024]
        mean = sum(reference) / len(reference)
        ax.plot(years, [row[key] / mean for row in rows], label=label, color=color, linestyle=style, linewidth=2.3)
    for year in (2012, 2019):
        ax.axvline(year, color="#AAB2BB", linestyle=":", linewidth=1.4)
    ax.set_xticks([2003, 2006, 2009, 2012, 2015, 2018, 2021, 2024])
    ax.set_xlim(2003, 2024)
    ax.set_ylabel("Relative to each series' 2012–2024 mean", fontsize=11)
    ax.yaxis.grid(True, color="#E8EBEF", linewidth=0.7)
    ax.set_axisbelow(True)
    handles, labels = ax.get_legend_handles_labels()
    fig.legend(handles, labels, loc="upper left", bbox_to_anchor=(0.08, 0.83), ncol=3, fontsize=10)
    fig.text(0.04, 0.95, "Sensor continuity: an external cross-check", fontsize=20, weight="bold", color="#172A3A")
    fig.text(0.04, 0.89, "Normalized annual series, 2003–2024; different observables, not interchangeable measurements",
             fontsize=11, color="#4D4D4D")
    fig.text(0.04, 0.125,
             "Dotted markers: VIIRS begins (2012); ESA product changes from MRBA to Sentinel-3 SYN (2019).",
             fontsize=10)
    fig.text(0.04, 0.075, "ESA burned area is measured in area; the other series count satellite detections.",
             fontsize=10)
    fig.text(0.04, 0.03,
             "Source: committed partner.json. Agreement supports plausibility, not ground-truth fire-count accuracy.",
             fontsize=10, color="#4D4D4D")
    save(fig, "continuity-crosscheck")


def main() -> None:
    plt.rcParams.update({
        "font.family": ["Arial", "DejaVu Sans", "sans-serif"],
        "font.size": 12,
        "axes.spines.top": False,
        "axes.spines.right": False,
        "axes.linewidth": 1.2,
        "legend.frameon": False,
        "svg.fonttype": "none",
        "pdf.fonttype": 42,
    })
    model_comparison()
    continuity_comparison()
    print(f"Saved PNG, SVG and PDF review figures in {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
