import React, { Component } from "react";
import Swipe from "react-easy-swipe";
import PropTypes from "prop-types";
import tracker from "../../../analytics/tracker";
import Button from "../../atoms/Button";
import { BackButtonIcon } from "../../atoms/Icon/icons";

import { round } from "../../../utils/pureFns";
import getTimeDiff from "../../../utils/getTimeDiff";
import getSessionStorage from "../../../utils/getSessionStorage";

import "./SwipeCards.scss";
import {
  //trackCT,
  filterJobDetailsForCleverTap
} from "../../../utils/tracking";

let _self;

class SwipeCards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeCard: 0
    };
    this.currentCardRef = React.createRef();
    this.prevCardRef = React.createRef();
    this.swipeThreshold = 120;
    this.cardLength = this.props.data.length;
    _self = this;
    this.xPos = 0;
    this._mounted = false;
  }

  getNewPosition = newX =>
    Math.abs(newX - this.xPos) > 0.5 ? newX : this.xPos;

  onSwipeMove(position) {
    if (position.x > 0 && _self.prevCardRef.current) {
      _self.xPos = _self.getNewPosition(position.x);
      _self.prevCardRef.current.style.transform = `translateX(calc(-100% + ${round(
        _self.xPos,
        1
      )}px))`;
    } else if (position.x < 0 && _self.currentCardRef.current) {
      _self.xPos = _self.getNewPosition(position.x);
      _self.currentCardRef.current.style.transform = `translateX(${round(
        _self.xPos,
        1
      )}px)`;
    }
    if (position.x > _self.swipeThreshold && _self.state.activeCard) {
      _self.prev();
    } else if (
      position.x < -_self.swipeThreshold &&
      (_self.cardLength > _self.state.activeCard + 1 ||
        (_self.props.lastCard && _self.cardLength > _self.state.activeCard))
    ) {
      _self.next();
    }
  }

  onSwipeEnd() {
    _self.enableSwipe();
    if (_self.prevCardRef.current)
      _self.prevCardRef.current.removeAttribute("style");
    if (_self.currentCardRef.current)
      _self.currentCardRef.current.removeAttribute("style");
  }

  next = isSwiped => {
    if (isSwiped) {
      tracker().on("event", {
        hitName: "browse$card_swiped$card"
      });
    }

    this.setState(
      {
        disableSwipe: true,
        activeCard: parseInt(this.state.activeCard) + 1
      },
      () => {
        if (this.state.activeCard !== this.props.data.length) {
          const currentJobId = this.props.data[
            this.cardLength - this.state.activeCard - 1
          ].jobId;
          const promise = new Promise(resolve => {
            this.props.setJobId(currentJobId, resolve);
          });
          promise.then(() => {
            if (!this.props.agentId) {
              this.props.postViewedJob(currentJobId);
              tracker().on("ctapPageView", {
                hitName: "job_card_view",
                payload: {
                  ...filterJobDetailsForCleverTap(
                    this.props.data[this.cardLength - this.state.activeCard - 1]
                  ),
                  total_job_count: this.cardLength - 1,
                  current_job_count: this.state.activeCard
                }
              });
            }

            if (
              this.props.data.length < this.props.maxJobs &&
              this.state.activeCard % 10 === 6
            ) {
              this.props.getNextPageData();
            }
          });
        }
        this.props.setActiveSwipeJobIndex(this.state.activeCard);
      }
    );
    this.prevCardRef.current &&
      this.prevCardRef.current.removeAttribute("style");
  };

  prev = isSwiped => {
    this.setState(
      {
        disableSwipe: true,
        activeCard: this.state.activeCard - 1
      },
      () => {
        this.props.setJobId(
          this.props.data[this.cardLength - this.state.activeCard - 1].jobId
        );
        this.props.setActiveSwipeJobIndex(this.state.activeCard);
      }
    );
    _self.currentCardRef.current &&
      _self.currentCardRef.current.removeAttribute("style");
  };

  handlePrevNav = () => {
    tracker().on("event", {
      hitName: "browse$previous_clicked$card"
    });
    this.prev(false);
  };
  handleNextNav = () => {
    tracker().on("event", {
      hitName: "browse$next_clicked$card"
    });
    this.next(false);
  };

  enableSwipe = () => {
    if (this.state.disableSwipe) {
      this.setState({
        disableSwipe: false
      });
    }
  };

  getClassByCardIndex = index => {
    let className = "SwipeCards__item ";
    if (this.state.activeCard > index) {
      className += "swiped ";
    } else if (this.state.activeCard < index) {
      className += "unswiped ";
    }
    className += Math.abs(this.state.activeCard - index) < 2 ? "active " : "";
    className += index === this.cardLength - 1 ? "last " : "";
    return className;
  };

  getRefByCardIndex = index => {
    if (index === this.state.activeCard) {
      return this.currentCardRef;
    } else if (index === this.state.activeCard - 1) {
      return this.prevCardRef;
    } else {
      return null;
    }
  };

  setActiveCardToStart = () => {
    tracker().on("event", {
      hitName: "browse$view_jobs_again_clicked$card"
    });

    this.setState({ activeCard: 0 });
  };

  static getDerivedStateFromProps = nextProps => {
    _self.cardLength = (nextProps.data && nextProps.data.length) || 0;
    const timeDiff = getTimeDiff(
      new Date(),
      new Date(sessionStorage.getItem("sessionStartTime"))
    );
    const isUpdated = getSessionStorage("isUpdated");
    const isFresh = getSessionStorage("isFresh");

    if (isFresh && timeDiff <= 30 && !isUpdated) {
      return _self._mounted && nextProps.activeSwipeJobIndex <= _self.cardLength
        ? {}
        : {
            activeCard:
              nextProps.activeSwipeJobIndex < _self.cardLength
                ? nextProps.activeSwipeJobIndex
                : 0
          };
    } else {
      return { activeCard: 0 };
    }
  };

  handleKeyboardNavigation = e => {
    if (e.keyCode === 37 && this.state.activeCard > 0) {
      this.prev();
    } else if (
      e.keyCode === 39 &&
      this.state.activeCard < this.props.maxJobs - 1
    ) {
      this.next();
    }
  };

  componentDidMount() {
    // const activeApiIndex =
    //   this.state.activeCard === this.cardLength
    //     ? this.cardLength - 1
    //     : this.cardLength - parseInt(this.state.activeCard) - 1;
    this._mounted = true;
    // if (this.props.data[activeApiIndex]) {
    //   this.props.setJobId(this.props.data[activeApiIndex].jobId);
    // }
    if (window.innerWidth > 1023) {
      window.addEventListener("keydown", this.handleKeyboardNavigation);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyboardNavigation);
  }

  render() {
    return (
      <React.Fragment>
        <Button
          onClick={this.handlePrevNav}
          type="link"
          appearance="secondary"
          className={`SwipeCards__Navs prev ${
            this.state.activeCard === 0 ? "disabled" : ""
          }`}
        >
          <BackButtonIcon />
          <p>Prev</p>
        </Button>
        <Button
          onClick={this.handleNextNav}
          className={`SwipeCards__Navs next ${
            this.state.activeCard === this.props.maxJobs ? "disabled" : ""
          }`}
          type="link"
          appearance="secondary"
        >
          <BackButtonIcon />
          <p className="SwipeCards__Navs-LabelText">Next</p>
        </Button>
        <Swipe
          onSwipeMove={this.state.disableSwipe ? undefined : this.onSwipeMove}
          onSwipeEnd={this.onSwipeEnd}
        >
          <div className="SwipeCardsWrapper">
            <div className="SwipeCards">
              <p
                className={`SwipeCards__index ${
                  this.state.activeCard === this.props.maxJobs
                    ? "hideLabel"
                    : ""
                }`}
              >
                {this.state.activeCard + 1 > this.cardLength
                  ? this.cardLength
                  : this.state.activeCard + 1}
                /{this.props.maxJobs}
              </p>
              {this.props.lastCard && (
                <this.props.lastCard
                  className={this.getClassByCardIndex(this.cardLength)}
                  viewAgainClick={this.setActiveCardToStart}
                  handleViewedJobsClick={this.props.handleGoToViewedClick}
                />
              )}
              {this.props.data.map((jobData, i) => (
                <div
                  key={`SwipeCards${i}`}
                  ref={this.getRefByCardIndex(this.cardLength - i - 1)}
                  className={this.getClassByCardIndex(this.cardLength - i - 1)}
                >
                  {React.Children.map(this.props.children, child => {
                    return React.cloneElement(child, { jobData });
                  })}
                </div>
              ))}
            </div>
          </div>
        </Swipe>
      </React.Fragment>
    );
  }
}

SwipeCards.propTypes = {
  data: PropTypes.array
};

export default SwipeCards;
