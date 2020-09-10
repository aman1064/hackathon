import React from "react";
import Toast from "./index";

export default { title: "Toast" };

class ToastWithButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      message: null
    };
  }

  showMessage = () => {
    this.setState({
      isOpen: true,
      message: `This is message - ${new Date().getTime()}`
    });
  };

  onClose = () => {
    this.setState({
      isOpen: false
    });
  };

  render() {
    const { isOpen, message } = this.state;
    return (
      <div>
        <button type="button" onClick={this.showMessage}>
          Show Toast
        </button>

        <Toast
          message={message}
          isOpen={isOpen}
          autoHideDuration={3000}
          onClose={this.onClose}
          {...this.props}
        />
      </div>
    );
  }
}

export const defaultToast = () => <ToastWithButton />;
export const success = () => <ToastWithButton variant="success" />;
export const warning = () => <ToastWithButton variant="warning" />;
export const error = () => <ToastWithButton variant="error" />;
export const withCustomIcon = () => <ToastWithButton />;
