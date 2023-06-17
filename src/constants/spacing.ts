import { Dimensions } from "react-native";

export const { height, width } = Dimensions.get("screen");

const baseHeight = 844;
const baseWidth = 390;
export const setHeight = (h: number) => (height / baseHeight) * h;
export const setWidth = (w: number) => (width / baseWidth) * w;

//frame
export const FRAMERATIO = { width: Math.round(setWidth(342)), height: Math.round(setHeight(216)) };
console.log("WIDTH:", FRAMERATIO.width);
console.log("HEIGHT:", FRAMERATIO.height);

//height
export const h3 = setHeight(3);
export const h10 = setHeight(10);
export const h100 = setHeight(100);
export const h12 = setHeight(12);
export const h15 = setHeight(15);
export const h155 = setHeight(155);
export const h16 = setHeight(16);
export const h18 = setHeight(8);
export const h2 = setHeight(2);
export const h20 = setHeight(20);
export const h56 = setHeight(56);
export const h24 = setHeight(24);
export const h25 = setHeight(25);
export const h28 = setHeight(28);
export const h32 = setHeight(32);
export const h34 = setHeight(34);
export const h360 = setHeight(360);
export const h38 = setHeight(38);
export const h381 = setHeight(381);
export const h4 = setHeight(4);
export const h40 = setHeight(40);
export const h5 = setHeight(5);
export const h50 = setHeight(50);
export const h54 = setHeight(54);
export const h62 = setHeight(62);
export const h64 = setHeight(64);
export const h72 = setHeight(72);
export const h8 = setHeight(8);
export const h220 = setHeight(220);
export const h136 = setHeight(136);
export const h342 = setHeight(342);
export const h48 = setHeight(42);
export const h204 = setHeight(204);
export const h660 = setHeight(660);
export const minHeight = setHeight(baseHeight + h100);

//width

export const w24 = setWidth(24);
export const w50 = setWidth(50);
export const w79 = setWidth(79);
export const w90 = setWidth(90);
export const w100 = setWidth(100);
export const w80 = setWidth(80);
export const w82 = setWidth(82);
export const w64 = setWidth(64);
export const w342 = setWidth(342);
export const w163 = setWidth(163);
export const w2 = setWidth(2);
export const w60 = setWidth(60);
export const w5 = setWidth(5);
export const w48 = setWidth(48);
export const w397 = setWidth(397);
export const w8 = setWidth(8);
export const w28 = setWidth(28);
export const w10 = setWidth(10);
export const w16 = setWidth(16);
export const w12 = setWidth(12);
export const w226 = setWidth(226);
export const w246 = setWidth(246);
export const w14 = setWidth(14);
export const w390 = setWidth(390);
export const w42 = setWidth(42);

export const baseX = 355.5;
export const baseY = 979;
export const min = 350;
export const max = 357.75;
export const minY = 970.25;
export const maxY = 980.75;

export const hCrop = setHeight(1384);
export const WCrop = setWidth(2560);
export const yPosition = setHeight(1064);
