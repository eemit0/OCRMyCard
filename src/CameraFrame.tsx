import React from "react";
import Svg, { Defs, Mask, Rect } from "react-native-svg";

export const CameraFrame: React.FunctionComponent = () => {
  return (
    <Svg height={"100%"} width={"100%"}>
      <Defs>
        <Mask id="0" height={"100%"} width={"100%"} x={0} y={0}>
          <Rect height={"100%"} width={"100%"} fill={"#fff"} />
          <Rect x={"18%"} y={"30%"} width={250} height={250} fill={"black"} />
        </Mask>
      </Defs>
      <Rect height={"100%"} width={"100%"} mask="url(#mask)" />
      <Rect x={"18%"} y={"30%"} width={250} height={250} strokeWidth={5} stroke={"white"} />
    </Svg>
  );
};
