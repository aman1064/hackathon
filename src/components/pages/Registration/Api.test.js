import services from "../../../utils/services";

describe("api testing of registration page ", () => {
  it("should load first page config", () => {
    return services
      .get("http://mockjsapi.getsandbox.com/v1/conf/getScreenData/1.1")
      .then(data => {
        expect(data).toBeDefined();
        expect(data.data).toBeDefined();
        expect(data.data.id).toBeDefined();
        expect(data.data.id).toEqual("1");
        expect(data.data.nextScreenCall).toBeDefined();
        expect(data.data.nextScreenCall).toEqual("/v1/conf/getScreenData/2.1");
        expect(data.data.components).toBeDefined();
        data.data.components.forEach(component => {
          expect(component.id).toBeDefined();
          expect(component.type).toBeDefined();
          expect(component.data).toBeDefined();
        });
      });
  });
  it("should load second page config", () => {
    return services
      .get("http://mockjsapi.getsandbox.com/v1/conf/getScreenData/2.1")
      .then(data => {
        expect(data).toBeDefined();
        expect(data.data).toBeDefined();
        expect(data.data.id).toBeDefined();
        expect(data.data.id).toEqual("2");
        expect(data.data.nextScreenCall).toBeDefined();
        expect(data.data.nextScreenCall).toEqual("/v1/conf/getScreenData/3.1");
        expect(data.data.components).toBeDefined();
      });
  });
});
