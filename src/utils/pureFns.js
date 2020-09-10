const shorthandMonth = {
  "01": "Jan",
  "02": "Feb",
  "03": "Mar",
  "04": "Apr",
  "05": "May",
  "06": "Jun",
  "07": "Jul",
  "08": "Aug",
  "09": "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec"
};

export const prependZero = number => (number > 9 ? number : `0${number}`);
export const round = (value, precision) => {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};
export const isStrContainsKey = (str = "", key = "") => {
  return str.toLowerCase().includes(key);
};

export const getFileNameFromPath = path => {
  const pathList = path.split("\\");
  return pathList[pathList.length - 1];
};

export const getFormFieldNameFromConfig = field =>
  `${field.entity}$${field.jsonKey}$${field.type}`;

export const getConfigNameFromFormFieldName = (formFieldName = "") =>
  formFieldName.split("$")[1];

export const sortByKey = (items, key) => {
  const _items = items.slice();
  return _items.sort((a, b) => {
    const nameA = a[key].toUpperCase(); // ignore upper and lowercase
    const nameB = b[key].toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    } else {
      return 1;
    }
  });
};

/**
 * If the given, non-null object has a value at the given path, returns the
 * value at that path. Otherwise returns the provided default value.
 *
 * @param {*} defaultValue The default value.
 * @param {Array} paths The path to use.
 * @param {Object} obj The object to retrieve the nested property from.
 * @return {*} The data at `path` of the supplied object or the default value.
 * @example
 *
 *      pathOr('N/A', ['a', 'b'], {a: {b: 2}}); //=> 2
 *      pathOr('N/A', ['a', 'b'], {c: {b: 2}}); //=> "N/A"
 */

export const pathOr = (defaultValue, paths, obj) => {
  let val = obj;
  let idx = 0;
  while (idx < paths.length) {
    if (val == null) {
      return defaultValue;
    }
    val = val[paths[idx]];
    idx += 1;
  }
  if (val == null) {
    return defaultValue;
  }
  return val;
};

export const memoize = f => {
  const cache = {};
  return ({ key, data }) => {
    if (
      cache[key] !== undefined &&
      JSON.stringify(cache[key]) === JSON.stringify(data)
    ) {
      return cache[key];
    }
    return (cache[key] = f(data));
  };
};
const getDDMMYYYYdate = dateString => {
  let date;
  if (typeof dateString === "string") {
    date = new Date(dateString.split("T")[0]);
  } else {
    date = new Date();
  }

  let dd = date.getDate();
  let mm = date.getMonth() + 1; // January is 0!

  const yyyy = date.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  return { dd, mm, yyyy };
};

const getFormattedDate = (dateString, format = "dd/mm/yyyy") => {
  const { dd, mm, yyyy } = getDDMMYYYYdate(dateString);
  switch (format) {
    case "dd MM":
      return `${dd} ${shorthandMonth[mm]}`;
    case "dd/mm/yyyy":
    default:
      return dd + "/" + mm + "/" + yyyy;
  }
};

export const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export default getFormattedDate;
export const getNumberOfSlides = (totalCards, chunkSize = 6) => {
  if (totalCards > 0 && totalCards <= chunkSize) {
    return 1;
  }
  const _totalCards = totalCards - chunkSize;
  if (_totalCards % chunkSize === 0) {
    return 1 + _totalCards / chunkSize;
  }
  return 2 + Math.floor(_totalCards / chunkSize);
};

export const getChunks = (numberTiles, data, chunkSize = 6) => {
  const chunks = [];
  for (let i = 0, j = 1; j <= numberTiles; i += chunkSize, j += 1) {
    chunks.push(data.slice(i, i + 6));
  }
  return chunks;
};

export const getImageObserverIns = () => {
  return new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const lazyImage = entry.target;
        lazyImage.src = lazyImage.dataset.src;
      }
    });
  });
};
