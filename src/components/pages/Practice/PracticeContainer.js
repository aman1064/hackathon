import React, { Component, Suspense } from "react";
import { Route, Switch } from "react-router-dom";

import routeConfig from "../../../constants/routeConfig";

import "./Practice.scss";

const PracticeHome = React.lazy(() =>
  import(/* webpackChunkName: 'PracticeHome' */ "./components/PracticeHome")
);

const QuizDetails = React.lazy(() =>
  import(/* webpackChunkName: 'QuizDetails' */ "./components/QuizDetails")
);

const QuizInsights = React.lazy(() =>
  import(/* webpackChunkName: 'QuizInsights' */ "./components/QuizInsights")
);

const BrowseQuiz = React.lazy(() =>
  import(/* webpackChunkName: 'BrowseQuiz' */ "./components/BrowseQuiz")
);

const PerformanceHistory = React.lazy(() =>
  import(/* webpackChunkName: 'PerformanceHistory' */ "./components/PerformanceHistory")
);

const Contest = React.lazy(() =>
  import(/* webpackChunkName: 'RenderContest' */ "./components/Contest/ContestContainer")
);

const ContestApply = React.lazy(() =>
  import(/* webpackChunkName: 'ContestApply' */ "./components/ContestApply")
);

class PracticeContainer extends Component {
  render() {
    return (
      <Suspense fallback={<div />}>
        <Switch>
          <Route
            exact
            path={routeConfig.practiceDetails}
            component={QuizDetails}
          />
          <Route
            exact
            path={routeConfig.practiceInsights}
            component={QuizInsights}
          />
          <Route exact path={routeConfig.practiceContest} component={Contest} />
          <Route
            exact
            path={routeConfig.practiceBrowseQuiz}
            component={BrowseQuiz}
          />
          <Route
            exact
            path={[
              routeConfig.practicePerformanceHistory,
              routeConfig.practicePerformanceHistoryWithId
            ]}
            component={PerformanceHistory}
          />
          <Route
            exact
            path={routeConfig.practiceSignup}
            component={ContestApply}
          />
          <Route path={routeConfig.practice} component={PracticeHome} />
        </Switch>
      </Suspense>
    );
  }
}

export default PracticeContainer;
