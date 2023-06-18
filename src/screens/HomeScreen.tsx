import { Linking, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { CornerMarker } from "../CornerMarker";
import { Camera, useCameraDevices, useFrameProcessor, CameraDeviceFormat } from "react-native-vision-camera";
import Icon from "react-native-vector-icons/Ionicons";
import {
  BORDERCOLOUR,
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
  ORANGE,
  OVERLAY,
  OXFORDBLUE,
  POPPINS_BLACK,
  ProgressChecker,
  ROSERED,
  w100,
  w226,
  w24,
  w48,
  w5,
  w82,
  WHITE,
  OCRFrontCard,
  width,
} from "../constants";
import { runOnJS } from "react-native-reanimated";
import { scanOCR } from "vision-camera-ocr";
import { SECONDARY } from "../constants";
import { ERROR, ERROR_CODE } from "../constants/error";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Stepper } from "../Stepper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { GlobalContext } from "../Context";

interface IHomeScreenProps extends NativeStackScreenProps<RootStackParamList, "HomeScreen"> {}
const HomeScreen = ({}: IHomeScreenProps) => {
  const [imageSource, setImageSource] = useState("");
  const [activeProcess, setActiveProcess] = useState<boolean>(false);
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

  //   Find the format that matches the desired height and width
  //   const desiredFormat = device.formats.find((f) => f.photoHeight === desiredHeight && f.photoWidth === desiredWidth);

  //   return desiredFormat || device.formats[0]; // Fallback to the first available format if desired format not found
  // }, [device?.formats]);

  const getPermission = useCallback(async () => {
    const permission = await Camera.requestCameraPermission();
    const delay = 2000; // 5000 milliseconds (5 seconds)

    const timerId = setTimeout((isPlacement) => {
      // Code to be executed after the delay
      console.log("Timeout completed");
      setIsScannedValid(isPlacement);
    }, delay);
    console.log("permission status ", permission);
    if (permission === "denied") await Linking.openSettings();
  }, []);

  const captureCamera = async () => {
    if (camera.current !== null) {
      const capture = await camera.current.takePhoto({
        flash: flash ? "on" : "off",
      });

      if (capture.path !== "" && isScannedValid === true) {
        setImageSource(capture.path);
        console.log(capture.path);
      }
      if (NRICCard !== null) {
        // timerId;
        navigation.navigate("InfoScreen", { mykad: NRICCard, imageSource: capture.path, currentStep: currentStep });
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
    let validatedInfo = false;

    const baseX = 355.5;
    const baseY = 979;
    const myKadMaxX = 381.75;
    const myKadMaxY = 980.25;
    const myKadMinX = 352.5;
    const myKadMinY = 967.75;
    const noIcMaxX = 104.25;
    const noIcMaxY = 1157.75;
    const noIcMinX = 97.75;
    const noIcMinY = 1140.25;

    //cleaner codes ---> filter by words to find desired blocks

    const hasMyKad: ITextBlock[] = blocks.filter((eachBlock) => eachBlock.text.toLowerCase().includes("mykad"));
    const findMyIC: ITextBlock[] = blocks.filter((eachBlock) => eachBlock.text.match("^([0-9]){6}-([0-9]){2}-([0-9]){4}$"));

    if (hasMyKad.length === 0) {
      console.log("not a valid nric");
      setIsScannedValid(false);
      return { error: { code: ERROR_CODE.invalidNric, message: ERROR.OCR_INVALID_NRIC }, validFront: false };
    }
    if (findMyIC.length === 0) {
      console.log("cannot find IC blocks");
      setIsScannedValid(false);
      return { error: { code: ERROR_CODE.invalidNric, message: ERROR.OCR_INVALID_NRIC }, validFront: false };
    }

    const oneMyKadBlock: ITextBlock[] = hasMyKad.length > 0 ? [...hasMyKad].splice(0, 1) : [];
    const noICBlock: ITextBlock[] = findMyIC.length > 0 ? [...findMyIC].splice(0, 1) : [];
    console.log("calculating range of no myKad x", hasMyKad[0].frame.x);
    console.log("calculating range of no myKad y", hasMyKad[0].frame.y);
    console.log("calculating range of no Ic x", findMyIC[0].frame.x);

    //check position of mykad range
    if (
      !(
        oneMyKadBlock.length > 0 &&
        oneMyKadBlock[0].frame.x >= myKadMinX &&
        oneMyKadBlock[0].frame.x <= myKadMaxX &&
        oneMyKadBlock[0].frame.y >= myKadMinY &&
        oneMyKadBlock[0].frame.y <= myKadMaxY
      )
    ) {
      return { error: { code: ERROR_CODE.invalidNric, message: ERROR.OCR_INVALID_NRIC }, validFront: false };
    }

    // check position of IC range
    if (
      !(
        (noICBlock.length > 0 && noICBlock[0].frame.x >= noIcMinX && noICBlock[0].frame.x <= noIcMaxX)
        // foundIC[0].frame.y >= noIcMinY &&
        // foundIC[0].frame.y <= noIcMaxY
      )
    ) {
      return { error: { code: ERROR_CODE.invalidNric, message: ERROR.OCR_INVALID_NRIC }, validFront: false };
    }
    setIsScannedValid(true);

    // To do send the image for real scanning for better accuracy

    const scanned = await OCRFrontCard(mykad, blocks, validatedInfo);

    if (!scanned.scannedIC) {
      console.log("invalid nric placement");
      setIsScannedValid(false);
      return { error: { code: ERROR_CODE.invalidNricData, message: ERROR.OCR_INVALID_NRIC_DATA }, validFront: false };
    }

    if ((mykad.idNumber === undefined && mykad.idNumber === null) || (mykad.name === undefined && mykad.name === null)) {
      console.log("invalid nric data");
      setIsScannedValid(false);
      return { error: { code: ERROR_CODE.invalidNricData, message: ERROR.OCR_INVALID_NRIC_DATA }, validFront: false };
    }

    //setIsScannedValid(scanned.scannedIC);
    console.log("NRIC_CARD is valid");
    return { mykad: scanned.mykad, validFront: true };
  };

  const nricCardBack = async (frame: TOCRFrame) => {
    const blockBack = frame.result;

    console.log("ic no", contextMyKad);
    if (blockBack.blocks.length > 0 && blockBack.text.toLowerCase().includes("pendaftaran negara")) {
      if (contextMyKad.idNumber) {
        if (blockBack.text.includes(contextMyKad.idNumber)) {
          const processedBlocks = blockBack.blocks.filter((blocks) => {
            return blocks.text.length > 0 && blocks.text.toLowerCase().includes("pendaftaran negara") ? blocks : [];
          });
          console.log("found pedaftaran negara?", processedBlocks[0].frame.boundingCenterY);

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

      const scannedOcr = scanOCR(frame);

      if (scannedOcr.result.text.length > 0) {
        // console.log(scannedOcr.result.blocks);

        runOnJS(isValidNricCard)(scannedOcr);
      }
    },
    [scanOCR, isValidNricCard],
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
