#!/bin/bash
# Run from inside ticket-resale/
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PAGES="$SCRIPT_DIR/frontend/src/pages"

if [ ! -d "$PAGES" ]; then
  echo "❌ ERROR: Run from inside ticket-resale/"
  exit 1
fi

FILES_DIR="$SCRIPT_DIR/stranger-things-final/pages"

echo ""
echo "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓"
echo "  HAWKINS LAB — FINAL THEME UPDATE"
echo "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓"
echo ""

cp "$FILES_DIR/TicketDetail.jsx" "$PAGES/TicketDetail.jsx" && echo "✅ TicketDetail.jsx"
cp "$FILES_DIR/Profile.jsx"      "$PAGES/Profile.jsx"      && echo "✅ Profile.jsx"
cp "$FILES_DIR/Listings.jsx"     "$PAGES/Listings.jsx"     && echo "✅ Listings.jsx (+ DemogorgonLoader + WillsWall)"
cp "$FILES_DIR/Dashboard.jsx"    "$PAGES/Dashboard.jsx"    && echo "✅ Dashboard.jsx (+ WillsWall empty state)"

echo ""
echo "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓"
echo "  ALL DONE! Refresh your browser."
echo "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓"
echo ""
