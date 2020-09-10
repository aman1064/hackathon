/* eslint-disable array-callback-return */
import React, { Component } from "react";
import { connect } from "react-redux";

import SingleSuggesterWithChip from "../../../../templates/SingleSuggester/SingleSuggesterWithChip";
import ChipGroup from "../../../../molecules/ChipGroup/ChipGroup";
import PageHeading from "../../../../atoms/PageHeading";
import { TagPlusIcon } from "../../../../atoms/Icon/icons";
import Loading from "../../../../atoms/Loading";

import services from "../../../../../utils/services";
import {
  updateUserProfile,
  openGlobalPrompt
} from "../../../../../sagas/ActionCreator";
import CustomDropdown from "../../../../templates/CustomDropdown";
import expOptions from "../../../../../utils/getExperienceOptions";
import { getUrl } from "../../../../../utils/getUrl";
import get from "../../../../../utils/jsUtils/get";
import "./Page3.scss";
import Urlconfig from "../../../../../constants/Urlconfig";
import getSessionStorage from "../../../../../utils/getSessionStorage";

const formSkillsData = params => {
  const { skills, skillsId, experienceMonth, experienceYear } = params;
  const data = [];
  for (let i = 0; i < skills.length; ++i) {
    const item = {
      name: skills[i],
      skillId: skillsId[i],
      experienceYear: parseInt(experienceYear[i], 10),
      experienceMonth: parseInt(experienceMonth[i], 10)
    };
    data.push(item);
  }
  return data;
};

class Skills extends Component {
  constructor(props) {
    super(props);
    this.state = {
      experienceYear: [],
      experienceMonth: [],
      skills: [],
      skillsId: [],
      skillsApiData: [],
      specializationId: ""
    };
    this.isEdit =
      props.history &&
      props.history.location.state &&
      props.history.location.state.isEdit;
    this.isQuickApplyFlow = getSessionStorage("isQuickApplyFlow");
    
    
  }
  handleIsButtonEnabled = params => {
    const { skills, experienceYear, experienceMonth } = params,
      submitSkillsData = formSkillsData(params);
    let isButtonEnabled = false;
    for (let i = 0; i < skills.length; i++) {
      isButtonEnabled =
        ["", "0"].includes(experienceYear[i]) &&
        ["", "0"].includes(experienceMonth[i])
          ? false
          : true;
      if (!isButtonEnabled) {
        break;
      }
    }
    if (skills && skills.length === 0) {
      isButtonEnabled = false;
    }
    if ((isButtonEnabled && this.isEdit) || !this.isEdit) {
      this.props.updateUserProfile({ skills: submitSkillsData || [] });
    }
    if (isButtonEnabled) {
      this.props.input.onChange(submitSkillsData);
    } else {
      this.props.input.onChange("");
    }
  };

  componentDidMount() {
    const { profile, history } = this.props;
    if(get(history,"location.state.showPrompt")){
      this.props.openGlobalPrompt("Please review your skills & experience","success");
    }
    this.setState({
      specializationId: profile.specialization ? profile.specialization.id : ""
    });
    const skillData = this.props.input && this.props.input.value;
    if ( (skillData &&
        skillData.length &&
        this.isQuickApplyFlow &&
        profile.skills &&
        profile.skills[0].skillId !== undefined) ||
      !this.isQuickApplyFlow
    ) {
      this.getPrevSkillsData();
    }
    this.getSkillApiData();
  }

  getPrevSkillsData = () => {
    const { skills, experienceYear, experienceMonth, skillsId } = this.state;
    const { profile,form ,initialValue,formValues} = this.props;
    if(form === "createJsForm"){
      profile.skills = formValues.skills || initialValue;
    }
    if (profile.skills && profile.skills.length) {
      profile.skills.map(item => {
        skills.push(item.name);
        skillsId.push(item.skillsId || "");
        if (item.experienceYear) {
          // if year exists
          experienceYear.push(`${item.experienceYear}`);
        } else if (item.experienceMonth && !item.experienceYear) {
          // if month exists, set year to 0
          experienceYear.push("0");
        } else {
          // if nothing exists, set year to ""
          experienceYear.push("");
        }
        item.experienceMonth
          ? experienceMonth.push(`${item.experienceMonth > 5 ? "6" : ""}`)
          : experienceMonth.push("");
      });
      this.setState({
        skills,
        experienceYear,
        experienceMonth,
        skillsId
      });
      this.handleIsButtonEnabled({
        skills,
        experienceYear,
        experienceMonth,
        skillsId
      });
    }
    
  };

  getSkillApiData = () => {
    const { profile, data } = this.props;
    let { dataUrl } = this.props;
    if (dataUrl) {
      dataUrl = getUrl(dataUrl);
      services.get(dataUrl).then(({ data }) => {
        data = data && data.length && data.filter(val => val.name !== "");
        if (profile.skills && profile.skills.length && data && data.length) {
          profile.skills.map(skill => {
            const index = data.findIndex(item => item.name === skill.name);
            index > -1 && data.splice(index, 1);
          });
        }
        this.setState({
          skillsApiData: data
        });
      });
    } else {
      this.setState({
        skillsApiData: data
      });
    }
  };

  handleExpSelect = (selectedValue, index) => {
    const { skills, experienceYear, experienceMonth, skillsId } = this.state;
    experienceYear.splice(index, 1, `${parseInt(selectedValue.value, 10)}`);
    experienceMonth.splice(index, 1, selectedValue.value % 1 > 0 ? "6" : "");
    this.setState({
      experienceYear,
      experienceMonth
    });
    this.handleIsButtonEnabled({
      skills,
      experienceYear,
      experienceMonth,
      skillsId
    });
  };

  getRenderInput = ({ skills }) => {
    let i = 0;
    const display = [];
    const { experienceYear, experienceMonth } = this.state;
    const {domainValue} = this.props;
    const skillsFieldLength =
      skills.length === 5 ? skills.length : skills.length + 1;
    for (i = 0; i < skillsFieldLength; ++i) {
      const experience =
        !experienceYear[i] && !experienceMonth[i]
          ? ""
          : experienceYear[i] > 10
            ? "10+ "
            : `${experienceYear[i] || "0"}${experienceMonth[i] > 5
                ? ".5"
                : ""}`;
      const displayElement = (
        <div key={i} className="spreadHr marginBottom_12 skillsExpItemsWrapper">
          <SingleSuggesterWithChip
            onSelect={this.handleSelect}
            onDelete={this.handleDelete}
            placeholder="e.g. java"
            className="width_140"
            id={i}
            chipSelectedValue={skills[i]}
            dataUrl={domainValue && domainValue.id ? Urlconfig.getSkillsSuggesterData.replace("{domainId}",this.props.domainValue.id): Urlconfig.getSkillsSuggesterData}
          />
          <div>
            <CustomDropdown
              data={expOptions}
              title="Exp. in skill"
              subTitle={
                experienceYear[i] === "1" && !experienceMonth[i] ? "yr" : "yrs"
              }
              width="width_104"
              height="height_200"
              onSelect={this.handleExpSelect}
              selectedValue={experience ? experience : ""}
              disabled={i > skills.length - 1 ? true : false}
              index={i}
            />
          </div>
        </div>
      );
      display.push(displayElement);
    }
    return display;
  };

  handleSelect = skill => {
    this.handleOnSelect(skill);
  };

  handleChipClick = ({ id }) => (label, e) => {
    const chipSelectedValue = e.currentTarget.querySelector(".chipValue")
      .textContent;
    this.handleOnSelect({ name: chipSelectedValue, id });
  };
  handleOnSelect = ({ name, id }) => {
    const { skills, experienceYear, experienceMonth, skillsId } = this.state,
      { skillsApiData } = this.state;
    const index =
      skillsApiData &&
      skillsApiData.length &&
      skillsApiData.findIndex(
        item => item.name.toLowerCase() === name.toLowerCase()
      );

    const skillsInLowerCase = skills.map(skill => skill.toLowerCase());
    if (skillsInLowerCase.includes(name.trim().toLowerCase())) {
      this.props.openGlobalPrompt(
        "You have already selected this skill",
        "error"
      );
    }
    if (skills.length === 5) {
      this.props.openGlobalPrompt("You have already added 5 skills", "error");
    }
    if (
      !skillsInLowerCase.includes(name.trim().toLowerCase()) &&
      skills.length < 5
    ) {
      skills.push(name);
      skillsId.push(id || "");
      experienceYear.push("");
      experienceMonth.push("");
      skillsApiData && skillsApiData.splice(index, 1);
      this.setState({
        skills,
        experienceYear,
        experienceMonth,
        skillsId,
        skillsApiData
      });
    }
    this.handleIsButtonEnabled({
      skills,
      experienceYear,
      experienceMonth,
      skillsId
    });
  };
  handleDelete = value => {
    const { skills, experienceYear, experienceMonth, skillsId } = this.state;
    const index = skills.indexOf(value);
    skills.splice(index, 1);
    skillsId.splice(index, 1);
    experienceYear.splice(index, 1);
    experienceMonth.splice(index, 1);
    this.setState({
      skills,
      experienceYear,
      experienceMonth,
      skillsId
    });
    this.handleIsButtonEnabled({
      skills,
      experienceYear,
      experienceMonth,
      skillsId
    });
  };
  chipWithIcon = (name, icon) => {
    return (
      <p className="spreadHr_center">
        <span className="chipValue paddingRight_4">{name}</span>
        <TagPlusIcon className="chipAddIcon" size={12} />
      </p>
    );
  };

  render() {
    const { skills, skillsApiData, experienceYear } = this.state;
    const { hideLoadingChip,meta} = this.props;
    const chipList =
      skillsApiData &&
      skillsApiData.length &&
      skillsApiData.filter((item, index) => index < 5).map(({ name, id }) => {
        return {
          name: this.chipWithIcon(name, "add"),
          id: id
        };
      });
    const hasSkills = experienceYear.length > 0;

    return (
      <div>
        {skillsApiData && skillsApiData.length ? (
          <ChipGroup
            chipList={chipList}
            onClick={this.handleChipClick}
            childClass="marginRight_12"
            chipGroupClass="chipGroupClass flexWrap"
          />
        ) : (
          !hideLoadingChip && <Loading variant="isSmall" />
        )}

        <div
          className={`spreadHr marginBottom_16 ${this.isQuickApplyFlow
            ? "marginTop_16"
            : "marginTop_30"}`}
        >
          <PageHeading
            key="skillsLabel"
            title="Skills"
            className={`${this.isQuickApplyFlow
              ? "QASubLabel"
              : "semibold fontSize_15"}`}
            el="h2"
          />
          <h2
            key="ExperienceLabel"
            className={`${this.isQuickApplyFlow
              ? "QASkillsExperienceLabel"
              : "skillsExperienceLabel"}`}
          >
            {`Experience`}
            {hasSkills && <span className="requiredLabel">*</span>}
          </h2>
        </div>
        {this.getRenderInput({ skills, skillsApiData })}
        {meta && meta.error && <p className="formError inline_error">{meta.error}</p>}
      </div>
    );
  }
}

const mapStateToProps = ({ commonData }) => {
  return {
    profile: commonData.userDetails.profile
  };
};

export default connect(mapStateToProps, {
  updateUserProfile,
  openGlobalPrompt
})(Skills);
