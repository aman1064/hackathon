const render = require("./render").run;

const routes = ["/","/login","/signup"];

const sanitizePage = async opt => {
  const { page } = opt;

  return page.evaluate(() => {
    // remove unnecessary elements
    const removeElementsWithID = ["fb-root", "ssIFrame_google"];

    removeElementsWithID.forEach(id => {
      const el = document.getElementById(id);
      if(el) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    })

    // fetching the images
    const images = Array.from(document.querySelectorAll("img"));

    images.forEach(el => {
      const realSrc = el.getAttribute('data-src');
      
      if(realSrc && realSrc.length > 0) {
        el.src = realSrc;
      }
    })

    /// remove unnecessary scripts
    const scripts = Array.from(document.querySelectorAll("script"));
    scripts.forEach(el => {
      const removeInlineScripts = ["inspectletjs"];
      const isRemove =
        (el.src && el.src.includes("/static/js/"))  || 
        // (el.src && !el.src.includes("/static/js/")) ||
        removeInlineScripts.includes(el.getAttribute("id"));

      if (isRemove) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    });
  });
};

function preRender() {
  return render({
    port: 45678,
    crawl: false,
    sourceMaps: false,
    puppeteerArgs: ["--no-sandbox"],
    preconnectThirdParty: false,
    skipThirdPartyRequests: false,
    userAgent: "BigShyft",
    destination: "build/pre-render",
    include: routes,
    removeScriptTags: false,
    sanitizePage
  });
}

module.exports = preRender;
