#!/usr/bin/env bash
set -e

echo "[setup] Installing server dependencies..."
cd server && npm install && cd ..

echo "[setup] Installing client dependencies..."
cd client && npm install && cd ..

echo "[setup] Done. Next: copy server/.env.example to server/.env and fill in values."
