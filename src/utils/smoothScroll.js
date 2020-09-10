function smoothScroll(x, y, el = window) {
  try {
    el.scrollTo({
      top: x,
      left: y,
      behavior: "smooth"
    });
  } catch (e) {
    el.scrollTo(x, y);
  }
}

export default smoothScroll;
