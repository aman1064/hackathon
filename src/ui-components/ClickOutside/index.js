import React from "react";
import PropTypes from "prop-types";

class ClickOutside extends React.PureComponent {
  constructor(props) {
    super(props);
    this.domNode = null;
  }

  componentDidMount() {
    document.addEventListener("click", this.handleClickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside, true);
  }

  handleClickOutside = e => {
    if (
      !this.props.disable &&
      this.domNode &&
      !this.domNode.contains(e.target)
    ) {
      this.props.handleClickOutside(e);
    }
  };

  handleClick = e => {
    e.stopPropagation();
  };

  render() {
    return (
      <span
        className="clickOutside"
        onClick={this.handleClick}
        ref={c => {
          this.domNode = c;
        }}
      >
        {this.props.children}
      </span>
    );
  }
}

ClickOutside.propTypes = {
  handleClickOutside: PropTypes.func.isRequired,
  children: PropTypes.object.isRequired,
  disable: PropTypes.bool
};

ClickOutside.defaultProps = {
  disable: false
};

export default ClickOutside;
