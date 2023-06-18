import { Image, ScrollView, StatusBar, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  ACCENTBLUE,
  ACTIVE,
  cropImage,
  FRAMERATIO,
  h136,
  h20,
  h204,
  h220,
  h32,
  h38,
  h4,
  h40,
  h56,
  h660,
  hCrop,
  ItemSeparator,
  minHeight,
  ORANGE,
  POPPINS_BLACK,
  setHeight,
  STEPBLUE,
  w24,
  w342,
  WCrop,
  WHITE,
  yPosition,
} from "../constants";
import { Stepper } from "../Stepper";
import { InfoSection } from "../InfoSection.tsx";
import { GlobalContext } from "../Context";

interface IInfoScreenProps extends NativeStackScreenProps<RootStackParamList, "InfoScreen"> {
  currentStep: string;
  imageSource: string;
  mykad: IOCRNricData;
}

const InfoScreen = ({ route, navigation }: IInfoScreenProps) => {
  const { mykad, imageSource, currentStep } = route.params;
  const { setProgress, myKad: contextMyKad } = useContext(GlobalContext);

  const setNextProgress = async (currentStep: string, mykad: IOCRNricData, nextStep: boolean) => {
    // const handleProgress = await setProgress(currentStep, mykad);
    // if (handleProgress.front === true && handleProgress.back === true && nextStep === true) {
    //   console.log("Mykad is valid and ready");

    //repeat process
    // navigation.push("HomeScreen", { currentStep: "Front" });
    // } else {
    //   console.log("setNextProgress", contextMyKad);
    //   const handleProgressFront = await setProgress(currentStep, mykad);
    //   const handleProgressBack = await setProgress("Back", contextMyKad);
    //   nextStep === true ? handleProgressBack : handleProgressFront;
    //   if (contextMyKad.idNumber !== "") {
    //     navigation.push("HomeScreen", { currentStep: currentStep });
    //   }
    // }

    const handleProgress = await setProgress(nextStep === true ? "Back" : currentStep, currentStep === "Back" ? contextMyKad : mykad);
    console.log(handleProgress);
    if (handleProgress.front === true && handleProgress.back === true && nextStep === true) {
      console.log("handleProgress", handleProgress);
      console.log("Mykad is valid and ready");
      const imagePath = await cropImage(imageSource);
      navigation.navigate("SummaryScreen", { imageSource: imageSource, cropImageSource: imagePath, mykad: contextMyKad });
      // setProgress("Front", {});
      //repeat process
      // navigation.push("HomeScreen", { currentStep: "Front" });
    } else {
      navigation.push("HomeScreen");
    }
  };

  // useEffect(() => {
  //   handleStepProgress();
  // }, []);
  return (
    <SafeAreaView>
      <StatusBar barStyle={"dark-content"} />
      <ItemSeparator height={h4} />

      <Stepper color={ACCENTBLUE} progress={50.5} nextProgress={"Front IC"} filePath={imageSource} invertBackground={STEPBLUE} />
      <View style={{ width: w342, paddingTop: h40, paddingHorizontal: w24 }}>
        <Text style={{ fontWeight: "600", fontSize: 20, paddingBottom: h4, fontFamily: POPPINS_BLACK }}>Verify your photo ID</Text>
        <Text style={{ fontSize: 14, fontWeight: "400", lineHeight: h20, width: w342, height: h40, fontFamily: POPPINS_BLACK }}>
          Make sure all details are clear to read with no blur or glare.
        </Text>
      </View>
      <ItemSeparator height={h32} />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: w24,
          flexShrink: 1,
          minHeight: currentStep === "Front" ? minHeight : h660,
        }}
        indicatorStyle="black"
        bounces={false}>
        <View
          style={{
            alignContent: "center",
            backgroundColor: ORANGE,
            borderRadius: 24,
            height: h204,
            justifyContent: "center",
          }}>
          {imageSource !== "" ? (
            <Image
              source={{ uri: imageSource }}
              resizeMode="cover"
              style={{
                height: "100%",
                width: "100%",
                borderRadius: 24,
              }}
            />
          ) : (
            <Text style={{ fontFamily: POPPINS_BLACK, fontSize: 16, textAlign: "center" }}> No picture, please retake myKad photo!</Text>
          )}
        </View>

        <ItemSeparator height={h38} />
        {/* FRAME */}
        <View style={{ height: h220, width: w342 }}>
          {mykad !== undefined || currentStep === currentStep ? (
            <View>
              <InfoSection mykad={mykad} currentStep={currentStep} />
              {/* render Row */}
              <ItemSeparator height={h38} />
            </View>
          ) : (
            <>
              <ItemSeparator height={h204} />
            </>
          )}

          <View style={{ width: w342, height: h136, justifyContent: "space-between" }}>
            <TouchableOpacity onPress={() => setNextProgress(currentStep, mykad, true)}>
              <View style={{ ...button }}>
                <Text
                  style={{
                    ...buttonText,
                  }}>
                  Looks Good!
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNextProgress(currentStep, mykad, false)}>
              <View style={{ ...button, backgroundColor: WHITE, borderWidth: 2, borderColor: ACTIVE }}>
                <Text
                  style={{
                    ...buttonText,
                    color: ACTIVE,
                  }}>
                  Retake Again
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <ItemSeparator height={h38} />
    </SafeAreaView>
  );
};

const button: ViewStyle = {
  backgroundColor: ACTIVE,
  borderRadius: 48,
  height: h56,
  justifyContent: "center",
  width: w342,
};
const buttonText: TextStyle = {
  alignSelf: "center",
  color: WHITE,
  fontFamily: POPPINS_BLACK,
  fontSize: 16,
  fontWeight: "600",
  textAlign: "center",
  textAlignVertical: "center",
};
export default InfoScreen;
