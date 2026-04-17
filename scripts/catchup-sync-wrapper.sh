#!/bin/bash
# CatchUp sync wrapper — called by launchd every hour.
# This script must run from a process that has Full Disk Access
# (grant FDA to this script's runner in System Settings if needed).

# Ensure nvm-installed node is on PATH
export PATH="/Users/tlf/.nvm/versions/node/v24.10.0/bin:/usr/local/bin:/usr/bin:$PATH"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting CatchUp sync..."
node "$SCRIPT_DIR/sync-imessages.js"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Sync complete."
