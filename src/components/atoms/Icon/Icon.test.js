import React from "react";

import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import Icon from "./Icon";

configure({ adapter: new Adapter() });
describe("ICON.JS", () => {
  describe("---> without customClass", () => {
    const wrapper = shallow(<Icon type="home" />);

    it("should render 1 'i' element", () => {
      expect(wrapper.find("i").length).toEqual(1);
    });

    it("should have type name is home in 'i' element", () => {
      expect(wrapper.find("i").hasClass("icon_home")).toEqual(true);
    });

    describe("---> with customClass", () => {
      const wrapper = shallow(<Icon type="home" customClass="fonSize_15" />);

      it("should have type name is home in 'i' element", () => {
        expect(wrapper.find("i").hasClass("icon_home fonSize_15")).toEqual(
          true
        );
      });
    });
  });
});
