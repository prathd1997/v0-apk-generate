"use client"

import { useEffect, useState } from "react"
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import SplashScreen from "react-native-splash-screen"
import Config from "react-native-config"
import type { JSX } from "react/jsx-runtime"

// Brand configuration will be injected during build
const BRAND_CONFIG = {
  appName: Config.APP_NAME || "White Label App",
  displayName: Config.DISPLAY_NAME || "My App",
  primaryColor: Config.PRIMARY_COLOR || "#2563eb",
  secondaryColor: Config.SECONDARY_COLOR || "#7c3aed",
  backgroundColor: Config.BACKGROUND_COLOR || "#ffffff",
  textColor: Config.TEXT_COLOR || "#1e293b",
  apiBaseUrl: Config.API_BASE_URL || "https://api.example.com",
  features: {
    darkMode: Config.FEATURE_DARK_MODE === "true",
    analytics: Config.FEATURE_ANALYTICS === "true",
    pushNotifications: Config.FEATURE_PUSH_NOTIFICATIONS === "true",
    biometric: Config.FEATURE_BIOMETRIC === "true",
  },
}

interface User {
  id: string
  name: string
  email: string
}

const App = (): JSX.Element => {
  const [user, setUser] = useState<User | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Hide splash screen
    SplashScreen.hide()

    // Load user data and preferences
    loadUserData()
    loadThemePreference()
  }, [])

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user")
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  const loadThemePreference = async () => {
    try {
      const theme = await AsyncStorage.getItem("theme")
      if (theme === "dark" && BRAND_CONFIG.features.darkMode) {
        setIsDarkMode(true)
      }
    } catch (error) {
      console.error("Error loading theme preference:", error)
    }
  }

  const toggleTheme = async () => {
    if (!BRAND_CONFIG.features.darkMode) return

    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)

    try {
      await AsyncStorage.setItem("theme", newTheme ? "dark" : "light")
    } catch (error) {
      console.error("Error saving theme preference:", error)
    }
  }

  const handleLogin = async () => {
    // Simulate login
    const mockUser = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
    }

    setUser(mockUser)

    try {
      await AsyncStorage.setItem("user", JSON.stringify(mockUser))
    } catch (error) {
      console.error("Error saving user data:", error)
    }
  }

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          setUser(null)
          try {
            await AsyncStorage.removeItem("user")
          } catch (error) {
            console.error("Error removing user data:", error)
          }
        },
      },
    ])
  }

  const styles = createStyles(isDarkMode)

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={styles.container.backgroundColor}
      />

      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={[styles.logoPlaceholder, { backgroundColor: BRAND_CONFIG.primaryColor }]}>
              <Text style={styles.logoText}>{BRAND_CONFIG.displayName.charAt(0)}</Text>
            </View>
            <Text style={styles.appName}>{BRAND_CONFIG.displayName}</Text>
          </View>

          {BRAND_CONFIG.features.darkMode && (
            <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
              <Text style={styles.themeButtonText}>{isDarkMode ? "☀️" : "🌙"}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to {BRAND_CONFIG.displayName}</Text>
          <Text style={styles.welcomeSubtitle}>Your personalized mobile experience</Text>
        </View>

        {/* User Section */}
        <View style={styles.userSection}>
          {user ? (
            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>{user.name.charAt(0)}</Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.loginSection}>
              <Text style={styles.loginTitle}>Get Started</Text>
              <Text style={styles.loginSubtitle}>Sign in to access all features</Text>
              <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresList}>
            {Object.entries(BRAND_CONFIG.features).map(([key, enabled]) => (
              <View key={key} style={styles.featureItem}>
                <Text style={styles.featureIcon}>{enabled ? "✅" : "❌"}</Text>
                <Text style={styles.featureText}>
                  {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Version: {Config.VERSION_NAME || "1.0.0"}</Text>
          <Text style={styles.appInfoText}>Build: {Config.VERSION_CODE || "1"}</Text>
          <Text style={styles.appInfoText}>Package: {Config.PACKAGE_NAME || "com.whitelabel.app"}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const createStyles = (isDarkMode: boolean) => {
  const backgroundColor = isDarkMode ? "#1e293b" : BRAND_CONFIG.backgroundColor
  const textColor = isDarkMode ? "#f8fafc" : BRAND_CONFIG.textColor
  const cardBackground = isDarkMode ? "#334155" : "#f8fafc"

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor,
    },
    scrollView: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? "#475569" : "#e2e8f0",
    },
    logoContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    logoPlaceholder: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    logoText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
    },
    appName: {
      fontSize: 20,
      fontWeight: "bold",
      color: textColor,
    },
    themeButton: {
      padding: 8,
    },
    themeButtonText: {
      fontSize: 24,
    },
    welcomeSection: {
      padding: 20,
      alignItems: "center",
    },
    welcomeTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: textColor,
      textAlign: "center",
      marginBottom: 8,
    },
    welcomeSubtitle: {
      fontSize: 16,
      color: isDarkMode ? "#94a3b8" : "#64748b",
      textAlign: "center",
    },
    userSection: {
      margin: 20,
      padding: 20,
      backgroundColor: cardBackground,
      borderRadius: 12,
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    userAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: BRAND_CONFIG.secondaryColor,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 15,
    },
    userAvatarText: {
      color: "white",
      fontSize: 20,
      fontWeight: "bold",
    },
    userDetails: {
      flex: 1,
    },
    userName: {
      fontSize: 18,
      fontWeight: "bold",
      color: textColor,
    },
    userEmail: {
      fontSize: 14,
      color: isDarkMode ? "#94a3b8" : "#64748b",
    },
    logoutButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: "#ef4444",
      borderRadius: 8,
    },
    logoutButtonText: {
      color: "white",
      fontWeight: "600",
    },
    loginSection: {
      alignItems: "center",
    },
    loginTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: textColor,
      marginBottom: 8,
    },
    loginSubtitle: {
      fontSize: 14,
      color: isDarkMode ? "#94a3b8" : "#64748b",
      marginBottom: 20,
    },
    loginButton: {
      backgroundColor: BRAND_CONFIG.primaryColor,
      paddingHorizontal: 32,
      paddingVertical: 12,
      borderRadius: 8,
    },
    loginButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
    featuresSection: {
      margin: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: textColor,
      marginBottom: 16,
    },
    featuresList: {
      backgroundColor: cardBackground,
      borderRadius: 12,
      padding: 16,
    },
    featureItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
    },
    featureIcon: {
      fontSize: 16,
      marginRight: 12,
    },
    featureText: {
      fontSize: 16,
      color: textColor,
    },
    appInfo: {
      margin: 20,
      padding: 16,
      backgroundColor: cardBackground,
      borderRadius: 12,
      alignItems: "center",
    },
    appInfoText: {
      fontSize: 12,
      color: isDarkMode ? "#94a3b8" : "#64748b",
      marginVertical: 2,
    },
  })
}

export default App
