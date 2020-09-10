import React, {Component} from "react";
import Urls from "../../../constants/Urlconfig";
import servives from "../../../utils/services";
import Loading from "../../atoms/Loading";
import "./Company.scss";
import CollectionCard from "../../templates/CollectionCard";

class Company extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyData: null,
            companyId: props.match.params.id
        };
    }

    componentDidMount() {
        const url = Urls.getLandingLogo;
        const {companyId} = this.state;
        const postobj = { query: `{ getCompanyPage(id: ${companyId}){id,companyName,companyLogoUrl,aboutCompany,companyLocation,companySize,companyType,companyFinancials,companyWebsiteUrl,companyVideoUrl,jobs{jobId,designation,cities,matchDetails,jobDescription,aboutCompany,companyLocation,companySize,companyType,companyFinancials,companyLogoUrl,companyWebsiteURL,minCTC,maxCTC,minExperience,maxExperience,benefits,empType,jobRole,ctcConfidential},recruiters{recName,recEmail}} }`
        };
        servives.post(url, postobj).then(res => {
            this.setState({ companyData: res.data.getCompanyPage });
        });
    }



    render() {
        const { companyData } = this.state;
        if(!companyData) {
            return <Loading/>
        }
        return <div className="Company">
            <div className="page-container">
                <div className="name-logo-grp">
                    <a href={companyData.companyWebsiteUrl} target="_blank" className="url-link">
                        <img src={companyData.companyLogoUrl} alt={companyData.companyName}/>
                    </a>
                </div>
                <p className="financial-note">{companyData.companyFinancials}</p>
                <div className="overview">
                    <p className="title">{companyData.companyName} Overview</p>
                    <ul className="">
                        <li className="meta-info">
                            <span className="key-label">Website</span>
                            <a href={companyData.companyWebsiteUrl} target="_blank">{companyData.companyWebsiteUrl}</a>
                        </li>
                        <li className="meta-info">
                            <span className="key-label">Size</span>
                            <span>{companyData.companySize}</span>
                        </li>
                        <li className="meta-info">
                            <span className="key-label">Type</span>
                            <span>{companyData.companyType}</span>
                        </li>
                        <li className="meta-info">
                            <span className="key-label">Headquarter</span>
                            <span>{companyData.companyLocation.replace("HQ : ", "")}</span>
                        </li>
                    </ul>
                </div>
                <div className="about-company" dangerouslySetInnerHTML={{
                    __html: companyData.aboutCompany
                }}/>
                <div className="jobs-grp">
                    {
                        companyData.jobs.map((job) => {
                            return <CollectionCard key={job.jobId} jobDetails={job} companyName={companyData.companyName}/>
                        })
                    }
                </div>
                <div className="video-container">
                    <iframe className="video-frame" key={companyData.companyVideoUrl} height="500"
                            src={`${companyData.companyVideoUrl}?autoplay=1&mute=1&controls=0`}>
                    </iframe>
                </div>
            </div>
        </div>
    }
}

export default Company;
