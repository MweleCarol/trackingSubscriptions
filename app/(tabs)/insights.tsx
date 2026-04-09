import { Text } from 'react-native'
import React from 'react'
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

// Wrap the provided `SafeAreaView` with `styled` to allow the use of Tailwind classes
const SafeAreaView = styled(RNSafeAreaView);


const insights = () => {
  return (
    <SafeAreaView className='flex-1 bg-background p-5'>
      <Text>Insights</Text>
    </SafeAreaView>
  )
}

export default insights