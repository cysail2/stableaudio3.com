#!/bin/bash
# Double-click this file in Finder to start the Next.js dev server.
# macOS recognises the .command extension and opens it in Terminal.
#
# Usage: just double-click. Press Ctrl+C in the Terminal window to stop.

set -e

# cd into this script's directory (the project root, regardless of cwd)
cd "$(dirname "$0")"

# Make sure homebrew bins (where node/pnpm live) are on PATH when launched from Finder.
# Finder-launched .command files inherit a minimal PATH that doesn't include /opt/homebrew.
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

# Pick the right package manager — prefer pnpm (we use it), fall back to npm.
if command -v pnpm >/dev/null 2>&1 && [ -f "pnpm-lock.yaml" ]; then
  RUNNER="pnpm dev"
else
  RUNNER="npx next dev"
fi

# Print a friendly banner so the Terminal window doesn't look empty
clear
cat <<EOF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Stable Audio 3 — local dev server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Project: $(pwd)
  Runner:  $RUNNER
  URL:     http://localhost:3000

  Press Ctrl+C to stop the server.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EOF

# Auto-open Chrome ~3.5s after the server starts (give Next.js time to compile).
# Falls back to the default browser if Chrome isn't installed.
# Runs in background so it doesn't block the dev server.
(
  sleep 3.5
  if [ -d "/Applications/Google Chrome.app" ]; then
    open -a "Google Chrome" "http://localhost:3000"
  else
    open "http://localhost:3000"
  fi
) &

# Hand off to the dev server (exec so Ctrl+C cleanly terminates it).
exec $RUNNER
