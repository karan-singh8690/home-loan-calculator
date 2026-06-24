#!/bin/sh
# ============================================================
# Home Loan Calculator - Mini Services Start Script
# ============================================================
# Starts all built mini-services from the mini-services-dist/
# directory. Each mini-service-*.js file is run with bun.
# Press Ctrl+C to stop all services.
# Usage: sh scripts/mini-services-start.sh
# ============================================================

set -e

DIST_DIR="./mini-services-dist"
pids=""

# Graceful shutdown handler
cleanup() {
  echo ""
  echo "Shutting down all services..."

  for pid in $pids; do
    if kill -0 "$pid" 2>/dev/null; then
      kill -TERM "$pid" 2>/dev/null
    fi
  done

  sleep 1

  for pid in $pids; do
    if kill -0 "$pid" 2>/dev/null; then
      kill -KILL "$pid" 2>/dev/null
    fi
  done

  echo "All services stopped."
  exit 0
}

trap cleanup INT TERM

# Check if dist directory exists
if [ ! -d "$DIST_DIR" ]; then
  echo "No mini-services-dist directory found. Nothing to start."
  exit 0
fi

# Find and start all service files
service_count=0

for file in "$DIST_DIR"/mini-service-*.js; do
  if [ -f "$file" ]; then
    service_name=$(basename "$file" .js | sed 's/mini-service-//')
    echo "Starting: $service_name"

    bun "$file" &
    pid=$!
    pids="$pids $pid"
    service_count=$((service_count + 1))

    sleep 0.5
    if kill -0 "$pid" 2>/dev/null; then
      echo "  Running (PID: $pid)"
    else
      echo "  FAILED to start"
    fi
  fi
done

if [ "$service_count" -eq 0 ]; then
  echo "No service files found in $DIST_DIR"
  exit 0
fi

echo ""
echo "$service_count service(s) running."
echo "Press Ctrl+C to stop all."
echo ""

wait
