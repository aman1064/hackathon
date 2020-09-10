import React from "react";

import PropTypes from "prop-types";
import HelpText from "../../atoms/HelpText";
import IconListItem from "../../atoms/ListItem/IconListItem";
import getKey from "../../../utils/getKey";
import UpdatePrefs from "../../organisms/UpdatePrefs";

const List = props => {
  const { matchDetails } = props;
  return matchDetails &&
  Array.isArray(matchDetails) &&
  matchDetails.length > 0 ? (
    <React.Fragment>
      <HelpText
        key="skillhelp"
        text={"Why this job may interest you"}
        className="marginTop_24 color_mid_night semibold"
      />
      <ul className="jobCards__MatchDetails">
        {matchDetails
          .filter(val => val !== "")
          .filter((val, index) => index < 3)
          .map((data, index) => (
            <IconListItem
              size={14}
              key={getKey()}
              iconName="CheckedActive"
              description={data}
              customClass={`trancate_singleLine ${!index
                ? "marginTop_12"
                : ""}`}
              viewBox="0 -2 28 28"
            />
          ))}
      </ul>
    </React.Fragment>
  ) : (
    <UpdatePrefs />
  );
};
List.defaultProps = {
  jobDetails: []
};
List.propTypes = {
  jobDetails: PropTypes.array.isRequired
  // matchDetails: PropTypes.array
};
export default List;
