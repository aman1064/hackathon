
import { clearMarks, getByName, mark } from "./performance-utils";
import pageMeasure from "./page-timing";
import apiMeasure from "./api-timing";
import resourceMeasure from "./resource-timing";

export default function() {
  // if anything needs to be done, like setting up a performance observer
  return {
    mark,
    pageMeasure,
    clearMarks,
    getByName,
    apiMeasure,
    resourceMeasure
  };
}
