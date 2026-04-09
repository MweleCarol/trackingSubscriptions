import { Link, router } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";

const SignIn = () => {
  return (
    <View>
      <Text>SignIn</Text>
      <Link href="/(auth)/sign-in">Create an Account</Link>
      <Button title="Back to Main" onPress={() => router.replace("/")} />
    </View>
  );
};

export default SignIn;
