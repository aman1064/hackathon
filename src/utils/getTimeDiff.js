// getTime diff in minutes
const getTimeDiff = (dt2, dt1) => {
  let diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
};

export default getTimeDiff;
