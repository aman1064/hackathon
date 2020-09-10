const removeTrailingSlash = source => {
  let path = source;
  if (path.substr(-1) === "/") {
    path = path.substr(0, source.length - 1);
    return removeTrailingSlash(path);
  } else {
    return path;
  }
};

export default removeTrailingSlash;
