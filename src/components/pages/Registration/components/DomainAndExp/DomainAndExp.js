import React, { Component } from "react";
import { connect } from "react-redux";

import DomainAndExp from "./DomainExpForm";

import { getNextScreen } from "../../saga/ActionCreator";
import { updateCurrentScreenWithPromise } from "../../../Profile/saga/ActionCreator";
import { updateUserProfile } from "../../../../../sagas/ActionCreator";
import services from "../../../../../utils/services";
import routeConfig from "../../../../../constants/routeConfig";
import Urlconfig from "../../../../../constants/Urlconfig";
import tracker from "../../../../../analytics/tracker";
import get from "../../../../../utils/jsUtils/get";
import { getUrl } from "../../../../../utils/getUrl";
import {
  handleChangeData,
  handleFormValidState
} from "../../../../organisms/Field/saga/ActionCreator";
import "./DomainAndExp.scss";

class DomainExpComp extends Component {
  state = {
    displayScreen: "domainForm",
    closeNotServingJobsModal: false,
    resetOtherDomain: false,
    domainRoleMap: JSON.parse(localStorage.getItem("domainRoleMap")) || {},
    hideNotServingJobsModal:false
  };

  static async getDerivedStateFromProps(props, state) {
    const { closeNotServingJobsModal, validSpecializations = [],hideNotServingJobsModal } = state;
    const { specialization, history, formValues, handleChangeData } = props;
    const isEdit = history.location.pathname.includes("profile");
    
    if (
      !hideNotServingJobsModal && 
      specialization &&
      specialization.id &&
      !closeNotServingJobsModal &&
      validSpecializations.length &&
      !validSpecializations.includes(specialization.id) &&
      !isEdit
    ) {
      state.isNotServingspecialization = true;
    } else {
      state.isNotServingspecialization = false;
    }

    if (get(formValues, "domain.id") && get(formValues, "specialization.id")) {
      const { data } = await services.get(
        getUrl(
          `/suggestions/v2/suggestions/specialization/parent/${
            formValues.domain.id
          }?size=40`
        )
      );
      const isJobMapping = data.filter(
        el => el.id === formValues.specialization.id
      );
      if (isJobMapping.length) {
        state.domainRoleMap[formValues.domain.id] = get(
          formValues,
          "specialization"
        );
      }
    } else if (get(formValues, "specialization.id")) {
      handleChangeData({
        form: "domainAndExp",
        fieldName: "specialization",
        value: "",
        touched: false
      });
    }
  }

  componentDidMount() {
    const {
      specialization,
      otherDomainValue = {},
      profile,
      history
    } = this.props;
    let otherDomainId;
    if (
      sessionStorage.getItem("DEx_displayScreen") === "otherDomainForm" &&
      this.state.displayScreen !== "otherDomainForm"
    ) {
      this.setState({ displayScreen: "otherDomainForm" });
    } else {
      otherDomainId = get(otherDomainValue, "id"); // to differentiate between primary_domains and other_domain
      this.setState({ resetOtherDomain: true });
    }
    if (get(history, "location.state.resetOtherDomain")) {
      otherDomainId = null;
      this.setState({ resetOtherDomain: true });
    }
    if (
      (get(profile, "domain.name") && !get(profile, "domain.id")) ||
      otherDomainId
    ) {
      history.push(routeConfig.noDomain);
    }

    this.getValidSpecializations();
    if (get(profile, "domain.id")) {
      this.state.domainRoleMap[profile.domain.id] = get(
        profile,
        "specialization"
      );
      this.setState({
        domainRoleMap: this.state.domainRoleMap
      });
      
    }
    if (specialization && specialization.id) {
      this.setNotServingJobsModalState();
    } else {
      this.resetNotServingJobsModal();
    }
  }

  componentWillUnmount() {
    // Done for Registration flow
    const isEdit = this.props.history.location.pathname.includes("profile");
    if(!isEdit){
      localStorage.setItem(
        "domainRoleMap",
        JSON.stringify(this.state.domainRoleMap)
      );
    }else{
      localStorage.removeItem("domainRoleMap");
    }
  }

  setNotServingJobsModalState = () => {
    const closeNotServingJobsModal =
      localStorage.getItem("DEx_closeNotServingJobsModal") === "true";

    if (this.state.closeNotServingJobsModal !== closeNotServingJobsModal) {
      this.setState({ closeNotServingJobsModal,hideNotServingJobsModal:false });
    }
  };

  getValidSpecializations = async () => {
    const { data } = await services.get(Urlconfig.getValidSpecializations);
    this.setState({
      validSpecializations: data.specializations
    });
  };

  handleOtherDomainClick = () => {
    sessionStorage.setItem("DEx_displayScreen", "otherDomainForm");
    this.setState({ displayScreen: "otherDomainForm" });
  };

  handleOtherDomainBackClick = () => {
    tracker().on("event", {
      hitName: `registration$back_button_clicked$domain_experience_other`
    });
    sessionStorage.removeItem("DEx_displayScreen");
    this.setState({ displayScreen: "domainForm" });
  };

  handleNotServingJobsModalClose = () => {
    localStorage.setItem("DEx_closeNotServingJobsModal", "true");
    this.setState({ closeNotServingJobsModal: true });
  };

  resetNotServingJobsModal = () => {
    const { formValues } = this.props;
    localStorage.setItem("DEx_closeNotServingJobsModal", "false");
    if (formValues) {
      this.state.domainRoleMap[formValues.domain.id] = "";
    }
    this.setState({
      closeNotServingJobsModal: false,
      hideNotServingJobsModal:false,
      domainRoleMap: this.state.domainRoleMap
    });
  };

  onChipChange = ({ id }) => {
    if (this.state.domainRoleMap[id]) {
      this.props.handleChangeData({
        form: "domainAndExp",
        fieldName: "specialization",
        value: this.state.domainRoleMap[id]
      });
      this.setState({
        hideNotServingJobsModal:true
      })
      
    }
  };

  render() {
    const {
      displayScreen,
      isNotServingspecialization,
      resetOtherDomain,
      domainRoleMap
    } = this.state;
    return (
      <div>
        <DomainAndExp
          {...this.props}
          displayScreen={displayScreen}
          domainRoleMap={domainRoleMap}
          handleOtherDomainClick={this.handleOtherDomainClick}
          handleOtherDomainBackClick={this.handleOtherDomainBackClick}
          isNotServingspecialization={isNotServingspecialization}
          handleNotServingJobsModalClose={this.handleNotServingJobsModalClose}
          resetNotServingJobsModal={this.resetNotServingJobsModal}
          resetOtherDomain={resetOtherDomain}
          onChipChange={this.onChipChange.bind(this)}
        />
      </div>
    );
  }
}

const getInitialValuesFromProfile = profileObj => {
  const returnObj = {};
  if (profileObj.domain && profileObj.domain.id) {
    returnObj.domain = profileObj.domain;
  }
  returnObj.experienceYear = profileObj.experienceYear;
  returnObj.experienceMonth = profileObj.experienceMonth;
  if (profileObj.specialization) {
    returnObj.specialization = profileObj.specialization;
  }
  return returnObj;
};

const mapSTP = (state, props) => {
  const { experimentId } = state.registrationData;
  const { variationId } = state.registrationData;
  const { profile } = state.commonData.userDetails;
  const domainValue = get(state.forms, "domainAndExp.values.domain");
  const otherDomainValue = get(state.forms, "domainAndExp.values.domain_other");
  const specialization = get(state.forms, "domainAndExp.values.specialization");
  const values = get(state.forms, "domainAndExp.values");
  const isValid = get(state.forms, "domainAndExp.isValid");
  const enableReinitialize =
    props.history &&
    props.history.location.state &&
    props.history.location.state.isEdit;

  return {
    domainValue,
    formValues: values,
    profile,
    experimentId,
    variationId,
    initialValues: getInitialValuesFromProfile(profile),
    enableReinitialize,
    otherDomainValue,
    specialization,
    isValid,
    profileEditScreens: get(state, "userProfileData.profileEditScreens")
  };
};

export default connect(
  mapSTP,
  {
    getNextScreen,
    updateUserProfile,
    handleChangeData,
    handleFormValidState,
    updateCurrentScreenWithPromise
  }
)(DomainExpComp);
