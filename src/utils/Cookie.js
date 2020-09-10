//  import Cookie from "universal-cookie";
//   export const getCookie = cname => {
//     const cookies = new Cookie();
//     return cookies.get(cname);
//  };

export const getCookie = cname => {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      const cval = c.substring(name.length, c.length);
      if (cval === "false") {
        return false;
      }
      return cval;
    }
  }
  return "";
};

export const setCookie = (cname, cvalue) => {
  document.cookie = `${cname}=${cvalue};path=/`;
  // const cookies = new Cookie();
  // cookies.set(cname, cvalue, { path: "/" });
};
