#!/bin/bash

# Copilot AutoRun Extension Installer
# This script compiles and installs the Copilot AutoRun extension

set -e

echo "🚀 Installing Copilot AutoRun Extension..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the copilot-autorun directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Compile TypeScript
echo "🔨 Compiling TypeScript..."
npm run compile

# Package extension
echo "📦 Packaging extension..."
npm run package

# Install the extension
echo "🔧 Installing extension..."
VSIX_FILE=$(ls *.vsix | head -n 1)
if [ -f "$VSIX_FILE" ]; then
    code --install-extension "$VSIX_FILE" --force
    echo "✅ Extension installed successfully!"
    echo "📌 Use Ctrl+Alt+R to toggle AutoRun mode"
    echo "⚠️  Remember: Only use in trusted environments!"
else
    echo "❌ Error: No .vsix file found"
    exit 1
fi

echo "🎉 Installation complete!"
echo ""
echo "📝 License: MIT License - see LICENSE file for details"
echo "🔗 Repository: https://github.com/local/copilot-autorun"
echo ""
echo "Next steps:"
echo "1. Restart VS Code"
echo "2. Open a shell script or terminal file"
echo "3. Press Ctrl+Alt+R to enable AutoRun"
echo "4. Start typing commands and watch Copilot suggestions get executed automatically"
echo ""
echo "⚠️  Security reminder: This extension executes code automatically. Use with caution!"
