#!/usr/bin/env bash
# ================================================
#  Project Tesca - Installation Script (Mac/Linux)
# ================================================

set -e

echo "================================================"
echo "  Project Tesca - Installation Script"
echo "================================================"
echo ""

# Get the directory where this script lives
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed or not in PATH."
    echo "Please download and install it from: https://nodejs.org/"
    exit 1
fi
echo "[OK] Node.js found: $(node -v)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm is not found. Please reinstall Node.js."
    exit 1
fi
echo "[OK] npm found: $(npm -v)"

echo ""
echo "------------------------------------------------"
echo " Installing backend dependencies..."
echo "------------------------------------------------"
cd "$SCRIPT_DIR/backend"
npm install
echo "[OK] Backend dependencies installed."

echo ""
echo "------------------------------------------------"
echo " Installing frontend dependencies..."
echo "------------------------------------------------"
cd "$SCRIPT_DIR/frontend"
npm install
echo "[OK] Frontend dependencies installed."

echo ""
echo "------------------------------------------------"
echo " Setting up environment files..."
echo "------------------------------------------------"
cd "$SCRIPT_DIR"

if [ ! -f "backend/.env" ]; then
    cp "backend/.env.example" "backend/.env"
    echo "[OK] Created backend/.env from .env.example"
    echo "[!] IMPORTANT: Open backend/.env and set a strong JWT_SECRET value!"
else
    echo "[--] backend/.env already exists, skipping."
fi

if [ ! -f "frontend/.env" ]; then
    cp "frontend/.env.example" "frontend/.env"
    echo "[OK] Created frontend/.env from .env.example"
else
    echo "[--] frontend/.env already exists, skipping."
fi

echo ""
echo "================================================"
echo " Installation complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo "  1. Make sure MongoDB is running on port 27017"
echo "  2. Open backend/.env and set JWT_SECRET to a strong random string"
echo "  3. Start the backend:   cd backend && npm run dev"
echo "  4. Start the frontend:  cd frontend && npm run dev"
echo "  5. Open your browser:   http://localhost:5173"
echo ""
echo "Default login credentials (password: Tesca2026!):"
echo "  Admin : tarek.ferchichi@tescagroup.com"
echo "  Achat : safa@tescagroup.com"
echo "  Other : bouyahi.mohamed@testgoup.com"
echo ""
