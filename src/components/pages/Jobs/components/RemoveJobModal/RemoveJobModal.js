/* eslint-disable prettier/prettier */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import queryString from "query-string";

import Modal from "../../../../../ui-components/Modal/Modal";
import Title from "../../../../../ui-components/Modal/Title";
import PageHeading from "../../../../atoms/PageHeading";
import HelpText from "../../../../atoms/HelpText";
import Button from "../../../../atoms/Button";
import CheckboxGroup from "../../../../molecules/CheckboxGroup";
import Loading from "../../../../atoms/Loading";

import { getIrrelevantReasons } from "../../saga/ActionCreator";

import { getUrl } from "../../../../../utils/getUrl";
import UrlConfig from "../../../../../constants/Urlconfig";

import "./RemoveJobModal.scss";

class RemoveJobModal extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    rejectReason: {
      name: "rejectReason"
    }
  };

  componentDidMount() {
    const irrelevantUrl = UrlConfig.irrelevantReasons;
    if (!this.props.irrelevantReasons || !this.props.irrelevantReasons.length) {
      this.props.getIrrelevantReasons(irrelevantUrl);
    }
  }

  handleRejectReasonCheckboxChange = checkboxKey => () => {
    this.setState({
      rejectReason: {
        // eslint-disable-next-line react/no-access-state-in-setstate
        ...this.state.rejectReason,
        // eslint-disable-next-line react/no-access-state-in-setstate
        [checkboxKey]: !this.state.rejectReason[checkboxKey]
      }
    });
  };

  handleRemoveJobSubmit = () => {
    const { isConsentFlow } = this.props;
    let url = UrlConfig.removeJob;
    const { rcvId } = queryString.parse(window.location.search);
    if (isConsentFlow) {
      url = UrlConfig.postMarkNotInterested.replace("{rcvId}", rcvId);
    } else if (window.location.search.includes("jobId")) {
      url = UrlConfig.recommendAndIrrelevant;
    }
    const removeJobUrl = getUrl(
      url.replace("{jobId}", this.props.jobId || this.props.activeJobId)
    );
    const rejectedReasonIdsArr = Object.keys(this.state.rejectReason);
    const selectedReasonsObj = this.props.irrelevantReasons.reduce(
      (acc, checkboxObj) => {
        if (
          rejectedReasonIdsArr.includes(checkboxObj.id) &&
          this.state.rejectReason[checkboxObj.id]
        ) {
          acc.push(checkboxObj);
        }
        return acc;
      },
      []
    );
    this.resetRejectReasonAndExecute(this.props.closeModal)();
    this.props.submitRemoveJob(removeJobUrl, selectedReasonsObj);
  };

  resetRejectReasonAndExecute = func => () => {
    this.setState({
      rejectReason: {
        name: "rejectReason"
      }
    });
    func();
  };

  render() {
    const {
      slideUp,
      irrelevantReasons,
      open,
      cancelRemoveJob,
      closeModal,
      isConsentFlow
    } = this.props;
    const isFlatAction = slideUp;

    return (
      <div>
        <Modal
          open={open}
          onClose={this.resetRejectReasonAndExecute(closeModal)}
          closeOnClickOutside
          backdrop={!!slideUp}
          animate={!!slideUp}
          className={
            slideUp ? (
              "Modal__Bottom"
            ) : (
              // eslint-disable-next-line prettier/prettier

              "SwipeCards__item active RemoveJobModal__Card"
            )
          }
        >
          <div className="ModalInnerLayer">
            <Title
              handleClose={
                !slideUp && this.resetRejectReasonAndExecute(closeModal)
              }
            />
            <div className="modalContent">
              <PageHeading
                className="RemoveJobModal__Title"
                el="h2"
                title={
                  isConsentFlow ? (
                    `What didn’t work out for you in this opportunity?`
                  ) : (
                    `Why is this job not relevant?`
                  )
                }
              />
              <HelpText
                className="color_dusk marginTop_4"
                text={
                  isConsentFlow ? (
                    `Your response will help us improve future recommendations`
                  ) : (
                    `It will help us find jobs that you would like`
                  )
                }
              />
              {irrelevantReasons && irrelevantReasons.length ? (
                <CheckboxGroup
                  checkboxData={irrelevantReasons}
                  onChange={this.handleRejectReasonCheckboxChange}
                  checkedState={this.state.rejectReason}
                  labelPlacement="start"
                  className="RemoveJobModal__CheckboxGroup"
                />
              ) : (
                <Loading />
              )}
            </div>
            <div
              className={`RemoveJobModal__Actions ${isFlatAction
                ? "RemoveJobModal__FlatAction"
                : ""}`}
            >
              <Button
                appearance={isFlatAction ? undefined : "secondary"}
                type={isFlatAction ? "link hasHover" : undefined}
                onClick={this.resetRejectReasonAndExecute(cancelRemoveJob)}
              >
                Cancel
              </Button>
              <Button
                className="submitButton"
                onClick={this.handleRemoveJobSubmit}
              >
                Submit
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStp = state => ({
  irrelevantReasons: state.jobData.irrelevantReasons,
  activeJobId: state.jobData.jobId
});

const mapDTP = { getIrrelevantReasons };

RemoveJobModal.propTypes = {
  irrelevantReasons: PropTypes.array,
  getIrrelevantReasons: PropTypes.func,
  isConsentFlow: PropTypes.bool,
  jobId: PropTypes.number,
  submitRemoveJob: PropTypes.func,
  closeModal: PropTypes.func,
  activeJobId: PropTypes.number,
  slideUp: PropTypes.bool,
  open: PropTypes.bool,
  cancelRemoveJob: PropTypes.bool
};

RemoveJobModal.defaultProps = {
  irrelevantReasons: [],
  getIrrelevantReasons: () => {},
  isConsentFlow: false,
  jobId: 0,
  submitRemoveJob: () => {},
  closeModal: () => {},
  activeJobId: 0,
  slideUp: false,
  open: false,
  cancelRemoveJob: false
};

export default connect(mapStp, mapDTP)(RemoveJobModal);
