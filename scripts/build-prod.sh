#!/usr/bin/env bash
#!/usr/bin/env bash

set -e

echo "🏗️  Building Angular app (production)..."

npx ng build --configuration production

echo "📄 Copying _redirects..."
cp _redirects dist/browser/