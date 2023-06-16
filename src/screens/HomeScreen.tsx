import { Linking, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CornerMarker } from "../CornerMarker";
import { Camera, useCameraDevices, useFrameProcessor, CameraDeviceFormat } from "react-native-vision-camera";
import Icon from "react-native-vector-icons/Ionicons";
import {
  BORDERCOLOUR,
  DICTIONARY_PLACE_OF_BIRTH,
  FRAMERATIO,
  h12,
  h16,
  h20,
  h25,
  h28,
  h360,
  h5,
  h64,
  h72,
  height,
  ItemSeparator,
  NRIC_DATE_FORMAT,
  ORANGE,
  OVERLAY,
  OXFORDBLUE,
  POPPINS_BLACK,
  ProgressChecker,
  ROSERED,
  titleCaseString,
  w100,
  w226,
  w24,
  w48,
  w5,
  w82,
  WHITE,
  width,
} from "../constants";
import { runOnJS } from "react-native-reanimated";
import { scanOCR } from "vision-camera-ocr";
import { OCRUtils } from "../constants";
import { SECONDARY } from "../constants";
import moment from "moment";
import { ERROR, ERROR_CODE } from "../constants/error";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Stepper } from "../Stepper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { GlobalContext } from "../Context";

interface IHomeScreenProps extends NativeStackScreenProps<RootStackParamList, "HomeScreen"> {}
const HomeScreen = ({}: IHomeScreenProps) => {
  const [imageSource, setImageSource] = useState("");
  const [flash, setFlash] = useState<boolean>(false);
  const [isScannedFront, setIsScannedFront] = useState<boolean>(false);
  const [isScannedBack, setIsScannedBack] = useState<boolean>(false);
  const [isScannedValid, setIsScannedValid] = useState<boolean>(false);
  const [NRICCard, setNRICCard] = useState<IOCRNricData>({});
  const devices = useCameraDevices("wide-angle-camera");
  const isFocused = useIsFocused();
  const device = devices.back;
  const navigation: RootNavigationProp = useNavigation();
  const camera = useRef<Camera>(null);
  const { currentStep, myKad: contextMyKad } = useContext(GlobalContext);
  //console.log("currentStep in homeScreen", currentStep);
  //  console.log("mykad in HomeScreen", contextMyKad);

  const customFormat: CameraDeviceFormat = {
    autoFocusSystem: "contrast-detection",
    colorSpaces: [],
    fieldOfView: 0,
    frameRateRanges: [],
    maxISO: 0,
    maxZoom: 5,
    minISO: 0,
    photoHeight: FRAMERATIO.height * height,
    photoWidth: FRAMERATIO.width * width,
    pixelFormat: "420f",
    supportsPhotoHDR: false,
    supportsVideoHDR: false,
    videoHeight: 0,
    videoStabilizationModes: [],
    videoWidth: 0,
  };
  // const format = useMemo(() => {
  //   if (!device) return null;

  //   const desiredHeight = 1080; // Specify the desired photo height
  //   const desiredWidth = 1920; // Specify the desired photo width

  //   // Find the format that matches the desired height and width
  //   const desiredFormat = device.formats.find((f) => f.photoHeight === desiredHeight && f.photoWidth === desiredWidth);

  //   return desiredFormat || device.formats[0]; // Fallback to the first available format if desired format not found
  // }, [device?.formats]);

  const getPermission = useCallback(async () => {
    const permission = await Camera.requestCameraPermission();
    console.log("permission status ", permission);
    if (permission === "denied") await Linking.openSettings();
  }, []);

  const captureCamera = async () => {
    const delay = 5000; // 5000 milliseconds (5 seconds)

    const timerId = setTimeout(() => {
      // Code to be executed after the delay
      console.log("Timeout completed");
    }, delay);

    if (camera.current !== null) {
      const capture = await camera.current.takePhoto({
        flash: flash ? "on" : "off",
      });

      if (capture.path !== "" && isScannedValid === true) {
        setImageSource(capture.path);
        console.log(capture.path);
        console.log("width:", capture.width);

        console.log("height", capture.height);

        if (NRICCard !== null) {
          //timerId;
          navigation.navigate("InfoScreen", { mykad: NRICCard, imageSource: capture.path, currentStep: currentStep });
        }
      }
    }
  };
  const NRICCardFront = async (frame: TOCRFrame) => {
    let mykad: IOCRNricData = {
      idNumber: "",
      name: "",
      dateOfBirth: "",
      address: "",
      placeOfBirth: "",
      postCode: "",
      city: "",
      state: "",
      gender: "",
      country: "Malaysia",
    };
    const blocks: ITextBlock[] = frame.result.blocks;
    const resultText: string = frame.result.text;
    let isPlacementValid = false;
    // console.log("length", blocks.length);

    const baseX = 355.5;
    const baseY = 979;
    const min = 350;
    const max = 420.75;
    const minY = 979.25;
    const maxY = 1856.75;

    //cleaner codes

    const hasMyKad: ITextBlock[] = blocks.filter((eachBlock) => eachBlock.text.toLowerCase().includes("mykad"));

    if (hasMyKad.length === 0) {
      console.log("not a valid nric");
      setIsScannedValid(false);
      return { error: { code: ERROR_CODE.invalidNric, message: ERROR.OCR_INVALID_NRIC }, validFront: false };
    }
    const oneMyKadBlock: ITextBlock[] = hasMyKad.length > 0 ? [...hasMyKad].splice(0, 1) : [];

    if (
      !(
        oneMyKadBlock.length > 0 &&
        oneMyKadBlock[0].frame.x >= min &&
        oneMyKadBlock[0].frame.x <= max &&
        oneMyKadBlock[0].frame.y >= minY &&
        oneMyKadBlock[0].frame.y <= maxY
      )
    ) {
      return { error: { code: ERROR_CODE.invalidNric, message: ERROR.OCR_INVALID_NRIC }, validFront: false };
    }

    blocks.forEach((block) => {
      console.log("myKad -->", block.text);
      console.log("frame x", block.frame.x);
      console.log("frame y", block.frame.y);

      block.lines.forEach((textLine) => {
        textLine.elements.forEach((element) => {
          const elementText = element.text;
          if (elementText.match("^([0-9]){6}-([0-9]){2}-([0-9]){4}$")) {
            mykad.idNumber = elementText;
            const nricDate = moment(elementText.substring(0, 6), NRIC_DATE_FORMAT);
            const capturedDate = nricDate.isAfter() ? nricDate.subtract(100, "years").format("DD-MM-YYYY") : nricDate.format("DD-MM-YYYY");
            const placeOfBirth = DICTIONARY_PLACE_OF_BIRTH.find((code) => code.code === elementText.substring(7, 9));
            mykad.placeOfBirth = placeOfBirth?.location;
            mykad.dateOfBirth = capturedDate;
            if (blocks) {
              const blockName: string =
                blocks[blocks.indexOf(block) + 1].text.length >= 1
                  ? blocks[blocks.indexOf(block) + 1].text
                  : blocks[blocks.indexOf(block)].text;
              let name = blockName.replace(/\n/g, "");
              if (
                name !== "warganegara" &&
                name !== "islam" &&
                name !== "warganegara islam" &&
                name !== "warganegara islam lelaki" &&
                !name.includes("myKad")
              ) {
                console.log(blockName);
                mykad.name = name.toUpperCase();
              }
            }
          } else if (elementText.match("[0-9]{5}")) {
            mykad.postCode = elementText;
            if (block.text) {
              const split = block.text.split("\n");
              const postCodeCity = split.filter((value) => {
                return value.match("^[0-9]{4,5}");
              });
              if (postCodeCity.length > 0) {
                const [postcode] = postCodeCity[0].split(" ");
                const [state] = split.slice(-1);
                mykad.postCode = postcode;
                mykad.city = titleCaseString(postCodeCity[0].split(" ").slice(1).join(" "));
                mykad.address = block.text.replace(/\n/g, " ");
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
            }
          } else if (elementText.toLowerCase() === "lelaki") {
            mykad.gender = "Male";
          } else if (elementText.toLowerCase() === "perempuan") {
            mykad.gender = "Female";
          }
        });
      });
      console.log(mykad);
      console.log("PERFECT FRAME!");
      isPlacementValid = true;
      console.log("isPlacement", isPlacementValid);
    });

    if (!isPlacementValid) {
      console.log("invalid nric placement");
      setIsScannedValid(false);
      return { error: { code: ERROR_CODE.invalidNricData, message: ERROR.OCR_INVALID_NRIC_DATA }, validFront: false };
    }

    if ((mykad.idNumber === undefined && mykad.idNumber === null) || (mykad.name === undefined && mykad.name === null)) {
      console.log("invalid nric data");
      setIsScannedValid(false);
      return { error: { code: ERROR_CODE.invalidNricData, message: ERROR.OCR_INVALID_NRIC_DATA }, validFront: false };
    }

    setIsScannedValid(isPlacementValid);
    console.log("NRIC_CARD is valid");
    //setNRICCard(mykad);
    return { mykad, validFront: true };
  };

  const nricCardBack = async (frame: TOCRFrame) => {
    const processed = frame.result;
    console.log("ic no", contextMyKad);
    if (processed.blocks.length > 0 && processed.text.toLowerCase().includes("pendaftaran negara")) {
      if (contextMyKad.idNumber) {
        if (processed.text.includes(contextMyKad.idNumber)) {
          //    console.log(processed.text);
          return { validBack: true };
        } else return { validBack: false };
      }
    }

    return { error: { code: ERROR_CODE.invalidNric, message: ERROR.OCR_INVALID_NRIC, validBack: false } };
  };

  //render function to validate Is NricCard
  const isValidNricCard = async (frame: TOCRFrame) => {
    if (currentStep === "Back") {
      const cardBack = await nricCardBack(frame);
      console.log("running cardBack function");
      if (cardBack.validBack === true) {
        setIsScannedValid(true);
        setIsScannedBack(true);
      } else {
        setIsScannedValid(false);
        setIsScannedBack(false);
      }
    } else if (currentStep === "Front") {
      const cardFront = await NRICCardFront(frame);
      if (cardFront) {
        if (cardFront.error) {
          setIsScannedValid(false);
        } else if (cardFront.validFront) {
          if (cardFront.validFront === true) {
            const mykad = cardFront.mykad;
            console.log("name", mykad.name);
            setNRICCard(mykad);
            setIsScannedValid(true);
            setIsScannedFront(true);

            //  console.log("cardFront is valid");
          }
        }
      }
    } else {
      console.log("currentStep : ", currentStep);
    }
  };

  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";
      // let squareSize = frame.width * FRAMERATIO.width - 100;

      // const scanFrame: TFrame = {
      //   height: squareSize,
      //   width: squareSize,
      //   isValid: frame.isValid,
      //   bytesPerRow: frame.bytesPerRow,
      //   planesCount: frame.planesCount,
      //   close: () => frame.toString(),
      // };

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
  const OCRSCANNER = "OCRSCANNER";
  const progress = 34.5;

  const getData = async () => {
    const progressChecker = await ProgressChecker(OCRSCANNER, imageSource, false, progress);
    return progressChecker;
  };

  useEffect(() => {
    // Handler
    getData();
    getPermission();
  }, []);

  return (
    <View style={{ backgroundColor: OXFORDBLUE, flex: 1 }}>
      <ItemSeparator height={h72} />
      <Stepper color={WHITE} progress={progress} invertBackground={ROSERED} nextProgress={OCRSCANNER} filePath={imageSource} />
      <ItemSeparator height={h64} />
      <View
        style={{
          alignItems: "center",
          backgroundColor: OVERLAY,
          height: h360,
        }}>
        <Text
          style={{
            color: isScannedValid ? BORDERCOLOUR : ROSERED,
            textAlign: "center",
            fontFamily: POPPINS_BLACK,
          }}>
          {isScannedValid ? "good placement!" : "Correct the placement of MyKad!"}
        </Text>

        <View style={{ paddingVertical: h72, paddingHorizontal: w24 }}>
          <CornerMarker
            color={isScannedValid === true ? BORDERCOLOUR : ROSERED}
            height={FRAMERATIO.height + h5}
            width={FRAMERATIO.width + w5}
            borderRadius={16}
            borderLength={48}
            thickness={8}>
            <View style={{ width: FRAMERATIO.width, height: FRAMERATIO.height }}>
              {device !== null && device !== undefined ? (
                <Camera
                  device={device}
                  enableHighQualityPhotos={true}
                  enableZoomGesture={true}
                  frameProcessor={frameProcessor}
                  isActive={isFocused}
                  photo
                  frameProcessorFps={30}
                  ref={camera}
                  //format={format}
                  style={{ height: FRAMERATIO.height, width: FRAMERATIO.width, borderRadius: 16 }}
                />
              ) : (
                <View
                  style={{
                    backgroundColor: ROSERED,
                    borderRadius: 50,
                    width: w100,
                    alignItems: "center",
                    alignSelf: "center",
                    justifyContent: "center",
                  }}>
                  <Text>Loading...</Text>
                </View>
              )}
            </View>
          </CornerMarker>
        </View>

        {/* Render bottom components */}
      </View>
      <ItemSeparator height={h28} />
      <View style={{ alignItems: "center", paddingHorizontal: w82 }}>
        <Text style={{ color: WHITE, fontSize: 16, fontWeight: "800", lineHeight: h20, fontFamily: POPPINS_BLACK }}>
          {`${currentStep} of your ID`}
        </Text>

        <Text
          style={{
            color: WHITE,
            paddingTop: h16,
            width: w226,
            fontSize: 12,
            fontWeight: "400",
            textAlign: "center",
            fontFamily: POPPINS_BLACK,
          }}>
          Place card on dark background for best results. Your entire ID must be in the frame and remove any cover.
        </Text>

        <Text
          style={{
            color: ORANGE,
            fontWeight: "400",
            paddingTop: h25,
            alignItems: "center",
            alignSelf: "center",
            fontFamily: POPPINS_BLACK,
          }}>
          PHOTO
        </Text>
      </View>
      <ItemSeparator height={h16} />
      <View style={{ justifyContent: "space-between", flexDirection: "row", paddingHorizontal: w48 }}>
        <View>
          <ItemSeparator height={h12} />
          <TouchableOpacity onPress={() => setFlash(!flash)} style={{}}>
            <Icon name="flash-outline" color={WHITE} style={{ fontSize: 32 }} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={captureCamera} disabled={isScannedValid === true ? false : true}>
          <View
            style={{
              alignSelf: "center",
              backgroundColor: WHITE,
              borderColor: SECONDARY,
              borderRadius: 50,
              borderStyle: "solid",
              height: 70,
              justifyContent: "center",
              position: "absolute",
              width: 70,
              zIndex: -1,
            }}>
            <View>
              <View
                style={{
                  alignSelf: "center",
                  backgroundColor: WHITE,
                  borderColor: SECONDARY,
                  borderRadius: 50,
                  borderStyle: "solid",
                  borderWidth: 2,
                  height: 58,
                  width: 58,
                }}></View>
            </View>
          </View>
        </TouchableOpacity>
        <View>
          <ItemSeparator height={h12} />
          <TouchableOpacity style={{}}>
            <Icon name="camera-reverse-outline" color={WHITE} style={{ fontSize: 32 }} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
