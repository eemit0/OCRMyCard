import "react-native-reanimated";
import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, Linking, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { Camera, useCameraDevices, useFrameProcessor } from "react-native-vision-camera";
import { Svg, Defs, Rect, Mask } from "react-native-svg";
import { scanOCR } from "vision-camera-ocr";

const cameraValidation = async (): Promise<string> => {
  const cameraPermission = await Camera.getCameraPermissionStatus();

  switch (cameraPermission) {
    case "authorized":
      return "Your app is authorized to use said permission.";
    case "not-determined":
      return "";
    case "denied":
      return "Your app has already requested permissions from the user, but was explicitly denied. You cannot use the request functions again,";
    case "restricted":
      return "(iOS only) Your app cannot use the Camera or Microphone because that functionality has been restricted, possibly due to active restrictions such as parental controls being in place.";
  }
};

function App(): JSX.Element {
  const validate = cameraValidation();
  const devices = useCameraDevices();
  const device = devices.back;
  const camera = useRef<Camera>(null);

  const { height, width } = Dimensions.get("screen");
  const setHeight = (h: number) => (height / 100) * h;
  const setWidth = (w: number) => (width / 100) * w;
  // represents position of the cat on the screen 🐈
  // const catBounds = useSharedValue({ top: 0, left: 0, right: 0, bottom: 0 });

  // continously sets 'catBounds' to the cat's coordinates on screen
  // const frameProcessor = useFrameProcessor(
  //   (frame) => {
  //     "worklet";
  //     catBounds.value = scanFrameForCat(frame);
  //   },
  //   [catBounds],
  // );

  // uses 'catBounds' to position the red rectangle on screen.
  // smoothly updates on UI thread whenever 'catBounds' is changed
  // const boxOverlayStyle = useAnimatedStyle(
  //   () => ({
  //     position: "absolute",
  //     borderWidth: 1,
  //     borderColor: "red",
  //     ...catBounds.value,
  //   }),
  //   [catBounds],
  // );

  const scannedOcr = useCallback((ocrFrame) => {}, []);
  const frameProcessor = useFrameProcessor((frame) => {
    "worklet";
    const scannedOcr = scanOCR(frame);
    console.log(scannedOcr);
    OcrScannerMyCard(scannedOcr);
  }, []);

  const OcrScannerMyCard = async (frame) => {
    let rightBounds = 0;
    let leftBounds = 0;
    // const processed = await TextRecognition.recognize(frame);

    if (frame.blocks.length > 0 && frame.text.toLowerCase().includes("mykad")) {
      frame.blocks.forEach((block) => {
        rightBounds = block[2] > rightBounds ? block[2] : rightBounds;
        const compareBounds = block[0] < leftBounds ? block[0] : leftBounds;
        leftBounds = leftBounds === 0 ? block[0] : compareBounds;
      });
      const cleanBlocks = frame.blocks.map((block) => {
        if (block[0] < leftBounds + 100) {
          return block;
        }
        if (block[2] < rightBounds / 2) {
          return block;
        }
        return undefined;
      });

      return { blocks: cleanBlocks.filter((block) => block !== undefined), text: frame.text };
    }
  };
  const [showCamera, setShowCamera] = useState(false);
  const [imageSource, setImageSource] = useState("");
  const [qrCode, setQrCode] = useState<string>("");
  const [isScanned, setIsScanned] = useState<boolean>(false);

  const getPermission = React.useCallback(async () => {
    const permission = await Camera.requestCameraPermission();
    console.log("permission status ", permission);
    if (permission === "denied") await Linking.openSettings();
  }, []);
  useEffect(() => {
    // Handler
    getPermission();
  }, []);

  const captureCamera = async () => {
    if (camera.current !== null) {
      const capture = await camera.current.takePhoto({});
      setImageSource(capture.path);
      setShowCamera(false);
      console.log(capture.path);
    }
  };

  return (
    <Fragment>
      <View style={{ flex: 1 }}>
        {device !== null && device !== undefined ? (
          <>
            <View style={{ flex: 1 }}>
              <Camera style={{ flex: 1 }} device={device} isActive={true} ref={camera} photo frameProcessor={frameProcessor}>
                {/* Camera preview */}
                <View style={{ flex: 1 }}>
                  {/* Box overlay */}
                  <Svg height={"100%"} width={"100%"}>
                    <Defs>
                      <Mask id="mask" height={"100%"} width={"100%"} x={0} y={0}>
                        <Rect height={"100%"} width={"100%"} fill={"#fff"} />

                        <Rect
                          x={"10%"}
                          y={"40%"}
                          width={setWidth(80)}
                          height={setHeight(20)}
                          fill={"black"}
                          strokeWidth={1.5}
                          stroke={"white"}
                        />
                      </Mask>
                    </Defs>
                    <Rect height={"100%"} width={"100%"} fill={"rgba(0,0,0,0.8)"} mask="url(#mask)" />
                    {/* <Rect x={"10%"} y={"40%"} width={setWidth(80)} height={setHeight(20)} strokeWidth={1.5} stroke={"white"} /> */}
                  </Svg>
                </View>
              </Camera>
            </View>
            <TouchableOpacity
              onPress={captureCamera}
              style={{
                width: 80,
                height: 80,
                borderRadius: 50,
                backgroundColor: "#F3F3F3",
                bottom: 50,
                borderColor: "#D32B09",
                position: "absolute",
                alignSelf: "center",
                borderWidth: 10,
              }}></TouchableOpacity>
          </>
        ) : (
          <Text>LOADING...</Text>
        )}
      </View>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  highlight: {
    fontWeight: "700",
  },
});

export default App;

const lottie: ViewStyle = {
  width: 100,
  height: 100,
};
