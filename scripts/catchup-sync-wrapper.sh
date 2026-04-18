#!/bin/bash
# CatchUp sync wrapper — called by launchd every hour.
# Portable: resolves node via nvm (any username/version) or system PATH.

# Load nvm if installed — picks up whatever version is currently default
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh" --no-use
  # Use the nvm default version if available
  NVM_DEFAULT=$(cat "$NVM_DIR/alias/default" 2>/dev/null | tr -d '[:space:]')
  [ -n "$NVM_DEFAULT" ] && export PATH="$NVM_DIR/versions/node/$NVM_DEFAULT/bin:$PATH"
fi

# Also add common install locations as fallback (Homebrew, system, etc.)
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:$PATH"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting CatchUp sync (node: $(command -v node 2>/dev/null || echo 'not found'))..."
node "$SCRIPT_DIR/sync-imessages.js"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Sync complete."
