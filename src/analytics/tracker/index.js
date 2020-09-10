import Publisher from "./Publisher";
import gaTracker from "./ga-handler";
import cleverTapTracker from "./cleverTap-handler";

let trackerInstance = null;

export default function tracker() {
  if (!trackerInstance) {
    trackerInstance = new Publisher();
    trackerInstance.subscribe(gaTracker);
    trackerInstance.subscribe(cleverTapTracker);
  }
  return trackerInstance;
}
