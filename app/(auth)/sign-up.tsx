import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const SignUp = () => {
  return (
    <View>
      {/* (auth) is a route group that is used to organize the routes without affecting the url path - it will show /sign-up instead of  /auth/sign-up*/}
      <Text>SignUp</Text>
      <Link href="/(auth)/sign-up">Sign up</Link>
    </View>
  );
};

export default SignUp;
