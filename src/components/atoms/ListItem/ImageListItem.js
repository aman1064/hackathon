import React from "react";
import PropTypes from "prop-types";

function ImageListItem({ title, description, imageUrl, size, customClass }) {
  return (
    <div className={`displayFlex_row marginTop_12 fontSize_13 ${customClass}`}>
      <img
        src={imageUrl}
        alt={title || imageUrl}
        height={size}
        width={size}
        className="borderRadius_50 marginRight_12"
      />
      <div>
        {title && <p className="font_weight_bold">{title}</p>}
        {description && <p>{description}</p>}
      </div>
    </div>
  );
}

ImageListItem.defaultProps = {
  customClass: "",
  size: 40
};
ImageListItem.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  size: PropTypes.number,
  customClass: PropTypes.string
};
export default ImageListItem;
