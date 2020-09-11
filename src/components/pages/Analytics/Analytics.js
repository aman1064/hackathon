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
      stats: null,
      processedData: null
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

  processData = ({
    footFallByBooths,
    footFallByJobInterests,
    footFallByInInterview,
    footFallByAssessmentDone
  }) => {
    const processedData = {};
    const hash = [];
    processedData.visitors = footFallByBooths.bars.reduce(
      (acc, el) => {
        hash[+el.label] = 1;
        acc.thumbs += el.value;
        acc.bars[+el.label] = el.value;
        return acc;
      },
      { thumbs: 0, bars: new Array(24).fill(0) }
    );
    processedData.applies = footFallByJobInterests.bars.reduce(
      (acc, el) => {
        hash[+el.label] = 1;
        acc.thumbs += el.value;
        acc.bars[+el.label] = el.value;
        return acc;
      },
      { thumbs: 0, bars: new Array(24).fill(0) }
    );
    processedData.interviews = footFallByInInterview.bars.reduce(
      (acc, el) => {
        hash[+el.label] = 1;
        acc.thumbs += el.value;
        acc.bars[+el.label] = el.value;
        return acc;
      },
      { thumbs: 0, bars: new Array(24).fill(0) }
    );
    processedData.assessments = footFallByAssessmentDone.bars.reduce(
      (acc, el) => {
        hash[+el.label] = 1;
        acc.thumbs += el.value;
        acc.bars[+el.label] = el.value;
        return acc;
      },
      { thumbs: 0, bars: new Array(24).fill(0) }
    );
    const latest4 = [
      hash.length - 4,
      hash.length - 3,
      hash.length - 2,
      hash.length - 1
    ];
    this.setState({ processedData, latest4 });
  };

  render() {
    const { stats, processedData, latest4 } = this.state;
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
            visits={(processedData && processedData.visitors.thumbs) || 0}
            applies={(processedData && processedData.applies.thumbs) || 0}
            assessments={
              (processedData && processedData.assessments.thumbs) || 0
            }
            interviews={(processedData && processedData.interviews.thumbs) || 0}
          />
          <BarChart processedData={processedData} latest4={latest4} />
        </div>
      );
    }
  }
}

export default Analytics;
