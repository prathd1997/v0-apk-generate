# White Label APK Generator

A comprehensive solution for creating multiple branded Android applications from a single React Native codebase.

## Features

- 🎨 **Brand Management**: Create and manage multiple app brands with unique configurations
- 🎯 **Visual Customization**: Custom colors, themes, and branding elements
- 📱 **React Native App**: Complete mobile app with configurable features
- 🔧 **Build Automation**: Automated APK generation with brand-specific configurations
- 🚀 **CI/CD Ready**: GitHub Actions workflow for automated builds

## Quick Start

### 1. Web Interface Setup

The web interface allows you to create and manage brand configurations:

\`\`\`bash
npm install
npm run dev
\`\`\`

Visit `http://localhost:3000` to access the brand management interface.

### 2. Create Brand Configurations

1. Open the web interface
2. Click "Add Brand" to create a new brand configuration
3. Configure app details, colors, features, and assets
4. Export the configuration as JSON

### 3. Generate APK

#### Method 1: Using Build Script

\`\`\`bash
# Make script executable
chmod +x scripts/build-apk.sh

# Build APK for specific brand
./scripts/build-apk.sh your-brand-id brand-configs.json
\`\`\`

#### Method 2: Manual Build

\`\`\`bash
# Setup brand configuration
node scripts/setup-brand.js brand-configs.json your-brand-id

# Navigate to React Native project
cd react-native

# Install dependencies
npm install

# Build APK
cd android && ./gradlew assembleRelease
\`\`\`

## Project Structure

\`\`\`
├── components/                 # Web interface components
│   └── white-label-apk-generator.tsx
├── react-native/              # React Native app
│   ├── App.tsx                # Main app component
│   ├── android/               # Android configuration
│   └── package.json           # RN dependencies
├── scripts/                   # Build automation
│   ├── setup-brand.js         # Brand configuration script
│   └── build-apk.sh          # APK build script
└── .github/workflows/         # CI/CD workflows
\`\`\`

## Brand Configuration

Each brand configuration includes:

- **App Details**: Name, package ID, version
- **Visual Theme**: Colors, fonts, assets
- **Features**: Toggle app features on/off
- **API Configuration**: Backend endpoints
- **Build Settings**: Signing, optimization

## Environment Variables

The React Native app uses these environment variables (set automatically by setup script):

\`\`\`env
APP_NAME=MyApp
DISPLAY_NAME=My Branded App
PACKAGE_NAME=com.mybrand.app
VERSION_NAME=1.0.0
VERSION_CODE=1
PRIMARY_COLOR=#2563eb
SECONDARY_COLOR=#7c3aed
API_BASE_URL=https://api.example.com
FEATURE_DARK_MODE=true
FEATURE_ANALYTICS=true
\`\`\`

## Build Requirements

- Node.js 16+
- React Native CLI
- Android Studio / Android SDK
- Java 17+

## Deployment

### Local Development
1. Use the web interface to create brand configurations
2. Export configurations as JSON
3. Run build scripts to generate APKs

### CI/CD (GitHub Actions)
1. Push brand configurations to repository
2. Trigger workflow with brand ID
3. Download generated APKs from artifacts

## Customization

### Adding New Features
1. Update the React Native app code
2. Add feature toggles to brand configuration
3. Update setup script to handle new environment variables

### Custom Assets
- Replace app icons in `android/app/src/main/res/mipmap/`
- Update splash screens in `android/app/src/main/res/drawable/`
- Add custom fonts to `react-native/assets/fonts/`

## Troubleshooting

### Build Issues
- Ensure Android SDK is properly installed
- Check Java version (requires Java 17+)
- Verify package name format (com.company.app)

### Configuration Issues
- Validate JSON configuration format
- Check environment variable names
- Ensure all required fields are present

## License

MIT License - feel free to use this for your white label projects!
