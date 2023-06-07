import { View } from "react-native";
import React from "react";

export const ItemSeparator = ({ height, width }) => {
  return <View style={{ width, height }} />;
};
ItemSeparator.defaultProps = {
  height: 0,
  width: 0,
};
