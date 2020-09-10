import React from "react";

import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import PrivateRoute from "./PrivateRoute";
import Profile from "../../pages/Profile";
configure({ adapter: new Adapter() });
describe("PRIVATEROUTE.JS", () => {
  describe("---> with authed is true", () => {
    const wrapper = shallow(
      <PrivateRoute authed={true} path="/profile" component={Profile} />
    );
    it("should render 1 'Route' element", () => {
      expect(wrapper.find("Route").length).toEqual(1);
    });
    it("should have path is '/profile' 'Route' element", () => {
      expect(wrapper.find("Route").props().path).toEqual("/profile");
    });
  });
});
