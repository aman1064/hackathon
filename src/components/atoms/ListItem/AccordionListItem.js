import React from "react";
import PropTypes from "prop-types";
import ReadMore from "../../organisms/ReadMore";

function AccordionListItem({ title, description, displayChars, customClass }) {
  return (
    <li
      className={`horizontalBar displayFlex_column icon_none marginTop_12 fontSize_13 ${customClass}`}
    >
      <p className="font_weight_bold">{title}</p>
      <ReadMore
        str={description}
        displayChars={displayChars}
        customClass="marginTop_8 paddingRight_16"
        customButtonClass="icon_cheveronDown"
        customButtonClassExpanded="icon_cheveronUp"
      />
    </li>
  );
}

AccordionListItem.defaultProps = {
  customClass: "",
  displayChars: 7
};
AccordionListItem.propTypes = {
  customClass: PropTypes.string,
  displayChars: PropTypes.number,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};
export default AccordionListItem;
