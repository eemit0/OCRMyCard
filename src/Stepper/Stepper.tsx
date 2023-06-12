import { TouchableOpacity, View, ViewStyle } from "react-native";
import React from "react";
import { ItemSeparator, h32, h4, w226, w24, w342, w64 } from "../constants";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

interface IStepper {
  color: string;
  progress: number;
  invertBackground: string;
  nextProgress: string;
  filePath: string;
}
export const Stepper = ({ color, progress, invertBackground, nextProgress, filePath }: IStepper) => {
  const navigation: RootNavigationProp = useNavigation();
  const progressPage: IProgressData = {
    imgSource: filePath,
    name: nextProgress,
    progressAchieve: progress,
    valid: true,
  };
  return (
    <View
      style={{
        width: w342,
        //backgroundColor: ACTIVE,
        alignSelf: "center",
        flexDirection: "row",
      }}>
      <TouchableOpacity onPress={navigation.canGoBack}>
        <Icon name="arrow-back-outline" size={32} color={color} />
      </TouchableOpacity>
      <ItemSeparator width={w24} />
      {/* stepper */}

      <View style={{ justifyContent: "center", width: "100%" }}>
        <View style={{ ...steeperStyle }}>
          <View style={{ backgroundColor: color, width: w64, height: h4, borderRadius: 16 }}>
            <View
              style={{
                width: progress + 40 / 100,
                backgroundColor: invertBackground,
                height: "100%",
                borderTopRightRadius: 50,
                borderBottomRightRadius: 50,
              }}></View>
          </View>
          <View style={{ backgroundColor: color, width: w64, height: h4, borderRadius: 16 }}></View>
          <View style={{ backgroundColor: color, width: w64, height: h4, borderRadius: 16 }}></View>
        </View>
        {/* stepper */}
      </View>
    </View>
  );
};

const steeperStyle: ViewStyle = {
  height: h32,
  width: w226,
  flexDirection: "row",

  justifyContent: "space-evenly",
  alignItems: "center",
};
