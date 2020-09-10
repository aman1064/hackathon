/* eslint-disable no-nested-ternary */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import PageHeading from "../../../../atoms/PageHeading";
import BackButton from "../../../../molecules/BackButton";
import Loading from "../../../../atoms/Loading";
import NoViewedJobs from "./NoViewedJobs";
import MiniJobCard from "../MiniJobCard";
import RemoveJobModal from "../RemoveJobModal";

import routeConfig from "../../../../../constants/routeConfig";
import UrlConfig from "../../../../../constants/Urlconfig";
import { getUrl } from "../../../../../utils/getUrl";
import Chip from "../../../../../ui-components/Chip";
import {
  trackCleverTap,
  filterJobDetailsForCleverTap
} from "../../../../../utils/tracking";
import tracker from "../../../../../analytics/tracker";
import "../../Jobs.scss";
import NoSavedJobs from "../SavedJobs/NoSavedJobs";
import {
  disableBodyScroll,
  enableBodyScroll
} from "../../../../../utils/bodyScroll";

let _self;
// eslint-disable-next-line react/prop-types
const Row = ({ index, style }) => {
  const { viewedJobs, savedJobs } = _self.props;
  const { isBookmarkChipSelected } = _self.state;
  const listData = isBookmarkChipSelected ? savedJobs : viewedJobs;
  const loadCard =
    listData && listData.jobs[index] && _self.isRowLoaded({ index });
  return loadCard ? (
    <div style={style} className="virtualizedCardsWrapper">
      <MiniJobCard
        jobDetail={listData.jobs[index]}
        onBookmarkClick={_self.handleBookmarkClick(
          listData.jobs[index].jobId,
          index
        )}
        onRemoveBookmarkClick={_self.handleRemoveBookmarkClick(
          listData.jobs[index].jobId,
          index
        )}
        onRemoveJobClick={_self.handleRemoveJobClick(index)}
        // eslint-disable-next-line prettier/prettier
        trackGAEventName={`browse$know_more_clicked$viewed_jobs$${listData.jobs[
          index].jobId}`}
        hideBookMark={false}
        hideNotRelevant={false}
        trackCleverTapName="KnowMore_ViewedJobs"
        trackCleverTapParameters={listData.jobs[index]}
        {..._self.props}
        index={index}
      />
    </div>
  ) : (
    ""
  );
};

class ViewedJobs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBookmarkChipSelected: props.location.pathname === routeConfig.savedJobs
    };
    this.bookmarkChipEL = React.createRef();
    this._isMounted = false;
    this.renderCount = 0;
    this.nextSavedJobsPageToLoad = 0;
    this.nextViewedJobsPageToLoad = 0;
    _self = this;
  }

  componentDidMount() {
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth > 460 ? 460 : window.innerWidth;

    this.props.getSavedJobs(
      `${getUrl(UrlConfig.savedJobs)}?page=${
        this.nextSavedJobsPageToLoad
      }&size=10`,
      !!this.nextSavedJobsPageToLoad
    );
    this.nextSavedJobsPageToLoad += 1;

    this.props.getViewedJobs(
      `${getUrl(UrlConfig.viewedJobs)}?page=${
        this.nextViewedJobsPageToLoad
      }&size=10`,
      !!this.nextViewedJobsPageToLoad
    );
    this.nextViewedJobsPageToLoad += 1;
    disableBodyScroll();

    this._isMounted = true;
  }

  componentDidUpdate(prevProps, prevState, prevSnapshot) {
    const viewedJobsListEl = document.getElementById("RV__ViewedJobsList");
    if (viewedJobsListEl) {
      viewedJobsListEl.scrollTop = prevSnapshot.listScrollTop;
    }
    if (this._isMounted) {
      tracker().on("ctapPageView", {
        hitName: "pv_viewed_tab",
        payload: {
          page_name: "js_viewed_tab",
          total_job_count:
            (this.props.viewedJobs && this.props.viewedJobs.totalElements) || 0
        }
      });
      window.__bgperformance.pageMeasure();
    }
    if (prevProps.location.pathname !== this.props.location.pathname) {
      window.__bgperformance.pageMeasure();
    }
    this._isMounted = false;
  }

  componentWillUnmount() {
    enableBodyScroll();
  }

  getSnapshotBeforeUpdate() {
    return { listScrollTop: this.listScrollTop || 0 };
  }

  isRowLoaded = ({ index }) => {
    const { viewedJobs, savedJobs } = this.props;
    const { isBookmarkChipSelected } = this.state;
    const listData = isBookmarkChipSelected ? savedJobs : viewedJobs;

    return !!listData.jobs[index];
  };

  loadMoreRows = () => {
    const { isBookmarkChipSelected } = this.state;
    const { viewedJobs, savedJobs } = this.props;
    const listData = isBookmarkChipSelected ? savedJobs : viewedJobs;
    if (this.isPageLoading || listData.jobs.length === listData.totalElements)
      return;
    this.isPageLoading = true;
    window.setTimeout(() => {
      if (isBookmarkChipSelected) {
        const promise = new Promise(resolve => {
          this.props.getSavedJobs(
            `${getUrl(UrlConfig.savedJobs)}?page=${
              _self.nextSavedJobsPageToLoad
            }&size=10`,
            !!_self.nextSavedJobsPageToLoad,
            resolve
          );
        });
        promise.then(() => {
          this.isPageLoading = false;
        });
        _self.nextSavedJobsPageToLoad += 1;
      } else {
        const promise = new Promise(resolve => {
          this.props.getViewedJobs(
            `${getUrl(UrlConfig.viewedJobs)}?page=${
              _self.nextViewedJobsPageToLoad
            }&size=10`,
            !!_self.nextViewedJobsPageToLoad,
            resolve
          );
        });
        promise.then(() => {
          this.isPageLoading = false;
        });
        _self.nextViewedJobsPageToLoad += 1;
      }
    }, 0);
  };

  handleBookmarkClick = (jobId, index) => () => {
    tracker().on("event", {
      hitName: `browse$bookmark_clicked$viewed_jobs$${jobId}`
    });
    trackCleverTap("Bookmarked_ViewedJobs", _self.props.jobs[index]);
    const bookmarkUrl = getUrl(UrlConfig.bookmarkJob.replace("{jobId}", jobId));
    _self.props.setBookmark(bookmarkUrl, jobId, "viewed");
    // eslint-disable-next-line no-plusplus
    _self.renderCount++;
  };

  handleRemoveBookmarkClick = (jobId, index) => () => {
    const pageName = _self.state.isBookmarkChipSelected ? "saved" : "viewed";
    tracker().on("event", {
      hitName: `browse$unbookmark_clicked$viewed_jobs$${jobId}`
    });
    trackCleverTap("Unbookmarked_ViewedJobs", _self.props.jobs[index]);
    const deleteBookmarkUrl = getUrl(
      UrlConfig.unBookmarkJob.replace("{jobId}", jobId)
    );
    _self.props.deleteBookmark(deleteBookmarkUrl, jobId, pageName);
    // eslint-disable-next-line no-plusplus
    _self.renderCount++;
  };

  handleRemoveJobClick = index => jobId => {
    tracker().on("event", {
      hitName: `browse$not_relevant_clicked$viewed_jobs$${jobId}`
    });
    trackCleverTap("NotRelevant_ViewedJobs", this.props.viewedJobs.jobs[index]);
    this.setState({
      showRemoveJobModal: true,
      jobIdToRemove: jobId,
      jobIndexToRemove: index
    });
  };

  handleSubmitRemoveJob = (removeJobUrl, selectedReasonsObj) => {
    const pageName = this.state.isBookmarkChipSelected
      ? "savedJobs"
      : "viewedJobs";
    tracker().on("event", {
      hitName: `browse$not_relevant_continue_clicked$viewed_jobs$${
        this.state.jobIdToRemove
      }`
    });
    const eventName = this.state.isBookmarkChipSelected
      ? "bookmarked"
      : "viewed";
    tracker().on("ctapEvent", {
      hitName: `${eventName}_tab_not_relevant_submit`,
      payload: {
        ...filterJobDetailsForCleverTap(
          this.props.viewedJobs.jobs[this.state.jobIndexToRemove]
        ),
        reason: selectedReasonsObj,
        page_name: `js_${eventName}_tab`
      }
    });
    const promise = new Promise((resolve, reject) => {
      this.props.removeJob(
        {
          jobId: this.state.jobIdToRemove,
          pageName
        },
        removeJobUrl,
        selectedReasonsObj,
        resolve,
        reject
      );
    });
    promise.then(res => {
      this.props.openGlobalPrompt(`${res}`, "");
    });
    promise.catch(err => {
      this.props.openGlobalPrompt(`${err}`, "error");
    });
  };

  cancelRemoveJob = () => {
    trackCleverTap(
      "NotRelevantCancel_ViewedJobs",
      this.props.viewedJobs.jobs[this.state.jobIndexToRemove]
    );
    tracker().on("event", {
      // eslint-disable-next-line prettier/prettier
      hitName: `browse$not_relevant_cancel_clicked$viewed_jobs$${this.state
        .jobIdToRemove}`
    });
    this.setState({ showRemoveJobModal: false });
  };

  closeRemoveJobModal = () => {
    tracker().on("event", {
      hitName: `browse$not_relevant_cross_clicked$viewed_jobs`
    });
    this.setState({ showRemoveJobModal: false });
  };

  redirectToJobs = () => {
    tracker().on("event", {
      hitName: `browse$back_button_clicked$viewed_jobs`
    });

    this.props.history.push(routeConfig.jobs);
  };

  onRVListScroll = ({ scrollOffset }) => {
    // eslint-disable-next-line eqeqeq
    if (this.listScrollTop > scrollOffset || scrollOffset == 0) {
      if (this.bookmarkChipEL.current) {
        this.bookmarkChipEL.current.classList.remove("isScrolledUp");
      }
    } else {
      if (this.bookmarkChipEL.current) {
        this.bookmarkChipEL.current.classList.add("isScrolledUp");
      }
      const { isBookmarkChipSelected } = this.state;
      const { viewedJobs, savedJobs } = this.props;
      const listData = isBookmarkChipSelected ? savedJobs : viewedJobs;
      if (
        listData.jobs.length < listData.totalElements &&
        !this.isPageLoading
      ) {
        this.loadMoreRows();
      }
    }
    this.listScrollTop = scrollOffset;
  };

  handleBookmarkChipClick = () => {
    _self.nextSavedJobsPageToLoad = 0;
    _self.nextViewedJobsPageToLoad = 0;
    const { isBookmarkChipSelected } = _self.state;

    const { savedJobs } = _self.props;
    const totalBookmarked =
      savedJobs && savedJobs.totalElements ? savedJobs.totalElements : "0";

    if (!isBookmarkChipSelected) {
      tracker().on("event", {
        hitName: `browse$mybookmarks_selected$viewed_jobs$${totalBookmarked}`
      });
    } else {
      tracker().on("event", {
        hitName: `browse$mybookmarks_unselected$viewed_jobs$${totalBookmarked}`
      });
    }

    _self.setState(
      {
        isBookmarkChipSelected: !isBookmarkChipSelected
      },
      () => {
        if (isBookmarkChipSelected) {
          _self.props.getViewedJobs(
            `${getUrl(
              UrlConfig.viewedJobs
              // eslint-disable-next-line prettier/prettier
            )}?page=${_self.nextViewedJobsPageToLoad}&size=10`,
            !!_self.nextViewedJobsPageToLoad
          );
          _self.nextViewedJobsPageToLoad += 1;
          _self.props.history.push(routeConfig.viewedJobs);
        } else {
          _self.props.getSavedJobs(
            `${getUrl(
              UrlConfig.savedJobs
              // eslint-disable-next-line prettier/prettier
            )}?page=${_self.nextSavedJobsPageToLoad}&size=10`,
            !!_self.nextSavedJobsPageToLoad
          );
          _self.nextSavedJobsPageToLoad += 1;
          _self.props.history.push(routeConfig.savedJobs);
        }
      }
    );
  };

  render() {
    const { viewedJobs, savedJobs } = this.props;
    const { isBookmarkChipSelected } = this.state;
    const listData = isBookmarkChipSelected ? savedJobs : viewedJobs;
    const totalBookmarked =
      savedJobs && savedJobs.totalElements ? savedJobs.totalElements : "0";
    return listData ? (
      <div className="ViewedJobs">
        <div className="ViewedJobs__heading">
          <div className="flexCenter">
            <BackButton
              customClass="marginRight_28"
              action={this.redirectToJobs}
            />
            <PageHeading
              title={`Viewed Jobs (${viewedJobs.totalElements || 0})`}
            />
          </div>
        </div>
        {viewedJobs && viewedJobs.jobs && viewedJobs.jobs.length > 0 && (
          <div
            ref={this.bookmarkChipEL}
            className="ViewedJobs__bookmarkChipWrapper ViewedJobs__bookmarkChip"
          >
            <Chip
              classes={{ label: "chipLabel" }}
              variant="outlined"
              label={`My Bookmarks (${totalBookmarked})`}
              appearance={isBookmarkChipSelected ? "secondary" : undefined}
              onClick={_self.handleBookmarkChipClick}
            />
          </div>
        )}

        {listData.jobs && listData.jobs.length ? (
          <InfiniteLoader
            isItemLoaded={this.isRowLoaded}
            loadMoreItems={this.loadMoreRows}
            itemCount={listData.totalElements}
          >
            {({ onItemsRendered, ref }) => (
              <List
                itemSize={140}
                onItemsRendered={onItemsRendered}
                ref={ref}
                width={this.windowWidth || 0}
                height={this.windowHeight ? this.windowHeight - 106 : 0}
                itemCount={listData.totalElements}
                onScroll={this.onRVListScroll}
                id="RV__ViewedJobsList"
                // eslint-disable-next-line react/no-children-prop
                children={Row}
                itemData={listData}
              />
            )}
          </InfiniteLoader>
        ) : isBookmarkChipSelected &&
          viewedJobs.jobs &&
          viewedJobs.jobs.length > 0 ? (
          <NoSavedJobs {...this.props} />
        ) : (
          <NoViewedJobs {...this.props} />
        )}
        <RemoveJobModal
          open={this.state.showRemoveJobModal}
          cancelRemoveJob={this.cancelRemoveJob}
          closeModal={this.closeRemoveJobModal}
          submitRemoveJob={this.handleSubmitRemoveJob}
          jobId={this.state.jobIdToRemove}
          slideUp
          isFlatAction
        />
      </div>
    ) : (
      <Loading />
    );
  }
}
ViewedJobs.propTypes = {
  index: PropTypes.number,
  style: PropTypes.string,
  viewedJobs: PropTypes.array,
  savedJobs: PropTypes.array,
  history: PropTypes.object,
  openGlobalPrompt: PropTypes.func,
  removeJob: PropTypes.func,
  location: PropTypes.object,
  getSavedJobs: PropTypes.func,
  getViewedJobs: PropTypes.func
};
ViewedJobs.defaultProps = {
  index: 0,
  style: "",
  viewedJobs: [],
  savedJobs: [],
  history: {},
  openGlobalPrompt: () => {},
  removeJob: () => {},
  location: () => {},
  getSavedJobs: () => {},
  getViewedJobs: () => {}
};

export default ViewedJobs;
