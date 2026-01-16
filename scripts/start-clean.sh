#!/usr/bin/env bash

set -e

echo "🧹 Cleaning Angular cache..."

rm -rf .angular/cache

echo "▶ Starting Angular dev server..."

npx ng serve --watch
