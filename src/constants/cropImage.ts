import RNPhotoManipulator from "react-native-photo-manipulator";
import { FRAMERATIO, WCrop, hCrop, setHeight, yPosition } from "./spacing";

export const cropImage = (image: string) => {
  const cropRegion = {
    x: 8,
    y: yPosition + FRAMERATIO.height,
    height: hCrop,
    width: WCrop - FRAMERATIO.width,
  };
  const targetSize = { height: setHeight(63), width: FRAMERATIO.width };

  const cropImage = RNPhotoManipulator.crop(image, cropRegion).then((path) => {
    //console.log(`results image path:,${path}`);
    return path;
  });
  return cropImage;
};
