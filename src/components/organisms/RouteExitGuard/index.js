import React from "react";
import { Prompt } from "react-router-dom";
import { ExitModal } from "../../pages/Covid19/Contest/components/ExitModal";

class RouteExitGuard extends React.Component {
  state = {
    modalVisible: false,
    confirmedNavigation: false
  };
  showModal = () => this.setState({ modalVisible: true });
  closeModal = callback => {
    const { replace, currentPath } = this.props;
    const fn =
      typeof callback === "function" ? callback : () => replace(currentPath);

    this.setState({ modalVisible: false }, fn());
  };
  handleBlockedNavigation = nextLocation => {
    const { confirmedNavigation } = this.state;
    const { shouldBlockNavigation } = this.props;
    if (!confirmedNavigation && shouldBlockNavigation(nextLocation)) {
      this.showModal();
      return false;
    }
    return true;
  };
  handleConfirmNavigationClick = () =>
    this.closeModal(() => {
      const { navigate, backUrl } = this.props;
      this.setState({ confirmedNavigation: true }, () => {
        navigate(backUrl);
      });
    });
  render() {
    const { when } = this.props;
    const { modalVisible } = this.state;
    return (
      <>
        <Prompt when={when} message={this.handleBlockedNavigation} />
        <ExitModal
          isConfirmModalOpen={modalVisible}
          closeConfirmModal={this.closeModal}
          confirmEnd={this.handleConfirmNavigationClick}
        />
      </>
    );
  }
}
export default RouteExitGuard;
