export const getMins = (seconds = 0) => {
  const secs = parseInt(seconds, 10);
  return secs / 60;
};

const padZero = n => {
  return n < 10 ? "0" + n : n;
};

export const getDHMS = (t = 0, padWithZero = false) => {
  const cd = 24 * 60 * 60 * 1000,
    ch = 60 * 60 * 1000,
    cm = 60 * 1000;
  const d = Math.floor(t / cd),
    h = Math.floor((t - d * cd) / ch),
    m = Math.floor((t - d * cd - h * ch) / cm),
    s = Math.floor((t - d * cd - h * ch - m * cm) / 1000);

  return padWithZero
    ? {
        days: padZero(d),
        hours: padZero(h),
        mins: padZero(m),
        secs: padZero(s)
      }
    : {
        days: d,
        hours: h,
        mins: m,
        secs: s
      };
};
