function compare(a, b) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

function sortPrefetchSuggestorData(arr, primaryKey, secKey) {
  arr.sort(function(a, b) {
    if (a[primaryKey] === b[primaryKey]) {
      // sort by name, ascending
      return compare(a[secKey], b[secKey]);
    }
    // sort by weight, decending
    return compare(-a[primaryKey], -b[primaryKey]);
  });
  return arr;
}

function sortAndFormatPrefetchSuggestorData(arr, primaryKey, secKey) {
  const finalArr = sortPrefetchSuggestorData(arr, primaryKey, secKey);
  return finalArr.reduce((acc, el) => {
    // consider only if deleted is false
    if (!el.deleted) {
      // add key name
      const _el = el;
      _el.name = el.textData;
      acc.push(_el);
    }
    return acc;
  }, []);
}

function updatePrefetchSuggestorData(
  masterData = [],
  updaterData = [],
  primaryKey = "",
  secKey = ""
) {
  let completeData;
  if (masterData.length) {
    if (updaterData.length) {
      const updatedData = updaterData.reduce((acc, el) => {
        const index = acc.findIndex(item => item.id === el.id);
        if (index === -1) {
          // add if id is not present in store data (case of new data-node)
          masterData.push(el);
        } else {
          // replace data-node if id is present in store data
          acc.splice(index, 1, el);
        }
        return acc;
      }, masterData);
      completeData = sortAndFormatPrefetchSuggestorData(
        updatedData,
        primaryKey,
        secKey
      );
    } else {
      completeData = masterData;
    }
  } else {
    completeData = sortAndFormatPrefetchSuggestorData(
      updaterData,
      primaryKey,
      secKey
    );
  }
  return completeData;
}

// // masterdata is the data in store
// // sorted by weight, then textData
// const masterData = [
//   { id: 1, textData: "Goa", weight: 0 },
//   { id: 3, textData: "Noida", weight: 1 },
//   { id: 2, textData: "Delhi", weight: 100 }
// ];
//
// // updaterData is the API response
// // sorted by ID
// const updaterData = [
//   { id: 1, textData: "Goa", weight: 0, deleted: true },
//   { id: 4, textData: "Mumbai", weight: 100, deleted: false }
// ];
//
// updatePrefetchSuggestorData(masterData, updaterData, "weight", "textData");
// output:  [
//   { id: 2, textData: "Delhi", weight: 100 },
//   { id: 4, textData: "Mumbai", weight: 100 },
//   { id: 3, textData: "Noida", weight: 1 }
// ];

export default updatePrefetchSuggestorData;
