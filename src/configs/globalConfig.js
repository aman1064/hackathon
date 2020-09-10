import { codeBase } from "../constants/config";

const globalConfig = {
  uploaderConstant: {
    maxSize: 5, // MB
    extensions: ["doc", "docx", "pdf"],
    errMsg: {
      default: "Something went wrong. Please try again.",
      invalidExt:
        "File extension not supported. Supported file extensions: .docx, .doc, .pdf",
      sizeLimit: "CV uploaded exceeds maximum file size limit (5 MB)."
    }
  },
  fileUrls: {
    save: "/jobseeker/v2/profile/{profileId}/cv",
    cloud: "/jobseeker/v2/profile/{profileId}/drive/cv",
    delete: "/jobseeker/v2/profile/{profileId}/cv/delete",
    insta_save: "/account/anonymous/upload/cv",
    insta_cloud: "/account/anonymous/drive/upload/cv",
    insta_delete: "/account/anonymous/upload/cv/delete"
  },
  REGEX_FORM_VALIDATION_FROM_CONFIG: "^_{2}",
  FORM_ERRORS: {
    name: "No numeric",
    email: "Incorrect e-mail address format",
    mobileNumber: "Please enter 10 digit mobile number",
    phoneNumber: "Please enter 10 digit mobile number",
    password:
      "Password should be alphanumeric and must be at least 6 character in length",
    yearOfPassing: `You can enter graduation year only upto ${new Date().getFullYear() +
      5}`
  },
  validateFn: {
    __VALIDATE_MONTH: value => {
      if (value > 11) {
        return "Month should be < 12";
      }
      return "";
    },
    __VALIDATE_GRAD_YEAR: value => {
      const currYear = new Date().getFullYear();
      if (value > 1950 && value < currYear + 6) {
        return false;
      }
      return true;
    }
  },
  fallbackImageSrc:
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  mandatoryValueMissing: "Mandatory value is missing"
};

export const blankImg =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export const appRedirectUrl = "https://bigsh.page.link/R6GT";

export const appRedirectUrlFromAPI = `${codeBase}/jsapi/communication/apps/redirect`;

export default globalConfig;
