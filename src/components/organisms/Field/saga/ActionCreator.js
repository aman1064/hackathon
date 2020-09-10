import APP_EVENT from "../AppEvents";

const handleChangeData = payload => ({
  type: APP_EVENT.HANDLE_CHANGE_DATA,
  ...payload
});

const reset = form => ({
  type: APP_EVENT.FORM_RESET,
  form
});

const handleFormValidState = ({ form, isValid, errorMsg = "" }) => {
  return {
    type: APP_EVENT.HANDLE_FORM_VALID_STATE,
    form,
    isValid,
    errorMsg
  };
};

const handleFieldError = ({ form, field, errorMsg, touched }) => {
  return {
    type: APP_EVENT.HANDLE_FIELD_ERROR,
    form,
    field,
    errorMsg,
    touched
  };
};

export { handleChangeData, reset, handleFormValidState, handleFieldError };
