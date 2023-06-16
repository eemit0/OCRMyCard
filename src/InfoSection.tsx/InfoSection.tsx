import { Text, TextStyle, View } from "react-native";
import React, { Fragment } from "react";
import {
  ACCENTBLUE,
  ItemSeparator,
  POPPINS_BLACK,
  PRIMARY,
  ROSERED,
  h12,
  h136,
  h16,
  h20,
  h38,
  h4,
  w16,
  w163,
  w246,
  w342,
  w79,
} from "../constants";

interface IInfoSection {
  mykad: IOCRNricData;
  currentStep: string;
}
export const InfoSection = ({ mykad, currentStep }: IInfoSection) => {
  return (
    <Fragment>
      {mykad !== undefined && currentStep === "Front" ? (
        <>
          <View style={{ flexDirection: "row", width: "100%", alignSelf: "stretch", paddingBottom: h16 }}>
            <Text style={{ fontSize: 10, fontWeight: "400", lineHeight: h12, color: PRIMARY, alignItems: "center" }}>Personal Details</Text>
            <ItemSeparator width={w16} />
            <View
              style={{
                width: w246,
                backgroundColor: ACCENTBLUE,
                height: 1,
                bottom: h4,
                alignSelf: "flex-end",
              }}
            />
          </View>
          <View style={{ width: "100%" }}>
            <View style={{ width: w342, alignItems: "flex-start" }}>
              <Text style={{ ...smallHeader }}>Legal Full Name</Text>
              <ItemSeparator height={h4} />
              <Text style={{ ...contentText }} selectable selectionColor={ROSERED}>
                {mykad.name}
              </Text>
            </View>
            <ItemSeparator height={h16} />

            {/* render Row   */}
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ ...headerText }}>
                <Text style={{ ...smallHeader }}>Nationality</Text>
                <Text style={{ ...contentText }}>{mykad.country}</Text>
              </View>
              <View style={{ ...headerText }}>
                <Text style={{ ...smallHeader }}>Identity Card</Text>
                <Text style={{ ...contentText }}>{mykad.idNumber}</Text>
              </View>
            </View>
            <ItemSeparator height={h16} />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ ...headerText }}>
                <Text style={{ ...smallHeader }}>Date of Birth</Text>
                <Text style={{ ...contentText }}>{mykad.dateOfBirth}</Text>
              </View>
              <View style={{ ...headerText }}>
                <Text style={{ ...smallHeader }}>Place of Birth</Text>
                <Text style={{ ...contentText }}>{mykad.placeOfBirth}</Text>
              </View>
            </View>
            <ItemSeparator height={h16} />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ ...headerText }}>
                <Text style={{ ...smallHeader }}>Gender</Text>
                <Text style={{ ...contentText }}>{mykad.gender}</Text>
              </View>
              <View style={{ ...headerText }}>
                <Text style={{ ...smallHeader }}>City</Text>
                <Text style={{ ...contentText }}>{mykad.city}</Text>
              </View>
            </View>
            <ItemSeparator height={h16} />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ ...headerText }}>
                <Text style={{ ...smallHeader }}>postCode</Text>
                <Text style={{ ...contentText }}>{mykad.postCode}</Text>
              </View>
              <View style={{ ...headerText }}>
                <Text style={{ ...smallHeader }}>State</Text>
                <Text style={{ ...contentText }}>{mykad.state}</Text>
              </View>
            </View>
            <ItemSeparator height={h16} />
            <View style={{ alignItems: "flex-start" }}>
              <Text style={{ ...smallHeader }}>Address</Text>
              <ItemSeparator height={h4} />
              <Text style={{ ...contentText }}>{mykad.address}</Text>
            </View>
          </View>
        </>
      ) : (
        <ItemSeparator height={h136} />
      )}
    </Fragment>
  );
};

const contentText: TextStyle = {
  fontSize: 16,
  flexDirection: "row",
  display: "flex",
  fontFamily: POPPINS_BLACK,
  fontWeight: "600",
  width: "100%",
  // backgroundColor: ROSERED,
  lineHeight: h20,
};
const smallHeader: TextStyle = {
  color: ACCENTBLUE,
  fontFamily: POPPINS_BLACK,
  fontSize: 10,
  fontWeight: "400",
  width: w79,
};
const headerText: TextStyle = {
  alignItems: "flex-start",
  height: h38,
  fontFamily: POPPINS_BLACK,
  width: w163,
};
