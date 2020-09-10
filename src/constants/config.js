let serverBase = "https://www.bigshyft.com/jsapi";
let codeBase = "https://www.bigshyft.com";
let imagesBase = "https://jsimages.bigshyft.com";
let recruiterUrl = "http://recruiter.bigshyft.com";

if (process.env.NODE_ENV === "development") {
  // serverBase = "https://jsdev.bigshyft.com/jsapi";
  serverBase = "https://assessments.bigshyft.com/jsapi";
  codeBase = "https://jsdev.bigshyft.com";
  imagesBase = "http://10.120.9.120:9999";
  recruiterUrl = "http://dev.david.infoedge.com";
} else if (
  process.env.NODE_ENV === "staging" ||
  process.env.NODE_ENV === "test"
) {
  // serverBase = "https://jsdev.bigshyft.com/jsapi";
  serverBase = "https://assessments.bigshyft.com/jsapi";
  codeBase = "https://jsdev.bigshyft.com";
  imagesBase = "http://10.120.9.120:9999";
  recruiterUrl = "http://dev.david.infoedge.com";
}
export { serverBase, codeBase, imagesBase, recruiterUrl };
