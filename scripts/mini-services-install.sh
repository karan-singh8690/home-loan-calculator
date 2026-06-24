#!/bin/bash
# ============================================================
# Home Loan Calculator - Mini Services Install Script
# ============================================================
# Installs dependencies for all mini-services in the mini-services/
# directory. Each subdirectory with a package.json is treated as
# a separate service.
# Usage: bash scripts/mini-services-install.sh
# ============================================================

set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)/mini-services"

if [ ! -d "$ROOT_DIR" ]; then
  echo "No mini-services directory found, skipping."
  exit 0
fi

success_count=0
fail_count=0

for dir in "$ROOT_DIR"/*; do
  if [ -d "$dir" ] && [ -f "$dir/package.json" ]; then
    project_name=$(basename "$dir")
    echo ""
    echo "Installing dependencies for: $project_name"

    if (cd "$dir" && bun install); then
      echo "  SUCCESS: $project_name"
      success_count=$((success_count + 1))
    else
      echo "  FAILED: $project_name"
      fail_count=$((fail_count + 1))
    fi
  fi
done

echo ""
echo "=== Install Summary ==="
echo "  Succeeded: $success_count"
echo "  Failed: $fail_count"
