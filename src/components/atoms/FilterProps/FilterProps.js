import React from "react";
import PropTypes from "prop-types";

function FilterProps(props) {
  const propsToPass =
      typeof props.filter === "function"
        ? props.filter(props)
        : props[props.filter],
    childrenWithProps = React.Children.map(props.children, child =>
      React.cloneElement(child, propsToPass)
    );
  return props.wrapper ? (
    <div className={props.className}>{childrenWithProps}</div>
  ) : (
    childrenWithProps
  );
}

FilterProps.defaultProps = {
  className: ""
};
FilterProps.propTypes = {
  filter: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  className: PropTypes.string
};

export default FilterProps;
