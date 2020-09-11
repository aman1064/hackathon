import React from "react";
import Button from "../../atoms/Button";
import routeConfig from "../../../constants/routeConfig";

const ExhibitorCard = ({ companyData, history, isPremium, isMostImp }) => {
  return (
    <div className="exhibitor-card CollectionCard">
      <div className="heading">
        <div className="logoCntnr">
          <a
            href={companyData.companyWebsiteUrl}
            target="_blank"
            className="url-link"
          >
            <img
              src={companyData.companyLogoUrl}
              alt={companyData.companyName}
            />
          </a>
        </div>
        <div className="companyNameCntnr">
          <h1>{companyData.companyName}</h1>
          <p className="desc">
            is{" "}
            {companyData.companySize && isMostImp && (
              <span>
                a <span className="bold">{companyData.companySize}</span>{" "}
                company
                <br />
              </span>
            )}
            {companyData.companyLocation && (
              <span>
                having Headquarter at{" "}
                <span className="bold">
                  {companyData.companyLocation
                    .replace("HQ : ", "")
                    .replace("HQ:", "")}
                </span>
              </span>
            )}
          </p>
        </div>
      </div>
      <div
        className="about"
        dangerouslySetInnerHTML={{
          __html: companyData.aboutCompany
        }}
      />
      <div className="cta-container">
        <Button
          type="link"
          onClick={() =>
            history.push(
              routeConfig.companyAnalytics.replace(":id", companyData.id)
            )
          }
          size="small"
          className={`inherit_styles`}
        >
          Booth View
        </Button>
        {isPremium && (
          <Button
            type="link"
            onClick={() => window.open(companyData.companyWebsiteUrl)}
            size="small"
            className={`inherit_styles`}
          >
            Company Website
          </Button>
        )}
        <Button
          type="link"
          onClick={() =>
            history.push(
              routeConfig.companyLanding.replace(":id", companyData.id)
            )
          }
          size="small"
          className={`inherit_styles`}
        >
          Company Page
        </Button>
      </div>
    </div>
  );
};

export default ExhibitorCard;
