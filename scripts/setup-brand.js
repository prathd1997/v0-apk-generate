#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

// Load brand configurations
const configPath = process.argv[2] || "brand-configs.json"
const brandId = process.argv[3]

if (!brandId) {
  console.error("Usage: node setup-brand.js <config-file> <brand-id>")
  process.exit(1)
}

try {
  const configFile = fs.readFileSync(configPath, "utf8")
  const configs = JSON.parse(configFile)

  let brandConfig
  if (Array.isArray(configs)) {
    brandConfig = configs.find((c) => c.brandId === brandId)?.config
  } else {
    brandConfig = configs[brandId]
  }

  if (!brandConfig) {
    console.error(`Brand configuration not found for ID: ${brandId}`)
    process.exit(1)
  }

  console.log(`Setting up brand: ${brandConfig.appConfig.displayName}`)

  // Create .env file for React Native Config
  const envContent = `
APP_NAME=${brandConfig.appConfig.name}
DISPLAY_NAME=${brandConfig.appConfig.displayName}
PACKAGE_NAME=${brandConfig.appConfig.package}
VERSION_NAME=${brandConfig.appConfig.version}
VERSION_CODE=${brandConfig.appConfig.versionCode}
PRIMARY_COLOR=${brandConfig.colors.primary}
SECONDARY_COLOR=${brandConfig.colors.secondary}
BACKGROUND_COLOR=${brandConfig.colors.background}
TEXT_COLOR=${brandConfig.colors.text}
API_BASE_URL=${brandConfig.apiConfig.baseUrl}
FEATURE_DARK_MODE=${brandConfig.features.darkMode}
FEATURE_ANALYTICS=${brandConfig.features.analytics}
FEATURE_PUSH_NOTIFICATIONS=${brandConfig.features.pushNotifications}
FEATURE_BIOMETRIC=${brandConfig.features.biometric}
`.trim()

  fs.writeFileSync(".env", envContent)
  console.log("✅ Environment variables configured")

  // Update Android strings.xml
  const stringsPath = "android/app/src/main/res/values/strings.xml"
  const stringsContent = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">${brandConfig.appConfig.displayName}</string>
</resources>`

  if (fs.existsSync(path.dirname(stringsPath))) {
    fs.writeFileSync(stringsPath, stringsContent)
    console.log("✅ Android strings updated")
  }

  // Update package.json name
  const packageJsonPath = "package.json"
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
    packageJson.name = brandConfig.appConfig.name
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
    console.log("✅ Package.json updated")
  }

  console.log(`\n🎉 Brand setup complete for: ${brandConfig.appConfig.displayName}`)
  console.log(`Package: ${brandConfig.appConfig.package}`)
  console.log(`Version: ${brandConfig.appConfig.version} (${brandConfig.appConfig.versionCode})`)
} catch (error) {
  console.error("Error setting up brand:", error.message)
  process.exit(1)
}
