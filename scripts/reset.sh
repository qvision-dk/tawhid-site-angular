#!/usr/bin/env bash

set -e

echo "🧹 Resetting project..."

echo "→ Removing node_modules"
rm -rf node_modules

echo "→ Removing Angular cache"
rm -rf .angular/cache

echo "→ Removing build output"
rm -rf dist

echo "→ Removing lock file"
rm -f package-lock.json

echo "📦 Reinstalling dependencies..."
npm install

echo "▶ Starting Angular dev server..."
npx ng serve