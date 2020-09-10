export function addLoading(id) {
  const submitBtn = document.getElementById(id);
  submitBtn.classList.add("loadingButton");
  submitBtn.disabled = true;
  return submitBtn;
}

export function removeLoading(submitBtn) {
  const btn = submitBtn;
  btn.classList.remove("loadingButton");
  btn.disabled = false;
}

export function AddHomepageRef(url, queryParam) {
  const generatedUrl = `${url}${queryParam}${
    queryParam ? "&" : "?"
  }ref=homepage`;

  return generatedUrl;
}
