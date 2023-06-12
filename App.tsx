import "react-native-reanimated";
import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { StackNavigator } from "./src/StackNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { GlobalProvider } from "./src/Context";

function App(): JSX.Element {
  return (
    <Fragment>
      <NavigationContainer>
        <StatusBar barStyle={"light-content"} translucent={true} />
        <GlobalProvider>
          <StackNavigator />
        </GlobalProvider>
      </NavigationContainer>
    </Fragment>
  );
}

export default App;
