import objectToGetParams from "./utils/objectToGetParams";
import createShareButton from "./utils/createShareButton";

function linkedinLink(url) {
  return `https://linkedin.com/shareArticle${objectToGetParams({ url })}`;
}

const LinkedinShareButton = createShareButton(
  "linkedin",
  linkedinLink,
  undefined,
  undefined,
  {
    windowWidth: 750,
    windowHeight: 600
  }
);

export default LinkedinShareButton;
