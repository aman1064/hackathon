import React from "react";

import servives from "../../../utils/services";
import Urls from "../../../constants/Urlconfig";

import LandingImg from "../../../assets/images/jpeg/landing.jpg";

import "./Home.scss";

class Home extends React.PureComponent {
  componentDidMount() {
    const url = Urls.getLandingLogo;
    const postobj = {
      query:
        "{getExhibitionHomePageData{goldPartner{id,name,companies{id,companyLogoUrl}},diamondPartner{id,name,companies{id,companyLogoUrl}} silverPartner{id,name,companies{id,companyLogoUrl}},  bronzePartner{id,name,companies{id,companyLogoUrl}},  youtubeLink1, youtubeLink2,youtubeLink3,venue,organiser}}"
    };
    servives.post(url, postobj).then(res => {
      console.log("qwe", res);
    });
  }
  render() {
    return (
      <div className="Home">
        <div className="imgWrapper">
          <img alt="landing" src={LandingImg} />
          <div className="diamondList">
            <div className="diamond1">one</div>
            <div className="diamond2">two</div>
            <div className="diamond3">three</div>
          </div>

          <div className="diamondList isRight">
            <div className="diamond1">one</div>
            <div className="diamond2">two</div>
            <div className="diamond3">three</div>
          </div>

          <div className="goldList">
            <div className="gold1">one</div>
            <div className="gold2">two</div>
            <div className="gold3">three</div>
          </div>

          <div className="goldList isRight">
            <div className="gold1">one</div>
            <div className="gold2">two</div>
            <div className="gold3">three</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
