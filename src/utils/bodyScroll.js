let $body;
let $html;

function getHtmlAndBody() {
  if (!$html) {
    $html = document.querySelector("html");
    $body = document.querySelector("body");
  }
}

export function enableBodyScroll() {
  getHtmlAndBody();
  $html.classList.remove("noScroll");
  $body.classList.remove("noScroll");
}

export function disableBodyScroll() {
  getHtmlAndBody();
  $html.classList.add("noScroll");
  $body.classList.add("noScroll");
}
