import createFingerPrint from "./create-finger-print";
import { CREATE_FINGERPRINT, FINGERPRINT_CREATED } from "./events";
// eslint-disable-next-line no-restricted-globals
const ctx = self;

ctx.addEventListener("message", async e => {
  // eslint-disable-next-line no-unused-vars
  const [eventName, ...eventData] = e.data;

  if (!eventName) return;

  let postMessageName = null;
  const postMessageData = [];

  switch (eventName) {
    case CREATE_FINGERPRINT:
      postMessageName = FINGERPRINT_CREATED;
      postMessageData[0] = await createFingerPrint();
      break;

    default:
      break;
  }

  if (postMessageName) {
    ctx.postMessage([postMessageName, ...postMessageData]);
  }
});
