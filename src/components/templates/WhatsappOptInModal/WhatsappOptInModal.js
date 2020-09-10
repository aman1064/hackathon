import React, { Component } from "react";
import WAOptInContent from "../../molecules/WAOptInContent";
import Button from "../../atoms/Button";
import Modal from "../../../ui-components/Modal";
import Title from "../../../ui-components/Modal/Title";

import tracker from "../../../analytics/tracker";
import { trackCleverTap } from "../../../utils/tracking";
import { getCookie, setCookie } from "../../../utils/Cookie";

import "./index.scss";

class WhatsappOptInModal extends Component {
  state = {
    showModal: true
  };
  handleOptInClick = () => {
    const { trackerCat } = this.props;
    tracker().on("event", {
      hitName: `${trackerCat}$optin_clicked$whatsapp-optin`
    });
    trackCleverTap("WhatsApp_OptIn_Success");
    trackCleverTap("profile", { WhatsApp_OptIn: true, "MSG-whatsapp": true });
    this.props.whatsappOptin();
    this.props.showWhatsappOptIn(false);
    this.setState({
      showModal: false
    });
  };

  closeModal = trackGa => {
    const { trackerCat } = this.props;
    if (trackGa) {
      tracker().on("event", {
        hitName: `${trackerCat}$optin_cross_clicked$whatsapp-optin`
      });
    }
    trackCleverTap("WhatsApp_OptIn_Cancel");
    trackCleverTap("profile", { WhatsApp_OptIn: false, "MSG-whatsapp": false });
    setCookie(
      "rejectCount",
      // eslint-disable-next-line radix
      getCookie("rejectCount") >= 0 ? parseInt(getCookie("rejectCount")) + 1 : 1
    );
    setCookie("lastRejectTime", new Date().getTime());
    this.props.showWhatsappOptIn(false);
    this.setState({
      showModal: false
    });
  };

  handleCancelClick = () => {
    const { trackerCat } = this.props;
    tracker().on("event", {
      hitName: `${trackerCat}$optin_cancel_clicked$whatsapp-optin`
    });
    this.closeModal(false);
  };

  render() {
    const { isJobApplied, open } = this.props;
    const { showModal } = this.state;
    return (
      <div>
        <Modal
          appear={true}
          open={open}
          onClose={this.closeModal}
          className="bottomFixedModal WAModal"
          closeOnClickOutside={open && showModal}
        >
          <Title handleClose={this.closeModal} closeBtnClass="crossBtn" />
          <div className="WAModalContent">
            <WAOptInContent
              title={
                isJobApplied
                  ? "Application sent. Get important updates on WhatsApp"
                  : "Get important updates like apply status on WhatsApp"
              }
            />
          </div>
          <div className="spreadHr RemoveJobModal__FlatAction">
            <Button
              type="link"
              appearance="secondary"
              className="cancelButton"
              onClick={this.handleCancelClick}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="submitButton"
              onClick={this.handleOptInClick}
            >
              OPT IN
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default WhatsappOptInModal;
