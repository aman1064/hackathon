import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import config from "../../../../../configs/globalConfig";
import "./CVUpload.scss";
import { imagesBase } from "../../../../../constants/config";

import {
  openGlobalPrompt,
  updateUserProfile
} from "../../../../../sagas/ActionCreator";
import { getNextScreen } from "../../saga/ActionCreator";
import { getUrl } from "../../../../../utils/getUrl";
import Button from "../../../../atoms/Button";
import routeConfig from "../../../../../constants/routeConfig";
import Store from "../../../../../store/Store";
import getAccessToken from "../../../../../utils/getAccessToken";
import tracker from "../../../../../analytics/tracker";

let _self;

class CVUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      percentCompleted: 0,
      isSnackbarOpen: false,
      isUploding: false,
      isUploadComplete: false,
      uploadedFileName: null,
      isRedirectToProfile: false,
      isRedirectToQuickApplyProfile: false
    };
    _self = this;
    this.isQuickApplyCVUpdate =
      this.props.history.location.state &&
      this.props.history.location.state.isQuickApplyCVUpdate;
    this.isPublicJDPageCvUpload =
      this.props.history.location.state &&
      this.props.history.location.state.isPublicJDPageCvUpload;
    this.pathname =
      this.props.history.location.state &&
      this.props.history.location.state.pathname;
    this.isRegistration = this.props.history.location.pathname.includes(
      "registration"
    );
    this.start = performance.now();

    this.isInstaApply =
      this.props.history.location.pathname.includes("instaCVUpload") &&
      this.props.history.location.state &&
      !this.props.history.location.state.isContestFlow;
    this.isContestApply =
      this.props.history.location.state &&
      this.props.history.location.state.isContestFlow
        ? true
        : false;
  }

  static getDerivedStateFromProps = nextProps => {
    const addToState = {};
    if (nextProps.profile.fileName) {
      addToState.uploadedFileName = nextProps.profile.fileName;
      addToState.isUploding = true;
      addToState.isUploadComplete = true;
    }

    return { ...addToState };
  };

  uploaderCallbacks = {
    beforeUpload: () => {
      this.hideCtaText();
      this.setState({ isUploding: true });
    },
    afterUpload: () => {
      this.props.dispatch(openGlobalPrompt("Upload Successsful", "success"));
    },
    errorInUpload: (errMsg, category) => {
      tracker().on("event", {
        hitName: `${category || "registrations"}$cv_upload_failed$cv_upload`
      });
      this.props.dispatch(openGlobalPrompt(errMsg, "error"));
    }
  };

  hideCtaText() {
    if (document.getElementsByClassName("js_submit_button_wrapper").length) {
      document
        .getElementsByClassName("js_submit_button_wrapper")[0]
        .classList.add("isHidden");
    }
  }

  showCtaText() {
    if (document.getElementsByClassName("js_submit_button_wrapper").length) {
      document
        .getElementsByClassName("js_submit_button_wrapper")[0]
        .classList.remove("isHidden");
    }
  }

  componentDidMount() {
    const { profile, category } = this.props;

    this.isEdit = profile.isUserProfileCompleted;
    if (
      (this.isEdit || this.isQuickApplyCVUpdate) &&
      document.getElementsByClassName("js_submit_button_wrapper").length
    ) {
      document
        .getElementsByClassName("js_submit_button_wrapper")[0]
        .classList.add("isHidden");
    }
    if (this.state.isUploding) {
      this.hideCtaText();
    } else {
      this.showCtaText();
    }
    const accessToken = getAccessToken();
    import(
      /* webpackChunkName: "ncAdvancedUploader" */ "../../../../../utils/ncAdvancedUploader/ncAdvancedUploader_v5"
    ).then(
      module =>
        (this.ncUploaderIns = new module.NCUploader({
          fileId: "resumeUpload",
          category: category,
          extensions: config.uploaderConstant.extensions,
          forceBasicUploader: false,
          maxSize: parseInt(config.uploaderConstant.maxSize, 10) * 1024 * 1024, // byte equivalent
          maxNumOfFiles: 1,
          materializeLoader: true,
          targets: {
            saveFileUrl:
              this.isQuickApplyCVUpdate || (this.isInstaApply && !accessToken)
                ? getUrl(config.fileUrls.insta_save)
                : getUrl(config.fileUrls.save),
            saveCloudUrl:
              this.isQuickApplyCVUpdate || (this.isInstaApply && !accessToken)
                ? getUrl(config.fileUrls.insta_cloud)
                : getUrl(config.fileUrls.cloud),
            deleteUrl:
              this.isQuickApplyCVUpdate || (this.isInstaApply && !accessToken)
                ? null
                : getUrl(config.fileUrls.delete)
          },
          outputHolder: {
            id: "uploadResults",
            cssClass: "outputCss"
          },
          plugins: {
            GoogleDrive: {
              buttonId: "GoogleDriveButton",
              apiKey: "AIzaSyDDl1WMhW2cwEARC9MQeJ1E41-XGOhLn_s",
              mimeType: "application/vnd.google-apps.document",
              exportLink:
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              appendExtension: ".docx"
            }
          },
          beforeSendCallback: this.uploaderCallbacks.beforeUpload,
          callback: this.ncUploaderCallback,
          onCancelClick: () => {
            tracker().on("event", {
              hitName: `InstaApply Flow$cv_upload_cancel$cv_upload`
            });
            this.props.dispatch(updateUserProfile({ fileName: null }));
            this.showCtaText();
            if (typeof this.props.onDeleteSuccess === "function") {
              this.props.onDeleteSuccess();
            }
            this.setState({
              isUploding: false,
              isUploadComplete: false
            });
          },
          uploadedFile: this.state.uploadedFileName,
          isRegistration: this.isRegistration,
          isEdit: this.isEdit
        }))
    );
  }

  fileKeyGenerator(length) {
    let result = "";
    const chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = length; i > 0; --i) {
      result += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return "U" + result;
  }

  ncUploaderCallback(uploadResponse) {
    const uploaderConfig = config.uploaderConstant;

    if (uploadResponse.SUCCESS) {
      _self.props.dispatch(
        updateUserProfile(uploadResponse.SUCCESS.data.completeResp)
      );
      if (typeof _self.props.onUploadSuccess === "function") {
        _self.props.onUploadSuccess(uploadResponse.SUCCESS.data.completeResp);
      }

      _self.setState({ isUploadComplete: true });
    } else if (uploadResponse.ERROR) {
      const errObj = uploadResponse.ERROR["dummyFileKey"];
      let errMsg = uploaderConfig.errMsg.default;
      if (errObj) {
        if (errObj.error === "INVALID_EXTENSION") {
          errMsg = uploaderConfig.errMsg.invalidExt;
        } else if (errObj.error === "FILE SIZE LIMIT EXCEEDED") {
          errMsg = uploaderConfig.errMsg.sizeLimit;
        }
      }
      _self.uploaderCallbacks.errorInUpload(errMsg, _self.props.category);
    }
  }

  handleNextButtonClick = () => {
    const { profile, history, location, currentScreen } = this.props;
    if (this.isRegistration) {
      tracker().on("ctapEvent", {
        hitName: "cv_upload_next_click",
        payload: {
          page_name: "js_cv_upload"
        }
      });

      tracker().on("ctapProfile", {
        hitName: "cv_upload_next_click",
        payload: {
          is_profile_complete: profile.isUserProfileCompleted ? true : false,
          does_cv_exist: profile.fileName ? true : false
        }
      });
      tracker().on("event", {
        hitName: "registration$next_button_clicked$cv_upload"
      });
    } else if (this.isEdit) {
      tracker().on("ctapEvent", {
        hitName: "edit_cv_upload_next_click",
        payload: {
          page_name: "js_edit_cv_upload"
        }
      });

      tracker().on("ctapProfile", {
        hitName: "edit_cv_upload_next_click",
        payload: {
          is_profile_complete: profile.isUserProfileCompleted ? true : false,
          does_cv_exist: profile.fileName ? true : false
        }
      });
      tracker().on("event", {
        hitName: "profile$update_clicked$edit_cv_upload"
      });
    } else if (this.isInstaApply) {
      tracker().on("ctapEvent", {
        hitName: "instaapply_cv_upload_next_click",
        payload: {
          page_name: "js_cv_upload"
        }
      });

      tracker().on("ctapProfile", {
        hitName: "instaapply_cv_upload_next_click",
        payload: {
          is_profile_complete: profile.isUserProfileCompleted ? true : false,
          does_cv_exist: profile.fileName ? true : false
        }
      });
    } else if (this.isContestApply) {
      tracker().on("ctapEvent", {
        hitName: "instaapply_cv_upload_next_click_contest",
        payload: {
          page_name: "js_cv_upload"
        }
      });

      tracker().on("ctapProfile", {
        hitName: "instaapply_cv_upload_next_click_contest",
        payload: {
          is_profile_complete: profile.isUserProfileCompleted ? true : false,
          does_cv_exist: profile.fileName ? true : false
        }
      });
    }

    const postObj = {
      currentScreenId: currentScreen.id,
      profile: {},
      userProfileId: profile.id
    };
    if (history.location.pathname.includes("instaCVUpload")) {
      tracker().on("event", {
        hitName: "InstaApply Flow$next_button_clicked$cv_upload"
      });
      history.goBack();
      return;
    }
    if (currentScreen.id === "applyWithCV") {
      if (this.isQuickApplyCVUpdate) {
        this.setState({ isRedirectToQuickApplyProfile: true });
      } else if (this.isPublicJDPageCvUpload) {
        this.setState({
          isRedirectToPublicJDPage: true
        });
      } else if (
        this.props.history.location &&
        this.props.history.location.state &&
        this.props.history.location.state.redirectTo
      ) {
        this.setState({ isRedirectToSource: true });
      } else {
        this.setState({ isRedirectToKnowMore: true });
      }
    } else {
      const isEdit = this.isEdit,
        promise = new Promise((resolve, reject) => {
          this.props.dispatch(getNextScreen(postObj, resolve, reject, isEdit));
        });
      promise.then(res => {
        if (isEdit) {
          this.setState({ isRedirectToProfile: true });
        } else {
          history.push(routeConfig.regWithId.replace(":id", res));
        }
      });
      promise.catch(err => {
        console.log(err);
      });
    }
  };

  render() {
    this.isEdit = this.props.profile.isUserProfileCompleted;
    if (this.state.isRedirectToProfile) {
      return <Redirect to={routeConfig.profile} />;
    } else if (this.state.isRedirectToKnowMore) {
      const {
        jobData: { jobId }
      } = Store.getState();
      return (
        <Redirect
          to={{
            pathname: routeConfig.jobs,
            state: { isApplyWithCv: true },
            search: `?jobId=${jobId}`
          }}
        />
      );
    } else if (this.state.isRedirectToQuickApplyProfile) {
      return <Redirect to={routeConfig.quickApplyProfile} />;
    } else if (this.state.isRedirectToSource) {
      const {
        jobData: { jobId }
      } = Store.getState();
      return (
        <Redirect
          to={{
            pathname: routeConfig.jobs,
            state: {
              redirectTo: this.props.history.location.state.redirectTo,
              isApplyWithCv: true
            },
            search: `?jobId=${jobId}`
          }}
        />
      );
    } else if (this.state.isRedirectToPublicJDPage) {
      return (
        <Redirect
          to={{
            pathname: this.pathname,
            state: { isApplyWithCv: true }
          }}
        />
      );
    }
    return (
      <div>
        <div
          className={`cvUpload_ButtonContainer ${
            this.state.isUploding ? "isHidden" : ""
          }`}
        >
          <input
            className="uploadAction sr-only"
            type="file"
            name="resumeUpload"
            id="resumeUpload"
          />
          {/* eslint-disable array-callback-return */}
          {this.props.childFields.map((uploadButton, index) => {
            switch (uploadButton.type) {
              case "googleDrive":
              case "dropBox":
                return (
                  <Button
                    appearance="card"
                    key={uploadButton.type}
                    id={
                      uploadButton.type === "googleDrive"
                        ? "GoogleDriveButton"
                        : "DropBoxButton"
                    }
                    className="cvUpload_uploadButton"
                    onClick={() => {
                      tracker().on("event", {
                        hitName: `${this.props.category ||
                          "registration"}$via_drive_clicked$cv_upload`
                      });
                    }}
                  >
                    <div className="displayFlex_column flexAlign_center">
                      <img
                        src={
                          uploadButton.additionalProperties.iconUrl.includes(
                            "http"
                          )
                            ? uploadButton.additionalProperties.iconUrl
                            : `${imagesBase}${uploadButton.additionalProperties.iconUrl}`
                        }
                        alt={`upload CV ${uploadButton.value}`}
                        width="50"
                      />
                      <p className="cvUpload_uploadButtonText">
                        {uploadButton.value}
                      </p>
                    </div>
                  </Button>
                );
              case "phone":
                return (
                  <label
                    key={`${uploadButton.id}_${index}`}
                    htmlFor="resumeUpload"
                    className={"cvUpload_uploadButton"}
                    id="deviceUploadButton"
                  >
                    <Button
                      appearance="card"
                      className="fullWidth"
                      component="span"
                      onClick={() => {
                        tracker().on("event", {
                          hitName: `${this.props.category ||
                            "registration"}$via_phone_clicked$cv_upload`
                        });
                      }}
                    >
                      <div className="displayFlex_column flexAlign_center">
                        <img
                          src={
                            uploadButton.additionalProperties.iconUrl.includes(
                              "http"
                            )
                              ? uploadButton.additionalProperties.iconUrl
                              : `${imagesBase}${uploadButton.additionalProperties.iconUrl}`
                          }
                          alt={`upload CV ${uploadButton.value}`}
                          width="50"
                        />
                        <p className="cvUpload_uploadButtonText">
                          {uploadButton.value}
                        </p>
                      </div>
                    </Button>
                  </label>
                );
              default:
                break;
            }
          })}
          <div className="fullWidth">
            <p className="cvUpload_helpText">
              Supported file formats DOC, DOCX, PDF.
            </p>
          </div>
        </div>
        <div
          className={`cvUpload-container flatCard large ${
            !this.state.isUploding ? "isHidden" : ""
          }`}
        >
          <ul id="uploadResults" className="cvUpload-loader-container" />
          <div className={`fixedToBottom spreadHr `}>
            <Button
              type="link hasHover"
              onClick={() => {
                if (
                  this.props.history.location.pathname.includes("instaCVUpload")
                ) {
                  tracker().on("event", {
                    hitName: "InstaApply Flow$back_button_clicked$cv_upload"
                  });
                }
                if (this.isRegistration) {
                  tracker().on("event", {
                    hitName: "registration$back_button_clicked$cv_upload"
                  });
                } else if (this.isEdit) {
                  tracker().on("event", {
                    hitName: "profile$back_clicked$edit_cv_upload"
                  });
                }
                this.props.history.goBack();
              }}
            >
              <span className="nav_arrow prev">{""}</span>
            </Button>

            <Button
              type="link hasHover"
              onClick={this.handleNextButtonClick}
              disabled={!this.state.isUploadComplete}
              id="cv_upload_next"
            >
              <span className={`nav_arrow secondary`}>{""}</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (
  { registrationData, commonData, quickApplyData },
  ownProps
) => {
  return {
    experimentId: registrationData.experimentId,
    variationId: registrationData.variationId,
    optionData: registrationData.optionData,
    profile: commonData.userDetails.profile,
    id: quickApplyData.id,
    currentScreen:
      registrationData.currentScreen || ownProps.currentScreenConfig
  };
};

export default connect(mapStateToProps)(CVUpload);
