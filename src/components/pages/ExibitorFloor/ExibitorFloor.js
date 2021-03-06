import React, { PureComponent } from "react";
import { Link } from "react-router-dom";

import LogoHeader from "../../organisms/LogoHeader";
import Loading from "../../atoms/Loading";
import Username from "../../templates/Username";

import Urls from "../../../constants/Urlconfig";
import servives from "../../../utils/services";
import routeConfig from "../../../constants/routeConfig";

import "./ExibitorFloor.scss";
import ExhibitorCard from "./ExhibitorCard";

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
        "{getExhibitionHomePageData{goldPartner{id,name,companies{id,companyLogoUrl,companyWebsiteUrl,companyName,aboutCompany,companyLocation,companySize}},diamondPartner{id,name,companies{id,companyLogoUrl,companyWebsiteUrl,companyName,aboutCompany,companyLocation,companySize}} silverPartner{id,name,companies{id,companyLogoUrl,companyWebsiteUrl,companyName,aboutCompany,companyLocation,companySize}}, bronzePartner{id,name,companies{id,companyLogoUrl,companyWebsiteUrl,companyName,aboutCompany,companyLocation,companySize}}, youtubeLink1{videoUrl,thumbnailUrl,title}, youtubeLink2{videoUrl,thumbnailUrl,title},youtubeLink3{videoUrl,thumbnailUrl,title},venue,organiser}}"
    };
    servives.post(url, postobj).then(res => {
      if (res.data) {
        this.setState({ landingData: res.data.getExhibitionHomePageData });
      }
    });
  }

  render() {
    const { landingData } = this.state;
    const { userName, history, newNotifications } = this.props;
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
              <div className="linkItem">
                <Link to={routeConfig.noticeBoard} className={newNotifications ? "red-dot" : ""}>
                  Notifications
                </Link>
              </div>
              <Username history={history} userName={userName} isLoggedIn />
            </div>
          </LogoHeader>
        </div>
        {!landingData && <Loading />}
        {landingData && (
          <div className="exhibitor-container">
            {["diamondPartner"].map(key => {
              return (
                <div key={key} className={key}>
                  <p className="title">{landingData[key].name}</p>
                  <div className="card-container">
                    {landingData[key].companies.map(companydata => {
                      return (
                        <ExhibitorCard
                          key={companydata.id}
                          companyData={companydata}
                          history={history}
                          isMostImp
                          isPremium={key !== "silverPartner"}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {landingData && (
          <div className="exhibitor-container">
            {["goldPartner", "silverPartner"].map(key => {
              return (
                <div key={key} className={key}>
                  <p className="title">{landingData[key].name}</p>
                  <div className="card-container">
                    {landingData[key].companies.map(companydata => {
                      return (
                        <ExhibitorCard
                          key={companydata.id}
                          companyData={companydata}
                          history={history}
                          isPremium={key !== "silverPartner"}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default ExibitorFloor;
