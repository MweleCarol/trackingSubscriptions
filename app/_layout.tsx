import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import '@/global.css';
import { useEffect } from "react";

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    'sans-serif': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-serif-bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-serif-medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-serif-semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-serif-extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'sans-serif-light': require('../assets/fonts/PlusJakartaSans-Light.ttf'),
  });

  // Hide the splash screen once the fonts are loaded
  useEffect(() => {
    if (fontsLoaded) {
     SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded)  return null; // Render nothing if the fonts are not loading
  

  return <Stack screenOptions={{headerShown: false}}/>;
}
