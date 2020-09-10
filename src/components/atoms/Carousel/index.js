import React from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import "./index.scss";
export default class Carousel extends React.PureComponent {
  render() {
    const { children, name, ...rest } = this.props;
    return <AliceCarousel {...rest} items={children} />;
  }
}
