import React, { Component } from "react";
import PageHeading from "../../atoms/PageHeading";
import HelpText from "../../atoms/HelpText";
import Button from "../../atoms/Button";
import { EditIcon } from "../../atoms/Icon";

export default class ProfileDetailsCard extends Component {
  render() {
    const { tempProfile, tempUser, isQuickApply } = this.props;

    return (
      <div className="profileDetailsCard">
        <PageHeading
          title={
            isQuickApply ? (
              "Review & update your details that recruiter will see"
            ) : (
              "Review & update your details before viewing jobs"
            )
          }
          el="h2"
          className="marginBottom_24"
        />
        <div className="spreadHr">
          <HelpText
            className="paddingBottom_12"
            text={
              tempProfile.profileSource === "NAUKRI" ? (
                "Details we have from Naukri"
              ) : (
                "Details we already know about you"
              )
            }
          />
          <Button
            type="link hasHover"
            className="editButton"
            name="profileEditButton"
            onClick={this.props.handleProfileEdit}
          >
            <EditIcon />
          </Button>
        </div>
        <div className="fontSize_13">
          <p className="semibold" name="userName">
            {tempUser.name}
          </p>
          <p className="marginTop_4" name="jobRole">
            {tempProfile.specialization && tempProfile.specialization.name}
          </p>
          <HelpText
            className="marginTop_12"
            text="Latest Professional Details"
          />

          <p className="marginTop_4" name="jobTitle">
            {tempProfile.latestCompanyDetails &&
              tempProfile.latestCompanyDetails.jobTitle &&
              tempProfile.latestCompanyDetails.jobTitle.name}
          </p>
          <p name="companyName">
            {tempProfile.latestCompanyDetails &&
              tempProfile.latestCompanyDetails.company &&
              `${tempProfile.latestCompanyDetails.company.name}, `}
            <span name="companyLocation">
              {tempProfile.latestCompanyDetails &&
                tempProfile.latestCompanyDetails.location &&
                tempProfile.latestCompanyDetails.location.name}
            </span>
          </p>
        </div>
      </div>
    );
  }
}
