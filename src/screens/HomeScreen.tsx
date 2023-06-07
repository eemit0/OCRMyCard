import { Linking, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { CornerMarker } from "../CornerMarker";
import { Camera, useCameraDevices, useFrameProcessor } from "react-native-vision-camera";
import Icon from "react-native-vector-icons/Ionicons";

import {
  BORDERCOLOUR,
  DICTIONARY_PLACE_OF_BIRTH,
  ItemSeparator,
  NRIC_DATE_FORMAT,
  ORANGE,
  OVERLAY,
  OXFORDBLUE,
  PRIMARY,
  ROSERED,
  WHITE,
  h2,
  h4,
  h5,
  setHeight,
  setWidth,
  titleCaseString,
  w100,
} from "../constants";
import { runOnJS } from "react-native-reanimated";
import { scanOCR } from "vision-camera-ocr";
import { OCRUtils } from "../constants";
import { SECONDARY } from "../constants";
import moment from "moment";
import { ERROR, ERROR_CODE } from "../constants/error";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  let mykad: IOCRNricData = {
    idNumber: "",
    name: "",
    dateOfBirth: new Date(),
    address: "",
    placeOfBirth: "",
    postCode: "",
    city: "",
    state: "",
    gender: "",
    country: "Malaysia",
  };
  const [active, setActive] = useState(true);
  const [imageSource, setImageSource] = useState("");
  const [flash, setFlash] = useState<boolean>(false);
  const [isScannedFront, setIsScannedFront] = useState<boolean>(false);
  const [NRICCard, setNRICCard] = useState<IOCRNricData>();
  const devices = useCameraDevices();
  const device = devices.back;
  const navigation: RootNavigationProp = useNavigation();
  const camera = useRef<Camera>(null);

  // const cameraValidation = async (): Promise<string> => {
  //   const cameraPermission = await Camera.getCameraPermissionStatus();

  //   switch (cameraPermission) {
  //     case "authorized":
  //       return "Your app is authorized to use said permission.";
  //     case "not-determined":
  //       return "";
  //     case "denied":
  //       return "Your app has already requested permissions from the user, but was explicitly denied. You cannot use the request functions again,";
  //     case "restricted":
  //       return "(iOS only) Your app cannot use the Camera or Microphone because that functionality has been restricted, possibly due to active restrictions such as parental controls being in place.";
  //   }
  // };
  // const validate = cameraValidation();

  const getPermission = useCallback(async () => {
    const permission = await Camera.requestCameraPermission();
    console.log("permission status ", permission);
    if (permission === "denied") await Linking.openSettings();
  }, []);

  const captureCamera = async () => {
    if (camera.current !== null) {
      const capture = await camera.current.takePhoto({
        flash: flash ? "on" : "off",
      });
      setImageSource(capture.path);
      setActive(!active);
      console.log(capture.path);
    }
  };
  const NRICcardFront = async (frame: TOCRFrame) => {
    let blocks = frame.result.blocks;

    if (blocks.length > 0 && frame.result.text.toLowerCase().includes("mykad")) {
      blocks.forEach((block, blockIndex) => {
        block.lines.forEach((textLine, lineIndex) => {
          textLine.elements.forEach((element) => {
            // no ic
            if (element.text.match("^([0-9]){6}-([0-9]){2}-([0-9]){4}$")) {
              mykad.idNumber = element.text;
              const nricDate = moment(element.text.substring(0, 6), NRIC_DATE_FORMAT);
              const capturedDate = nricDate.isValid() ? nricDate : null;
              const placeOfBirth = DICTIONARY_PLACE_OF_BIRTH.find((code) => code.code === element.text.substring(7, 9));
              mykad.placeOfBirth = placeOfBirth?.location;
              if (capturedDate === null) {
                return { error: { code: ERROR_CODE.invalidNric, message: ERROR.OCR_INVALID_NRIC } };
              } else {
                mykad.dateOfBirth = moment(capturedDate).isAfter() ? capturedDate.subtract(100, "years").toDate() : capturedDate.toDate();
                mykad.name = blocks[blockIndex + 1].text; // next block should be name
              }
            } else if (element.text.match("[0-9]{5}")) {
              mykad.postCode = element.text;
              if (mykad.postCode !== null) {
                let postCodeIndex = -1;
                const split = block.text.split("\n");
                const postCodeCity = split.filter((value, index) => {
                  postCodeIndex = index;
                  return value.match("^[0-9]{4,5}");
                });
                const [postCode] = postCodeCity[0].split(" ");
                const [state] = split.slice(-1);
                mykad.postCode = postCode;
                mykad.city = titleCaseString(postCodeCity[0].split(" ").slice(1).join(" "));
                mykad.address = split.slice(0, postCodeIndex - 1).join(" ");
                if (state.toLowerCase().includes("kl")) {
                  mykad.state = "Wilayah Persekutuan";
                } else if (state.toLowerCase().includes("putra")) {
                  mykad.state = "Wilayah Persekutuan Putrajaya";
                } else if (state.toLowerCase().includes("labuan")) {
                  mykad.state = "Wilayah Persekutuan Labuan";
                } else {
                  mykad.state = titleCaseString(state);
                }
              }

              mykad.address = block.text;
              mykad.city = element.text.substring(6);
              mykad.state = block.lines[lineIndex + 1].text;
            }
            return { error: { code: ERROR_CODE.invalidNricData, message: ERROR.OCR_INVALID_NRIC_DATA } };
          });
        });
      });
      console.log("nric valid");
      setNRICCard({ ...mykad });
      return { mykad: mykad, validFront: true };
    } else {
      return { error: { code: ERROR_CODE.invalidNric, message: ERROR.OCR_INVALID_NRIC, validFront: false } };
    }
  };

  const nricCardBack = async (frame: TOCRFrame) => {
    const processed = frame.result;
    if (processed.blocks.length > 0 && processed.text.toLowerCase().includes("pendaftaran negara")) {
      if (mykad.idNumber) {
        if (processed.text.includes(mykad.idNumber?.toString())) {
          return { validBack: true };
        } else return { validBack: false };
      }
    }

    return { error: { code: ERROR_CODE.invalidNric, message: ERROR.OCR_INVALID_NRIC, validBack: false } };
  };

  const isValidNricCard = async (frame: TOCRFrame) => {
    const cardFront = NRICcardFront(frame);
    const cardBack = nricCardBack(frame);

    if ((await cardFront) && (await cardBack)) {
      if ((await cardFront).validFront === true) {
        console.log("cardFront is valid");

        setIsScannedFront(true);
        if ((await cardBack).validBack === true) {
          console.log("cardBack is valid");
        }
      }
      if ((await cardFront).validFront && (await cardBack).validBack) {
        navigation.navigate("InfoScreen");
      }
    } else console.log("not exist");
  };
  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";

      const scannedOcr = scanOCR(frame);

      if (scannedOcr.result.text.length > 0) {
        // console.log(scannedOcr.result.blocks);

        runOnJS(isValidNricCard)(scannedOcr);

        //console.log("inside result", scannedOcr.result);
        //const data = OCRUtils.mykadFront(scannedOcr);
        // console.log(data);

        //const cornerPoints = scannedOcr.cornerPoints;
        // const xRatio = frame.width / width;
        // const yRatio = frame.height / height;
        // if (Platform.OS === 'ios') {
        //   const xArray = cornerPoints.map(corner => parseFloat(corner.x));
        //   const yArray = cornerPoints.map(corner => parseFloat(corner.y));
        //   const resultPoints = {
        //     left: Math.min(...xArray) / xRatio,
        //     right: Math.max(...xArray) / xRatio,
        //     bottom: Math.max(...yArray) / yRatio,
        //     top: Math.min(...yArray) / yRatio,
        //   };
        //   runOnJS(setPointsOfInterest)(resultPoints);
        // } else {
        // }
        //   runOnJS(setBarcodes)(detectedBarcodes);
        // } else {
        //   runOnJS(setPointsOfInterest)(null);
        // }
      }
    },
    [scanOCR, OCRUtils],
  );

  useEffect(() => {
    // Handler
    getPermission();
  }, []);

  return (
    <View style={{ backgroundColor: OXFORDBLUE, flex: 1, paddingVertical: 120 }}>
      <View
        style={{
          justifyContent: "center",
          alignSelf: "center",
          alignItems: "center",
          paddingHorizontal: 120,
          backgroundColor: OVERLAY,
          paddingVertical: 40,
        }}>
        <View style={{ width: 120, height: 24 }}>
          <Text style={{ backgroundColor: ORANGE, color: PRIMARY }}> Scanned: {isScannedFront ? "Back IC" : "Front IC"}</Text>
        </View>
        <CornerMarker color={BORDERCOLOUR} height={setHeight(27)} width={setWidth(95)} borderRadius={12} borderLength={38} thickness={3}>
          {device !== null && device !== undefined ? (
            <Camera
              style={{ width: setWidth(90), height: setHeight(25), borderRadius: 8 }}
              device={device}
              isActive={active}
              ref={camera}
              photo
              frameProcessor={frameProcessor}
            />
          ) : (
            <View style={{ backgroundColor: ROSERED }}>
              <Text>LOADING...</Text>
            </View>
          )}
        </CornerMarker>
        {/* Render bottom components */}
      </View>
      <ItemSeparator height={h5} />
      <View style={{ justifyContent: "center", width: "100%", flexDirection: "column" }}>
        <Text style={{ color: WHITE, textAlign: "center", fontSize: 16, fontWeight: "800" }}>Front of your ID</Text>
        <Text
          style={{
            color: WHITE,
            paddingTop: 12,
            fontSize: 14,
            width: w100,
            textAlignVertical: "center",
            textAlign: "center",
            fontWeight: "500",
            paddingHorizontal: 50,
            justifyContent: "center",
          }}
          numberOfLines={3}>
          Place card on dark background for best results. Your entire ID must be in the frame and remove any cover.
        </Text>
        <View style={{ alignItems: "center", paddingTop: 24 }}>
          <Text style={{ color: ORANGE, fontWeight: "600" }}>PHOTO</Text>
        </View>
        <View style={{ justifyContent: "space-around", flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => setFlash(!flash)}
            style={{
              ...bottomIconStyle,
            }}>
            <Icon name="flash-outline" size={24} color={WHITE} />
          </TouchableOpacity>

          <TouchableOpacity onPress={captureCamera}>
            <View
              style={{
                width: 60,
                height: 60,
                justifyContent: "center",
                borderRadius: 50,
                position: "absolute",
                backgroundColor: WHITE,
                top: h2,
                zIndex: -1,
                borderStyle: "solid",
                borderColor: SECONDARY,
                alignSelf: "center",
              }}>
              <View>
                <View
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 50,
                    backgroundColor: WHITE,
                    borderStyle: "solid",
                    borderColor: SECONDARY,
                    alignSelf: "center",
                    borderWidth: 3,
                  }}></View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...bottomIconStyle,
            }}>
            <Icon name="camera-reverse-outline" size={24} color={WHITE} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const bottomIconStyle: ViewStyle = {
  top: h4,
  justifyContent: "center",
  alignSelf: "auto",
};

export default HomeScreen;
