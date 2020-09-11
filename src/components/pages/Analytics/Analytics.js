import React, { PureComponent } from "react";

import Loading from "../../atoms/Loading";
import ThumbStats from "./components/ThumbStats";
import BarChart from "./components/BarCharts";

import servives from "../../../utils/services";
import Urls from "../../../constants/Urlconfig";

import "./Analytics.scss";

class Analytics extends PureComponent {
  constructor() {
    super();
    this.state = {
      stats: null
    };
  }
  componentDidMount() {
    const url = Urls.getLandingLogo;
    const { match } = this.props;
    const postobj = {
      query: `{ getJobFairStatistics(companyId: \"${match.params.id}\"){company{companyId,companyName,companyLogoUrl},footFallByBooths{label,totalCount,bars{label,value}}, footFallByJobInterests{label,totalCount,bars{label,value}} , footFallByInInterview{label,totalCount,bars{label,value}} , footFallByAssessmentDone{label,totalCount,bars{label,value}}} }`
    };
    servives.post(url, postobj).then(res => {
      if (res.data) {
        this.processData(res.data.getJobFairStatistics);
        this.setState({ stats: res.data.getJobFairStatistics });
      }
    });
  }

  processData = jobFairStatistics => {};

  render() {
    const { stats } = this.state;
    if (!stats) {
      return <Loading />;
    } else {
      return (
        <div className="Analytics">
          <div className="heading">
            <div>
              <img src={stats.company.companyLogoUrl} />
            </div>
            <div>
              <h1>{stats.company.companyName} Dashboard</h1>
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
}

export default Analytics;
