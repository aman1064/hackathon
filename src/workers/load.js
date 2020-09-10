import Worker from "./index.worker";
import { FINGERPRINT_CREATED } from "./events";

function saveFingerPrint(murmur) {
  if (murmur) {
    localStorage.setItem("Fingerprint", murmur);
  }
}

function loadWorker() {
  const manager = new Worker();
  manager.addEventListener("message", function workerEventListener(e) {
    const [eventName, ...eventData] = e.data;

    if (!eventName) return;

    switch (eventName) {
      case FINGERPRINT_CREATED:
        saveFingerPrint(eventData[0]);
        break;

      default:
        break;
    }
  });

  return manager;
}

export default loadWorker;
