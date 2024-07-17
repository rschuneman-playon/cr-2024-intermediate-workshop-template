// app/_layout.tsx
import React from "react"
import { ViewStyle, Platform } from "react-native"
import { Slot, SplashScreen } from "expo-router"
import { useInitialRootStore } from "src/models"
import { useFonts } from "@expo-google-fonts/space-grotesk"
import { customFontsToLoad } from "src/theme"
import { KeyboardProvider } from "react-native-keyboard-controller"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import * as QuickActions from "expo-quick-actions"
import { useQuickActionRouting, RouterAction } from "expo-quick-actions/router"

// QuickActions.setItems([
//   {
//     id: "0",
//     title: "Do something!",
//     subtitle: "It could be anything!",
//     icon: "heart",
//     params: { stuff: "whatever" },
//   },
// ])

// const subscription = QuickActions.addListener((action) => {
//   console.log(action)
// })

SplashScreen.preventAutoHideAsync()

if (__DEV__) {
  // Load Reactotron configuration in development. We don't want to
  // include this in our production bundle, so we are using `if (__DEV__)`
  // to only execute this in development.
  require("src/devtools/ReactotronConfig.ts")
}

export { ErrorBoundary } from "src/components/ErrorBoundary/ErrorBoundary"

export default function Root() {
  // Wait for stores to load and render our layout inside of it so we have access
  // to auth info etc
  const { rehydrated } = useInitialRootStore()
  useQuickActionRouting()

  React.useEffect(() => {
    QuickActions.setItems<RouterAction>([
      {
        title: "Update your profile",
        subtitle: "Keep your deets up-to-date!",
        icon: Platform.OS === "android" ? "profile_icon" : "contact",
        id: "0",
        params: { href: "/(app)/(tabs)/profile" },
      },
      {
        title: "Check out the latest podcast",
        subtitle: "What's everyone saying on RN Radio?",
        icon: Platform.OS === "android" ? "podcast_icon" : "play",
        id: "1",
        params: { href: "/(app)/(tabs)/podcasts/latest" },
      },
    ])
  }, [])

  const [fontsLoaded, fontError] = useFonts(customFontsToLoad)

  const loaded = fontsLoaded && rehydrated

  React.useEffect(() => {
    if (fontError) throw fontError
  }, [fontError])

  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <GestureHandlerRootView style={$root}>
      <KeyboardProvider>
        <BottomSheetModalProvider>
          <Slot />
        </BottomSheetModalProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  )
}

const $root: ViewStyle = {
  flex: 1,
}
