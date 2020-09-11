import React from "react";
import Button from "../../atoms/Button";
import routeConfig from "../../../constants/routeConfig";

const ExhibitorCard = ({companyData, history, isPremium}) => {
    const Tag = isPremium ? "a" : "div";
    return <div className="exhibitor-card CollectionCard">
        <div>
            <img src={companyData.companyLogoUrl} alt=""/>
        </div>
        <Tag href={companyData.companyWebsiteUrl} target="_blank" className="meta-data">
            <span>{companyData.companyName}</span>
            <span>{companyData.companyLocation}</span>
        </Tag>
        <div dangerouslySetInnerHTML={{
            __html: companyData.aboutCompany
        }}/>
        <div className="cta-container">
            <Button
                type="link"
                onClick={() => history.push(routeConfig.companyAnalytics.replace(":id", companyData.id))}
                size="small"
                className={`inherit_styles`}
            >
                Booth View
            </Button>
            {isPremium && <Button
                type="link"
                onClick={() => window.open(companyData.companyWebsiteUrl)}
                size="small"
                className={`inherit_styles`}
            >
                Company Website
            </Button>
            }
            <Button
                type="link"
                onClick={() => history.push(routeConfig.companyLanding.replace(":id", companyData.id))}
                size="small"
                className={`inherit_styles`}
            >
                Company Page
            </Button>
        </div>
    </div>
}

export default ExhibitorCard;
