const getCtcStr = value => {
  let returnValue;
  if (value > 10) {
    returnValue = `${value / 100000}`;
  } else {
    returnValue = `${value}`;
  }
  return returnValue;
};

export const getPackageStr = ({
  minCtc,
  maxCtc,
  suffix = "lacs",
  repeatSuffix
}) => {
  let packageStr;
  if (repeatSuffix) {
    packageStr = `${getCtcStr(minCtc)}${repeatSuffix} - ${getCtcStr(
      maxCtc
    )}${repeatSuffix}`;
  } else {
    packageStr = `${getCtcStr(minCtc)} - ${getCtcStr(maxCtc)} ${suffix}`;
  }
  return packageStr;
};

export const getExpStr = ({ minExp, maxExp, suffix = "years" }) => {
  return `${minExp} - ${maxExp} ${suffix}`;
};
