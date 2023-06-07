const INVALID_ALPHANUMERIC = "Kindly input a valid alphanumeric.";
const INVALID_BANK_NAME = "Kindly input a bank account name.";
const INVALID_BANK_NUMBER = "Kindly input a bank account number.";
const INVALID_CHEQUE_NUMBER = "Kindly input a cheque number.";
const INVALID_CTA_NUMBER = "Kindly input a CTA number.";
const INVALID_NAME = "Kindly input a valid name.";
const INVALID_NUMBER = "Kindly input a valid number.";
const INVALID_POST_CODE = "Kindly input a valid post code.";
const INVALID_STRING = "Kindly input a valid text.";
const INVESTMENT_INVALID_AMOUNT = "The amount you have entered is invalid.";
const INVESTMENT_INVALID_EMAIL = "The email you have entered is invalid.";
const INVESTMENT_MAX_AMOUNT = "The amount you have entered exceeds the maximum amount.";
const INVESTMENT_MIN_AMOUNT = "The amount you have entered didn't reach the minimum amount.";
const LOGIN_INVALID_NRIC = "Your NRIC Number is invalid.";
const LOGIN_INVALID_OTP = "Invalid OTP. Please try again.";
const OCR_INVALID_NRIC = "Kindly upload a valid NRIC.";
const OCR_INVALID_NRIC_DATA = "We’re unable to capture the data from the image you uploaded.";
const PASSWORD_NOT_MATCH = "Those passwords didn't match. Try again.";
const CHECK_WRONG_PASSWORD = "Invalid password entered. Please try again.";
const SIMILAR_PASSWORD = "New password entered is the same as current password.";

export const ERROR_CODE = {
  lockedAccount: "EM001",
  otpAttempt: "EM002",
  invalidNric: "EM011",
  invalidNricData: "EM012",
  invalidNricFormat: "EM408",
  clientAgeMinimum: "EM600",
  clientAgeMaximum: "EM601",
  clientBannedCountry: "EM602",
  internal: "OMNI400",
  unauthenticated: "OMNI401",
  network: "OMNI402",
  storage: "OMNI403",
  submittedPdf: "EM448",
  currentPassword: "EM403",
  duplicateLogin: "EM011",
  nativeException: "R004",
  jsException: "R005",
};

export const ERROR = {
  INVALID_ALPHANUMERIC,
  INVALID_BANK_NAME,
  INVALID_BANK_NUMBER,
  INVALID_CHEQUE_NUMBER,
  INVALID_CTA_NUMBER,
  INVALID_NAME,
  INVALID_NUMBER,
  INVALID_POST_CODE,
  INVALID_STRING,
  INVESTMENT_INVALID_AMOUNT,
  INVESTMENT_INVALID_EMAIL,
  INVESTMENT_MAX_AMOUNT,
  INVESTMENT_MIN_AMOUNT,
  LOGIN_INVALID_NRIC,
  LOGIN_INVALID_OTP,
  OCR_INVALID_NRIC_DATA,
  OCR_INVALID_NRIC,
  PASSWORD_NOT_MATCH,
  CHECK_WRONG_PASSWORD,
  SIMILAR_PASSWORD,
};
