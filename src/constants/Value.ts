export const titleCaseString = (text: string) => {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())
    .join(" ");
};
