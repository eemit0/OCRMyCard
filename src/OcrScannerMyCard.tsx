import moment from "moment";
import { DICTIONARY_PLACE_OF_BIRTH, NRIC_DATE_FORMAT, titleCaseString } from "./constants";
import { ERROR, ERROR_CODE } from "./constants/error";

export const processMykadFront = async (frame: TOCRFrame) => {
  let rightBounds = 0;
  let leftBounds = 0;
  let blocks = frame.result.blocks;

  if (blocks.length > 0 && frame.result.text.toLowerCase().includes("mykad")) {
    blocks.forEach((block) => {
      console.log(block.text);
      rightBounds = block.frame.width > rightBounds ? block.frame.width : rightBounds;
      //console.log("rightBounds", rightBounds);
      const compareBounds = block.frame.x < leftBounds ? block.frame.x : leftBounds;
      leftBounds = leftBounds === 0 ? block[0] : compareBounds;
    });
    const cleanBlocks = blocks.map((block) => {
      if (block.frame.x < leftBounds + 100) {
        return block;
      }
      if (block[2] < rightBounds / 2) {
        return block;
      }
      return undefined;
    });
    console.log("ITS NRIC");
    console.log("clean blocks", cleanBlocks);

    return { blocks: cleanBlocks.filter((block) => block !== undefined), text: frame.result.text };
  }
  return { error: { code: ERROR_CODE.invalidNric, message: ERROR.OCR_INVALID_NRIC } };
};

const mykadBack = async (frame: TOCRFrame) => {
  if (frame.result.blocks.length > 0 && frame.result.text.toLowerCase().includes("pendaftaran negara")) {
    return {};
  }

  return { error: { code: ERROR_CODE.invalidNric, message: ERROR.OCR_INVALID_NRIC } };
};

const mykadFront = async (processed: TOCRFrame) => {
  const mykad: IOCRNricData = {
    idNumber: "",
    name: "",
    dateOfBirth: new Date(),
    address: "",
    placeOfBirth: "",
    postCode: "",
    city: "",
    state: "",
    gender: "",
    country: "Malaysia",
  };
  let idNumberIndex = -1;
  const mykadBlocks = await processMykadFront(processed);
  if (mykadBlocks) {
    console.log("blocks", mykadBlocks);
    if ("error" in mykadBlocks && mykadBlocks.error !== undefined) {
      console.log("pls place in a better condition for scanning");
      return mykadBlocks;
    }
  }
  mykad.gender = mykadBlocks.text.toLowerCase().includes("lelaki") ? "Male" : "Female";
  mykadBlocks.blocks.forEach((block, blockIndex) => {
    const { text } = block!;
    if (text.match("^([0-9]){6}-([0-9]){2}-([0-9]){4}$")) {
      mykad.idNumber = text;
      idNumberIndex = blockIndex;
      const capturedDate = moment(text.substring(0, 6), NRIC_DATE_FORMAT);
      const placeOfBirth = DICTIONARY_PLACE_OF_BIRTH.filter((code) => code.code === text.substring(7, 2));
      mykad.placeOfBirth = placeOfBirth[0].location;
      mykad.dateOfBirth = moment(capturedDate).isAfter() ? capturedDate.subtract(100, "years").toDate() : capturedDate.toDate();
    } else if (text.match("[0-9]{5}")) {
      const postCodeBlock = text.match("[0-9]{5} ");
      if (postCodeBlock !== null) {
        let postCodeIndex = -1;
        const split = text.split("\n");
        const postCodeCity = split.filter((value, index) => {
          postCodeIndex = index;
          return value.match("^[0-9]{4,5}");
        });
        const [postCode] = postCodeCity[0].split(" ");
        const [state] = split.slice(-1);
        mykad.postCode = postCode;
        mykad.city = titleCaseString(postCodeCity[0].split(" ").slice(1).join(" "));
        mykad.address = split.slice(0, postCodeIndex - 1).join(" ");
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
  });

  if (idNumberIndex > -1) {
    mykad.name = mykadBlocks?.blocks[idNumberIndex + 1]?.text!.split("\n").join(" ");
  }
  if (mykad.address === "" || mykad.postCode === "" || mykad.city === "" || mykad.state === "") {
    return { error: { code: ERROR_CODE.invalidNricData, message: ERROR.OCR_INVALID_NRIC_DATA } };
  }
  console.log("mykad ---->", mykad);
  return mykad;
};

export const OCRUtils = { mykadFront, mykadBack };

// const NRICcardFront = async (frame: TOCRFrame) => {
//   let blocks = frame.result.blocks;
//   console.log("lenngth", blocks.length);
//   // console.log("frame", frame);
//   if (blocks === undefined) {
//     setIsScannedValid(false);
//     return { error: { code: ERROR_CODE.invalidNric, message: ERROR.OCR_INVALID_NRIC }, validFront: false };
//   }

//   if (blocks.length <= 10 && blocks.length >= 5 && frame.result.text.toLowerCase().includes("mykad")) {
//     console.log(" mykad valid");

//     // Validation of NRIC
//     blocks.forEach((block, blockIndex) => {
//       block.lines.forEach((textLine, lineIndex) => {
//         textLine.elements.forEach((element, elementIndex) => {
//           // no ic
//           if (element.text.match("^([0-9]){6}-([0-9]){2}-([0-9]){4}$")) {
//             setIsScannedValid(true);
//             mykad.idNumber = element.text;
//             const nricDate = moment(element.text.substring(0, 6), NRIC_DATE_FORMAT);
//             const capturedDate = nricDate.isAfter()
//               ? nricDate.subtract(100, "years").format("DD-MM-YYYY")
//               : nricDate.format("DD-MM-YYYY");
//             const placeOfBirth = DICTIONARY_PLACE_OF_BIRTH.find((code) => code.code === element.text.substring(7, 9));
//             mykad.placeOfBirth = placeOfBirth?.location;
//             mykad.dateOfBirth = capturedDate;
//             console.log("next blocks", blocks[blockIndex + 1].text);
//             mykad.name = blocks[blockIndex + 1].text;
//             // next block should be name
//           } else if (element.text.match("[0-9]{5}")) {
//             mykad.postCode = element.text;
//             if (mykad.postCode !== null) {
//               let postCodeIndex = -1;
//               const split = block.text.split("\n");
//               const postCodeCity = split.filter((value, index) => {
//                 postCodeIndex = index;
//                 return value.match("^[0-9]{4,5}");
//               });
//               const [postCode] = postCodeCity[0].split(" ");
//               const [state] = split.slice(-1);
//               mykad.postCode = postCode;
//               mykad.city = titleCaseString(postCodeCity[0].split(" ").slice(1).join(" "));
//               mykad.address = split.slice(0, postCodeIndex - 1).join(" ");
//               if (state.toLowerCase().includes("kl")) {
//                 mykad.state = "Wilayah Persekutuan";
//               } else if (state.toLowerCase().includes("putra")) {
//                 mykad.state = "Wilayah Persekutuan Putrajaya";
//               } else if (state.toLowerCase().includes("labuan")) {
//                 mykad.state = "Wilayah Persekutuan Labuan";
//               } else {
//                 mykad.state = titleCaseString(state);
//               }
//             }
//             console.log("address", block.text);
//             mykad.address = block.text;
//             //  mykad.city = element.text.substring(0, 6);
//             mykad.state = block.lines[lineIndex + 1].text;
//           } else if (element.text.toLowerCase() === "lelaki") {
//             mykad.gender = "Male";
//           } else if (element.text.toLowerCase() === "perempuan") {
//             mykad.gender = "Female";
//           }

//           // setIsScannedValid(true);
//           // return { mykad: mykad, validFront: true };

//           //    return { error: { code: ERROR_CODE.invalidNricData, message: ERROR.OCR_INVALID_NRIC_DATA }, validFront: false };
//         });
//       });
//     });
//     console.log("nric valid");
//     setNRICCard(mykad);
//     setIsScannedValid(true);
//     return { mykad: mykad, validFront: true };
//   } else {
//     console.log("not a valid nric");
//     setIsScannedValid(false);
//     return { error: { code: ERROR_CODE.invalidNric, message: ERROR.OCR_INVALID_NRIC }, validFront: false };
//   }
// };
