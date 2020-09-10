import { put, call } from "redux-saga/effects";
import { cloneableGenerator } from "@redux-saga/testing-utils";
import assert from "assert";
import { getRecommendedJobs } from "./index";
import services from "../../../../utils/services";

const defaultProps = {
  url: "Mock API",
  action_type: "mock Effect",
  isFresh: "true",
  resolve: function() {},
  reject: function() {}
};
describe("JOBS SAGA", () => {
  describe("GETRECOMMENDEDJOBS SAGA", () => {
    const generator = cloneableGenerator(getRecommendedJobs)(defaultProps);
    it("should return getRecommendedApi call", () => {
      assert.deepEqual(
        generator.next().value,
        call(services.get, defaultProps.url)
      );
    });

    it("should return GET_RECOMMENDED_JOBS_EFFECT action success", () => {
      const mockData = {
        result: { data: undefined, isFresh: defaultProps.isFresh },
        status: 200
      };

      const clone = generator.clone();

      assert.deepEqual(
        clone.next(mockData).value,

        put({
          type: defaultProps.action_type,
          payload: mockData.result
        })
      );
      assert.deepEqual(
        clone.next(mockData).value,
        call(defaultProps.resolve, undefined)
      );
      assert.equal(clone.next().done, true, "it should be done");
    });
    it("should reject the promise if status is not 200", () => {
      const mockData = {
        status: 400
      };

      const clone = generator.clone();

      assert.deepEqual(
        clone.next(mockData).value,
        call(defaultProps.reject, mockData)
      );
      assert.equal(clone.next().done, true, "it should be done");
    });
    // it("should return Fetch_Error action on failure", () => {
    //   const mockData = "error";
    //   const clone = generator.clone();

    //   assert.deepEqual(
    //     clone.next(mockData).value,
    //     put({
    //       type: "Fetch_Error",
    //       payload: mockData
    //     })
    //   );

    //   assert.equal(clone.next().done, true, "it should be done");
    // });
  });
});
