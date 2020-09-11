import React from "react";
import { Link } from "react-router-dom";

import Modal from "../../../ui-components/Modal";
import ModalTitle from "../../../ui-components/Modal/Title";
import Loading from "../../atoms/Loading";

import servives from "../../../utils/services";
import Urls from "../../../constants/Urlconfig";
import routeConfig from "../../../constants/routeConfig";

import LandingImg from "../../../assets/images/jpeg/landing.jpg";

import "./Home.scss";

class Home extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      landingData: null,
      isYoutubeModalOpen: false
    };
  }

  componentDidMount() {
    const url = Urls.getLandingLogo;
    const postobj = {
      query:
        "{getExhibitionHomePageData{goldPartner{id,name,companies{id,companyLogoUrl}},diamondPartner{id,name,companies{id,companyLogoUrl}} silverPartner{id,name,companies{id,companyLogoUrl}}, bronzePartner{id,name,companies{id,companyLogoUrl}}, youtubeLink1{videoUrl,thumbnailUrl,title}, youtubeLink2{videoUrl,thumbnailUrl,title},youtubeLink3{videoUrl,thumbnailUrl,title},venue,organiser}}"
    };
    servives.post(url, postobj).then(res => {
      if (res.data) {
        this.setState({ landingData: res.data.getExhibitionHomePageData });
      }
    });
  }

  openYoutubeModal = ({ videoUrl }) => () => {
    this.setState({
      youtubeUrl: videoUrl
    });
    window.setTimeout(() => {
      this.setState({ isYoutubeModalOpen: true });
    }, 0);
  };

  closeYoutubeModal = () => {
    this.setState({ isYoutubeModalOpen: false });
  };

  render() {
    const { landingData, isYoutubeModalOpen, youtubeUrl } = this.state;
    if (!landingData) {
      return <Loading />;
    } else {
      return (
        <div className="Home">
          <div className="imgWrapper">
            <img alt="landing" src={LandingImg} />
            {landingData && (
              <div className="overlayWrapper">
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

                <div className="silverList">
                  {landingData.silverPartner.companies.map((el, index) => {
                    if (index < 2) {
                      return (
                        <div
                          key={el.id}
                          className={`silverItem silver${index + 1}`}
                        >
                          <Link
                            className="companyLink"
                            to={routeConfig.companyLanding.replace(
                              ":id",
                              el.id
                            )}
                          >
                            <img src={el.companyLogoUrl} />
                          </Link>
                        </div>
                      );
                    }
                  })}
                </div>

                <div className="silverList isRight">
                  {landingData.silverPartner.companies.map((el, index) => {
                    if (index > 1) {
                      return (
                        <div
                          key={el.id}
                          className={`silverItem silver${index + 1}`}
                        >
                          <Link
                            className="companyLink"
                            to={routeConfig.companyLanding.replace(
                              ":id",
                              el.id
                            )}
                          >
                            <img src={el.companyLogoUrl} />
                          </Link>
                        </div>
                      );
                    }
                  })}
                </div>

                {landingData.youtubeLink1 && (
                  <div
                    className="videoThumb is1st"
                    onClick={this.openYoutubeModal(landingData.youtubeLink1)}
                    title={landingData.youtubeLink1.title}
                  >
                    <img src={landingData.youtubeLink1.thumbnailUrl} />
                  </div>
                )}
                {landingData.youtubeLink2 && (
                  <div
                    className="videoThumb is2nd"
                    onClick={this.openYoutubeModal(landingData.youtubeLink2)}
                    title={landingData.youtubeLink2.title}
                  >
                    <img src={landingData.youtubeLink2.thumbnailUrl} />
                  </div>
                )}
                {landingData.youtubeLink3 && (
                  <div
                    className="videoThumb is3rd"
                    onClick={this.openYoutubeModal(landingData.youtubeLink3)}
                    title={landingData.youtubeLink3.title}
                  >
                    <img src={landingData.youtubeLink3.thumbnailUrl} />
                  </div>
                )}
                <Link
                  className="exibitorFloorCta"
                  to={routeConfig.exibitorFloor}
                ></Link>
                <Modal
                  className="youtubeModal"
                  open={isYoutubeModalOpen}
                  onClose={this.closeYoutubeModal}
                  closeOnClickOutside
                  backdrop
                >
                  <ModalTitle handleClose={this.closeYoutubeModal} />
                  <iframe
                    key={youtubeUrl}
                    width="520"
                    height="380"
                    src={`${youtubeUrl}?autoplay=1&mute=1`}
                  ></iframe>
                </Modal>
              </div>
            )}
          </div>
        </div>
      );
    }
  }
}

export default Home;
