#!/bin/bash

# White Label APK Build Script
set -e

BRAND_ID=${1:-""}
CONFIG_FILE=${2:-"brand-configs.json"}

if [ -z "$BRAND_ID" ]; then
    echo "Usage: ./build-apk.sh <brand-id> [config-file]"
    echo "Available brands:"
    if [ -f "$CONFIG_FILE" ]; then
        node -e "
        const config = JSON.parse(require('fs').readFileSync('$CONFIG_FILE', 'utf8'));
        if (Array.isArray(config)) {
            config.forEach(c => console.log('  -', c.brandId, ':', c.config.appConfig.displayName));
        } else {
            Object.keys(config).forEach(key => console.log('  -', key, ':', config[key].appConfig.displayName));
        }
        "
    fi
    exit 1
fi

echo "🚀 Building APK for brand: $BRAND_ID"

# Setup brand configuration
echo "📝 Setting up brand configuration..."
node scripts/setup-brand.js "$CONFIG_FILE" "$BRAND_ID"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Navigate to React Native directory
cd react-native

# Install React Native dependencies
echo "📱 Installing React Native dependencies..."
npm install

# Clean previous builds
echo "🧹 Cleaning previous builds..."
cd android && ./gradlew clean && cd ..

# Build Android APK
echo "🔨 Building Android APK..."
cd android && ./gradlew assembleRelease

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📱 APK location: react-native/android/app/build/outputs/apk/release/"
    ls -la android/app/build/outputs/apk/release/*.apk
else
    echo "❌ Build failed!"
    exit 1
fi
