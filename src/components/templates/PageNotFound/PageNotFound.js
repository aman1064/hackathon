import React,{memo} from "react";

import LogoHeader from "../../organisms/LogoHeader";

import PageNotFoundImg from "../../../assets/images/png/page_not_found.png";
import "./PageNotFound.scss";

const PageNotFound = memo(({type}) => (
  <div className="PageNotFound">
    <LogoHeader redirectLink="/" />
    <div className="PageNotFound__ImageWrapper">
      <img src={PageNotFoundImg} alt="page not found" />
    </div>
    <div className="PageNotFound__TextWrapper">
      <h2>{type =="hideJD" ? "Job not found!" :" Page not found!"}</h2>
      
      <p>
        {type =="hideJD" ?"The job you are looking for is removed.": "The page you were looking for doesn’t exist."}
        <br /> Try going back or visit our homepage.
      </p>
    </div>
  </div>
));

export default PageNotFound;
