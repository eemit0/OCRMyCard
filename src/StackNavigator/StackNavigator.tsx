import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import InfoScreen from "../screens/InfoScreen";

export const RootStack = createNativeStackNavigator<RootStackParamList>();

export const StackNavigator = () => {
  return (
    <>
      <RootStack.Navigator screenOptions={{ headerShown: false, animation: "fade_from_bottom", animationTypeForReplace: "push" }}>
        <RootStack.Group>
          <RootStack.Screen name="HomeScreen" component={HomeScreen} />
          <RootStack.Screen name="InfoScreen" component={InfoScreen} />
        </RootStack.Group>
      </RootStack.Navigator>
    </>
  );
};
