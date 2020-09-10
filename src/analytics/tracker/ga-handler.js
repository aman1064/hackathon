function sendEvent(event) {
  if (!window.dataLayer || !event) return;
  window.dataLayer.push({
    event
  });
}

function sendUserTiming(payload) {
  if (!window.dataLayer || !payload) return;

  console.info("GA User Timing", payload);

  window.dataLayer.push({
    event: "pageTimingMeasure",
    ...payload
  });
}

export default function(hitType, { hitName = "", ...payload }) {
  switch (hitType) {
    // case "event":
    case "event":
      return sendEvent(hitName);
    case "gtm_user_timing":
      return sendUserTiming(payload);
    default:
      return null;
  }
}
