import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Timer extends Component {
  constructor(props) {
    super(props);
    const timer = localStorage.getItem("contestTimer");
    this.state = {
      minutes: timer ? +timer.split(":")[0] : 0,
      seconds: timer ? +timer.split(":")[1] : 0
    };
  }

  componentDidMount() {
    this.#myInterval = setInterval(() => {
      const { seconds, minutes } = this.state;

      if (seconds > 0) {
        this.saveTimerState(this.state.minutes, this.state.seconds - 1);
        this.setState(() => ({
          seconds: seconds - 1
        }));
      }
      if (seconds === 0) {
        if (minutes === 0) {
          this.saveTimerState(0, 0);
          this.props.handleTimeOut();
          clearInterval(this.#myInterval);
        } else {
          this.saveTimerState(this.state.minutes - 1, 59);
          this.setState(() => ({
            minutes: minutes - 1,
            seconds: 59
          }));
        }
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.#myInterval);
  }

  saveTimerState = (m, s) => {
    localStorage.setItem("contestTimer", `${m}:${s}`);
  };

  #myInterval = null;

  render() {
    const { minutes, seconds } = this.state;
    return (
      <div className="timer">
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds} mins
      </div>
    );
  }
}

Timer.propTypes = {
  handleTimeOut: PropTypes.func.isRequired
};

Timer.defaultProps = {};
