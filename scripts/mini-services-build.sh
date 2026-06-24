#!/bin/bash
# ============================================================
# Home Loan Calculator - Mini Services Build Script
# ============================================================
# Builds all mini-services using bun build. Each service's
# entry file (src/index.ts or index.ts) is compiled to a
# single bundled file in the dist/ directory.
# Usage: bash scripts/mini-services-build.sh
# ============================================================

set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)/mini-services"
DIST_DIR="$(cd "$(dirname "$0")/.." && pwd)/mini-services-dist"

if [ ! -d "$ROOT_DIR" ]; then
  echo "No mini-services directory found, skipping."
  exit 0
fi

mkdir -p "$DIST_DIR"

success_count=0
fail_count=0

for dir in "$ROOT_DIR"/*; do
  if [ -d "$dir" ] && [ -f "$dir/package.json" ]; then
    project_name=$(basename "$dir")

    # Find the entry file
    entry_path=""
    for entry in "src/index.ts" "index.ts" "src/index.js" "index.js"; do
      if [ -f "$dir/$entry" ]; then
        entry_path="$dir/$entry"
        break
      fi
    done

    if [ -z "$entry_path" ]; then
      echo "Skipping $project_name: no entry file found"
      continue
    fi

    echo ""
    echo "Building: $project_name"
    output_file="$DIST_DIR/mini-service-$project_name.js"

    if bun build "$entry_path" \
      --outfile "$output_file" \
      --target bun \
      --minify; then
      echo "  SUCCESS: $project_name -> $output_file"
      success_count=$((success_count + 1))
    else
      echo "  FAILED: $project_name"
      fail_count=$((fail_count + 1))
    fi
  fi
done

# Copy the start script to the dist directory
START_SCRIPT="$(cd "$(dirname "$0")/.." && pwd)/scripts/mini-services-start.sh"
if [ -f "$START_SCRIPT" ]; then
  cp "$START_SCRIPT" "$DIST_DIR/mini-services-start.sh"
  chmod +x "$DIST_DIR/mini-services-start.sh"
fi

echo ""
echo "=== Build Summary ==="
echo "  Succeeded: $success_count"
echo "  Failed: $fail_count"
