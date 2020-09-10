const regexConfig = {
  password: "^(?=.*[a-z])(?=.*[0-9])(?=.{6,})",
  mobileNumber: "^[+]?[0-9]{10,15}$",
  email: "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,64}",
  suggester: "^[a-zA-Z0-9 ,.\\-/&()\\[\\]]+$",
  skillSuggester: "^[a-zA-Z0-9 ,.\\-+/&#()\\[\\]]+$",
  collegeSuggester: "^[a-zA-Z ',.\\-/&()\\[\\]]+$",
  suggesterWithApos: "^[a-zA-Z0-9 ',.\\-/&()\\[\\]]+$",
  areaOfWorkSuggester: "^[a-zA-Z ,.\\-/&()\\[\\]]+$"
};

export default regexConfig;
