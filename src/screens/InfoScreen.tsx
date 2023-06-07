import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

interface IHomeScreenProps extends NativeStackScreenProps<RootStackParamList, "InfoScreen"> {}

const InfoScreen = ({ navigation }: IHomeScreenProps) => {
  return (
    <View>
      <Text>LoginScreen</Text>
    </View>
  );
};

export default InfoScreen;
