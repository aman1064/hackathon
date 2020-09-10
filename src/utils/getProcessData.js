/* eslint-disable array-callback-return */
/* eslint-disable default-case */
import Loadable from "react-loadable";
import {
  fieldRequiredError,
  onlyNumbers,
  decimalNumbers,
  onlyChar,
  normalizeMobileNumber,
  normalizeSingleSuggester,
  normalizeField
} from "../components/templates/Form/Validate";
import { isStrContainsKey, getFormFieldNameFromConfig } from "../utils/pureFns";
import regexConfig from "../constants/regexConfig";
import Loading from "../components/atoms/Loading";
import Skills from "../components/pages/Registration/components/Page3/Skills";

const ChipGroup = Loadable ({
  loader: () =>
  import(/* webpackChunkName: "chipgroup" */ "../components/molecules/ChipGroup"),
loading: Loading
});

const RadioGroup = Loadable({
  loader: () =>
  import(/* webpackChunkName: "radiogroup" */ "../components/molecules/RadioGroup"),
loading: Loading
})

const SingleSuggester = Loadable({
  loader: () =>
  import(/* webpackChunkName: "single-suggestor-view" */ "../components/templates/SingleSuggester/SingleSuggester"),
loading: Loading
});

const CVUpload = Loadable({
  loader: () =>
    import(/* webpackChunkName: "cvupload-view" */ "../components/pages/Registration/components/CVUpload/CVUpload"),
  loading: Loading
});

const Preferences = Loadable({
  loader: () =>
    import(/* webpackChunkName: "wishlist-view" */ "../components/pages/Registration/components/Preferences"),
  loading: Loading
});

// const Skills = Loadable({
//   loader: () =>
//     import(/* webpackChunkName: "skills-view" */ "../components/pages/Registration/components/Page3/Skills"),
//   loading: Loading
// });

const JobSearchStatus =  Loadable({
  loader: () =>
    import(/* webpackChunkName: "profile-privacy-view" */ "../components/pages/Registration/components/JobSearchStatus/JobSearchStatus"),
  loading: Loading
});

const DomainAndExp = Loadable({
  loader: () =>
  import(/* webpackChunkName: "domain-exp-view" */ "../components/pages/Registration/components/DomainAndExp"),
loading: Loading
});

const ChipsWithSuggestorModal = Loadable({
  loader: () =>
  import(/* webpackChunkName: "chip-with-suggestor-modal-view" */ "../components/organisms/ChipsWithSuggestorModal"),
loading: Loading
});

const ClosedInputField = Loadable({
  loader: () =>
  import(/* webpackChunkName: "closed-input-field-view" */ "../components/templates/ClosedInputField"),
loading: Loading
});

const customTypeMap = {
  formEmailInput: "email",
  formNameInput: "text",
  formMobileInput: "tel",
  formNumberInput: "tel",
  formPasswordInput: "password",
  label: "heading",
  subLabel: "helpText",
  checkbox: "checkbox",
  floatInput: "tel",
  float_text: "tel",
  chipGroup: "component",
  singleSelection: "component",
  multiSelectChipGroup: "component",
  dropDownSelector: "component",
  radioItem: "radioItem",
  selectionMulti: "component",
  link: "textLink",
  closedInputSelector: "component",
  singleSelectionWithSuggestor: "component"
};

const addValidateKey = output => {
  output.validate = fieldRequiredError;
};
// prepare child to parent dependency mapping
const getDependentConfig = data => {
  const dependentConfig = {};
  data.components &&
    data.components.map(({ id, dependents }) => {
      dependents.map(dependentId => {
        dependentConfig[dependentId] = id;
      });
    });
  return dependentConfig;
};

const getDependentFieldName = (data, dependentComponentId) => {
  const dependentComponent = data.components.find(
    item => item.id === dependentComponentId
  );
  const dependentField = dependentComponent.data.filter(
    ({ jsonKey }) => jsonKey !== null
  );
  const dependentFieldName =
    dependentField.length && getFormFieldNameFromConfig(dependentField[0]);
  return dependentFieldName;
};

const createConfigForInput = field => {
  const output = {
    className: "input_field",
    customClass: "marginBottom_32",
    regexstr: field.additionalProperties.validationJs,
    form: field.formName
  };
  if (field.type === "formNameInput") {
    output.normalize = onlyChar("50");
  } else if (field.type === "formMobileInput") {
    output.normalize = normalizeMobileNumber("15");
  } else if (field.type === "password") {
    output.showPassword = false;
  }
  if (field.value === "Graduation Year") {
    output.normalize = onlyNumbers("4");
    output.regexstr = "__VALIDATE_GRAD_YEAR";
  }
  if (!field.additionalProperties.isOptional) {
    addValidateKey(output);
  }
  return output;
};

const createConfigForChipgroup = field => {
  const output = {
    component: ChipGroup,
    chipGroupClass: field.additionalProperties.chipGroupClass,
    childClass: field.additionalProperties.childClass,
    wrapperClass: "marginBottom_40",
    hideUnselected: field.additionalProperties.hideUnselected,
    form: field.formName,
    chipList:
      field.value && JSON.parse(field.value).length
        ? JSON.parse(field.value)
        : [],
    chipListUrl: field.additionalProperties.dataUrl,
    isMultiSelect: field.type === "multiSelectChipGroup" ? true : false,
    isEditable: field.additionalProperties.isEditable
      ? !JSON.parse(field.additionalProperties.isEditable)
      : false
  };
  if (!field.additionalProperties.isOptional) {
    addValidateKey(output);
  }
  return output;
};

const createConfigForChipWithSuggestorModal = field => {
  return Object.assign({}, createConfigForChipgroup(field), {
    component: ChipsWithSuggestorModal,
    form: field.formName,
    wrapperClass: "marginBottom_20",
    modalTitle: `Select ${field.additionalProperties.hint}`,
    modalPlaceholder: `Search ${field.additionalProperties.hint.toLowerCase()}`,
    chipListUrl: field.additionalProperties.dataUrl.replace("{input}", ""),
    threshold: field.additionalProperties.threshold,
    _normalize: normalizeField(regexConfig.suggester, 50),
    renderOtherOption: field.additionalProperties.renderOtherOption,
    fieldLabel: field.additionalProperties.fieldName,
    buttonSuffix: field.additionalProperties.fieldName
  });
};

const createConfigForDropDownSelector = field => {
  const output = {
    component: SingleSuggester,
    form: field.formName,
    data: [],
    dataUrl: field.additionalProperties.dataUrl,
    customClass: "marginBottom_20",
    placeholder: field.additionalProperties.hint,
    threshold: field.additionalProperties.threshold,
    normalize: normalizeSingleSuggester(...getNormalizeParams(field)),
    showAll: field.additionalProperties.showAll
      ? JSON.parse(field.additionalProperties.showAll)
      : false,
    separateOptionsThreshold:
      field.additionalProperties.separateOptionsThreshold,
    separateOptionsLabel: field.additionalProperties.separateOptionsLabel
  };
  if (!field.additionalProperties.isOptional) {
    addValidateKey(output);
  }
  return output;
};

const getNormalizeParams = field => {
  let jsonKey;
  if (field.jsonKey === "college") {
    jsonKey = regexConfig.collegeSuggester;
  } else if (field.jsonKey === "company" || field.jsonKey === "jobTitle") {
    jsonKey = regexConfig.suggesterWithApos;
  } else {
    jsonKey = regexConfig.suggester;
  }
  return [jsonKey, field.jsonKey === "college" ? "100" : "50"];
};

const createConfigForClosedInputSelector = (field, suggestorsData) => {
  return Object.assign({}, createConfigForDropDownSelector(field), {
    component: ClosedInputField,
    _normalize: normalizeField(...getNormalizeParams(field)),
    fieldLabel: field.additionalProperties.fieldName,
    data: suggestorsData[field.jsonKey] || []
  });
};

const createConfigForSelectionMulti = field => {
  const output = {
    component: Skills,
    form: field.formName,
    formDesc: field.formDesc,
    data: [],
    dataUrl: field.additionalProperties.dataUrl,
    customClass: "marginBottom_20",
    placeholder: field.additionalProperties.hint,
    showAll: field.additionalProperties.showAll
      ? JSON.parse(field.additionalProperties.showAll)
      : false
  };
  if (!field.additionalProperties.isOptional) {
    addValidateKey(output);
  }
  return output;
};
const createConfigForCta = field => {
  const output = {
    name: field.id,
    submitButtonText: field.value,
    customClass: "textCenter fixedToBottom",
    className: `submit_button ${field.additionalProperties.className}`,
    variant: "outlined",
    color: field.additionalProperties.variant
      ? field.additionalProperties.variant
      : "primary",
    type: "submit"
  };
  return output;
};

const createConfigForCheckbox = field => {
  return {
    color: "primary",
    labelClass: "color_blue_grey",
    customClass: `${field.additionalProperties.className}`,
    jsonKey: field.jsonKey,
    form: field.formName,
    formDesc:field.formDesc,
    fieldType: "checkbox",
    validate: () => false
  };
};

const createConfigForFloatInput = field => {
  const output = {
    placeholder: field.additionalProperties.hint,
    className: "input_field",
    customClass: "",
    normalize: decimalNumbers("10"),
    form: field.formName
  };
  if (!field.additionalProperties.isOptional) {
    addValidateKey(output);
  }
  return output;
};
const createConfigForFloatText = field => {
  const output = {
    placeholder: field.additionalProperties.hint,
    customClass: "marginBottom_20",
    InputLabelProps: { shrink: true, className: "static-InputLabel" },
    normalize: decimalNumbers(10),
    form: field.formName
  };
  if (!field.additionalProperties.isOptional) {
    addValidateKey(output);
  }
  return output;
};

const setConfigByFieldType = (
  field,
  config,
  container,
  commonOutput,
  basicOutput,
  suggestorsData
) => {
  field.formName = config.name;
  field.formDesc = config.description;
  let output = {};

  switch (field.type) {
    case "formEmailInput":
    case "formNameInput":
    case "formMobileInput":
    case "formNumberInput":
    case "formPasswordInput":
      output = Object.assign(createConfigForInput(field), commonOutput);
      return config[container].push(output);
    case "label":
    case "subLabel":
      output = {
        className: field.additionalProperties.className,
        el: field.additionalProperties.el
      };
      output = Object.assign(output, commonOutput);
      return config[container].push(output);
    case "checkbox":
      output = Object.assign(createConfigForCheckbox(field), commonOutput);
      return config[container].push(output);
    case "floatInput":
      output = Object.assign(createConfigForFloatInput(field), commonOutput);
      return config[container].push(output);
    case "float_text":
      output = Object.assign(createConfigForFloatText(field), commonOutput);
      return config[container].push(output);
    case "chipGroup":
    case "singleSelection":
    case "multiSelectChipGroup":
      output = Object.assign(createConfigForChipgroup(field), commonOutput);
      return config[container].push(output);
    case "dropDownSelector":
      output = Object.assign(
        createConfigForDropDownSelector(field),
        commonOutput
      );
      return config[container].push(output);
    case "selectionMulti":
      output = Object.assign(
        createConfigForSelectionMulti(field),
        commonOutput
      );
      return config[container].push(output);
    case "closedInputSelector":
      output = Object.assign(
        createConfigForClosedInputSelector(field, suggestorsData),
        commonOutput
      );
      return config[container].push(output);
    case "singleSelectionWithSuggestor":
      output = Object.assign(
        createConfigForChipWithSuggestorModal(field),
        commonOutput
      );
      return config[container].push(output);
    case "cta":
      config.button = createConfigForCta(field);
      return config;
    case "button":
      output = Object.assign({}, field, {
        iconURL:
          field.additionalProperties && field.additionalProperties.iconURL
      });
      config[container].push(output);
      break;

    case "radioItem":
      output = {
        label: field.value,
        type: field.type,
        value: field.additionalProperties.selectedValue,
        isDefault: field.additionalProperties.isDefault,
        className: field.additionalProperties.className
      };
      config = Object.assign(config, basicOutput);
      config[container].push(output);
      break;

    default:
      config[container].push(field);
      break;
  }
};

const setFormConfig = (
  data,
  config,
  container,
  isDependent,
  dependentfieldname,
  suggestorsData
) => {
  data.map(field => {
    const basicOutput = {
      // form: config.name,
      name: getFormFieldNameFromConfig(field),
      id: field.id,
      isDependent,
      dependentfieldname
    };
    const commonOutput = {
      ...basicOutput,
      type: customTypeMap[field.type],
      label: field.value || "",
      isoptional:
        (field.additionalProperties && field.additionalProperties.isOptional) ||
        "false"
    };
    setConfigByFieldType(
      field,
      config,
      container,
      commonOutput,
      basicOutput,
      suggestorsData
    );
  });
};

const createConfigForCVUpload = fieldData => {
  const formattedCvUploadObj = fieldData.reduce(
    (acc, fieldEl) => {
      fieldEl.type === "googleDrive" || fieldEl.type === "phone"
        ? acc.resumeUploadButtons.childFields.push(fieldEl)
        : acc.cvUploadConfig.push(fieldEl);
      return acc;
    },
    {
      cvUploadConfig: [],
      resumeUploadButtons: {
        type: "component",
        component: CVUpload,
        name: "file",
        _name: "fileName",
        childFields: []
      }
    }
  );

  formattedCvUploadObj.cvUploadConfig.push(
    formattedCvUploadObj.resumeUploadButtons
  );

  return formattedCvUploadObj.cvUploadConfig;
};

const getHeaderLabel = label => {
  if (
    JSON.parse(localStorage.getItem("appstate")).commonData.userDetails.name
  ) {
    return (
      label &&
      label.replace(
        "{userDetails.name}",
        JSON.parse(
          localStorage.getItem("appstate")
        ).commonData.userDetails.name.split(" ")[0]
      )
    );
  } else if (localStorage.getItem("userName")) {
    return (
      label &&
      label.replace("{userDetails.name}", localStorage.getItem("userName"))
    );
  }
  return label;
};

const addValidateObj = config => {
  if (config.isSkippable) {
    return;
  }
  config.formFields.reduce((acc, formField) => {
    acc[formField.name] = formField.validate;
    formField.validateObj = acc;
    delete formField.validate;
    return acc;
  }, {});
};

const getProcessData = (data, suggestorsData = {}) => {
  const config = {
    name: data.id,
    pageName: data.name,
    isSkippable: data.isSkippable,
    container: {
      className: data.id
    },
    formFields: [],
    description: data.description,
    pageHeading: getHeaderLabel(data.header && data.header.label)
  };
  // TODO : make a better config , add support for dependent fields
  if (isStrContainsKey(data.description, "domain and experience")) {
    const output = {
      id: data.id,
      name: data.id,
      type: "component",
      component: DomainAndExp
    };
    config.formFields.push(output);
  } else if (isStrContainsKey(data.description, "wishlist")) {
    const output = {
      id: data.id,
      name: data.id,
      type: "component",
      component: Preferences
    };
    config.formFields.push(output);
  } else if (isStrContainsKey(data.description, "other domain")) {
    config.container.className = "otherDomainPage";
    setFormConfig(data.components[0].data, config, "formFields");
  } else if (isStrContainsKey(data.description, "job search screen")) {
    const output = {
      id: data.id,
      name: data.id,
      type: "component",
      component: JobSearchStatus,
      jobSearchRadioConfig: {},
      profilePrivacyRadioConfig: {},
      cta: {}
    };
    data.components &&
      data.components.map(field => {
        switch (field.type) {
          case "radioGroup":
            const radioConfig = {
              ariaLabel: "privacy policy",
              labelPlacement: "start",
              wrapperClass: "fullWidth",
              className: "RadioCard__Flat",
              radioList: []
            };
            setFormConfig(field.data, radioConfig, "radioList");
            if (isStrContainsKey(field.description, "privacy policy")) {
              output.profilePrivacyRadioConfig = radioConfig;
            } else {
              output.jobSearchRadioConfig = radioConfig;
            }
        }
        output.cta = { name: data.ctaText };
      });
    config.formFields.push(output);
  } else {
    config.button = {
      name: data.id,
      submitButtonText: data.ctaText,
      customClass: `textCenter fixedToBottom`,
      isTextButton:
        data.ctaProperties && data.ctaProperties.isTextButton ? true : false,
      className:
        data.ctaProperties && data.ctaProperties.isTextButton
          ? "submit_button"
          : "",
      variant:
        data.ctaProperties && data.ctaProperties.type
          ? data.ctaProperties.type
          : "outlined",
      color: "primary",
      type: "submit"
    };
    const dependentConfig = getDependentConfig(data);
    data.components &&
      data.components.map(field => {
        const isDependent = !data.defaultComponents.includes(field.id);

        let dependentFieldName = "";
        if (isDependent) {
          const dependentComponentId = dependentConfig[field.id];
          dependentFieldName = getDependentFieldName(
            data,
            dependentComponentId
          );
        }
        switch (field.type) {
          case "cvUpload":
            return setFormConfig(
              createConfigForCVUpload(field.data),
              config,
              "formFields",
              isDependent
            );
          case "radioGroup":
            const radioConfig = {
              ariaLabel: "privacy policy",
              labelPlacement: "start",
              wrapperClass: "fullWidth",
              className: "RadioCard__Flat",
              radioList: [],
              type: "component",
              component: RadioGroup
            };
            addValidateKey(radioConfig);
            setFormConfig(
              field.data,
              radioConfig,
              "radioList",
              isDependent,
              dependentFieldName
            );
            return config.formFields.push(radioConfig);
          default:
            return setFormConfig(
              field.data,
              config,
              "formFields",
              isDependent,
              dependentFieldName,
              suggestorsData
            );
        }
      });
  }

  addValidateObj(config);
  return config;
};

export default getProcessData;
