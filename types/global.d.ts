declare type VisionRectangle = [number, number, number, number];
declare type VisionPoint = [number, number];

declare interface VisionTextBase {
  text: string;
  confidence: null | number;
  recognizedLanguages: string[];
  boundingBox: VisionRectangle;
  cornerPoints: VisionPoint[];
}

declare type VisionTextElement = VisionTextBase;

declare interface VisionTextLine extends VisionTextBase {
  elements: VisionTextElement[];
}

declare interface TextBlock extends VisionTextBase {
  lines: VisionTextLine[];
}

declare interface VisionText {
  text: string;
  blocks: TextBlock[];
}
