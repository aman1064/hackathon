import React from "react";
import PropTypes from "prop-types";

const WithToggle = WrappedComponent => {
  class WrapWithToggle extends React.Component {
    constructor(props) {
      super(props);

      const isOpenUndefined = typeof props.open === "undefined";
      this.state = {
        isControlled: !isOpenUndefined,
        open: props.open || false
      };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      if (prevState.isControlled && nextProps.open !== prevState.open) {
        return {
          open: nextProps.open
        };
      }

      return null;
    }

    onClose = () => {
      this.setState({
        open: false
      });

      if (this.props.onClose) {
        this.props.onClose();
      }
    };

    onOpen = () => {
      this.setState({
        open: true
      });

      if (this.props.onOpen) {
        this.props.onOpen();
      }
    };

    render() {
      const { open } = this.state;

      return (
        <WrappedComponent
          {...this.props}
          open={open}
          onOpen={this.onOpen}
          onClose={this.onClose}
        />
      );
    }
  }

  WrapWithToggle.propTypes = {
    open: PropTypes.bool,
    onOpen: PropTypes.func,
    onClose: PropTypes.func
  };

  WrapWithToggle.defaultProps = {
    open: undefined,
    onOpen: null,
    onClose: null
  };

  return WrapWithToggle;
};

export default WithToggle;
