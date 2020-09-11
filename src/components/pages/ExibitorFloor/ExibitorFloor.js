import React, { PureComponent } from "react";
import { Link } from "react-router-dom";

import LogoHeader from "../../organisms/LogoHeader";
import Loading from "../../atoms/Loading";

import Urls from "../../../constants/Urlconfig";
import servives from "../../../utils/services";
import routeConfig from "../../../constants/routeConfig";

import "./ExibitorFloor.scss";

class ExibitorFloor extends PureComponent {
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
        "{getExhibitionHomePageData{goldPartner{id,name,companies{id,companyLogoUrl,companyWebsiteUrl,companyName,aboutCompany,companyLocation}},diamondPartner{id,name,companies{id,companyLogoUrl,companyWebsiteUrl,companyName,aboutCompany,companyLocation}} silverPartner{id,name,companies{id,companyLogoUrl,companyWebsiteUrl,companyName,aboutCompany,companyLocation}}, bronzePartner{id,name,companies{id,companyLogoUrl,companyWebsiteUrl,companyName,aboutCompany,companyLocation}}, youtubeLink1{videoUrl,thumbnailUrl,title}, youtubeLink2{videoUrl,thumbnailUrl,title},youtubeLink3{videoUrl,thumbnailUrl,title},venue,organiser}}"
    };
    servives.post(url, postobj).then(res => {
      if (res.data) {
        this.setState({ landingData: res.data.getExhibitionHomePageData });
      }
    });
  }

  render() {
    const { landingData } = this.state;
    const { userName } = this.props;
    return (
      <div className="ExibitorFloor">
        <div className="LogoHeaderCntnr">
          <LogoHeader redirectLink={routeConfig.home}>
            <div className="LogoHeaderLinks">
              <div className="linkItem">
                <Link to={routeConfig.home}>Job Fair</Link>
              </div>
              <div className="linkItem">
                <Link to={routeConfig.exibitorFloor}>Exibitor Floor</Link>
              </div>
              <div className="username linkItem">Hi {userName}</div>
            </div>
          </LogoHeader>
        </div>
        {!landingData && <Loading />}
        {landingData && (
          <div>
            <div className="diamond">diamond</div>
            <div className="gold">gold</div>
            <div className="silver">silver</div>
          </div>
        )}
      </div>
    );
  }
}

export default ExibitorFloor;
