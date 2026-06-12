#!/bin/bash
trap 'kill 0' EXIT

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BOLD='\033[1m'
RESET='\033[0m'

echo ""
echo -e "${BOLD}  qonflo dev${RESET}"
echo -e "  ─────────────────────────────"
echo -e "  ${CYAN}●${RESET} frontend  → http://localhost:4442"
echo -e "  ${GREEN}●${RESET} backend   → http://localhost:3001"
echo -e "  ─────────────────────────────"
echo -e "  ${YELLOW}ctrl+c to stop both${RESET}"
echo ""

(cd backend && npm run dev 2>&1 | while IFS= read -r line; do
  echo -e "  ${GREEN}[be]${RESET} $line"
done) &

(cd app && bun dev 2>&1 | while IFS= read -r line; do
  echo -e "  ${CYAN}[fe]${RESET} $line"
done) &

wait
