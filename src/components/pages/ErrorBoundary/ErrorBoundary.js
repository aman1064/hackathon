import React from "react";
import ErrorPage from "../ErrorPage";

class ErrorBoundary extends React.Component {
  state = {
    hasError: false
  };

  componentDidCatch(error, info) {
    // pushing error in newrelic tracker
    //newrelic.noticeError(error, info);
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage isErrorBoundary />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
