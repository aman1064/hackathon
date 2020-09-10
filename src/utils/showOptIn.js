function getDate(numDays) {
  var now = new Date();
  now.setDate(now.getDate() + numDays);
  return now;
}
function showOptInBox(lastRejectTime, rejectCount) {
  if (rejectCount == 0) {
    return true;
  }
  var oneDayMs = 1000 * 3600 * 24;
  var today = new Date();
  var numDays = (today.getTime() - lastRejectTime) / oneDayMs;
  if (numDays >= 16) {
    return true;
  }
  return numDays >= Math.pow(2, rejectCount);
}
// for (day = -5; day <= 20; day++) {
//   var lastRejectDate = getDate(-day);
//   for (rejectCount = 0; rejectCount <= 10; rejectCount++) {
//     showOptInBox(lastRejectDate.getTime(), rejectCount);
//     // console.log(
//     //   "lastRejectDate:",
//     //   lastRejectDate,
//     //   "rejectCount:",
//     //   rejectCount,
//     //   ", showOptInBox:",
//     //   showOptInBox(lastRejectDate.getTime(), rejectCount)
//     // );
//   }
// }
export default showOptInBox;
