import APP_EVENT from "../AppEvents";

export function resendOTP({ url, data, resolve, reject }) {
  return {
    type: `${APP_EVENT.RESEND_OTP}_WATCHER`,
    url,
    data,
    resolve,
    reject
  };
}
export function setInteractionId(data) {
  return {
    type: `${APP_EVENT.SET_INTERACTION_ID}_WATCHER`,
    action_type: `${APP_EVENT.SET_INTERACTION_ID}_EFFECT`,
    data
  };
}
