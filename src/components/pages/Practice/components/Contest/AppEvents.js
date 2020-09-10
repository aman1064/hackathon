import keymirror from "keymirror";

const APP_EVENTS = keymirror({
  START_CONTEST_QUEST: null,
  SUBMIT_CONTEST_QUEST: null,
  FINAL_SUBMIT_CONTEST_QUEST: null,
  BEGIN_QUIZ: null,
  RESET_SUBMITTING: null,
  RESET_CONTEST_QUEST: null
});

export default APP_EVENTS;
