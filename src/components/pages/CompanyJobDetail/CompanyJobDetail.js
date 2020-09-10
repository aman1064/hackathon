import React, {Component} from "react";
import JobDetails from "../../templates/JobDetails";
import CompanyDetails from "../../organisms/CompanyDetails";

class CompanyJobDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobDetails: window.data || JSON.parse(localStorage.jobDetails || "")
        }
    }

    componentDidMount() {
        if(window.data) {
            localStorage.jobDetails = JSON.stringify(window.data)
        }
    }

    render() {
        const { jobDetails } = this.state;
        const aboutCompany = [
            {
                "name": "Company Type",
                "value": jobDetails.companyType
            },
            {
                "name": "Industry"
            },
            {
                "name": "Website",
                "value": jobDetails.companyWebsiteURL
            },
            {
                "name": "Company Size",
                "value": jobDetails.companySize
            },
            {
                "name": "Company Financials",
                "value": jobDetails.companyFinancials
            },
            {
                "name": "Office Locations",
                "value": jobDetails.companyLocation
            }
        ]
        return <div>
            <CompanyDetails jobData={jobDetails} trackerCategory={"Public_JD"}/>
            <JobDetails jobDetails={jobDetails} aboutCompany={aboutCompany} className="jobDetails"/>
        </div>
    }
}

export default CompanyJobDetail;
