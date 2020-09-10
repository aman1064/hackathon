import store from "../store/Store";

const getAccessToken = () => {
  const { commonData } = store.getState();
  const accessToken =
    commonData && commonData.userDetails && commonData.userDetails.accessToken;
  return accessToken || "";
};

export default getAccessToken;
