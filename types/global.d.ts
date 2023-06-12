declare type RootStackParamList = {
  HomeScreen: { currentStep: string };
  CameraFrame: undefined;
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
  x: number;
  y: number;
  width: number;
  height: number;
  boundingCenterX: number;
  boundingCenterY: number;
};
declare type Point = {
  x: number;
  y: number;
};
declare type TextElement = {
  text: string;
  frame: TBoundingFrame;
  cornerPoints: Point[];
};
declare type TextLine = {
  text: string;
  elements: TextElement[];
  frame: TBoundingFrame;
  recognizedLanguages: string[];
  cornerPoints: Point[];
};
declare interface ITextBlock {
  text: string;
  lines: TextLine[];
  frame: TBoundingFrame;
  recognizedLanguages: string[];
  cornerPoints: Point[];
}
declare interface IText {
  text: string;
  blocks: ITextBlock[];
}
declare interface TOCRFrame {
  result: IText;
}
