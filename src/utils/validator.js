const isEmptyString = value =>
  typeof value !== "string" || value.trim().length === 0;

export default isEmptyString;
