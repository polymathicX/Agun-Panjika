"""Build both mentor reports with XeLaTeX. Run: python docs/latex/build.py."""

from __future__ import annotations

import os
import shutil
import subprocess
import sys
from pathlib import Path

SOURCE = Path(__file__).resolve().parent
BUILD = SOURCE / "build"
DESTINATION = SOURCE.parent / "pdf"


def main() -> None:
    executable = shutil.which("xelatex")
    if not executable:
        raise SystemExit("XeLaTeX is required (MiKTeX or TeX Live).")
    BUILD.mkdir(exist_ok=True)
    DESTINATION.mkdir(exist_ok=True)
    # MiKTeX rejects executable filenames mistakenly listed as PATH directories.
    # Filter only the child process environment; preserve the user's configuration.
    env = os.environ.copy()
    path_key = next(key for key in env if key.lower() == "path")
    env[path_key] = os.pathsep.join(p for p in env[path_key].split(os.pathsep) if Path(p).is_dir())
    subprocess.run([sys.executable, str(SOURCE / "build_report_figures.py")], check=True, env=env)
    for source, output in [("project-brief", "PROJECT_BRIEF"), ("global-extension-plan", "GLOBAL_EXTENSION_PLAN")]:
        for pass_number in (1, 2):
            result = subprocess.run(
                [executable, "--disable-installer", "-interaction=nonstopmode", "-halt-on-error",
                 "-output-directory=build", source + ".tex"],
                cwd=SOURCE, env=env, capture_output=True, encoding="utf-8", errors="replace",
            )
            (BUILD / f"{source}-pass-{pass_number}.txt").write_text(
                result.stdout + result.stderr, encoding="utf-8",
            )
            if result.returncode:
                raise SystemExit("\n".join((result.stdout + result.stderr).splitlines()[-35:]))
        log = (BUILD / (source + ".log")).read_text(encoding="utf-8", errors="replace")
        warnings = [line for line in log.splitlines() if "Overfull" in line or "Missing character:" in line]
        for warning in warnings:
            print(source + ": " + warning)
        if warnings:
            raise SystemExit("Resolve typesetting overflow or missing glyphs before publishing " + source)
        shutil.copyfile(BUILD / (source + ".pdf"), DESTINATION / (output + ".pdf"))
        print("Built " + str((DESTINATION / (output + ".pdf")).relative_to(SOURCE.parents[1])))


if __name__ == "__main__":
    main()
