export default function({ src, height = "0", width = "0", id = "" }) {
  let isFramePresent = false;
  if (id) {
    isFramePresent = document.getElementById(id);
  }
  if (!isFramePresent) {
    var ifrm = document.createElement("iframe");
    ifrm.setAttribute("src", src);
    ifrm.setAttribute("id", id);
    ifrm.setAttribute("scrolling", "no");
    ifrm.setAttribute("frameborder", "0");
    ifrm.style.width = width;
    ifrm.style.height = height;
    document.body.appendChild(ifrm);
  }
}
