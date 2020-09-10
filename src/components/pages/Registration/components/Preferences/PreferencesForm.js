import React from "react";

import ReduxField from "../../../../organisms/Field";
import ChipGroup from "../../../../molecules/ChipGroup";
import ChipsWithSuggestorModal from "../../../../organisms/ChipsWithSuggestorModal";
import Button from "../../../../atoms/Button";
import Checkbox from "../../../../../ui-components/CheckBox";
import BaseInput from "../../../../../ui-components/BaseInput";

import { decimalNumbers } from "../../../../templates/Form/Validate";

import routeConfig from "../../../../../constants/routeConfig";
import tracker from "../../../../../analytics/tracker";

let CURRENT_ID;

const PreferencesForm = props => {
  const {
    id,
    getNextScreen,
    updateUserProfile,
    history,
    handleChangeData,
    initialValues,
    isValid,
    openGlobalPrompt,
    formValues,
    getUserProfile
  } = props;
  const isEdit = history.location.pathname.includes("profile");

  CURRENT_ID = id;
  return (
    <div className="preferences">
      <div>
        <div className="marginBottom_32 expectedCtc">
          <h2>Annual CTC expectation(in lacs)</h2>
          <ReduxField
            form="preferences"
            name="expectedCTC"
            component={renderTextField}
            isEditable={!isEdit}
            placeholder="e.g. 15.5"
            normalize={decimalNumbers("10")}
            handleChangeData={handleChangeData}
            initialValue={initialValues.expectedCTC}
          />
        </div>
        <div className="marginBottom_32">
          <h2 className="fontSize_17">
            Locations{" "}
            {formValues &&
              formValues.locations &&
              formValues.locations.length > 0 &&
              `(${formValues.locations.length})`}
          </h2>
          <ReduxField
            form="preferences"
            name="locations"
            component={renderChipsWithSuggestorModal}
            initialValue={initialValues && initialValues.locations}
          />
          <ReduxField
            form="preferences"
            name="strictPreferredLocation"
            type="checkbox"
            initialValue={
              initialValues && initialValues.strictPreferredLocation
            }
            label="Show jobs only from above selected city"
            labelClass="color_blue_grey"
            disabled={
              formValues &&
              formValues.locations &&
              formValues.locations.length > 0 ? (
                false
              ) : (
                true
              )
            }
            isEdit={isEdit}
            formValues
            fieldType="checkbox" // to handle the onChange exclusively for reduxField
            component={renderField}
          />
        </div>
        <div className="marginBottom_32">
          <h2 className="fontSize_17">
            Company Type{" "}
            {formValues &&
              formValues.companyTypes &&
              formValues.companyTypes.length > 0 &&
              `(${formValues.companyTypes.length})`}
          </h2>
          <ReduxField
            name="companyTypes"
            form="preferences"
            url="/suggestions/v2/suggestions/preferredCompanyType"
            component={renderChipGroup}
            handleChangeData={handleChangeData}
            initialValue={initialValues && initialValues.companyTypes}
          />
        </div>
        <div className="marginBottom_32">
          <h2 className="fontSize_17">
            Type of role{" "}
            {formValues &&
              formValues.roleTypes &&
              formValues.roleTypes.length > 0 &&
              `(${formValues.roleTypes.length})`}
          </h2>
          <ReduxField
            name="roleTypes"
            form="preferences"
            url="/suggestions/v2/suggestions/preferredRoles"
            component={renderChipGroup}
            handleChangeData={handleChangeData}
            initialValue={initialValues && initialValues.roleTypes}
          />
        </div>
        <div className="marginBottom_32">
          <h2 className="fontSize_17">
            Additional Benefits{" "}
            {formValues &&
              formValues.benefits &&
              formValues.benefits.length > 0 &&
              `(${formValues.benefits.length})`}{" "}
          </h2>
          <ReduxField
            name="benefits"
            form="preferences"
            url="/suggestions/v2/suggestions/preferredBenefits"
            component={renderChipGroup}
            initialValue={initialValues && initialValues.benefits}
          />
        </div>
        <div className="js_submit_button_wrapper textCenter fixedToBottom spreadHr">
          <Button
            type="link hasHover"
            onClick={() => {
              tracker().on("event", {
                hitName: "registration$back_button_clicked$wishlist"
              });
              history.goBack();
            }}
          >
            <span className="nav_arrow prev">{""}</span>
          </Button>

          <Button
            type="link hasHover"
            disabled={!isValid}
            onClick={handleFormSubmit(
              formValues,
              getNextScreen,
              updateUserProfile,
              history,
              isEdit,
              openGlobalPrompt,
              getUserProfile
            )}
            id="formNextButton"
          >
            <span className={`nav_arrow secondary`}>{""}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

const renderChipGroup = props => {
  return (
    <ChipGroup
      chipListUrl={props.url}
      isMultiSelect={true}
      hideUnselected={false}
      isEditable={true}
      {...props}
    />
  );
};

const renderChipsWithSuggestorModal = props => (
  <ChipsWithSuggestorModal
    buttonText="+ More Locations"
    chipListUrl={`/suggestions/v2/suggestions/location?size=2000`}
    isMultiSelect={true}
    hideUnselected={false}
    threshold={7}
    modalPlaceholder="Search location"
    modalTitle="Select Locations"
    fieldLabel="location"
    {...props}
  />
);

const renderTextField = ({
  label,
  input,
  className,
  InputLabelProps,
  meta: { touched, error },
  ...custom
}) => (
  <BaseInput
    error={touched && typeof error === "string"}
    label={label}
    className={`fontSize_13 blue_grey_Input ${className}`}
    labelClassName={`${InputLabelProps && InputLabelProps.className}`}
    containerClassName={`${className} blue_grey_Input`}
    {...input}
    maxLength={50}
    inputClassName={"blue_grey_InputBorder"}
    {...custom}
  />
);
const renderField = ({
  type,
  label,
  labelClass,
  input,
  meta: { touched, error },
  disabled,
  formValues,
  isEdit
}) => {
  return (
    <Checkbox
      error={touched && typeof error === "string"}
      type={type}
      label={label}
      checked={
        formValues &&
        formValues.locations &&
        formValues.locations.length > 0 &&
        (input.value || false)
      }
      {...input}
      labelClass={`${labelClass} fontSize_13`}
      containerClassName="marginTop_18"
      disabled={disabled}
      disabledClass={"color_blue_grey"}
      onClick={() => {
        if (!input.value) {
          if (isEdit) {
            tracker().on("event", {
              hitName: "profile$wishlist_location_strict_selected$edit_wishlist"
            });
          } else {
            tracker().on("event", {
              hitName: "registration$wishlist_location_strict_selected$wishlist"
            });
          }
        } else {
          if (isEdit) {
            tracker().on("event", {
              hitName:
                "profile$wishlist_location_strict_unselected$edit_wishlist"
            });
          } else {
            tracker().on("event", {
              hitName:
                "registration$wishlist_location_strict_unselected$wishlist"
            });
          }
        }
      }}
    />
  );
};

const handleFormSubmit = (
  values,
  getNextScreen,
  updateUserProfile,
  history,
  isEdit,
  openGlobalPrompt,
  getUserProfile
) => () => {
  const postObj = Object.assign({}, values);
  postObj.expectedCTC = postObj.expectedCTC !== "" ? postObj.expectedCTC : -1;
  postObj.strictPreferredLocation =
    postObj.strictPreferredLocation &&
    postObj.locations &&
    postObj.locations.length > 0
      ? postObj.strictPreferredLocation
      : false;
  ["locations", "companyTypes", "benefits", "roleTypes"].forEach(key => {
    if (postObj[key] === "") {
      postObj[key] = [];
    }
  });
  const profile = { preferences: { ...postObj } };
  const postData = {
    profile: profile,
    currentScreenId: CURRENT_ID
  };
  updateUserProfile(profile);
  const promise = new Promise((resolve, reject) => {
    getNextScreen(postData, resolve, reject, isEdit);
  });
  if (isEdit) {
    tracker().on("event", {
      hitName: `profile$update_clicked$edit_wishlist`
    });
    history.push(routeConfig.profile);
  } else {
    tracker().on("event", {
      hitName: `registration$next_button_clicked$wishlist`
    });
  }

  promise.then(res => {
    let eventName;
    let page_name;
    if (isEdit) {
      eventName = "edit_wishlist_next_click";
      page_name = "js_edit_wishlist";
      tracker().on("event", {
        hitName: `profile$update_success$edit_wishlist`
      });
      history.push(routeConfig.profile);
    } else {
      eventName = `wishlist_next_click`;
      page_name = "js_wishlist";
      tracker().on("event", {
        hitName: `registration$next_success_clicked$wishlist`
      });
    }
    const profileObj = {};
    for (const key in postObj) {
      profileObj[`wishlist_${key}`] = postObj[key];
    }
    tracker().on("ctapProfile", {
      hitName: eventName,
      payload: {
        ...profileObj,
        is_profile_complete: profile.isUserProfileCompleted ? true : false,
        does_cv_exist: profile.fileName ? true : false
      }
    });
    tracker().on("ctapEvent", {
      hitName: eventName,
      payload: { page_name }
    });
    getUserProfile();
  });

  return promise.catch(err => {
    if (isEdit) {
      tracker().on("event", {
        hitName: `profile$update_fail$edit_wishlist`
      });
      // history.push(routeConfig.profile);
    } else {
      tracker().on("event", {
        hitName: `registration$next_fail$wishlist`
      });
    }
    openGlobalPrompt("Sorry!! unable to update the preferences", "error");
  });
};

export default PreferencesForm;
