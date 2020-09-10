import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import Menu from "../../../../../ui-components/Menu";
import LeaderWidgetShimmer from "./LeaderWidgetShimmer";

import Urlconfig from "../../../../../constants/Urlconfig";
import { getUrl } from "../../../../../utils/getUrl";

import leaderboard from "../../../../../assets/images/svg/leaderboard.svg";

import "./LeaderWidget.scss";

const THUMBNAIL_COLORS = ["#8879ca", "#21b8c6", "#ff6e6e", "#52a9f6"];

class LeaderWidget extends PureComponent {
  constructor() {
    super();
    this.state = {
      selectedMenuIndex: 0
    };
  }

  componentDidMount() {
    const { getLeaderboardData, groupId, contestId } = this.props;
    const url = this.getLeaderboardUrl(groupId || contestId, !!contestId);
    this.groupId = groupId;
    this.contestId = contestId;
    if (groupId || contestId) {
      getLeaderboardData(url);
    }
  }

  componentDidUpdate() {
    const {
      leaderBoardData,
      groupId,
      getLeaderboardData,
      contestId
    } = this.props;
    const perviousDataChanged =
      (groupId && groupId !== this.groupId) ||
      (contestId && contestId !== this.contestId);
    if (leaderBoardData.data && perviousDataChanged) {
      const url = this.getLeaderboardUrl(groupId || contestId, !!contestId);
      this.groupId = groupId;
      this.contestId = contestId;
      getLeaderboardData(url);
    }
  }

  getLeaderboardUrl = (id, isContest = false) => {
    let url;
    if (!isContest) {
      url = getUrl(Urlconfig.getGroupLeaderboard).replace("{groupId}", id);
    } else {
      url = getUrl(Urlconfig.getContestLeaderboard).replace("{contestId}", id);
    }
    return url;
  };

  getLeaderBoardItems() {
    const { leaderBoardData, profileId } = this.props;
    const top5Items = [];
    let isCurrentUserInTop5 = false;

    if (leaderBoardData.data) {
      const _leaderBoardData = leaderBoardData.data.leaderBoardList.slice();
      _leaderBoardData.splice(0, 5).reduce((acc, leaderBoardItem) => {
        if (profileId === leaderBoardItem.profileId) {
          isCurrentUserInTop5 = true;
        }
        acc.push(
          <div
            className={`leaderItem ${
              profileId === leaderBoardItem.profileId ? "userItem" : ""
            }`}
            key={leaderBoardItem.index}
          >
            <span className="rank">#{leaderBoardItem.index + 1}</span>
            <span
              className="thumbnail"
              style={{
                color: THUMBNAIL_COLORS[leaderBoardItem.index % 4],
                backgroundColor: `${
                  THUMBNAIL_COLORS[leaderBoardItem.index % 4]
                }20`
              }}
            >
              {this.userThumbnail(leaderBoardItem.name)}
            </span>
            <span className="userName">{leaderBoardItem.name}</span>
            <span className="score">{leaderBoardItem.totalScore}</span>
          </div>
        );
        return acc;
      }, top5Items);
    }
    if (
      !isCurrentUserInTop5 &&
      leaderBoardData.data &&
      leaderBoardData.data.userAttempt
    ) {
      top5Items.push(
        <div
          className="leaderItem userItem"
          key={leaderBoardData.data.userAttempt.index}
        >
          <span className="rank">
            #{leaderBoardData.data.userAttempt.index + 1}
          </span>
          <span className="thumbnail">
            {this.userThumbnail(leaderBoardData.data.userAttempt.name)}
          </span>
          <span className="userName">
            {leaderBoardData.data.userAttempt.name}
          </span>
          <span className="score">
            {leaderBoardData.data.userAttempt.totalScore}
          </span>
        </div>
      );
    }
    return top5Items;
  }

  userThumbnail = (name = "") =>
    name
      .split(" ")
      .map(el => el[0])
      .join("")
      .slice(0, 2);

  onMenuChange = ({ selectedValue, selectedIndex }) => {
    const { getLeaderboardData } = this.props;
    const url = this.getLeaderboardUrl(selectedValue);
    this.setState({ selectedMenuIndex: selectedIndex });
    getLeaderboardData(url);
  };

  render() {
    const {
      quizName,
      quizList,
      showDropdownVariant,
      leaderBoardData
    } = this.props;
    const { selectedMenuIndex } = this.state;
    return (
      <div className="LeaderWidget">
        {leaderBoardData.isLoading && <LeaderWidgetShimmer />}
        {leaderBoardData.data && (
          <>
            <div className="headCntnr">
              <div className="headLeft">
                <h2>
                  Attempted by {leaderBoardData.data.totalDistinctUserAttempts}{" "}
                  techies!
                </h2>
                {showDropdownVariant ? (
                  <Menu
                    list={quizList.data}
                    variant="selected"
                    labelKey="group"
                    labelSuffix="Test"
                    valueKey="groupId"
                    onChange={this.onMenuChange}
                    selectedIndex={selectedMenuIndex}
                  />
                ) : (
                  <p className="quizName">{quizName} Test</p>
                )}
              </div>
              <div className="imageCntnr">
                <img src={leaderboard} alt="icon" />
              </div>
            </div>
            {leaderBoardData.data.leaderBoardList.length > 0 && (
              <div className="leaderCntnr">{this.getLeaderBoardItems()}</div>
            )}
          </>
        )}
      </div>
    );
  }
}

LeaderWidget.propTypes = {
  getLeaderboardData: PropTypes.func.isRequired,
  groupId: PropTypes.string,
  contestId: PropTypes.string,
  leaderBoardData: PropTypes.object,
  quizName: PropTypes.string.isRequired,
  profileId: PropTypes.string,
  quizList: PropTypes.object,
  showDropdownVariant: PropTypes.bool
};

LeaderWidget.defaultProps = {
  groupId: "",
  contestId: "",
  leaderBoardData: { data: null, isError: false, isLoading: false },
  profileId: null,
  quizList: { data: null, isError: false, isLoading: false },
  showDropdownVariant: false
};

export default LeaderWidget;
