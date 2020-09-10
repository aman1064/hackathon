const getRegexFuc = regex => string => {
  const exp = new RegExp(regex);
  return exp.test(string);
};

export default getRegexFuc;
