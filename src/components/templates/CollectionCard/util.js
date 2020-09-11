export const CTA_TYPE = {
    INTERVIEW: {
        value: "INTERVIEW",
        label: "Interview"
    },
    APPLY: {
        value: "APPLY",
        label: "Apply"
    },
    ASSESSMENT: {
        value: "ASSESSMENT",
        label: "Take an assessment",
        msg: "Before entering in interview room, please complete assessment"
    },
    ASSESS_FAIL: {
        value: "ASSESS_FAIL",
        msg: "Sorry! You Didn't meet the required score"
    }
}

export const findCTA = ({shownInterest, assessed, assessmentPassed}) => {
    if(shownInterest && assessed && assessmentPassed) {
        return CTA_TYPE.INTERVIEW
    } else if(shownInterest && assessed && !assessmentPassed) {
        return CTA_TYPE.ASSESS_FAIL
    } else if(shownInterest && !assessed) {
        return CTA_TYPE.ASSESSMENT
    }
    return CTA_TYPE.APPLY
}
