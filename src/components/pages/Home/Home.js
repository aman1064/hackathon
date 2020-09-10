import React from "react";
import { Link } from "react-router-dom";

import servives from "../../../utils/services";
import Urls from "../../../constants/Urlconfig";
import routeConfig from "../../../constants/routeConfig";

import LandingImg from "../../../assets/images/jpeg/landing.jpg";

import "./Home.scss";

class Home extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      landingData: null
    };
  }

  componentDidMount() {
    const url = Urls.getLandingLogo;
    const postobj = {
      query:
        "{getExhibitionHomePageData{goldPartner{id,name,companies{id,companyLogoUrl}},diamondPartner{id,name,companies{id,companyLogoUrl}} silverPartner{id,name,companies{id,companyLogoUrl}}, bronzePartner{id,name,companies{id,companyLogoUrl}}, youtubeLink1{videoUrl,thumbnailUrl,title}, youtubeLink2{videoUrl,thumbnailUrl,title},youtubeLink3{videoUrl,thumbnailUrl,title},venue,organiser}}"
    };
    servives.post(url, postobj).then(res => {
      this.setState({ landingData: res.data.getExhibitionHomePageData });
    });
  }
  render() {
    const { landingData } = this.state;
    return (
      <div className="Home">
        <div className="imgWrapper">
          <img alt="landing" src={LandingImg} />
          {landingData && (
            <div>
              <div className="diamondList">
                {landingData.diamondPartner.companies.map((el, index) => (
                  <div
                    key={el.id}
                    className={`diamondItem diamond${index + 1}`}
                  >
                    <Link
                      className="companyLink"
                      to={routeConfig.companyLanding.replace(":id", el.id)}
                    >
                      <img src={el.companyLogoUrl} />
                    </Link>
                  </div>
                ))}
              </div>

              <div className="diamondList isRight">
                {landingData.diamondPartner.companies.map((el, index) => (
                  <div key={el.id} className={`diamondItem gold${index + 1}`}>
                    <Link
                      className="companyLink"
                      to={routeConfig.companyLanding.replace(":id", el.id)}
                    >
                      <img src={el.companyLogoUrl} />
                    </Link>
                  </div>
                ))}
              </div>

              <div className="goldList">
                {landingData.goldPartner.companies.map((el, index) => (
                  <div key={el.id} className={`goldItem gold${index + 1}`}>
                    <Link
                      className="companyLink"
                      to={routeConfig.companyLanding.replace(":id", el.id)}
                    >
                      <img src={el.companyLogoUrl} />
                    </Link>
                  </div>
                ))}
              </div>

              <div className="goldList isRight">
                {landingData.goldPartner.companies.map((el, index) => (
                  <div key={el.id} className={`goldItem gold${index + 1}`}>
                    <Link
                      className="companyLink"
                      to={routeConfig.companyLanding.replace(":id", el.id)}
                    >
                      <img src={el.companyLogoUrl} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Home;
