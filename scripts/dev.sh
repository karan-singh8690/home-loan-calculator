#!/bin/bash
# ============================================================
# Home Loan Calculator - Development Server Start Script
# ============================================================
# Starts the Next.js dev server with database setup.
# Usage: bash scripts/dev.sh
# ============================================================

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

# Check that bun is installed
if ! command -v bun > /dev/null 2>&1; then
  echo "ERROR: bun is not installed or not in PATH"
  exit 1
fi

echo "=== Installing dependencies ==="
bun install

echo ""
echo "=== Setting up database ==="
bun run db:push

echo ""
echo "=== Starting development server ==="
echo "The server will be available at http://localhost:3000"
echo "Press Ctrl+C to stop."
echo ""
exec bun run dev
