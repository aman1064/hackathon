import React, { Component } from "react";

let _self;
class Timer extends Component {
  constructor() {
    super();
    this.state = {
      days: "--",
      hours: "--",
      mins: "--",
      secs: "--"
    };
    _self = this;
    this._isMounted = false;
  }

  onTimerComplete() {
    const { onTimerEnd } = this.props;
    window.clearInterval(this.timerId);
    if (typeof onTimerEnd === "function") {
      this.props.onTimerEnd();
    }
  }

  componentWillUnmount() {
    window.clearInterval(this.timerId);
    if (typeof this.props.onUnMount === "function") {
      this.props.onUnMount();
    }
  }

  static getDerivedStateFromProps(nextProps) {
    const addToState = {};
    if (_self.id !== nextProps.id) {
      _self.id = nextProps.id;
      addToState.currentTime = nextProps.duration;
      if (_self._isMounted) {
        window.clearInterval(_self.timerId);
        _self.timerId =
          nextProps.duration && window.setInterval(_self.decreaseTime, 1000);
      }
    }
    return {
      ...addToState
    };
  }

  padZero = n => {
    return n < 10 ? "0" + n : n;
  };

  dhms = (t = 0) => {
    const cd = 24 * 60 * 60 * 1000,
      ch = 60 * 60 * 1000,
      cm = 60 * 1000;
    const d = Math.floor(t / cd),
      h = Math.floor((t - d * cd) / ch),
      m = Math.floor((t - d * cd - h * ch) / cm),
      s = Math.floor((t - d * cd - h * ch - m * cm) / 1000);

    return {
      days: this.padZero(d),
      hours: this.padZero(h),
      mins: this.padZero(m),
      secs: this.padZero(s)
    };
  };

  decreaseTime = () => {
    const { currentTime } = this.state;
    const { mode } = this.props;
    if (currentTime === 0) {
      this.onTimerComplete();
    } else {
      if (mode === "otp") {
        this.setState(
          {
            currentTime: this.state.currentTime - 1
          },
          this.updateTimeCallback
        );
      } else {
        const { days, hours, mins, secs } = this.dhms(currentTime - 1000);

        this.setState(
          {
            days,
            hours,
            mins,
            secs,
            currentTime: currentTime - 1000
          },
          this.updateTimeCallback
        );
      }
    }
  };

  updateTimeCallback = () => {
    const { onTimeChange } = this.props;
    if (typeof onTimeChange === "function") {
      onTimeChange(this.state.currentTime);
    }
  };

  componentDidMount() {
    this._isMounted = true;
    this.timerId = window.setInterval(this.decreaseTime, 1000);
    this.totalDuration = this.state.currentTime;
    window.clearInterval(window.timerId);
  }

  render() {
    const { days, hours, mins, secs, currentTime } = this.state;
    const { mode, separator = "" } = this.props;
    return (
      <React.Fragment>
        <div className="timer">
          {mode === "otp" ? (
            <span>{`in 00:${
              currentTime > 9 ? currentTime : `0${currentTime}`
            }`}</span>
          ) : (
            <>
              <span className="days">{days}</span>
              <span className="sep dh_sep">{separator}</span>
              <span className="hours">{hours}</span>
              <span className="sep hm_sep">{separator}</span>
              <span className="minutes">{mins}</span>
              <span className="sep ms_sep">{separator}</span>
              <span className="seconds">{secs}</span>
            </>
          )}
        </div>
      </React.Fragment>
    );
  }
}
export default Timer;
