import { Image, Text, View } from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ItemSeparator, ORANGE, h10, h100, h20, h204, w24 } from "../constants";

interface ISummaryScreenProps extends NativeStackScreenProps<RootStackParamList, "SummaryScreen"> {
  imageSource: string;
  cropImageSource: string;
  mykad?: IOCRNricData;
}
const SummaryScreen = ({ route }: ISummaryScreenProps) => {
  const { imageSource, cropImageSource } = route.params;
  return (
    <View style={{ paddingHorizontal: w24 }}>
      <ItemSeparator height={h100} />
      <View
        style={{
          alignContent: "center",
          backgroundColor: ORANGE,
          borderRadius: 24,
          height: h204,
          justifyContent: "center",
        }}>
        <Image
          source={{ uri: imageSource }}
          resizeMode="contain"
          style={{
            height: "100%",
            width: "100%",
            borderRadius: 24,
          }}
        />
      </View>
      <ItemSeparator height={h10} />
      <Text style={{ textAlign: "center" }}> THIS IS ORIGINAL IMAGE {imageSource}</Text>

      <ItemSeparator height={h20} />
      <View
        style={{
          alignContent: "center",
          backgroundColor: ORANGE,
          borderRadius: 24,
          height: h204,
          justifyContent: "center",
        }}>
        <Image
          source={{ uri: cropImageSource }}
          resizeMode="contain"
          style={{
            height: "100%",
            width: "100%",
            borderRadius: 24,
          }}
        />
      </View>
      <ItemSeparator height={h10} />
      <Text style={{ textAlign: "center" }}> THIS IS CROP IMAGE {cropImageSource}</Text>
    </View>
  );
};

export default SummaryScreen;
