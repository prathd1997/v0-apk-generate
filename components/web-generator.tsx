"use client"

import { useState, useRef } from "react"
import { Download, Upload, Plus, Trash2, Eye, Settings, Smartphone, Palette, Code, FileText } from "lucide-react"

const WhiteLabelAPKGenerator = () => {
  const [brands, setBrands] = useState([])
  const [currentBrand, setCurrentBrand] = useState(null)
  const [activeTab, setActiveTab] = useState("brands")
  const [previewMode, setPreviewMode] = useState(false)
  const fileInputRef = useRef(null)

  const defaultBrandConfig = {
    id: Date.now(),
    appName: "",
    displayName: "",
    packageName: "",
    bundleId: "",
    version: "1.0.0",
    versionCode: 1,
    colors: {
      primary: "#2563eb",
      secondary: "#7c3aed",
      background: "#ffffff",
      surface: "#f8fafc",
      text: "#1e293b",
      textSecondary: "#64748b",
    },
    features: {
      darkMode: true,
      analytics: true,
      pushNotifications: true,
      biometric: false,
    },
    apiBaseUrl: "",
    assets: {
      icon: null,
      splash: null,
      logo: null,
    },
  }

  const addNewBrand = () => {
    const newBrand = {
      ...defaultBrandConfig,
      id: Date.now(),
      appName: `App ${brands.length + 1}`,
      displayName: `Brand ${brands.length + 1}`,
      packageName: `com.brand${brands.length + 1}.app`,
      bundleId: `com.brand${brands.length + 1}.app`,
    }
    setBrands([...brands, newBrand])
    setCurrentBrand(newBrand)
  }

  const updateBrand = (field, value) => {
    if (!currentBrand) return

    const updatedBrand = { ...currentBrand }
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      updatedBrand[parent] = { ...updatedBrand[parent], [child]: value }
    } else {
      updatedBrand[field] = value
    }

    setCurrentBrand(updatedBrand)
    setBrands(brands.map((brand) => (brand.id === currentBrand.id ? updatedBrand : brand)))
  }

  const deleteBrand = (brandId) => {
    setBrands(brands.filter((brand) => brand.id !== brandId))
    if (currentBrand && currentBrand.id === brandId) {
      setCurrentBrand(brands.length > 1 ? brands[0] : null)
    }
  }

  const handleFileUpload = (event, assetType) => {
    const file = event.target.files[0]
    if (file && currentBrand) {
      const reader = new FileReader()
      reader.onload = (e) => {
        updateBrand(`assets.${assetType}`, e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateBuildConfig = (brand) => {
    return {
      appConfig: {
        name: brand.appName,
        displayName: brand.displayName,
        version: brand.version,
        versionCode: brand.versionCode,
        package: brand.packageName,
        bundleId: brand.bundleId,
      },
      colors: brand.colors,
      features: brand.features,
      apiConfig: {
        baseUrl: brand.apiBaseUrl,
      },
      buildScripts: {
        android: `#!/bin/bash
echo "Building ${brand.displayName}..."
npm run setup-brand ${brand.id}
cd android && ./gradlew assembleRelease`,
        ios: `#!/bin/bash
echo "Building ${brand.displayName} for iOS..."
npm run setup-brand ${brand.id}
cd ios && xcodebuild -workspace App.xcworkspace -scheme App archive`,
      },
    }
  }

  const downloadConfig = (brand) => {
    const config = generateBuildConfig(brand)
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${brand.packageName}-config.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadAllConfigs = () => {
    const allConfigs = brands.map((brand) => ({
      brandId: brand.id,
      config: generateBuildConfig(brand),
    }))

    const blob = new Blob([JSON.stringify(allConfigs, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "white-label-configs.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const generateBuildScript = () => {
    const script = `#!/bin/bash
# White Label APK Build Script
# Generated on ${new Date().toISOString()}

set -e

BRAND_NAME=\${1:-"${brands[0]?.id || "default"}"}

echo "Building APK for brand: \$BRAND_NAME"

# Setup brand configuration
node scripts/setup-brand.js \$BRAND_NAME

# Install dependencies
npm install

# Build Android APK
cd android
./gradlew assembleRelease

echo "Build completed! APK location: android/app/build/outputs/apk/release/"
`

    const blob = new Blob([script], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "build-apk.sh"
    a.click()
    URL.revokeObjectURL(url)
  }

  const BrandList = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Brand Configurations</h2>
        <div className="flex gap-2">
          <button
            onClick={addNewBrand}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={16} />
            Add Brand
          </button>
          {brands.length > 0 && (
            <button
              onClick={downloadAllConfigs}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Download size={16} />
              Export All
            </button>
          )}
        </div>
      </div>

      {brands.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Smartphone size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No brands configured</h3>
          <p className="text-gray-600 mb-4">Create your first brand configuration to get started</p>
          <button onClick={addNewBrand} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Create First Brand
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                currentBrand?.id === brand.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setCurrentBrand(brand)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{brand.displayName}</h3>
                  <p className="text-sm text-gray-600">{brand.packageName}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: brand.colors.primary }}
                      ></div>
                      <span className="text-xs text-gray-500">Primary</span>
                    </div>
                    <span className="text-xs text-gray-500">v{brand.version}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      downloadConfig(brand)
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteBrand(brand.id)
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const BrandEditor = () => {
    if (!currentBrand) {
      return (
        <div className="text-center py-12">
          <Settings size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No brand selected</h3>
          <p className="text-gray-600">Select a brand from the list to edit its configuration</p>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Edit Brand: {currentBrand.displayName}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Eye size={16} />
              {previewMode ? "Edit" : "Preview"}
            </button>
            <button
              onClick={() => downloadConfig(currentBrand)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {previewMode ? (
          <BrandPreview brand={currentBrand} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings size={20} />
                Basic Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">App Name</label>
                  <input
                    type="text"
                    value={currentBrand.appName}
                    onChange={(e) => updateBrand("appName", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={currentBrand.displayName}
                    onChange={(e) => updateBrand("displayName", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
                  <input
                    type="text"
                    value={currentBrand.packageName}
                    onChange={(e) => updateBrand("packageName", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="com.company.app"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bundle ID (iOS)</label>
                  <input
                    type="text"
                    value={currentBrand.bundleId}
                    onChange={(e) => updateBrand("bundleId", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                    <input
                      type="text"
                      value={currentBrand.version}
                      onChange={(e) => updateBrand("version", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Version Code</label>
                    <input
                      type="number"
                      value={currentBrand.versionCode}
                      onChange={(e) => updateBrand("versionCode", Number.parseInt(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">API Base URL</label>
                  <input
                    type="url"
                    value={currentBrand.apiBaseUrl}
                    onChange={(e) => updateBrand("apiBaseUrl", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://api.example.com"
                  />
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Palette size={20} />
                Colors
              </h3>
              <div className="space-y-4">
                {Object.entries(currentBrand.colors).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-3">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => updateBrand(`colors.${key}`, e.target.value)}
                      className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                    <label className="flex-1 text-sm font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    <span className="text-xs text-gray-500 font-mono">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Code size={20} />
                Features
              </h3>
              <div className="space-y-3">
                {Object.entries(currentBrand.features).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    <button
                      onClick={() => updateBrand(`features.${key}`, !value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Assets */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Upload size={20} />
                Assets
              </h3>
              <div className="space-y-4">
                {["icon", "splash", "logo"].map((assetType) => (
                  <div key={assetType}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{assetType}</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => handleFileUpload(e, assetType)}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 flex items-center justify-center w-20 h-20"
                      >
                        {currentBrand.assets[assetType] ? (
                          <img
                            src={currentBrand.assets[assetType]}
                            alt={assetType}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <Upload size={24} className="text-gray-400" />
                        )}
                      </button>
                      <span className="text-sm text-gray-600">
                        {currentBrand.assets[assetType] ? "Click to change" : "Click to upload"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const BrandPreview = ({ brand }) => (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Preview</h3>
      <div className="max-w-sm mx-auto">
        {/* Phone mockup */}
        <div className="relative bg-black rounded-3xl p-2">
          <div className="bg-white rounded-2xl overflow-hidden">
            {/* Status bar */}
            <div className="bg-gray-900 text-white text-xs p-2 flex justify-between">
              <span>9:41</span>
              <span>100%</span>
            </div>
            {/* App content */}
            <div className="p-6 text-center" style={{ backgroundColor: brand.colors.background }}>
              {brand.assets.logo ? (
                <img src={brand.assets.logo} alt="Logo" className="w-16 h-16 mx-auto mb-4 rounded-lg" />
              ) : (
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: brand.colors.primary }}
                >
                  <span className="text-white font-bold">{brand.displayName.charAt(0)}</span>
                </div>
              )}
              <h3 className="font-bold text-lg" style={{ color: brand.colors.text }}>
                {brand.displayName}
              </h3>
              <p className="text-sm mt-2" style={{ color: brand.colors.textSecondary }}>
                Welcome to your app
              </p>
              <button
                className="mt-4 px-6 py-2 rounded-lg text-white font-medium"
                style={{ backgroundColor: brand.colors.primary }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="font-semibold">{brand.appName}</p>
          <p className="text-sm text-gray-600">{brand.packageName}</p>
          <p className="text-xs text-gray-500">Version {brand.version}</p>
        </div>
      </div>
    </div>
  )

  const BuildTools = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Build Tools</h2>

      <div className="grid gap-6">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText size={20} />
            Generate Build Scripts
          </h3>
          <p className="text-gray-600 mb-4">
            Download shell scripts to automate the build process for your white label apps.
          </p>
          <div className="flex gap-3">
            <button
              onClick={generateBuildScript}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Download size={16} />
              Copy Build Script
            </button>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Build Instructions</h3>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900">Local Build:</h4>
              <pre className="bg-gray-100 p-3 rounded mt-2 overflow-x-auto">
                {`# Setup brand
npm run setup-brand brand-id

# Build Android APK
cd android && ./gradlew assembleRelease

# Build iOS IPA
cd ios && xcodebuild -workspace App.xcworkspace -scheme App archive`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">GitHub Actions:</h4>
              <pre className="bg-gray-100 p-3 rounded mt-2 overflow-x-auto">
                {`name: Build APK
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build
        run: |
          npm install
          npm run setup-brand \${{ github.event.inputs.brand }}
          cd android && ./gradlew assembleRelease`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">White Label APK Generator</h1>
          <p className="text-gray-600">
            Create and manage multiple branded Android applications from a single codebase
          </p>
        </div>

        {/* Navigation */}
        <div className="flex space-x-1 mb-8 bg-white p-1 rounded-lg border">
          {[
            { id: "brands", label: "Brands", icon: Smartphone },
            { id: "editor", label: "Editor", icon: Settings },
            { id: "build", label: "Build Tools", icon: Code },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg border p-6">
          {activeTab === "brands" && <BrandList />}
          {activeTab === "editor" && <BrandEditor />}
          {activeTab === "build" && <BuildTools />}
        </div>
      </div>
    </div>
  )
}

export default WhiteLabelAPKGenerator
