const isMobileDevice = () => {
  let isMobile;
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    isMobile = true;
  } else {
    isMobile = false;
  }
  return isMobile;
};

export default isMobileDevice;
