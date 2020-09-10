import ChipGroup from "../components/molecules/ChipGroup";
import QACVUpload from "../components/pages/QuickApply/component/QACVUpload";
import {
  onlyNumbers,
  decimalNumbers,
  normalizeMonths,
  normalizeYears,
  fieldRequiredErrorWithHighlight,
  quickApplyExperienceFieldError,
  fieldRequiredError,
  normalizeField
} from "../components/templates/Form/Validate";
import Urlconfig from "../constants/Urlconfig";
import getSessionStorage from "./getSessionStorage";
import regexConfig from "../constants/regexConfig";
import ClosedInputField from "../components/templates/ClosedInputField";
import ChipsWithSuggestorModal from "../components/organisms/ChipsWithSuggestorModal";

import Skills from "../components/pages/Registration/components/Page3/Skills";

const config = props => {
  const { tempProfile, skillsChipListData } = props;

  const isQuickApply = getSessionStorage("isQuickApply");
  return {
    name: "quickRegistration",
    container: {
      className: "quickRegistration"
    },
    button: {
      id: "quickApplySubmitButton",
      name: "quickApplySubmitButton",
      submitButtonText: isQuickApply ? "SAVE & APPLY" : "VIEW JOBS",
      isTextButton: true,
      className: "submit_button",
      variant: "outlined",
      color: "primary",
      type: "submit"
    },
    formFields: [
      {
        id: "expSubLabel",
        name: "expSubLabel",
        type: "helpText",
        label: "Total work experience"
      },
      {
        id: "experience",
        name: "experience",
        type: "textGroup",
        wrapperClass: "experienceFieldsWrapper",
        childFields: [
          {
            id: "experienceYear",
            name: "experienceYear",
            InputLabelProps: {
              shrink: true,
              className: "static-InputLabel fontSize_13"
            },
            customClass: "marginBottom_20 width_70",
            isoptional: "false",
            label: "Year(s)",
            placeholder: "0",
            normalize: normalizeYears("2"),
            validate: quickApplyExperienceFieldError
          },
          {
            id: "experienceMonth",
            name: "experienceMonth",
            InputLabelProps: {
              shrink: true,
              className: "static-InputLabel fontSize_13"
            },
            customClass: "marginBottom_20 width_85",
            isoptional: "false",
            label: "Month(s)",
            placeholder: "0",
            normalize: normalizeMonths("2"),
            validate: quickApplyExperienceFieldError
          }
        ]
      },
      {
        id: "ctc",
        name: "ctc",
        type: "tel",
        label: "Annual CTC (in lacs)",
        className: "input_field",
        normalize: decimalNumbers("10"),
        validate: fieldRequiredError
      },
      {
        id: "isCTCConfidential",
        name: "isCTCConfidential",
        type: "checkbox",
        fieldType: "checkbox",
        label: "Hide CTC from recruiters",
        jsonKey: "isCTCConfidential",
        labelClass: "color_blue_grey"
      },
      {
        id: "noticePeriodSubLabel",
        name: "noticePeriodSubLabel",
        type: "helpText",
        label: "Notice Period",
        className: "semibold marginTop_20"
      },
      {
        id: "noticePeriodData",
        name: "noticePeriodData",
        type: "component",
        component: ChipGroup,
        chipListUrl: Urlconfig.getNoticePeriodData,
        isMultiSelect: false,
        isEditable: false,
        chipGroupClass: "marginBottom_40",
        validate: fieldRequiredErrorWithHighlight
      },
      {
        id: "educationLabel",
        name: "educationLabel",
        type: "heading",
        label: "Education",
        el: "h2",
        className: "marginBottom_20"
      },
      {
        id: "courseLabel",
        type: "helpText",
        label: "Course",
        name: "courseSubLabel",
        className: "semibold marginTop_20"
      },
      {
        id: "course",
        name: "course",
        type: "component",
        component: ChipsWithSuggestorModal,
        _normalize: normalizeField(regexConfig.suggester, "50"),
        chipListUrl: Urlconfig.getCourse,
        placeholder: "Course",
        validate: fieldRequiredErrorWithHighlight,
        threshold: 5,
        renderOtherOption: true,
        modalTitle: `Select Course`,
        modalPlaceholder: `Search course`,
        fieldLabel: "Course",
        wrapperClass: "qaSuggestorChipsWrapper"
      },
      {
        id: "college",
        name: "college",
        type: "component",
        component: ClosedInputField,
        _normalize: normalizeField(regexConfig.collegeSuggester, "100"),
        dataUrl: Urlconfig.getCollegeWithCourseId,
        customClass: "marginBottom_11",
        placeholder: "Institute/College",
        showAll: false,
        validate: fieldRequiredErrorWithHighlight,
        modalTitle: `Select College`,
        modalPlaceholder: `Search college`,
        fieldLabel: "College"
      },
      {
        id: "courseDepartment",
        name: "courseDepartment",
        type: "component",
        component: ClosedInputField,
        _normalize: normalizeField(regexConfig.suggester, "50"),
        dataUrl: Urlconfig.getCourseDepartment,
        customClass: "marginBottom_11",
        placeholder: "Specialization",
        showAll: false,
        validate: fieldRequiredErrorWithHighlight,
        modalTitle: `Select Specialization`,
        modalPlaceholder: `Search specialization`,
        fieldLabel: "Specialization"
      },
      {
        id: "yearOfPassing",
        name: "yearOfPassing",
        type: "tel",
        label: "Graduation Year",
        className: "input_field",
        normalize: onlyNumbers("4"),
        validate: fieldRequiredError,
        regexstr: "__VALIDATE_GRAD_YEAR"
      },
      {
        id: "cvLabel",
        name: "cvLabel",
        type: "heading",
        label: "Uploaded CV",
        className: "fontSize_13 semibold marginBottom_11 marginTop_36"
      },
      {
        id: "cvUpload",
        name: "cvUpload",
        type: "component",
        component: QACVUpload,
        fileName: tempProfile.fileName,
        cvPath: tempProfile.cvPath,
        props
      },
      {
        id: "skillLabel",
        name: "skillLabel",
        type: "heading",
        label: "Key skills",
        className: "fontSize_13 semibold marginBottom_4"
      },
      {
        id: "skillSubLabel",
        name: "skillSubLabel",
        type: "helpText",
        label: "Select minimum 1 and upto 5 top skills"
      },
      {
        id: "skills",
        name: "skills",
        type: "component",
        component: Skills,
        data: skillsChipListData,
        hideLoadingChip: true,
        validate: fieldRequiredErrorWithHighlight
      },
      {
        id: "isWorkingInManagementRole",
        name: "isWorkingInManagementRole",
        type: "checkbox",
        fieldType: "checkbox",
        label: "Working in a people management role",
        checkboxClass: "QASubLabel"
      },
      {
        id: "profileTrackLabel",
        name: "profileTrackLabel",
        type: "heading",
        label: "Set up profile to track application",
        className: "fontSize_13 semibold marginBottom_16 marginTop_30"
      },
      {
        id: "email",
        name: "email",
        type: "email",
        label: "E-mail id",
        className: "input_field",
        customClass: "marginBottom_11 color_disabled",
        validate: fieldRequiredErrorWithHighlight,
        disabled: true,
        regexstr: regexConfig.email
      },
      {
        id: "mobileNumber",
        name: "mobileNumber",
        type: "tel",
        label: "Mobile number",
        className: "input_field",
        customClass: "marginBottom_16",
        normalize: onlyNumbers("10"),
        validate: fieldRequiredErrorWithHighlight,
        regexstr: regexConfig.mobileNumber
      }
    ]
  };
};
export default config;
