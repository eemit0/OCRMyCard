import moment from "moment";
import { DICTIONARY_PLACE_OF_BIRTH, NRIC_DATE_FORMAT } from "../date";
import { titleCaseString } from "../Value";

export const OCRFrontCard = async (mykad: IOCRNricData, blocks: ITextBlock[], validatedInfo: boolean) => {
  blocks.forEach((block) => {
    console.log("running scanning -->", block.text);
    // console.log("calculating range of no myKad x", hasMyKad[0].frame.x);
    // console.log("calculating range of no myKad y", hasMyKad[0].frame.y);
    // console.log("calculating range of no Ic x", findMyIC[0].frame.x);

    block.lines.forEach((textLine) => {
      textLine.elements.forEach((element) => {
        const elementText = element.text;
        if (elementText.match("^([0-9]){6}-([0-9]){2}-([0-9]){4}$")) {
          mykad.idNumber = elementText;
          const nricDate = moment(elementText.substring(0, 6), NRIC_DATE_FORMAT);
          const capturedDate = nricDate.isAfter() ? nricDate.subtract(100, "years").format("DD-MM-YYYY") : nricDate.format("DD-MM-YYYY");
          const placeOfBirth = DICTIONARY_PLACE_OF_BIRTH.find((code) => code.code === elementText.substring(7, 9));
          mykad.placeOfBirth = placeOfBirth?.location;
          mykad.dateOfBirth = capturedDate;

          const blockName: string =
            blocks[blocks.indexOf(block) + 1].text.length >= 1
              ? blocks[blocks.indexOf(block) + 1].text
              : blocks[blocks.indexOf(block)].text;
          let name = blockName.replace(/\n/g, " ");
          if (
            name.toLowerCase() !== "warganegara islam" &&
            name.toLowerCase() !== "islam" &&
            !name.toLowerCase().includes("myKad") &&
            !name.toLowerCase().includes("warganegara")
          ) {
            console.log(name);
            mykad.name = name.replace(/\n/g, " ");
          }
        } else if (elementText.match("[0-9]{5}")) {
          mykad.postCode = elementText;
          if (block.text) {
            const split = block.text.split("\n");
            const postCodeCity = split.filter((value) => {
              return value.match("^[0-9]{4,5}");
            });
            if (postCodeCity.length > 0) {
              const [postcode] = postCodeCity[0].split(" ");
              const [state] = split.slice(-1);
              mykad.postCode = postcode;
              mykad.city = titleCaseString(postCodeCity[0].split(" ").slice(1).join(" "));
              mykad.address = block.text.replace(/\n/g, " ");
              if (state.toLowerCase().includes("kl")) {
                mykad.state = "Wilayah Persekutuan";
              } else if (state.toLowerCase().includes("putra")) {
                mykad.state = "Wilayah Persekutuan Putrajaya";
              } else if (state.toLowerCase().includes("labuan")) {
                mykad.state = "Wilayah Persekutuan Labuan";
              } else {
                mykad.state = titleCaseString(state);
              }
            }
          }
        } else if (elementText.toLowerCase() === "lelaki") {
          mykad.gender = "Male";
        } else if (elementText.toLowerCase() === "perempuan") {
          mykad.gender = "Female";
        }
      });
    });
    console.log(mykad);
    console.log("PERFECT FRAME!");
    validatedInfo = true;
  });
  return { mykad: mykad, scannedIC: validatedInfo };
};
