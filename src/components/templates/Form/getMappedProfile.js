import {
  getConfigNameFromFormFieldName,
  isStrContainsKey
} from "../../../utils/pureFns";

window.GLOBAL_MAPPED_PROFILE_OBJ = {};
const excludeVoidFromAPI = value => {
  if (value || value === 0) {
    if (value === -1) {
      return "";
    }
    return value;
  } else {
    return "";
  }
};
const getValuesMappedWithFormattedName = (formFieldsArr, profileObj = {}) => {
  const mappedProfileObj = formFieldsArr.reduce((acc, field) => {
    if (field.id === "experience") {
      field.childFields.reduce((acc, childField) => {
        acc[childField.name] =
          profileObj[getConfigNameFromFormFieldName(childField.name)] || "";
        return acc;
      }, acc);
    } else if (isStrContainsKey(field.name, "$")) {
      acc[field.name] = excludeVoidFromAPI(
        profileObj[getConfigNameFromFormFieldName(field.name)]
      );
    } else {
      acc[field.name] = profileObj[field.name] || "";
    }
    return acc;
  }, {});
  window.GLOBAL_MAPPED_PROFILE_OBJ = {
    ...window.GLOBAL_MAPPED_PROFILE_OBJ,
    ...mappedProfileObj
  };

  return window.GLOBAL_MAPPED_PROFILE_OBJ;
};

export default getValuesMappedWithFormattedName;
