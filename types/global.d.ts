declare type RootStackParamList = {
  CameraFrame: undefined;
  HomeScreen: undefined;
  SummaryScreen: { imageSource: string; cropImageSource: string; mykad: IOCRNricData };
  InfoScreen: { mykad: IOCRNricData; imageSource: string; currentStep: string };
};
declare type TFrame = import("react-native-vision-camera").Frame;

declare type RootNavigationProp = import("@react-navigation/native-stack").NativeStackNavigationProp<RootStackParamList>;

declare interface IOCRError {
  code: string;
  message: string;
}

declare interface IOCRNricData {
  address?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string;
  error?: IOCRError;
  gender?: string;
  idNumber?: string;
  name?: string;
  placeOfBirth?: string;
  postCode?: string;
  state?: string;
}

declare interface IProgressData {
  imgSource: string;
  name: string;
  progressAchieve: number;
  valid: boolean;
}

declare type TBoundingFrame = {
  boundingCenterX: number;
  boundingCenterY: number;
  height: number;
  width: number;
  x: number;
  y: number;
};
declare type Point = {
  x: number;
  y: number;
};
declare type TextElement = {
  cornerPoints: Point[];
  frame: TBoundingFrame;
  text: string;
};
declare type TextLine = {
  cornerPoints: Point[];
  elements: TextElement[];
  frame: TBoundingFrame;
  recognizedLanguages: string[];
  text: string;
};
declare interface ITextBlock {
  cornerPoints: Point[];
  frame: TBoundingFrame;
  lines: TextLine[];
  recognizedLanguages: string[];
  text: string;
}
declare interface IText {
  blocks: ITextBlock[];
  text: string;
}
declare interface TOCRFrame {
  result: IText;
}
