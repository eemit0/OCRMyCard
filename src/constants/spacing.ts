import { Dimensions } from "react-native";

export const { height, width } = Dimensions.get("screen");
export const setHeight = (h: number) => (height / 100) * h;
export const setWidth = (w: number) => (width / 100) * w;

//height
export const h24 = setHeight(24);
export const h32 = setHeight(32);
export const h64 = setHeight(64);
export const h2 = setHeight(2);
export const h3 = setHeight(3);
export const h4 = setHeight(4);

export const h5 = setHeight(5);
export const h16 = setHeight(16);
export const h50 = setHeight(50);
export const h100 = setHeight(100);
export const h8 = setHeight(8);
export const h10 = setHeight(10);
export const h12 = setHeight(12);

//width

export const w24 = setWidth(24);
export const w50 = setWidth(50);
export const w100 = setWidth(100);
export const w2 = setWidth(2);
export const w5 = setWidth(5);
export const w8 = setWidth(8);
export const w10 = setWidth(10);
export const w12 = setWidth(12);
