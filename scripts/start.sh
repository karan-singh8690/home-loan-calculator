#!/bin/sh
# ============================================================
# Home Loan Calculator - Production Start Script
# ============================================================
# Starts the Next.js production server (standalone build).
# Used in containerized deployments. For Vercel, this is not
# needed — Vercel handles the start command automatically.
# Usage: sh scripts/start.sh
# ============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR"

# Database configuration
DB_PATH="${PROJECT_DIR}/db/custom.db"
DB_URL="${DATABASE_URL:-file:$DB_PATH}"

export DATABASE_URL="$DB_URL"
export NODE_ENV="production"
export PORT="${PORT:-3000}"
export HOSTNAME="${HOSTNAME:-0.0.0.0}"

# Start the Next.js standalone server if it exists
if [ -f ".next/standalone/server.js" ]; then
  echo "Starting Next.js production server..."
  echo "  Port: $PORT"
  echo "  Database: $DB_URL"
  echo ""
  exec bun .next/standalone/server.js
else
  echo "ERROR: No standalone build found."
  echo "Run 'bash scripts/build.sh' first."
  exit 1
fi
