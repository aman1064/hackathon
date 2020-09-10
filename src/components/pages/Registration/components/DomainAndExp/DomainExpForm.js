import React from "react";

import ReduxField from "../../../../organisms/Field";
import ChipGroup from "../../../../molecules/ChipGroup";
import ChipsWithSuggestorModal from "../../../../organisms/ChipsWithSuggestorModal";
import Button from "../../../../atoms/Button";
import SingleSuggester from "../../../../templates/SingleSuggester/SingleSuggester";
import BaseInput from "../../../../../ui-components/BaseInput";
import HelpText from "../../../../atoms/HelpText";
import Modal from "../../../../../ui-components/Modal";
import Title from "../../../../../ui-components/Modal/Title";

import Store from "../../../../../store/Store";
import {
  fieldRequiredError,
  normalizeMonths,
  normalizeYears,
  experienceFieldError,
  fieldRequiredErrorInDomain,
  fieldRequiredErrorInOtherDomain,
  normalizeSingleSuggester
} from "../../../../templates/Form/Validate";

import services from "../../../../../utils/services";
import { getUrl } from "../../../../../utils/getUrl";
import routeConfig from "../../../../../constants/routeConfig";
import Urlconfig from "../../../../../constants/Urlconfig";
import tracker from "../../../../../analytics/tracker";
import regexConfig from "../../../../../constants/regexConfig";

let CURRENT_ID;

const validateObj = {
  domain: fieldRequiredError,
  domain_other: () => false,
  experienceYear: experienceFieldError,
  experienceMonth: experienceFieldError,
  specialization: fieldRequiredErrorInDomain
};

const DomainAndExp = props => {
  const {
    domainValue = {},
    id,
    formValues,
    getNextScreen,
    updateUserProfile,
    history,
    profile,
    displayScreen,
    handleOtherDomainClick,
    handleOtherDomainBackClick,
    otherDomainValue,
    isNotServingspecialization,
    handleNotServingJobsModalClose,
    resetNotServingJobsModal,
    specialization = {},
    resetOtherDomain,
    handleChangeData,
    isValid,
    initialValues,
    profileEditScreens,
    updateCurrentScreenWithPromise,
    domainRoleMap,
    onChipChange
  } = props;
  const isEdit = history.location.pathname.includes("profile");
  const specializationName = specialization && specialization.name;

  const handleCompleteProfileClick = () => {
    tracker().on("event", {
      hitName: `registration$role_bottom_sheet_next_clicked$domain_experience`
    });

    if (!isValid) {
      handleNotServingJobsModalClose();
    } else {
      handleFormSubmit(
        formValues,
        getNextScreen,
        updateUserProfile,
        history,
        isEdit,
        profile,
        profileEditScreens
      )();
    }
  };
  const handleModalCancelClick = () => {
    tracker().on("event", {
      hitName: `registration$role_bottom_sheet_cancelled$domain_experience`
    });
    handleNotServingJobsModalClose();
  };
  const handleModalClose = () => {
    tracker().on("event", {
      hitName: `registration$role_bottom_sheet_crossed$domain_experience`
    });
    handleNotServingJobsModalClose();
  };

  const handleOtherDomainSelected = () => {
    tracker().on("event", {
      hitName: `registration$other_domain_selected$domain_experience`
    });
    sessionStorage.removeItem("DEx_displayScreen");
    handleFormSubmit(
      formValues,
      getNextScreen,
      updateUserProfile,
      history,
      isEdit,
      profile,
      profileEditScreens
    )();
  };

  CURRENT_ID = id;
  if (
    (displayScreen === "domainForm" && resetOtherDomain && otherDomainValue) ||
    (domainValue.name && otherDomainValue)
  ) {
    handleChangeData({
      form: "domainAndExp",
      fieldName: "domain_other",
      value: null
    });
  }
  return (
    <div className="DomainAndExp">
      {displayScreen === "domainForm" && (
        <div>
          <h1 className="smallHeading">
            Tell us a bit about yourself to get started
          </h1>

          <div className="marginBottom_48">
            <h2 className="marginBottom_4">Current area of work</h2>
            {!isEdit && (
              <HelpText
                className="fontSize_11 marginBottom_4"
                text="We currently serve jobs to only these areas of work."
              />
            )}
            <ReduxField
              form="domainAndExp"
              name="domain"
              component={renderChipGroup}
              validate={fieldRequiredError}
              passFormNameToChild
              isEditable
              onChipChange={onChipChange}
              listToDelete={[
                "domain_other",
                "specialization"
              ]}
              reduxfieldChange={handleChangeData}
              handleChangeData={handleChangeData}
              validateObj={validateObj}
              initialValue={initialValues.domain}
              onChipDelete={resetNotServingJobsModal}
            />
          </div>
          {(!domainValue || !domainValue.name) && !isEdit && (
            <div className="otherDomain">
              <p className="fontSize_13">Your area of work isn’t listed?</p>
              <Button
                color="primary"
                type="link hasHover"
                className="otherDomain_CTA"
                onClick={handleOtherDomainClick}
              >
                Tell us here!
              </Button>
            </div>
          )}
          {domainValue.name && (
            <div>
              <h2>Total work experience</h2>
              <div className="marginBottom_56">
                <ReduxField
                  form="domainAndExp"
                  name="experienceYear"
                  label="Year(s)"
                  component={renderTextField}
                  InputLabelProps={{
                    shrink: true,
                    className: "static-InputLabel blue_grey_InputLabel"
                  }}
                  validate={experienceFieldError}
                  type="tel"
                  normalize={normalizeYears("2")}
                  className="experienceYear"
                  placeholder="0"
                  inputWrapperClass="isExperienceInput"
                  validateObj={validateObj}
                  initialValue={initialValues.experienceYear}
                />
                <ReduxField
                  form="domainAndExp"
                  name="experienceMonth"
                  label="Month(s)"
                  component={renderTextField}
                  InputLabelProps={{
                    shrink: true,
                    className: "static-InputLabel blue_grey_InputLabel"
                  }}
                  validate={experienceFieldError}
                  type="tel"
                  placeholder="0"
                  inputWrapperClass="isExperienceInput"
                  normalize={normalizeMonths("2")}
                  className="experienceMonth"
                  validateObj={validateObj}
                  initialValue={initialValues.experienceMonth}
                />
              </div>
              <h2 className="marginBottom_4">Latest Job Role</h2>
              <ReduxField
                form="domainAndExp"
                name="specialization"
                component={renderChipsWithSuggestorModal}
                domainId={domainValue.id}
                validate={fieldRequiredErrorInDomain}
                onChipDelete={resetNotServingJobsModal}
                validateObj={validateObj}
                initialValue={
                  domainRoleMap[domainValue.id] || initialValues.specialization
                }
              />
            </div>
          )}

          <div className="js_submit_button_wrapper textCenter fixedToBottom spreadHr">
            {isEdit ? (
              <Button
                type="link hasHover"
                onClick={() => {
                  tracker().on("event", {
                    hitName: `profile$back_clicked$edit_domain_experience`
                  });
                  history.push(routeConfig.profile);
                }}
              >
                <span className="nav_arrow prev" />
              </Button>
            ) : (
              <div />
            )}
            <Button
              type="link hasHover"
              disabled={!isValid}
              onClick={handleFormSubmit(
                formValues,
                getNextScreen,
                updateUserProfile,
                history,
                isEdit,
                profile,
                profileEditScreens,
                updateCurrentScreenWithPromise
              )}
              id="formNextButton"
            >
              <span className="nav_arrow secondary" />
            </Button>
          </div>
        </div>
      )}

      {displayScreen === "otherDomainForm" && (
        <div className="otherDomainForm">
          <ReduxField
            form="domainAndExp"
            name="domain_other"
            component={renderSingleSuggester}
            placeholder="Area of work"
            normalize={normalizeSingleSuggester(
              regexConfig.areaOfWorkSuggester,
              "50"
            )}
            validate={fieldRequiredErrorInOtherDomain}
          />

          <div className="js_submit_button_wrapper textCenter fixedToBottom spreadHr">
            <Button type="link hasHover" onClick={handleOtherDomainBackClick}>
              <span className="nav_arrow prev" />
            </Button>

            <Button
              type="link hasHover"
              disabled={!otherDomainValue || !otherDomainValue.name}
              onClick={handleOtherDomainSelected}
              id="formNextButton"
            >
              <span className="nav_arrow secondary" />
            </Button>
          </div>
        </div>
      )}

      <Modal
        open={isNotServingspecialization}
        onClose={handleModalClose}
        className="Modal__Bottom"
        closeOnClickOutside
        appear
      >
        <Title handleClose={handleModalClose}>
          We will soon start serving for {specializationName} role
        </Title>
        <p className="message">
          You can choose to complete your profile on BigShyft and we’ll notify
          you when we start serving ‘{specializationName}’ related
          opportunities.
        </p>
        <div className="actions">
          <Button
            appearance="secondary"
            onClick={handleModalCancelClick}
            className="cancelCTA"
          >
            Cancel
          </Button>
          <Button onClick={handleCompleteProfileClick}>Complete Profile</Button>
        </div>
      </Modal>
    </div>
  );
};

const renderChipGroup = props => {
  return (
    <ChipGroup
      chipListUrl="/suggestions/v2/suggestions/domain/"
      isMultiSelect={false}
      hideUnselected
      form={props.form}
      labelClassName="domainChipItem"
      {...props}
    />
  );
};

const renderChipsWithSuggestorModal = props => (
  <ChipsWithSuggestorModal
    buttonSuffix="role"
    chipListUrl={`/suggestions/v2/suggestions/specialization/parent/${
      props.domainId
    }?size=40`}
    isMultiSelect={false}
    hideUnselected
    threshold={5}
    modalPlaceholder="Search role"
    modalTitle="Select Role"
    labelClassName="domainChipItem"
    fieldLabel="role"
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
    inputClassName="blue_grey_InputBorder"
    {...custom}
  />
);

const renderSingleSuggester = props => (
  <SingleSuggester
    data={null}
    dataUrl={"/suggestions/v2/suggestions/otherdomain?input={input}"}
    placeholder={props.label}
    showAll={false}
    {...props}
  />
);

const handleFormSubmit = (
  values,
  getNextScreen,
  updateUserProfile,
  history,
  isEdit,
  profile,
  profileEditScreens,
  updateCurrentScreenWithPromise
) => () => {
  localStorage.setItem("DEx_closeNotServingJobsModal", "true");
  const postObj = { ...values };
  if (postObj.domain_other) {
    postObj.domain = postObj.domain_other;
    delete postObj.domain_other;
    delete postObj.specialization;
    delete postObj.experienceMonth;
    delete postObj.experienceYear;
    services.post(getUrl(Urlconfig.postUpdateUserProfile), postObj);
    updateUserProfile(postObj);
    history.push(routeConfig.noDomain);
  } else {
    delete postObj.domain_other;
    if (!postObj.experienceMonth) {
      postObj.experienceMonth = "0";
    } else if (!postObj.experienceYear) {
      postObj.experienceYear = "0";
    }
    const postData = {
      profile: postObj,
      currentScreenId: CURRENT_ID
    };
    updateUserProfile(postObj);
    const promise = new Promise((resolve, reject) => {
      getNextScreen(postData, resolve, reject, isEdit);
    });

    promise.then(res => {
      let eventName;
      let page_name;
      if (isEdit) {
        eventName = "edit_domain_experience_next_click";
        page_name = "js_edit_domain_experience";
        tracker().on("event", {
          hitName: `profile$update_clicked$edit_domain_experience`
        });
        if (
          postObj.domain.id === profile.domain.id &&
          postObj.specialization.id === profile.specialization.id
        ) {
          history.push(routeConfig.profile);
        } else {
          const { defaultFlow } = profileEditScreens;
          // id for skills screen
          const id = defaultFlow[1];
          history.push(routeConfig.profileEdit.replace(":id", id), {
            isEdit: true,
            showPrompt: true
          });
          new Promise((resolve, reject) => {
            updateCurrentScreenWithPromise(id, resolve, reject);
          });
        }
      } else {
        eventName = `domain_experience_next_click`;
        page_name = "js_domain_experience";
        tracker().on("event", {
          hitName: `registration$next_button_clicked$domain_experience`
        });
        res && history.push(routeConfig.regWithId.replace(":id", res));
      }
      tracker().on("ctapProfile", {
        hitName: eventName,
        payload: {
          ...postObj,
          is_profile_complete: !!profile.isUserProfileCompleted,
          does_cv_exist: !!profile.fileName
        }
      });
      tracker().on("ctapEvent", {
        hitName: eventName,
        payload: { page_name }
      });
    });

    return promise.catch(err => {
      if (err === "apifailure") {
        this.setState({
          redirectToNoProfilePage: true
        });
      } else {
        Store.dispatch(
          handleFormValidState({
            form: "domainAndExp",
            isValid: false,
            errorMsg: err
          })
        );
      }
    });
  }
};

export default DomainAndExp;
