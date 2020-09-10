import { round } from "./pureFns";

const calcRem = (value, baseFont) => {
  if (+value < 4) {
    return `${value}px`;
  }
  if (baseFont === 0) {
    console.error("basefont cannot be zero in calcRem()");
    return "";
  }
  const remValue = round(value / baseFont, 2);
  return remValue === 0 ? 0 : `${remValue}rem`;
};
const getRem = values => {
  if (typeof values === "number") {
    return calcRem(values, 16);
  }
  const valuesArr = values.split(" "),
    remArr = valuesArr.map(value => calcRem(value, 16));
  return remArr.join(" ");
};
export default getRem;
