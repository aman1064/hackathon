import React, { Component } from "react";
import { connect } from "react-redux";

import { get, isEmpty } from "../../../utils/jsUtils";

const FormHOC = options => WrappedComponent => {
  class Form extends Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  const mapSTP = (reduxState, ownProps) => ({
    invalid: !isEmpty(get(reduxState, `forms.${options.form}.errors`))
  });
  return connect(
    mapSTP,
    null
  )(Form);
};

export default FormHOC;
