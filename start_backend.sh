#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$repo_dir/backend"

if [[ -f .venv/Scripts/activate ]]; then
  source .venv/Scripts/activate
elif [[ -f .venv/bin/activate ]]; then
  source .venv/bin/activate
fi

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
