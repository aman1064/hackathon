import DropdownWithReduxForm from "../components/templates/Dropdown/DropdownWithReduxForm";
import ClosedInputField from "../components/templates/ClosedInputField";
import {
  fieldRequiredErrorWithHighlight,
  normalizeField
} from "../components/templates/Form/Validate";
import Urlconfig from "../constants/Urlconfig";
import regexConfig from "../constants/regexConfig";
import SingleSuggester from "../components/templates/SingleSuggester/SingleSuggester";

const commonConfig = {
  data: [],
  customClass: "marginBottom_11",
  showAll: false,
  validate: fieldRequiredErrorWithHighlight,
  type: "component",
  component: ClosedInputField,
  _normalize: normalizeField(regexConfig.suggester, "50")
};

const config = props => {
  return {
    name: "quickApplyProfileEdit",
    container: {
      className: "quickApplyProfileEdit_form"
    },
    button: {
      id: "updateDetails",
      name: "updateDetails",
      submitButtonText: "UPDATE DETAILS",
      isTextButton: true,
      customClass: "",
      className: "submit_button",
      variant: "outlined",
      color: "primary",
      type: "submit"
    },
    formFields: [
      {
        id: "personalDetailsLabel",
        name: "personalDetailsLabel",
        type: "heading",
        label: "Personal details",
        el: "h2",
        className: "marginBottom_20 personalDetailsPseudoCard"
      },
      {
        id: "name",
        name: "name",
        type: "text",
        label: "Full Name",
        placeholder: "Full Name",
        className: "input_field",
        customClass: "marginBottom_28",
        validate: fieldRequiredErrorWithHighlight
      },
      {
        id: "specialization",
        name: "specialization",
        type: "component",
        component: DropdownWithReduxForm,
        title: "Select job role",
        dataUrl: Urlconfig.getspecializationData,
        customClass: "marginBottom_62 input_field",
        jobRoleData: props.jobRoleData,
        validate: fieldRequiredErrorWithHighlight
      },
      {
        id: "workExperienceLabel",
        name: "workExperienceLabel",
        type: "heading",
        label: "Work experience",
        el: "h2",
        className: "marginBottom_20 workExperiencePseudoCard"
      },
      {
        id: "jobTitle",
        name: "jobTitle",
        ...commonConfig,
        component: SingleSuggester,
        dataUrl: Urlconfig.getJobTitles,
        placeholder: "Designation/Title"
      },
      {
        id: "company",
        name: "company",
        ...commonConfig,
        dataUrl: Urlconfig.getCompanies,
        placeholder: "Company Name",
        modalTitle: `Select Company`,
        modalPlaceholder: `Search company`,
        fieldLabel: "Company"
      },
      {
        id: "location",
        name: "location",
        ...commonConfig,
        dataUrl: Urlconfig.getLocation,
        customClass: "marginBottom_52",
        placeholder: "Job Location",
        modalTitle: `Select Location`,
        modalPlaceholder: `Search location`,
        fieldLabel: "Location"
      }
    ]
  };
};

export default config;
