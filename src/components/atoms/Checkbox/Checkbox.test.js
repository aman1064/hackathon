import React from "react";

import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import Checkbox from "./Checkbox";

configure({ adapter: new Adapter() });
const onChange = jest.fn();
const defaultProps = {
  name: "checkbox_name",
  checked: false,
  onChange,
  label: "checkbox_1",
  labelPlacement: "start"
};
describe("CHECKBOX.JS", () => {
  describe("---> with default props", () => {
    const wrapper = mount(
      <Checkbox
        label={defaultProps.name}
        labelPlacement={defaultProps.labelPlacement}
        checked={defaultProps.checked}
        name={defaultProps.name}
      />
    );

    it("should render 1 'input' element for default props", () => {
      expect(wrapper.find("input").length).toEqual(1);
    });

    it("should have checkbox type in input element for default props", () => {
      expect(wrapper.find("input").props().type).toEqual("checkbox");
    });

    it("should have false checked in input element for default props", () => {
      expect(wrapper.find("input").props().checked).toEqual(false);
    });

    it("should have checkbox_name name in input element for default props", () => {
      expect(wrapper.find("input").props().name).toEqual("checkbox_name");
    });

    it("should have onChange toBe a function in input element for default props", () => {
      expect(typeof wrapper.find("input").props().onChange).toEqual("function");
    });
  });
});
