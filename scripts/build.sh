#!/bin/bash
# ============================================================
# Home Loan Calculator - Production Build Script
# ============================================================
# Builds the Next.js app for production deployment.
# Usage: bash scripts/build.sh
# ============================================================

set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

export NEXT_TELEMETRY_DISABLED=1

echo "=== Installing dependencies ==="
bun install

echo ""
echo "=== Building Next.js application ==="
bun run build

echo ""
echo "=== Build complete ==="
echo "Output directory: .next/"
echo ""
echo "To run the production build locally:"
echo "  bun run start"
