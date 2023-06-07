import React, { Children } from "react";
import { View } from "react-native";

interface ICornerMarkerProps {
  color: string;
  height: string | number;
  width: string | number;
  borderLength: string | number;
  thickness: number;
  borderRadius: number;
  children?: JSX.Element;
}

export const CornerMarker = ({
  color,
  height,
  width,
  borderLength,
  thickness,
  borderRadius,
  children,
}: ICornerMarkerProps): JSX.Element => {
  return (
    <View style={{ height: height, width: width, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          position: "absolute",
          height: borderLength,
          width: borderLength,
          top: 0,
          left: 0,
          borderColor: color,
          borderTopWidth: thickness,
          borderLeftWidth: thickness,
          borderTopLeftRadius: borderRadius,
        }}
      />
      <View
        style={{
          position: "absolute",
          height: borderLength,
          width: borderLength,
          top: 0,
          right: 0,
          borderColor: color,
          borderTopWidth: thickness,
          borderRightWidth: thickness,
          borderTopRightRadius: borderRadius,
        }}
      />
      <View
        style={{
          position: "absolute",
          height: borderLength,
          width: borderLength,
          bottom: 0,
          left: 0,
          borderColor: color,
          borderBottomWidth: thickness,
          borderLeftWidth: thickness,
          borderBottomLeftRadius: borderRadius,
        }}
      />
      <View
        style={{
          position: "absolute",
          height: borderLength,
          width: borderLength,
          bottom: 0,
          right: 0,
          borderColor: color,
          borderBottomWidth: thickness,
          borderRightWidth: thickness,
          borderBottomRightRadius: borderRadius,
        }}
      />
      {children}
    </View>
  );
};
