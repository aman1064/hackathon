import APP_EVENT from "../AppEvents";

import set from "../../../../utils/jsUtils/set";
import get from "../../../../utils/jsUtils/get";

export default (state = {}, action) => {
  let updatedFormState;
  switch (action.type) {
    case APP_EVENT.HANDLE_CHANGE_DATA: {
      if (typeof action.form === "undefined") {
        return { ...state };
      }
      updatedFormState = set(
        state[action.form] || {},
        `values.${action.fieldName}`,
        action.value
      );
      updatedFormState = set(
        updatedFormState,
        `errors.${action.fieldName}`,
        action.error
      );
      updatedFormState = set(
        updatedFormState,
        `touched.${action.fieldName}`,
        action.touched
      );
      return { ...state, [action.form]: { ...updatedFormState } };
    }
    case APP_EVENT.FORM_RESET:
      return { ...state, [action.form]: undefined };

    case APP_EVENT.HANDLE_FORM_VALID_STATE: {
      if (typeof action.form === "undefined") {
        return { ...state };
      }
      updatedFormState = set(
        state[action.form] || {},
        "isValid",
        action.isValid
      );
      updatedFormState = set(
        state[action.form] || {},
        "errorMsg",
        action.errorMsg
      );
      // if (action.isValid) {
      //   updatedFormState = set(state[action.form] || {}, "errors", {});
      // }
      if (
        !get(state[action.form], "errors.experienceMonth") ||
        !get(state[action.form], "errors.experienceYear")
      ) {
        set(state[action.form], "errors.experienceMonth", false);
        set(state[action.form], "errors.experienceYear", false);
      }

      return { ...state, [action.form]: { ...updatedFormState } };
    }
    case APP_EVENT.HANDLE_FIELD_ERROR:
      updatedFormState = set(
        state[action.form] || {},
        `errors.${action.field}`,
        action.errorMsg
      );
      updatedFormState = set(
        state[action.form] || {},
        `touched.${action.field}`,
        action.touched
      );
      return { ...state, [action.form]: { ...updatedFormState } };
    default:
      return state;
  }
};
