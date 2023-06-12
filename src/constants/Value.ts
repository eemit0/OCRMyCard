export const titleCaseString = (text: string) => {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())
    .join(" ");
};

const FRONT_IC = "FRONT_IC";
const BACK_IC = "BACK_IC";
const ORCSCANNER = "OCRSCANNER";

export const ProgressChecker = async (progressPage, filePath, valid, progressAchieve) => {
  if (progressPage != "") {
    switch (progressPage !== null) {
      case progressPage === FRONT_IC:
        if (valid) return { progressAchieve: progressAchieve * 1.5, valid: true };
        else return { progressAchieve: progressAchieve, valid: false };
      case progressPage === BACK_IC:
        if (valid) return { progressAchieve: progressAchieve * 2.5, valid: true };
        else return { progressAchieve: progressAchieve, valid: false };
      case progressPage === ORCSCANNER:
        if (valid) return { progressAchieve: progressAchieve * 3.5, valid: true };
        else return { progressAchieve: progressAchieve, valid: false };
    }
  }
  return { progressAchieve, valid };
};
