import React from "react";
import PropTypes from "prop-types";

import {
  BookmarkUnselectedIcon,
  BookmarkSelectedIcon
} from "../../../atoms/Icon/icons";

const JobsViewBookmark = props => {
  const { bookmarkedDate } = props;
  const handleRemoveBookmarkClick = () => {
    const { jobId, onRemoveBookmarkClick } = props;
    onRemoveBookmarkClick(jobId);
  };

  const handleBookmarkClick = () => {
    const { jobId, onBookmarkClick } = props;
    onBookmarkClick(jobId);
  };

  return (
    <div className="textAlign_right">
      <button
        className={`jobCard__BookmarkCTA ${
          bookmarkedDate ? "isBookmarked" : ""
        }`}
        onClick={
          bookmarkedDate ? handleRemoveBookmarkClick : handleBookmarkClick
        }
        type="submit"
      >
        {bookmarkedDate ? <BookmarkSelectedIcon /> : <BookmarkUnselectedIcon />}
      </button>
    </div>
  );
};
JobsViewBookmark.propTypes = {
  bookmarkedDate: PropTypes.string,
  jobId: PropTypes.number,
  onRemoveBookmarkClick: PropTypes.func,
  onBookmarkClick: PropTypes.func
};
JobsViewBookmark.defaultProps = {
  bookmarkedDate: "",
  jobId: 0,
  onRemoveBookmarkClick: () => {},
  onBookmarkClick: () => {}
};

export default JobsViewBookmark;
