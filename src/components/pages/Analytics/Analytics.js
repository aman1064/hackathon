import React, { PureComponent } from "react";

import ThumbStats from "./components/ThumbStats";
import BarChart from "./components/BarCharts";

import servives from "../../../utils/services";
import Urls from "../../../constants/Urlconfig";

import "./Analytics.scss";

class Analytics extends PureComponent {
  componentDidMount() {
    const url = Urls.getLandingLogo;
    const postobj = {
      query:
        "{ getJobFairStatistics{footFallByBooths{label,totalCount,bars{label,value}}, footFallByJobInterests{label,totalCount,bars{label,value}} , footFallByInInterview{label,totalCount,bars{label,value}} , footFallByAssessmentDone{label,totalCount,bars{label,value}}} }"
    };
    servives.post(url, postobj).then(res => {
      if (res.data) {
        this.setState({ landingData: res.data.getExhibitionHomePageData });
      }
    });
  }

  render() {
    return (
      <div className="Analytics">
        <div className="heading">
          <div>
            <img src="https://recruiter.bigshyft.com/companies/2831/logo" />
          </div>
          <div>
            <h1>Times Internet Dashboard</h1>
            <p className="desc">
              You received 70% more footfall than the average footfall
            </p>
          </div>
        </div>
        <ThumbStats
          visits={20}
          applies={10}
          assessments={5}
          interviews={3}
          totalAssessments={8}
        />
        <BarChart />
      </div>
    );
  }
}

export default Analytics;
